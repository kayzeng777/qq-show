import { useState, useCallback, useEffect } from "react";
import QQShow from "./components/QQShow";
import CategorySelector from "./components/CategorySelector";
import ItemSelector from "./components/ItemSelector";
import SharePage from "./components/SharePage";
import type { QQShowCategory, QQShowItem, QQShowOutfit } from "./types/qqShow";
import { categories as generatedCategories } from "./data/categories";
import { LanguageProvider, useLanguage } from "./contexts/LanguageContext";
import { saveShareData, getShareData } from "./lib/supabase";
import "./App.css";

// 使用自动生成的全量分类（已含背景与新分类）
const categories: QQShowCategory[] =
  generatedCategories as unknown as QQShowCategory[];

function AppContent() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    "background",
  );
  const [outfit, setOutfit] = useState<QQShowOutfit>({});
  const [history, setHistory] = useState<QQShowOutfit[]>([{}]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [showAbout, setShowAbout] = useState(false);
  const [isSharePage, setIsSharePage] = useState(false);
  const { language, setLanguage, t } = useLanguage();

  // 从URL参数加载装扮
  useEffect(() => {
    const loadShareData = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const shareId = urlParams.get("id");

      // 只有在有分享ID时才显示分享页面，避免主页面的分享功能触发分享页面
      if (shareId) {
        // 添加短暂延迟，确保页面完全加载后再显示分享页面
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // 显示分享页面
        setIsSharePage(true);
        
        try {
          // 从Supabase中读取装扮数据和语言设置
          const shareData = await getShareData(shareId);
          
          if (shareData) {
            // 验证装扮数据的有效性
            if (shareData.outfit && typeof shareData.outfit === "object") {
              setOutfit(shareData.outfit);
              // 保存到历史记录
              setHistory([shareData.outfit]);
              setHistoryIndex(0);
              
              // 恢复语言设置（如果存在）
              if (shareData.language && (shareData.language === "zh" || shareData.language === "en")) {
                setLanguage(shareData.language);
              }

              // 记录到控制台（用于调试）
              console.log("分享ID:", shareId);
              console.log("恢复的语言设置:", shareData.language);
              console.log(
                "装扮数据加载成功，包含项目:",
                Object.keys(shareData.outfit),
              );
            } else {
              console.warn("装扮数据格式无效");
            }
          } else {
            console.warn("未找到对应的装扮数据");
          }
        } catch (error) {
          console.error("加载装扮数据失败:", error);
          // 如果数据损坏，显示空装扮而不是错误
          setOutfit({});
          setHistory([{}]);
          setHistoryIndex(0);
        }
      }
    };

    loadShareData();
  }, []);


  const saveToHistory = useCallback(
    (newOutfit: QQShowOutfit) => {
      setHistory((prev) => {
        const newHistory = prev.slice(0, historyIndex + 1);
        newHistory.push(newOutfit);
        const finalHistory = newHistory.slice(-50); // 限制历史记录最多50条
        setHistoryIndex(finalHistory.length - 1);
        return finalHistory;
      });
    },
    [historyIndex],
  );

  const handleUndo = useCallback(() => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setOutfit(history[newIndex]);
    }
  }, [historyIndex, history]);

  const handleRedo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setOutfit(history[newIndex]);
    }
  }, [historyIndex, history]);

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
  };

  const handleItemSelect = (item: QQShowItem) => {
    setOutfit((prev) => {
      const newOutfit = { ...prev };

      // 添加新选择的item
      newOutfit[item.category as keyof QQShowOutfit] = item;

      // 互斥逻辑1: 全头 vs 发型/前头发/后头发/全脸
      if (item.category === "fullHead") {
        // 选择全头时，移除发型、前头发、后头发、全脸
        delete newOutfit.hair;
        delete newOutfit.frontHair;
        delete newOutfit.backHair;
        delete newOutfit.fullFace;
      } else if (
        ["hair", "frontHair", "backHair", "fullFace"].includes(item.category)
      ) {
        // 选择发型/前头发/后头发/全脸时，移除全头
        delete newOutfit.fullHead;
      }

      // 发型组合逻辑
      if (item.category === "hair") {
        // 选择发型时，移除单独的前头发和后头发
        delete newOutfit.frontHair;
        delete newOutfit.backHair;
      } else if (["frontHair", "backHair"].includes(item.category)) {
        // 选择单独的前头发或后头发时，移除发型
        delete newOutfit.hair;
      }

      // 互斥逻辑2: 衣服全身 vs 衣服上身/衣服下身
      if (item.category === "outfit") {
        // 选择衣服全身时，移除衣服上身、衣服下身
        delete newOutfit.top;
        delete newOutfit.bottom;
      } else if (["top", "bottom"].includes(item.category)) {
        // 选择衣服上身/衣服下身时，移除衣服全身
        delete newOutfit.outfit;
      }

      // 立即保存到历史记录
      saveToHistory(newOutfit);
      
      return newOutfit;
    });
  };

  const handleItemRemove = () => {
    if (selectedCategory) {
      setOutfit((prev) => {
        const newOutfit = { ...prev };
        delete newOutfit[selectedCategory as keyof QQShowOutfit];
        return newOutfit;
      });

      // 在下一个tick保存到历史记录，确保outfit已经更新
      setTimeout(() => {
        setOutfit((currentOutfit) => {
          saveToHistory(currentOutfit);
          return currentOutfit;
        });
      }, 0);
    }
  };

  const selectedCategoryData = selectedCategory
    ? categories.find((cat) => cat.id === selectedCategory) || null
    : null;

  const selectedItem = selectedCategory
    ? outfit[selectedCategory as keyof QQShowOutfit] || null
    : null;

  const handleRandomOutfit = useCallback(() => {
    const newOutfit: QQShowOutfit = {};

    // 1. 随机选择头部：全头 或者 发型+脸
    const headChoice = Math.random() < 0.5; // 50% 概率选择全头

    if (headChoice) {
      // 选择全头
      const fullHeadCategory = categories.find((cat) => cat.id === "fullHead");
      if (fullHeadCategory && fullHeadCategory.items.length > 0) {
        const randomFullHead =
          fullHeadCategory.items[
            Math.floor(Math.random() * fullHeadCategory.items.length)
          ];
        newOutfit.fullHead = randomFullHead;
      }
    } else {
      // 选择发型+脸
      const hairCategory = categories.find((cat) => cat.id === "hair");
      const faceCategory = categories.find((cat) => cat.id === "fullFace");

      if (hairCategory && hairCategory.items.length > 0) {
        const randomHair =
          hairCategory.items[
            Math.floor(Math.random() * hairCategory.items.length)
          ];
        newOutfit.hair = randomHair;
      }

      if (faceCategory && faceCategory.items.length > 0) {
        const randomFace =
          faceCategory.items[
            Math.floor(Math.random() * faceCategory.items.length)
          ];
        newOutfit.fullFace = randomFace;
      }
    }

    // 2. 随机选择衣服：全身 或者 上身+下身
    const outfitChoice = Math.random() < 0.5; // 50% 概率选择全身衣服

    if (outfitChoice) {
      // 选择全身衣服
      const outfitCategory = categories.find((cat) => cat.id === "outfit");
      if (outfitCategory && outfitCategory.items.length > 0) {
        const randomOutfit =
          outfitCategory.items[
            Math.floor(Math.random() * outfitCategory.items.length)
          ];
        newOutfit.outfit = randomOutfit;
      }
    } else {
      // 选择上身+下身
      const topCategory = categories.find((cat) => cat.id === "top");
      const bottomCategory = categories.find((cat) => cat.id === "bottom");

      if (topCategory && topCategory.items.length > 0) {
        const randomTop =
          topCategory.items[
            Math.floor(Math.random() * topCategory.items.length)
          ];
        newOutfit.top = randomTop;
      }

      if (bottomCategory && bottomCategory.items.length > 0) {
        const randomBottom =
          bottomCategory.items[
            Math.floor(Math.random() * bottomCategory.items.length)
          ];
        newOutfit.bottom = randomBottom;
      }
    }

    // 3. 随机选择背景
    const backgroundCategory = categories.find(
      (cat) => cat.id === "background",
    );
    if (backgroundCategory && backgroundCategory.items.length > 0) {
      const randomBackground =
        backgroundCategory.items[
          Math.floor(Math.random() * backgroundCategory.items.length)
        ];
      newOutfit.background = randomBackground;
    }

    setOutfit(newOutfit);

    // 在下一个tick保存到历史记录，确保outfit已经更新
    setTimeout(() => {
      saveToHistory(newOutfit);
    }, 0);
  }, [saveToHistory]);

  const generateUniqueId = useCallback(() => {
    // 生成超短ID：使用更短的格式
    // 使用时间戳的后4位 + 4位随机字符，总共约8位
    const timestamp = Date.now().toString(36).slice(-4); // 取时间戳后4位
    const randomId = Math.random().toString(36).substring(2, 6); // 4位随机字符
    
    return `${timestamp}${randomId}`;
  }, []);

  const handleShareOutfit = useCallback(async () => {
    // 生成唯一的分享ID
    const uniqueId = generateUniqueId();

    // 将装扮数据和语言设置存储到Supabase中
    const success = await saveShareData(uniqueId, outfit, language);
    
    if (success) {
      // 生成简短的分享链接，只包含ID
      const shareUrl = `${window.location.origin}${window.location.pathname}?id=${uniqueId}`;

      // 调试信息
      console.log("当前装扮数据:", outfit);
      console.log("当前语言:", language);
      console.log("生成的分享链接:", shareUrl);

      // 直接跳转到分享页面
      window.location.href = shareUrl;
    } else {
      console.error("保存分享数据失败");
    }
  }, [outfit, language, generateUniqueId]);

  // 如果是分享页面，渲染分享页面组件
  if (isSharePage) {
    return <SharePage outfit={outfit} />;
  }

  return (
    <div className="qq-window">
      <div className="qq-titlebar">
        <div className="qq-titlebar-left">
          <img
            src="/assets/icons/qqshow_icon.PNG"
            alt="QQ秀"
            className="qq-icon clickable-icon"
            onClick={() => window.open("https://qqshow2000.com", "_blank")}
            title="访问主站"
          />
          <span
            className="qq-title clickable-title"
            onClick={() => window.open("https://qqshow2000.com", "_blank")}
            title="访问主站"
          >
            {t.app.title}
          </span>
        </div>
        <div className="qq-titlebar-right">
          <div className="language-buttons">
            <button
              className={`language-button ${language === "zh" ? "active" : ""}`}
              onClick={(e) => {
                setLanguage("zh");
                e.currentTarget.blur();
              }}
              title="中文"
            >
              中文
            </button>
            <button
              className={`language-button ${language === "en" ? "active" : ""}`}
              onClick={(e) => {
                setLanguage("en");
                e.currentTarget.blur();
              }}
              title="English"
            >
              EN
            </button>
          </div>
          <button
            className="about-button"
            onClick={(e) => {
              setShowAbout(true);
              e.currentTarget.blur();
            }}
            title={t.app.about}
          >
            {t.app.about}
          </button>
          <button
            className={`share-button ${language === "en" ? "english" : ""}`}
            onClick={(e) => {
              handleShareOutfit();
              e.currentTarget.blur();
            }}
            title={t.app.shareOutfit}
          >
            {t.app.shareOutfit}
          </button>
        </div>
      </div>

      <div className="app-content">
        <div className="qq-show-layout">
          <div
            className="qq-show-panel col-display"
            style={{ justifySelf: "center" }}
          >
            <div className="display-controls">
              <div className="left-controls">
                <button
                  className="clear-button"
                  onClick={(e) => {
                    setOutfit({});
                    // 在下一个tick保存到历史记录，确保outfit已经更新
                    setTimeout(() => {
                      saveToHistory({});
                    }, 0);
                    // 点击后自动失焦
                    e.currentTarget.blur();
                  }}
                >
                  {t.app.clearAll}
                </button>
              </div>
              <div className="center-controls">
                <button
                  className="action-button undo-button"
                  onClick={(e) => {
                    handleUndo();
                    e.currentTarget.blur();
                  }}
                  disabled={historyIndex === 0}
                  title={t.app.undo}
                >
                  ↶
                </button>
                <button
                  className="action-button redo-button"
                  onClick={(e) => {
                    handleRedo();
                    e.currentTarget.blur();
                  }}
                  disabled={historyIndex >= history.length - 1}
                  title={t.app.redo}
                >
                  ↷
                </button>
              </div>
              <div className="right-controls">
                <button
                  className="random-button"
                  onClick={(e) => {
                    handleRandomOutfit();
                    e.currentTarget.blur();
                  }}
                  title={t.app.randomStyle}
                >
                  ⚂
                </button>
              </div>
            </div>
            <QQShow
              outfit={outfit}
              onItemChange={(_category, item) => {
                if (item) {
                  handleItemSelect(item);
                } else {
                  handleItemRemove();
                }
              }}
            />
          </div>

          <div className="menus-container">
            <div className="qq-show-panel col-items">
              <ItemSelector
                category={selectedCategoryData}
                selectedItem={selectedItem}
                onItemSelect={handleItemSelect}
                onItemRemove={handleItemRemove}
              />
            </div>

            <div className="qq-show-panel col-categories">
              <CategorySelector
                categories={categories}
                selectedCategory={selectedCategory}
                onCategorySelect={handleCategorySelect}
              />
            </div>
          </div>
        </div>
      </div>

      {/* About Modal */}
      {showAbout && (
        <div className="modal-overlay" onClick={() => setShowAbout(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{t.about.title}</h2>
              <button
                className="modal-close"
                onClick={(e) => {
                  setShowAbout(false);
                  e.currentTarget.blur();
                }}
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <div>
                <div className="about-section about-description">
                  <p
                    style={{ whiteSpace: "pre-line" }}
                    dangerouslySetInnerHTML={{ __html: t.about.description }}
                  ></p>
                </div>
                <div className="about-section about-colophon">
                  <p
                    style={{ whiteSpace: "pre-line" }}
                    dangerouslySetInnerHTML={{ __html: t.about.colophon }}
                  ></p>
                </div>
                <div className="about-section about-disclaimers">
                  <p style={{ whiteSpace: "pre-line" }}>
                    {t.about.disclaimers}
                  </p>
                </div>
                <div className="about-section about-timeline">
                  <p style={{ whiteSpace: "pre-line" }}>{t.about.timeline}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}

export default App;
