import React from "react";
import type { QQShowCategory, QQShowOutfit } from "../types/qqShow";
import { useLanguage } from "../contexts/LanguageContext";
import "./CategorySelector.css";

interface CategorySelectorProps {
  categories: QQShowCategory[];
  selectedCategory: string | null;
  outfit: QQShowOutfit;
  onCategorySelect: (categoryId: string) => void;
}

const CategorySelector: React.FC<CategorySelectorProps> = ({
  categories,
  selectedCategory,
  outfit,
  onCategorySelect,
}) => {
  const { t } = useLanguage();
  return (
    <div className="category-selector">
      <h3 className="category-title">{t.app.categoryTitle}</h3>
      <div className="category-grid">
        {categories.map((category) => {
          // 检查该分类是否有选中的物品
          const hasSelectedItem = outfit[category.id as keyof QQShowOutfit] !== undefined;
          
          return (
            <div
              key={category.id}
              className={`category-item ${selectedCategory === category.id ? "selected" : ""}`}
              onClick={(e) => {
                onCategorySelect(category.id);
                e.currentTarget.blur();
              }}
            >
              <div className="category-thumbnail">
                <img
                  src={category.thumbnail}
                  alt={category.name}
                  className="category-thumbnail-image"
                />
                
                {/* 选中状态指示器 */}
                {hasSelectedItem && (
                  <div className="selected-indicator">
                    <div className="selected-checkmark">✓</div>
                  </div>
                )}
              </div>
              <span className="category-name">
                {t.categories[category.id as keyof typeof t.categories] ||
                  category.name}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CategorySelector;
