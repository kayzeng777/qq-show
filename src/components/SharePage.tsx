import React, { useState, useEffect, useRef } from "react";
import ShareQQShow from "./ShareQQShow";
import type { QQShowOutfit } from "../types/qqShow";
import { useLanguage } from "../contexts/LanguageContext";

interface SharePageProps {
  outfit: QQShowOutfit;
}

const SharePage: React.FC<SharePageProps> = ({ outfit }) => {
  const { language, setLanguage, t } = useLanguage();
  const [showAbout, setShowAbout] = useState(false);
  const [outfitName, setOutfitName] = useState(t.app.defaultOutfitName);
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleCreateYourOwn = () => {
    window.location.href = "https://qqshow2000.com";
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleEditClick = () => {
    setIsEditing(true);
    setInputValue(""); // 清空input，只显示placeholder
    // 等待状态更新后再聚焦输入框
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
        // 防止软键盘遮挡，滚动到可视区域
        inputRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 100); // 增加延迟时间确保DOM更新完成
  };

  const handleBlur = () => {
    // 延迟退出编辑模式，避免与按钮点击冲突
    setTimeout(() => {
      // 如果input为空，保存默认名称
      if (inputValue.trim()) {
        setOutfitName(inputValue.trim());
      } else {
        setOutfitName(t.app.defaultOutfitName);
      }
      setIsEditing(false);
    }, 150);
  };

  const handleSaveClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // 如果input为空，保存默认名称
    if (inputValue.trim()) {
      setOutfitName(inputValue.trim());
    } else {
      setOutfitName(t.app.defaultOutfitName);
    }
    // 立即退出编辑模式
    setIsEditing(false);
  };

  const handleButtonMouseDown = (e: React.MouseEvent) => {
    e.preventDefault(); // 防止触发input的blur事件
  };

  // 更新页面标题
  useEffect(() => {
    document.title = `${outfitName} - ${t.app.title}`;
  }, [outfitName, t.app.title]);

  // 当语言改变时，更新装扮名称的默认值
  useEffect(() => {
    if (outfitName === (language === "zh" ? "My QQ Show" : "我的QQ秀")) {
      setOutfitName(t.app.defaultOutfitName);
    }
  }, [language, outfitName, t.app.defaultOutfitName]);



  return (
    <div className="qq-window">
      <div className="qq-titlebar">
        <div className="qq-titlebar-left">
          <img
            src="/assets/icons/qqshow_icon.PNG"
            alt="QQ秀"
            className="qq-icon clickable-icon"
            onClick={handleCreateYourOwn}
            title="回到主站"
          />
          <span
            className="qq-title clickable-title"
            onClick={handleCreateYourOwn}
            title="回到主站"
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
              handleCreateYourOwn();
              e.currentTarget.blur();
            }}
            title={t.app.createYourOwn}
          >
            {t.app.createYourOwn}
          </button>
        </div>
      </div>

      <div className="app-content share-page-content">
        <div className="qq-show-layout share-page-layout">
          <div className="qq-show-panel col-display share-page-display">
            <ShareQQShow outfit={outfit} />

            {/* 装扮名称编辑区域 */}
            <div className="outfit-name-section" style={{ width: '210px' }}>
              <div className="outfit-name-container" style={{ width: '100%' }}>
                {isEditing ? (
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputValue}
                    onChange={handleNameChange}
                    onBlur={handleBlur}
                    placeholder={t.app.defaultOutfitName}
                    className="outfit-name-input"
                    style={{
                      fontSize: '16px',
                      fontWeight: 'bold',
                      fontFamily: 'Unifont, monospace',
                      color: '#333',
                      background: 'transparent',
                      border: 'none',
                      flex: 1,
                      textAlign: 'center',
                      padding: 0,
                      width: '100%'
                    }}
                  />
                ) : (
                  <span 
                    className="outfit-name-display"
                    style={{
                      fontSize: '16px',
                      fontWeight: 'bold',
                      fontFamily: 'Unifont, monospace',
                      color: '#333',
                      flex: 1,
                      textAlign: 'center',
                      padding: '4px 0',
                      minHeight: '24px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    {outfitName}
                  </span>
                )}
                <button
                  className="outfit-name-button"
                  onClick={isEditing ? handleSaveClick : handleEditClick}
                  onMouseDown={handleButtonMouseDown}
                  title={isEditing ? "完成" : "编辑名称"}
                  style={{
                    padding: '4px 8px',
                    border: '1px solid #c0c0c0',
                    background: '#ffffff',
                    color: '#333',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    fontFamily: 'Unifont, monospace',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textShadow: '1px 1px 0px #cccccc',
                    outline: 'none',
                    boxShadow: 'inset 1px 1px 2px rgba(255, 255, 255, 0.3), inset -1px -1px 2px rgba(0, 0, 0, 0.2)',
                    width: '40px',
                    height: '24px',
                    whiteSpace: 'nowrap',
                    transition: 'all 0.1s ease',
                    flexShrink: 0
                  }}
                >
                  {isEditing ? "✓" : "✎"}
                </button>
              </div>
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
};

export default SharePage;
