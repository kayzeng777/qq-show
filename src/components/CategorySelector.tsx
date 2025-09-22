import React from 'react';
import type { QQShowCategory } from '../types/qqShow';
import { useLanguage } from '../contexts/LanguageContext';
import './CategorySelector.css';

interface CategorySelectorProps {
  categories: QQShowCategory[];
  selectedCategory: string | null;
  onCategorySelect: (categoryId: string) => void;
}

const CategorySelector: React.FC<CategorySelectorProps> = ({
  categories,
  selectedCategory,
  onCategorySelect,
}) => {
  const { t } = useLanguage();
  return (
    <div className="category-selector">
      <h3 className="category-title">{t.app.categoryTitle}</h3>
      <div className="category-grid">
        {categories.map((category) => (
          <div
            key={category.id}
            className={`category-item ${selectedCategory === category.id ? 'selected' : ''}`}
            onClick={() => onCategorySelect(category.id)}
          >
            <div className="category-thumbnail">
              <img
                src={category.thumbnail}
                alt={category.name}
                className="category-thumbnail-image"
              />
            </div>
            <span className="category-name">{t.categories[category.id as keyof typeof t.categories] || category.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategorySelector;
