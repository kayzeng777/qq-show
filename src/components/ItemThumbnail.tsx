import React from 'react';
import type { QQShowItem } from '../types/qqShow';
import { useLanguage } from '../contexts/LanguageContext';
import { translateItemName } from '../utils/translations';
import './ItemThumbnail.css';

interface ItemThumbnailProps {
  item: QQShowItem;
  isSelected: boolean;
  onSelect: (item: QQShowItem) => void;
  onRemove?: () => void;
}

const ItemThumbnail: React.FC<ItemThumbnailProps> = ({
  item,
  isSelected,
  onSelect,
  onRemove,
}) => {
  const { language } = useLanguage();
  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isSelected && onRemove) {
      onRemove();
    } else {
      onSelect(item);
    }
    // 点击后自动失焦
    e.currentTarget.blur();
  };

  // 检查是否是发型item（包含前后头发）
  const isHairItem = item.category === 'hair' && (item as any).frontHair;
  const hairItem = isHairItem ? (item as any) : null;

  return (
    <div
      className={`item-thumbnail item-thumbnail-component ${isSelected ? 'selected' : ''}`}
      style={{
        padding: '12px 12px 8px 12px',
        boxSizing: 'border-box'
      }}
      onClick={handleClick}
    >
      <div className="item-thumbnail-image-container">
        {isHairItem && hairItem ? (
          // 发型item：显示前后头发叠加
          <div className="hair-preview-container">
            {/* 占位元素，用于确定容器尺寸 */}
            <img
              src={hairItem.frontHair.image}
              alt=""
              className="hair-preview-placeholder"
            />
            {/* 后头发 */}
            {hairItem.backHair && (
              <img
                src={hairItem.backHair.image}
                alt={translateItemName(hairItem.backHair.name, language)}
                className="hair-preview-back"
              />
            )}
            {/* 前头发 */}
            <img
              src={hairItem.frontHair.image}
                alt={translateItemName(hairItem.frontHair.name, language)}
              className="hair-preview-front"
            />
          </div>
        ) : (
          // 普通item：显示单个图片
          <img
            src={item.thumbnail}
            alt={translateItemName(item.name, language)}
            className="item-thumbnail-image"
          />
        )}
      </div>
      <span className="item-name">{translateItemName(item.name, language)}</span>
    </div>
  );
};

export default ItemThumbnail;
