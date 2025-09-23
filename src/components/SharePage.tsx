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

  const handleCreateYourOwn = () => {
    window.location.href = "https://qqshow2000.com";
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOutfitName(e.target.value);
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
            <div className="outfit-name-section">
              <div className="outfit-name-container">
                <input
                  type="text"
                  value={outfitName}
                  onChange={handleNameChange}
                  placeholder={t.app.defaultOutfitName}
                  className="outfit-name-input"
                />
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
