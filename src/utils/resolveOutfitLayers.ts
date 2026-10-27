import type { QQShowItem, QQShowOutfit } from "../types/qqShow";
import { LAYER_ORDER } from "../types/qqShow";

export type ResolvedOutfitLayer = QQShowItem & {
  category: string;
  isDefault?: boolean;
};

const DEFAULT_ITEMS: Partial<Record<keyof typeof LAYER_ORDER, QQShowItem>> = {
  frontHair: {
    id: "default_frontHair",
    name: "默认前头发",
    thumbnail: "/assets/front-hair/default.gif",
    image: "/assets/front-hair/default.gif",
    category: "frontHair",
    layer: 10,
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

const SECONDARY_ORDER: Record<string, number> = {
  bottom: 0,
  outfit: 1,
  top: 2,
};

/** Resolves selected items, default layers, hair parts, and mutually exclusive slots. */
export function resolveOutfitLayers(outfit: QQShowOutfit): ResolvedOutfitLayer[] {
  const items: ResolvedOutfitLayer[] = [];
  const usedCategories = new Set<string>();
  const excludedCategories = new Set<string>();

  Object.entries(outfit).forEach(([category, item]) => {
    if (!item) return;

    const hair = item as QQShowItem & {
      frontHair?: QQShowItem;
      backHair?: QQShowItem;
    };

    if (category === "hair" && hair.frontHair) {
      if (hair.backHair) {
        items.push({ ...hair.backHair, category: "backHair", layer: 5 });
        usedCategories.add("backHair");
      }
      items.push({ ...hair.frontHair, category: "frontHair", layer: 10 });
      usedCategories.add("frontHair");
      excludedCategories.add("frontHair");
      excludedCategories.add("backHair");
    } else {
      items.push({ ...item, category, isDefault: false });
      usedCategories.add(category);
    }

    if (category === "head-set") {
      excludedCategories.add("hair");
      excludedCategories.add("frontHair");
      excludedCategories.add("backHair");
      excludedCategories.add("makeup");
    }
    if (category === "frontHair" || category === "backHair") {
      excludedCategories.add("hair");
    }
    if (category === "outfit") {
      excludedCategories.add("top");
      excludedCategories.add("bottom");
    }
  });

  Object.keys(LAYER_ORDER).forEach((category) => {
    if (usedCategories.has(category) || excludedCategories.has(category)) return;
    const defaultItem = DEFAULT_ITEMS[category as keyof typeof LAYER_ORDER];
    if (defaultItem) {
      items.push({ ...defaultItem, category, isDefault: true });
    }
  });

  return items.sort((a, b) => {
    const layerA = LAYER_ORDER[a.category as keyof typeof LAYER_ORDER] ?? 999;
    const layerB = LAYER_ORDER[b.category as keyof typeof LAYER_ORDER] ?? 999;
    if (layerA !== layerB) return layerA - layerB;
    return (SECONDARY_ORDER[a.category] ?? 0) - (SECONDARY_ORDER[b.category] ?? 0);
  });
}
