import React from "react";
import type { QQShowCategory, QQShowItem } from "../types/qqShow";
import ItemThumbnail from "./ItemThumbnail";
import OptimizedImage from "./OptimizedImage";
import { useLanguage } from "../contexts/LanguageContext";
import "./ItemSelector.css";

interface ItemSelectorProps {
  category: QQShowCategory | null;
  selectedItem: QQShowItem | null;
  onItemSelect: (item: QQShowItem) => void;
  onItemRemove: () => void;
}

const ItemSelector: React.FC<ItemSelectorProps> = ({
  category,
  selectedItem,
  onItemSelect,
  onItemRemove,
}) => {
  const { t } = useLanguage();
  
  // 获取分类的文件夹名称（处理ID与文件夹名称不匹配的情况）
  const getCategoryFolderName = (categoryId: string): string => {
    const folderMapping: Record<string, string> = {
      'background': 'backgrounds',
      'backgroundDecor': 'background-decor',
      'textDecor': 'text',
      'otherAccessories': 'other-accessories',
      'faceDecor': 'face-decor',
      'fullFace': 'full-face',
      'fullHead': 'full-head',
      'frontHair': 'front-hair',
      'backHair': 'back-hair'
    };
    return folderMapping[categoryId] || categoryId;
  };

  // 获取分类的默认文件扩展名
  const getDefaultFileExtension = (categoryId: string): string => {
    // 先获取正确的文件夹名称
    const folderName = getCategoryFolderName(categoryId);
    
    // 根据实际的文件系统检查结果
    const pngFolders = [
      'background-decor', 'backgrounds', 'companion', 'earrings', 'face-decor',
      'frame', 'full-face', 'full-head', 'glasses', 'headwear', 'necklace',
      'other-accessories', 'outfit', 'sparkle', 'text', 'vehicle', 'wings'
    ];
    
    return pngFolders.includes(folderName) ? 'png' : 'gif';
  };
  if (!category) {
    return (
      <div className="item-selector">
        <div className="item-selector-placeholder">
          <p>{t.app.selectCategory}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="item-selector">
      <h3 className="item-selector-title">
        {t.categories[category.id as keyof typeof t.categories] ||
          category.name}
      </h3>
      <div className="item-grid">
        {/* 添加"无"选项 */}
        <div
          className={`item-thumbnail ${!selectedItem ? "selected" : ""}`}
          onClick={onItemRemove}
        >
          <div className="item-thumbnail-image-container">
            {category.id === "hair" ? (
              // 发型分类：显示前后头发叠加
              <div className="hair-preview-container">
                {/* 占位元素，用于确定容器尺寸 */}
                <OptimizedImage
                  src={`/assets/front-hair/default.${getDefaultFileExtension("frontHair")}`}
                  alt=""
                  className="hair-preview-placeholder"
                  showLoadingState={false}
                />
                {/* 后头发 */}
                <OptimizedImage
                  src={`/assets/back-hair/default.${getDefaultFileExtension("backHair")}`}
                  alt="默认后头发"
                  className="hair-preview-back"
                />
                {/* 前头发 */}
                <OptimizedImage
                  src={`/assets/front-hair/default.${getDefaultFileExtension("frontHair")}`}
                  alt="默认前头发"
                  className="hair-preview-front"
                />
              </div>
            ) : (
              // 其他分类：显示单个图片
              <OptimizedImage
                src={`/assets/${getCategoryFolderName(category.id)}/default.${getDefaultFileExtension(category.id)}`}
                alt={t.app.none}
                className="item-thumbnail-image"
                draggable={false}
              />
            )}
          </div>
          <span className="item-name">{t.app.none}</span>
        </div>

        {/* 显示该分类的所有物品 */}
        {category.items.map((item) => (
          <ItemThumbnail
            key={item.id}
            item={item}
            isSelected={selectedItem?.id === item.id}
            onSelect={onItemSelect}
            onRemove={onItemRemove}
          />
        ))}
      </div>
    </div>
  );
};

export default ItemSelector;
