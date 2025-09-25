import React, { useRef, useEffect } from "react";
import type { QQShowCategory, QQShowItem } from "../types/qqShow";
import ItemThumbnail from "./ItemThumbnail";
import { useLanguage } from "../contexts/LanguageContext";
import "./ItemSelector.css";

interface ItemSelectorProps {
  category: QQShowCategory | null;
  selectedItem: QQShowItem | null;
  onItemSelect: (item: QQShowItem) => void;
  onItemRemove: () => void;
  shouldAutoScroll?: boolean; // 是否应该自动滚动
}

const ItemSelector: React.FC<ItemSelectorProps> = ({
  category,
  selectedItem,
  onItemSelect,
  onItemRemove,
  shouldAutoScroll = false,
}) => {
  const { t } = useLanguage();
  const itemGridRef = useRef<HTMLDivElement>(null);
  const itemSelectorRef = useRef<HTMLDivElement>(null);
  const selectedItemRef = useRef<HTMLDivElement>(null);
  
  // 自动滚动到选中的item（只在shouldAutoScroll为true时）
  useEffect(() => {
    if (shouldAutoScroll && selectedItem && selectedItemRef.current && itemGridRef.current && itemSelectorRef.current) {
      // 添加延迟确保DOM完全更新
      const scrollToSelected = () => {
        const selectedElement = selectedItemRef.current;
        
        if (!selectedElement) return;
        
        // 检查是否是移动设备（小屏幕）
        const isMobile = window.innerWidth <= 900;
        
        if (isMobile) {
          // 小屏幕：水平滚动到第一列，使用item-grid作为滚动容器
          const gridElement = itemGridRef.current;
          if (gridElement) {
            const scrollLeft = selectedElement.offsetLeft;
            gridElement.scrollTo({
              left: scrollLeft,
              behavior: 'smooth'
            });
          }
        } else {
          // 大屏幕：垂直滚动到第一行，使用item-selector作为滚动容器
          const selectorElement = itemSelectorRef.current;
          if (selectorElement) {
            // 计算相对于item-grid的offsetTop，因为item-grid是实际的内容容器
            const gridElement = itemGridRef.current;
            if (gridElement) {
              const gridRect = gridElement.getBoundingClientRect();
              const selectedRect = selectedElement.getBoundingClientRect();
              const relativeTop = selectedRect.top - gridRect.top + selectorElement.scrollTop;
              
              selectorElement.scrollTo({
                top: relativeTop,
                behavior: 'smooth'
              });
            }
          }
        }
      };
      
      // 使用requestAnimationFrame确保DOM更新完成
      requestAnimationFrame(() => {
        requestAnimationFrame(scrollToSelected);
      });
    }
  }, [shouldAutoScroll, selectedItem, category]);
  
  // 获取分类的文件夹名称（处理ID与文件夹名称不匹配的情况）
  const getCategoryFolderName = (categoryId: string): string => {
    // 直接返回categoryId，因为现在categories.ts中的ID已经和文件夹名称匹配
    return categoryId;
  };

  // 获取分类的默认文件扩展名
  const getDefaultFileExtension = (categoryId: string): string => {
    // 先获取正确的文件夹名称
    const folderName = getCategoryFolderName(categoryId);
    
    // 根据实际的文件系统检查结果
    const pngFolders = [
      'background-decor', 'backgrounds', 'companion', 'earrings', 'face-decor',
      'frame', 'makeup', 'head-set', 'glasses', 'headwear', 'neckwear',
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
    <div className="item-selector" ref={itemSelectorRef}>
      <h3 className="item-selector-title">
        {t.categories[category.id as keyof typeof t.categories] ||
          category.name}
      </h3>
      <div className="item-grid" ref={itemGridRef}>
        {/* 添加"无"选项 */}
        <div
          ref={!selectedItem ? selectedItemRef : null}
          className={`item-thumbnail ${!selectedItem ? "selected" : ""}`}
          onClick={onItemRemove}
        >
          <div className="item-thumbnail-image-container">
            {category.id === "hair" ? (
              // 发型分类：显示前后头发叠加
              <div className="hair-preview-container">
                {/* 占位元素，用于确定容器尺寸 */}
                <img
                  src={`/assets/front-hair/default.${getDefaultFileExtension("front-hair")}`}
                  alt=""
                  className="hair-preview-placeholder"
                />
                {/* 后头发 */}
                <img
                  src={`/assets/back-hair/default.${getDefaultFileExtension("back-hair")}`}
                  alt="默认后头发"
                  className="hair-preview-back"
                />
                {/* 前头发 */}
                <img
                  src={`/assets/front-hair/default.${getDefaultFileExtension("front-hair")}`}
                  alt="默认前头发"
                  className="hair-preview-front"
                />
              </div>
            ) : (
              // 其他分类：显示单个图片
              <img
                src={`/assets/${getCategoryFolderName(category.id)}/default.${getDefaultFileExtension(category.id)}`}
                alt={t.app.none}
                className="item-thumbnail-image"
                draggable={false}
              />
            )}
            
            {/* 选中状态指示器 */}
            {!selectedItem && (
              <div className="selected-indicator">
                <div className="selected-checkmark">✓</div>
              </div>
            )}
          </div>
          <span className="item-name">{t.app.none}</span>
        </div>

        {/* 显示该分类的所有物品 */}
        {category.items.map((item) => (
          <ItemThumbnail
            key={item.id}
            ref={selectedItem?.id === item.id ? selectedItemRef : null}
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
