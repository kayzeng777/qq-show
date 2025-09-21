import React from 'react';
import type { QQShowCategory, QQShowItem } from '../types/qqShow';
import ItemThumbnail from './ItemThumbnail';
import { useLanguage } from '../contexts/LanguageContext';
import './ItemSelector.css';

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
      <h3 className="item-selector-title">{t.categories[category.id as keyof typeof t.categories] || category.name}</h3>
      <div className="item-grid">
        {/* 添加"无"选项 */}
        <div
          className={`item-thumbnail ${!selectedItem ? 'selected' : ''}`}
          onClick={onItemRemove}
        >
          <div className="item-thumbnail-image-container">
            <img
              src="/assets/default/none.png"
              alt={t.app.none}
              className="item-thumbnail-image"
              draggable={false}
            />
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
