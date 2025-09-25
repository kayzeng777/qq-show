// QQ秀装扮系统类型定义

export interface QQShowItem {
  id: string;
  name: string;
  thumbnail: string;
  image: string;
  category: string; // 分类ID
  layer: number; // 层级，数字越小越靠后
}

export interface QQShowCategory {
  id: string;
  name: string;
  thumbnail: string;
  layer: number; // 层级顺序
  items: QQShowItem[];
}

export interface QQShowOutfit {
  sparkle?: QQShowItem; // 闪闪（最前）
  text?: QQShowItem; // 装饰字
  frame?: QQShowItem; // 边框
  companion?: QQShowItem; // 陪伴
  headwear?: QQShowItem; // 头饰
  "face-decor"?: QQShowItem; // 脸饰
  glasses?: QQShowItem; // 眼镜墨镜
  earrings?: QQShowItem; // 耳饰
  neckwear?: QQShowItem; // 颈饰
  "head-set"?: QQShowItem; // 妆发造型
  hair?: QQShowItem; // 发型（组合前后头发）
  frontHair?: QQShowItem; // 前头发（发型组合的一部分）
  makeup?: QQShowItem; // 妆容
  backHair?: QQShowItem; // 后头发（发型组合的一部分）
  "other-accessories"?: QQShowItem; // 其他配饰
  outfit?: QQShowItem; // 套装
  top?: QQShowItem; // 上装
  bottom?: QQShowItem; // 下装
  wings?: QQShowItem; // 翅膀
  vehicle?: QQShowItem; // 车
  backgrounds?: QQShowItem; // 背景（最后）
  "background-decor"?: QQShowItem; // 背景装饰（背景之上、翅膀之下）
}

// 预定义的分类层级顺序（从后到前：数值越大越靠前）
export const LAYER_ORDER = {
  // 从后到前（数值越大越靠前）
  backgrounds: 0,
  "background-decor": 1,
  vehicle: 2,
  wings: 3,
  bottom: 4, // 下装
  hair: 5, // 发型（组合前后头发）
  backHair: 5, // 后头发（发型组合的一部分）
  top: 6, // 上装
  outfit: 7, // 套装
  makeup: 8, // 妆容
  "head-set": 9, // 妆发造型
  neckwear: 10, // 颈饰
  "face-decor": 11, // 脸饰
  frontHair: 12, // 前头发（发型组合的一部分）
  earrings: 13, // 耳饰
  glasses: 14, // 眼镜
  headwear: 15, // 头饰
  "other-accessories": 16, // 其他配饰
  companion: 17, // 陪伴
  frame: 18, // 边框
  text: 19, // 称号
  sparkle: 20, // 特效
} as const;

export type LayerKey = keyof typeof LAYER_ORDER;
