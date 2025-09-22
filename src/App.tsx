import { useState, useCallback } from 'react';
import QQShow from './components/QQShow';
import CategorySelector from './components/CategorySelector';
import ItemSelector from './components/ItemSelector';
import type { QQShowCategory, QQShowItem, QQShowOutfit } from './types/qqShow';
import { categories as generatedCategories } from './data/categories';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';
import './App.css';

// 使用自动生成的全量分类（已含背景与新分类）
const categories: QQShowCategory[] = generatedCategories as unknown as QQShowCategory[];

function AppContent() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>('background');
  const [outfit, setOutfit] = useState<QQShowOutfit>({});
  const [history, setHistory] = useState<QQShowOutfit[]>([{}]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [showAbout, setShowAbout] = useState(false);
  const { language, setLanguage, t } = useLanguage();

  const saveToHistory = useCallback((newOutfit: QQShowOutfit) => {
    setHistory(prev => {
      const newHistory = prev.slice(0, historyIndex + 1);
      newHistory.push(newOutfit);
      const finalHistory = newHistory.slice(-50); // 限制历史记录最多50条
      setHistoryIndex(finalHistory.length - 1);
      return finalHistory;
    });
  }, [historyIndex]);

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
    setOutfit(prev => {
      const newOutfit = { ...prev };
      
      // 添加新选择的item
      newOutfit[item.category as keyof QQShowOutfit] = item;
      
      // 互斥逻辑1: 全头 vs 发型/前头发/后头发/全脸
      if (item.category === 'fullHead') {
        // 选择全头时，移除发型、前头发、后头发、全脸
        delete newOutfit.hair;
        delete newOutfit.frontHair;
        delete newOutfit.backHair;
        delete newOutfit.fullFace;
      } else if (['hair', 'frontHair', 'backHair', 'fullFace'].includes(item.category)) {
        // 选择发型/前头发/后头发/全脸时，移除全头
        delete newOutfit.fullHead;
      }
      
      // 发型组合逻辑
      if (item.category === 'hair') {
        // 选择发型时，移除单独的前头发和后头发
        delete newOutfit.frontHair;
        delete newOutfit.backHair;
      } else if (['frontHair', 'backHair'].includes(item.category)) {
        // 选择单独的前头发或后头发时，移除发型
        delete newOutfit.hair;
      }
      
      // 互斥逻辑2: 衣服全身 vs 衣服上身/衣服下身
      if (item.category === 'outfit') {
        // 选择衣服全身时，移除衣服上身、衣服下身
        delete newOutfit.top;
        delete newOutfit.bottom;
      } else if (['top', 'bottom'].includes(item.category)) {
        // 选择衣服上身/衣服下身时，移除衣服全身
        delete newOutfit.outfit;
      }
      
      return newOutfit;
    });
    
    // 在下一个tick保存到历史记录，确保outfit已经更新
    setTimeout(() => {
      setOutfit(currentOutfit => {
        saveToHistory(currentOutfit);
        return currentOutfit;
      });
    }, 0);
  };

  const handleItemRemove = () => {
    if (selectedCategory) {
      setOutfit(prev => {
        const newOutfit = { ...prev };
        delete newOutfit[selectedCategory as keyof QQShowOutfit];
        return newOutfit;
      });
      
      // 在下一个tick保存到历史记录，确保outfit已经更新
      setTimeout(() => {
        setOutfit(currentOutfit => {
          saveToHistory(currentOutfit);
          return currentOutfit;
        });
      }, 0);
    }
  };

  const selectedCategoryData = selectedCategory 
    ? categories.find(cat => cat.id === selectedCategory) || null
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
      const fullHeadCategory = categories.find(cat => cat.id === 'fullHead');
      if (fullHeadCategory && fullHeadCategory.items.length > 0) {
        const randomFullHead = fullHeadCategory.items[Math.floor(Math.random() * fullHeadCategory.items.length)];
        newOutfit.fullHead = randomFullHead;
      }
    } else {
      // 选择发型+脸
      const hairCategory = categories.find(cat => cat.id === 'hair');
      const faceCategory = categories.find(cat => cat.id === 'fullFace');
      
      if (hairCategory && hairCategory.items.length > 0) {
        const randomHair = hairCategory.items[Math.floor(Math.random() * hairCategory.items.length)];
        newOutfit.hair = randomHair;
      }
      
      if (faceCategory && faceCategory.items.length > 0) {
        const randomFace = faceCategory.items[Math.floor(Math.random() * faceCategory.items.length)];
        newOutfit.fullFace = randomFace;
      }
    }

    // 2. 随机选择衣服：全身 或者 上身+下身
    const outfitChoice = Math.random() < 0.5; // 50% 概率选择全身衣服
    
    if (outfitChoice) {
      // 选择全身衣服
      const outfitCategory = categories.find(cat => cat.id === 'outfit');
      if (outfitCategory && outfitCategory.items.length > 0) {
        const randomOutfit = outfitCategory.items[Math.floor(Math.random() * outfitCategory.items.length)];
        newOutfit.outfit = randomOutfit;
      }
    } else {
      // 选择上身+下身
      const topCategory = categories.find(cat => cat.id === 'top');
      const bottomCategory = categories.find(cat => cat.id === 'bottom');
      
      if (topCategory && topCategory.items.length > 0) {
        const randomTop = topCategory.items[Math.floor(Math.random() * topCategory.items.length)];
        newOutfit.top = randomTop;
      }
      
      if (bottomCategory && bottomCategory.items.length > 0) {
        const randomBottom = bottomCategory.items[Math.floor(Math.random() * bottomCategory.items.length)];
        newOutfit.bottom = randomBottom;
      }
    }

    // 3. 随机选择背景
    const backgroundCategory = categories.find(cat => cat.id === 'background');
    if (backgroundCategory && backgroundCategory.items.length > 0) {
      const randomBackground = backgroundCategory.items[Math.floor(Math.random() * backgroundCategory.items.length)];
      newOutfit.background = randomBackground;
    }

    setOutfit(newOutfit);
    
    // 在下一个tick保存到历史记录，确保outfit已经更新
    setTimeout(() => {
      saveToHistory(newOutfit);
    }, 0);
  }, [saveToHistory]);

  return (
    <div className="qq-window">
      <div className="qq-titlebar">
        <div className="qq-titlebar-left">
          <img src="/assets/icons/qqshow_icon.PNG" alt="QQ秀" className="qq-icon" />
          <span className="qq-title">{t.app.title}</span>
        </div>
        <div className="qq-titlebar-right">
          <div className="language-buttons">
            <button 
              className={`language-button ${language === 'zh' ? 'active' : ''}`}
              onClick={(e) => {
                setLanguage('zh');
                e.currentTarget.blur();
              }}
              title="中文"
            >
              中文
            </button>
            <button 
              className={`language-button ${language === 'en' ? 'active' : ''}`}
              onClick={(e) => {
                setLanguage('en');
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
        </div>
      </div>
      
      <div className="app-content">
        <div className="qq-show-layout">
          <div className="qq-show-panel col-display" style={{ justifySelf: 'center' }}>
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
            <QQShow outfit={outfit} onItemChange={(_category, item) => {
              if (item) {
                handleItemSelect(item);
              } else {
                handleItemRemove();
              }
            }} />
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
                <p>{t.about.description}</p>
                <p>{t.about.features}</p>
                {t.about.featureList.map((feature, index) => (
                  <p key={index} dangerouslySetInnerHTML={{ __html: feature }}></p>
                ))}
                <p dangerouslySetInnerHTML={{ __html: t.about.conclusion }}></p>
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
