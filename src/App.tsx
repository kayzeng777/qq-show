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
const allCategories: QQShowCategory[] =
  generatedCategories as unknown as QQShowCategory[];

// 自定义分类显示顺序（不影响渲染层级）
const CATEGORY_DISPLAY_ORDER = [
  "backgrounds",      // 背景
  "sparkle",          // 特效
  "hair",             // 发型
  "makeup",           // 妆容
  "head-set",         // 妆发造型
  "outfit",           // 套装
  "top",              // 上装
  "bottom",           // 下装
  "headwear",         // 头饰
  "glasses",          // 眼镜墨镜
  "neckwear",         // 颈饰
  "earrings",         // 耳饰
  "face-decor",       // 脸饰
  "wings",            // 翅膀
  "other-accessories", // 其他配饰
  "companion",        // 陪伴
  "vehicle",          // 车
  "background-decor", // 背景装饰
  "frame",            // 边框
  "text"              // 装饰字
];

// 按自定义顺序排序分类
const categories: QQShowCategory[] = CATEGORY_DISPLAY_ORDER
  .map(categoryId => allCategories.find(cat => cat.id === categoryId))
  .filter((cat): cat is QQShowCategory => cat !== undefined);

function AppContent() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    "backgrounds",
  );
  const [outfit, setOutfit] = useState<QQShowOutfit>({});
  const [history, setHistory] = useState<QQShowOutfit[]>([{}]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [showAbout, setShowAbout] = useState(false);
  const [isSharePage, setIsSharePage] = useState(false);
  const [shouldAutoScroll, setShouldAutoScroll] = useState(false); // 控制是否应该自动滚动
  const { language, setLanguage, t } = useLanguage();

  // 重置自动滚动状态（延迟重置，确保ItemSelector有时间处理）
  useEffect(() => {
    if (shouldAutoScroll) {
      const timer = setTimeout(() => {
        setShouldAutoScroll(false);
      }, 200); // 延迟200ms重置，确保滚动完成
      
      return () => clearTimeout(timer);
    }
  }, [shouldAutoScroll]);

  // 从URL参数加载装扮
  useEffect(() => {
    const loadShareData = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const shareId = urlParams.get("id");

      // 只有在有分享ID时才显示分享页面，避免主页面的分享功能触发分享页面
      if (shareId) {
        console.log("检测到分享ID:", shareId);
        console.log("当前URL:", window.location.href);
        // 添加短暂延迟，确保页面完全加载后再显示分享页面
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // 显示分享页面
        setIsSharePage(true);
        console.log("设置为分享页面模式");
        
        try {
          // 从Supabase中读取装扮数据和语言设置
          const shareData = await getShareData(shareId);
          
          if (shareData) {
            // 先恢复语言设置（如果存在）
            if (shareData.language && (shareData.language === "zh" || shareData.language === "en")) {
              console.log('恢复语言设置:', shareData.language);
              setLanguage(shareData.language);
            } else {
              console.log('没有找到语言设置，使用默认语言');
            }
            
            // 验证装扮数据的有效性
            if (shareData.outfit && typeof shareData.outfit === "object") {
              setOutfit(shareData.outfit);
              // 保存到历史记录
              setHistory([shareData.outfit]);
              setHistoryIndex(0);

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
    setShouldAutoScroll(true); // 触发自动滚动
  };

  const handleItemSelect = (item: QQShowItem) => {
    setOutfit((prev) => {
      const newOutfit = { ...prev };

      // 添加新选择的item
      newOutfit[item.category as keyof QQShowOutfit] = item;

      // 互斥逻辑1: 妆发造型 vs 发型/妆容
      if (item.category === "head-set") {
        // 选择妆发造型时，移除发型和妆容
        delete newOutfit.hair;
        delete newOutfit.frontHair;
        delete newOutfit.backHair;
        delete newOutfit.makeup;
      } else if (
        ["hair", "frontHair", "backHair", "makeup"].includes(item.category)
      ) {
        // 选择发型或妆容时，移除妆发造型
        delete newOutfit["head-set"];
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

    // 辅助函数：随机选择物品（排除"无"选项和default物品）
    const getRandomItem = (category: QQShowCategory) => {
      const validItems = category.items.filter(item => {
        // 排除各种形式的"无"选项
        if (item.name === "无" || 
            item.name === "None" || 
            item.name === "none" ||
            item.name.includes("默认") || 
            item.name.includes("default") ||
            item.name.includes("Default") ||
            item.thumbnail.includes("/default.") ||
            item.thumbnail.includes("/default/") ||
            item.image.includes("/default.") ||
            item.image.includes("/default/")) {
          return false;
        }
        return true;
      });
      
      if (validItems.length === 0) return null;
      
      // 增加随机性：使用加权随机选择
      // 给每个物品不同的权重，让选择更加随机
      const weights = validItems.map(() => Math.random());
      const maxWeight = Math.max(...weights);
      const selectedIndex = weights.indexOf(maxWeight);
      
      return validItems[selectedIndex];
    };

    // 辅助函数：随机决定是否添加某个分类（增加随机性）
    const shouldAddCategory = (probability: number = 0.7) => Math.random() < probability;

    // 0. 随机选择背景（总是添加）
    const backgroundCategory = allCategories.find((cat) => cat.id === "backgrounds");
    if (backgroundCategory) {
      const randomBackground = getRandomItem(backgroundCategory);
      if (randomBackground) {
        newOutfit.backgrounds = randomBackground;
      }
    }

    // 1. 随机选择头部：妆发造型 或者 发型+脸（必有）
    const headChoice = Math.random() < 0.4; // 40% 概率选择妆发造型

    if (headChoice) {
      // 选择妆发造型（必有）
      const headSetCategory = allCategories.find((cat) => cat.id === "head-set");
      if (headSetCategory) {
        const randomHeadSet = getRandomItem(headSetCategory);
        if (randomHeadSet) {
          newOutfit["head-set"] = randomHeadSet;
        }
      }
    } else {
      // 选择发型+脸（必有）
      const hairCategory = allCategories.find((cat) => cat.id === "hair");
      const faceCategory = allCategories.find((cat) => cat.id === "makeup");

      if (hairCategory) {
        const randomHair = getRandomItem(hairCategory);
        if (randomHair) {
          newOutfit.hair = randomHair;
        }
      }

      if (faceCategory) {
        const randomFace = getRandomItem(faceCategory);
        if (randomFace) {
          newOutfit.makeup = randomFace;
        }
      }
    }

    // 2. 随机选择衣服：全身 或者 上身+下身（必有）
    const outfitChoice = Math.random() < 0.3; // 30% 概率选择全身衣服

    if (outfitChoice) {
      // 选择全身衣服（必有）
      const outfitCategory = allCategories.find((cat) => cat.id === "outfit");
      if (outfitCategory) {
        const randomOutfit = getRandomItem(outfitCategory);
        if (randomOutfit) {
          newOutfit.outfit = randomOutfit;
        }
      }
    } else {
      // 选择上身+下身（必有）
      const topCategory = allCategories.find((cat) => cat.id === "top");
      const bottomCategory = allCategories.find((cat) => cat.id === "bottom");

      if (topCategory) {
        const randomTop = getRandomItem(topCategory);
        if (randomTop) {
          newOutfit.top = randomTop;
        }
      }

      if (bottomCategory) {
        const randomBottom = getRandomItem(bottomCategory);
        if (randomBottom) {
          newOutfit.bottom = randomBottom;
        }
      }
    }

    // 3. 随机添加配饰（增加更多随机性）
    const accessoryCategories = [
      { id: "headwear", probability: 0.4 },
      { id: "glasses", probability: 0.3 },
      { id: "neckwear", probability: 0.4 },
      { id: "earrings", probability: 0.3 },
      { id: "face-decor", probability: 0.2 },
      { id: "wings", probability: 0.2 },
      { id: "other-accessories", probability: 0.3 },
      { id: "companion", probability: 0.2 },
      { id: "vehicle", probability: 0.1 },
      { id: "background-decor", probability: 0.3 },
      { id: "frame", probability: 0.2 },
      { id: "text", probability: 0.1 },
      { id: "sparkle", probability: 0.4 }
    ];

    // 打乱配饰顺序，增加随机性
    const shuffledAccessories = [...accessoryCategories].sort(() => Math.random() - 0.5);
    
    shuffledAccessories.forEach(({ id, probability }) => {
      // 为每个配饰生成动态概率，增加随机性
      const dynamicProbability = probability * (0.5 + Math.random() * 1.0); // 0.5x 到 1.5x 的概率
      
      if (shouldAddCategory(dynamicProbability)) {
        const category = allCategories.find((cat) => cat.id === id);
        if (category) {
          const randomItem = getRandomItem(category);
          if (randomItem) {
            newOutfit[id as keyof QQShowOutfit] = randomItem;
          }
        }
      }
    });

    setOutfit(newOutfit);
    setShouldAutoScroll(true); // 触发自动滚动

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
          <a
            className={`share-button ${language === "en" ? "english" : ""}`}
            href="#"
            onClick={async (e) => {
              e.preventDefault();
              const uniqueId = generateUniqueId();
              const success = await saveShareData(uniqueId, outfit, language);
              
              if (success) {
                const shareUrl = `${window.location.origin}${window.location.pathname}?id=${uniqueId}`;
                window.location.href = shareUrl;
              }
            }}
            title={t.app.shareOutfit}
          >
            {t.app.shareOutfit}
          </a>
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
                shouldAutoScroll={shouldAutoScroll}
              />
            </div>

            <div className="qq-show-panel col-categories">
              <CategorySelector
                categories={categories}
                selectedCategory={selectedCategory}
                outfit={outfit}
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
