import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 模拟LAYER_ORDER
const LAYER_ORDER = {
  backgrounds: 0,
  "background-decor": 1,
  vehicle: 2,
  wings: 3,
  bottom: 4,
  hair: 5,
  backHair: 5,
  top: 6,
  outfit: 7,
  makeup: 8,
  "head-set": 9,
  neckwear: 10,
  "face-decor": 11,
  frontHair: 12,
  earrings: 13,
  glasses: 14,
  headwear: 15,
  "other-accessories": 16,
  companion: 17,
  frame: 18,
  text: 19,
  sparkle: 20,
};

async function main() {
  console.log('🔍 测试显示顺序...');
  
  // 模拟一些物品
  const testItems = [
    { category: 'sparkle', name: '特效' },
    { category: 'text', name: '称号' },
    { category: 'frame', name: '边框' },
    { category: 'companion', name: '陪伴' },
    { category: 'headwear', name: '头饰' },
    { category: 'neckwear', name: '颈饰' },
    { category: 'glasses', name: '眼镜' },
    { category: 'earrings', name: '耳饰' },
    { category: 'face-decor', name: '脸饰' },
    { category: 'frontHair', name: '前头发' },
    { category: 'head-set', name: '妆发造型' },
    { category: 'makeup', name: '妆容' },
    { category: 'outfit', name: '套装' },
    { category: 'top', name: '上装' },
    { category: 'bottom', name: '下装' },
    { category: 'backHair', name: '后头发' },
    { category: 'hair', name: '发型' },
    { category: 'wings', name: '翅膀' },
    { category: 'vehicle', name: '车辆' },
    { category: 'background-decor', name: '背景装饰' },
    { category: 'backgrounds', name: '背景' },
  ];
  
  console.log('\n📋 排序前的顺序：');
  testItems.forEach((item, index) => {
    console.log(`${index + 1}. ${item.category} - ${item.name}`);
  });
  
  // 模拟排序逻辑
  const SECONDARY_ORDER = {
    bottom: 0,
    outfit: 1,
    top: 2,
  };
  
  const sortedItems = testItems.sort((a, b) => {
    const layerA = LAYER_ORDER[a.category] ?? 999;
    const layerB = LAYER_ORDER[b.category] ?? 999;
    if (layerA !== layerB) return layerA - layerB;
    const secA = SECONDARY_ORDER[a.category] ?? 0;
    const secB = SECONDARY_ORDER[b.category] ?? 0;
    return secA - secB;
  });
  
  console.log('\n📋 排序后的顺序（从后到前）：');
  sortedItems.forEach((item, index) => {
    const layer = LAYER_ORDER[item.category] ?? 999;
    console.log(`${index + 1}. ${item.category} (layer: ${layer}) - ${item.name}`);
  });
  
  console.log('\n✅ 显示顺序测试完成！');
  console.log('📝 正确的顺序应该是：背景 → 背景装饰 → 车辆 → 翅膀 → 下装 → 发型 → 上装 → 套装 → 妆容 → 妆发造型 → 颈饰 → 脸饰 → 前头发 → 耳饰 → 眼镜 → 头饰 → 其他配饰 → 陪伴 → 边框 → 称号 → 特效');
}

main().catch(console.error);
