import React from 'react';
import type { QQShowItem, QQShowOutfit } from '../types/qqShow';
import { LAYER_ORDER } from '../types/qqShow';
import { defaults } from '../data/defaults';

interface ShareQQShowProps {
  outfit: QQShowOutfit;
}

const ShareQQShow: React.FC<ShareQQShowProps> = ({ outfit }) => {
  // 获取所有需要显示的物品（用户选择的 + 默认的）
  const getAllDisplayItems = (): (QQShowItem & { category: string; isDefault?: boolean })[] => {
    const items: (QQShowItem & { category: string; isDefault?: boolean })[] = [];
    const usedCategories = new Set<string>();
    const excludedCategories = new Set<string>();
    
    // 首先添加用户选择的物品
    Object.entries(outfit).forEach(([category, item]) => {
      if (item) {
        items.push({
          ...item,
          category,
          isDefault: false,
        });
        usedCategories.add(category);
        
        // 互斥逻辑：如果选择了全头，排除发型、前头发、后头发、全脸
        if (category === 'fullHead') {
          excludedCategories.add('hair');
          excludedCategories.add('frontHair');
          excludedCategories.add('backHair');
          excludedCategories.add('fullFace');
        }
        
        // 如果选择了全脸，排除发型、前头发、后头发、全头
        if (category === 'fullFace') {
          excludedCategories.add('hair');
          excludedCategories.add('frontHair');
          excludedCategories.add('backHair');
          excludedCategories.add('fullHead');
        }
      }
    });
    
    // 然后添加默认物品（如果该分类没有被用户选择且没有被排除）
    Object.entries(defaults).forEach(([category, defaultItem]) => {
      if (!usedCategories.has(category) && !excludedCategories.has(category) && defaultItem) {
        items.push({
          ...defaultItem,
          category,
          isDefault: true,
        });
      }
    });
    
    return items;
  };

  const allDisplayItems = getAllDisplayItems();

  return (
    <div className="share-display-container">
      <div className="share-display-area">
        {allDisplayItems.map((item) => {
          const layerValue = LAYER_ORDER[item.category as keyof typeof LAYER_ORDER] ?? 0;
          
          // 处理发型的前后头发分离显示
          if (item.category === 'hair' && item.backHair && item.frontHair) {
            return (
              <React.Fragment key={`${item.category}-${item.id}`}>
                <div
                  className="share-display-layer"
                  style={{ zIndex: LAYER_ORDER.backHair }}
                >
                  <img
                    src={item.backHair.image}
                    alt={item.backHair.name}
                    className="share-display-image"
                    draggable={false}
                  />
                </div>
                <div
                  className="share-display-layer"
                  style={{ zIndex: LAYER_ORDER.frontHair }}
                >
                  <img
                    src={item.frontHair.image}
                    alt={item.frontHair.name}
                    className="share-display-image"
                    draggable={false}
                  />
                </div>
              </React.Fragment>
            );
          }
          
          return (
            <div
              key={`${item.category}-${item.id}`}
              className="share-display-layer"
              style={{ zIndex: layerValue }}
            >
              <img
                src={item.image}
                alt={item.name}
                className="share-display-image"
                draggable={false}
              />
            </div>
          );
        })}
        
        {allDisplayItems.length === 0 && (
          <div className="share-display-empty">
            <p>选择装扮来创建你的QQ秀</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShareQQShow;
