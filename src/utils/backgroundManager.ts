// 背景图片管理工具

export interface BackgroundItem {
  id: string;
  name: string;
  filename: string;
  description?: string;
  category?: string;
}

// 背景图片列表 - 需要根据实际内容更新
export const backgroundItems: BackgroundItem[] = [
  // 这些需要根据实际图片内容来更新
  { id: "bg_001", name: "背景1", filename: "background_001.gif" },
  { id: "bg_002", name: "背景2", filename: "background_002.gif" },
  { id: "bg_003", name: "背景3", filename: "background_003.gif" },
  // ... 更多背景
];

// 检查重复背景的函数
export const checkDuplicateBackgrounds = (
  _items: BackgroundItem[],
): BackgroundItem[][] => {
  // 这里需要实现重复检查逻辑
  // 由于无法直接比较图片内容，需要手动检查
  return [];
};

// 重新命名背景的函数
export const renameBackground = (
  item: BackgroundItem,
  newName: string,
): BackgroundItem => {
  return {
    ...item,
    name: newName,
  };
};

// 生成背景分类数据
export const generateBackgroundCategories = (items: BackgroundItem[]) => {
  return items.map((item) => ({
    id: item.id,
    name: item.name,
    thumbnail: `/assets/backgrounds/${item.filename}`, // 缩略图路径
    image: `/assets/backgrounds/${item.filename}`, // 完整图片路径
    category: "backgrounds",
    layer: 0,
  }));
};
