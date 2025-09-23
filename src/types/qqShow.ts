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
  textDecor?: QQShowItem; // 装饰字
  frame?: QQShowItem; // 边框
  companion?: QQShowItem; // 陪伴
  headwear?: QQShowItem; // 头饰
  faceDecor?: QQShowItem; // 脸饰
  glasses?: QQShowItem; // 眼镜墨镜
  earrings?: QQShowItem; // 耳饰
  necklace?: QQShowItem; // 颈饰
  fullHead?: QQShowItem; // 妆发造型
  hair?: QQShowItem; // 发型（组合前后头发）
  frontHair?: QQShowItem; // 前头发（发型组合的一部分）
  fullFace?: QQShowItem; // 妆容
  backHair?: QQShowItem; // 后头发（发型组合的一部分）
  otherAccessories?: QQShowItem; // 其他配饰
  outfit?: QQShowItem; // 套装
  top?: QQShowItem; // 上装
  bottom?: QQShowItem; // 下装
  wings?: QQShowItem; // 翅膀
  vehicle?: QQShowItem; // 车
  background?: QQShowItem; // 背景（最后）
  backgroundDecor?: QQShowItem; // 背景装饰（背景之上、翅膀之下）
}

// 预定义的分类层级顺序（从后到前：数值越大越靠前）
export const LAYER_ORDER = {
  // 从后到前（数值越大越靠前）
  background: 0,
  backgroundDecor: 1,
  vehicle: 2,
  wings: 3,
  hair: 4, // 发型（组合前后头发）
  backHair: 5, // 后头发（发型组合的一部分）
  bottom: 5, // 下装
  top: 6, // 上装
  outfit: 7, // 套装
  fullFace: 8, // 妆容
  fullHead: 9, // 妆发造型
  frontHair: 10, // 前头发（发型组合的一部分）
  faceDecor: 10,
  earrings: 11,
  glasses: 12,
  necklace: 13,
  headwear: 14,
  otherAccessories: 15, // 其他配饰
  companion: 16,
  frame: 17,
  textDecor: 18,
  sparkle: 19,
} as const;

export type LayerKey = keyof typeof LAYER_ORDER;
