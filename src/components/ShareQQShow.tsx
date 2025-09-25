import React from "react";
import type { QQShowItem, QQShowOutfit } from "../types/qqShow";
import { LAYER_ORDER } from "../types/qqShow";

interface ShareQQShowProps {
  outfit: QQShowOutfit;
}

const ShareQQShow: React.FC<ShareQQShowProps> = ({ outfit }) => {
  // 获取分类的默认物品
  const getDefaultItemForCategory = (category: string): QQShowItem | null => {
    // 根据分类返回对应的默认物品
    const defaultItems: Record<string, QQShowItem> = {
      frontHair: {
        id: "default_frontHair",
        name: "默认前头发",
        thumbnail: "/assets/front-hair/default.gif",
        image: "/assets/front-hair/default.gif",
        category: "frontHair",
        layer: 12,
      },
      backHair: {
        id: "default_backHair", 
        name: "默认后头发",
        thumbnail: "/assets/back-hair/default.gif",
        image: "/assets/back-hair/default.gif",
        category: "backHair",
        layer: 5,
      },
      bottom: {
        id: "default_bottom",
        name: "默认下装",
        thumbnail: "/assets/bottom/default.gif",
        image: "/assets/bottom/default.gif",
        category: "bottom",
        layer: 5,
      },
      top: {
        id: "default_top",
        name: "默认上装",
        thumbnail: "/assets/top/default.gif",
        image: "/assets/top/default.gif",
        category: "top",
        layer: 6,
      },
      makeup: {
        id: "default_makeup",
        name: "默认妆容",
        thumbnail: "/assets/makeup/default.png",
        image: "/assets/makeup/default.png",
        category: "makeup",
        layer: 8,
      },
    };
    
    return defaultItems[category] || null;
  };

  // 获取所有需要显示的物品（用户选择的 + 默认的）
  const getAllDisplayItems = (): (QQShowItem & {
    category: string;
    isDefault?: boolean;
  })[] => {
    const items: (QQShowItem & { category: string; isDefault?: boolean })[] =
      [];
    const usedCategories = new Set<string>();
    const excludedCategories = new Set<string>();

    // 首先添加用户选择的物品
    Object.entries(outfit).forEach(([category, item]) => {
      if (item) {
        // 特殊处理发型：将发型分解为前后头发
        if (category === "hair" && (item as any).frontHair) {
          const hairItem = item as any;
          
          // 添加后头发（如果存在）
          if (hairItem.backHair) {
            items.push({
              ...hairItem.backHair,
              category: "backHair",
              layer: 5, // 后头发layer 5
              isDefault: false,
            });
            usedCategories.add("backHair");
          }
          
          // 添加前头发
          items.push({
            ...hairItem.frontHair,
            category: "frontHair",
            layer: 12, // 前头发layer 12
            isDefault: false,
          });
          usedCategories.add("frontHair");
          
          // 排除单独的前头发和后头发分类
          excludedCategories.add("frontHair");
          excludedCategories.add("backHair");
        } else {
          // 普通物品
          items.push({
            ...item,
            category,
            isDefault: false,
          });
          usedCategories.add(category);
        }

        // 互斥逻辑：如果选择了妆发造型，排除发型、前头发、后头发、妆容
        if (category === "head-set") {
          excludedCategories.add("hair");
          excludedCategories.add("frontHair");
          excludedCategories.add("backHair");
          excludedCategories.add("makeup");
        }

        // 如果选择了单独的前头发或后头发，排除发型
        if (["frontHair", "backHair"].includes(category)) {
          excludedCategories.add("hair");
        }

        // 互斥逻辑：如果选择了衣服全身，排除衣服上身、衣服下身
        if (category === "outfit") {
          excludedCategories.add("top");
          excludedCategories.add("bottom");
        }
      }
    });

    // 然后添加未选择类别的默认物品（排除互斥的类别）
    Object.entries(LAYER_ORDER).forEach(([categoryKey]) => {
      if (
        !usedCategories.has(categoryKey) &&
        !excludedCategories.has(categoryKey)
      ) {
        // 从分类文件夹读取默认物品
        const defaultItem = getDefaultItemForCategory(categoryKey);
        if (defaultItem) {
          items.push({
            ...defaultItem,
            category: categoryKey,
            isDefault: true,
          });
        }
      }
    });



    return items;
  };

  const allDisplayItems = getAllDisplayItems();

  return (
    <div className="share-display-container">
      <div className="share-display-area">
        {allDisplayItems.map((item) => {
          const layerValue =
            LAYER_ORDER[item.category as keyof typeof LAYER_ORDER] ?? 0;

          // 如果是发型组合，需要渲染前头发和后头发
          if (item.category === "hair" && (item as any).frontHair) {
            const hairItem = item as any;
            return (
              <React.Fragment key={`${item.category}-${item.id}`}>
                {/* 后头发 */}
                {hairItem.backHair && (
                  <div
                    className="share-display-layer"
                    style={{ zIndex: LAYER_ORDER.backHair }}
                  >
                    <img
                      src={hairItem.backHair.image}
                      alt={hairItem.backHair.name}
                      className="share-display-image"
                      draggable={false}
                    />
                  </div>
                )}
                {/* 前头发 */}
                {hairItem.frontHair && (
                  <div
                    className="share-display-layer"
                    style={{ zIndex: LAYER_ORDER.frontHair }}
                  >
                    <img
                      src={hairItem.frontHair.image}
                      alt={hairItem.frontHair.name}
                      className="share-display-image"
                      draggable={false}
                    />
                  </div>
                )}
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
