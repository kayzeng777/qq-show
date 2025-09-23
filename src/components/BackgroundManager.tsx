import React, { useState } from "react";
import type { BackgroundItem } from "../utils/backgroundManager";
import "./BackgroundManager.css";

interface BackgroundManagerProps {
  backgrounds: BackgroundItem[];
  onRename: (id: string, newName: string) => void;
  onRemove: (id: string) => void;
  title?: string;
}

const BackgroundManager: React.FC<BackgroundManagerProps> = ({
  backgrounds,
  onRename,
  onRemove,
  title = "背景图片管理",
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");

  const handleStartEdit = (item: BackgroundItem) => {
    setEditingId(item.id);
    setEditName(item.name);
  };

  const handleSaveEdit = () => {
    if (editingId && editName.trim()) {
      onRename(editingId, editName.trim());
      setEditingId(null);
      setEditName("");
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditName("");
  };

  return (
    <div className="background-manager">
      <h2>{title}</h2>
      <div className="background-grid">
        {backgrounds.map((item) => (
          <div key={item.id} className="background-item">
            <div className="background-preview">
              <img
                src={`/assets/backgrounds/${item.filename}`}
                alt={item.name}
                className="background-image"
                onError={(e) => {
                  // 如果图片加载失败，显示占位符
                  e.currentTarget.src =
                    "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjRjBGMEYwIi8+Cjx0ZXh0IHg9IjUwIiB5PSI1MCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjEyIiBmaWxsPSIjOTk5IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+5Zu+54mH5Yqg6L295aSx6LSlPC90ZXh0Pgo8L3N2Zz4K";
                }}
              />
            </div>

            <div className="background-info">
              {editingId === item.id ? (
                <div className="edit-form">
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="edit-input"
                    autoFocus
                    onKeyPress={(e) => {
                      if (e.key === "Enter") handleSaveEdit();
                      if (e.key === "Escape") handleCancelEdit();
                    }}
                  />
                  <div className="edit-buttons">
                    <button onClick={handleSaveEdit} className="save-btn">
                      保存
                    </button>
                    <button onClick={handleCancelEdit} className="cancel-btn">
                      取消
                    </button>
                  </div>
                </div>
              ) : (
                <div className="background-details">
                  <span className="background-name">{item.name}</span>
                  <div className="background-actions">
                    <button
                      onClick={() => handleStartEdit(item)}
                      className="edit-btn"
                    >
                      重命名
                    </button>
                    <button
                      onClick={() => onRemove(item.id)}
                      className="remove-btn"
                    >
                      删除
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BackgroundManager;
