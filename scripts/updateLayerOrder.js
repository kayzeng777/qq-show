import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const categoriesFile = join(__dirname, '../src/data/categories.ts');
const typesFile = join(__dirname, '../src/types/qqShow.ts');

async function main() {
  console.log('🔧 开始更新图层渲染顺序...');
  
  // 新的layer顺序
  const newLayerOrder = {
    'backgrounds': 0,
    'background-decor': 1,
    'vehicle': 2,
    'wings': 3,
    'bottom': 4,
    'hair': 5, // 发型
    'top': 6,
    'outfit': 7,
    'makeup': 8,
    'head-set': 9,
    'neckwear': 10,
    'earrings': 11,
    'face-decor': 12,
    'glasses': 13,
    'headwear': 14,
    'other-accessories': 15,
    'companion': 16,
    'frame': 17,
    'text': 18,
    'sparkle': 19,
  };
  
  // 1. 更新categories.ts中的layer值
  console.log('📋 更新categories.ts中的layer值...');
  let categoriesContent = fs.readFileSync(categoriesFile, 'utf8');
  let categories = JSON.parse(categoriesContent.match(/export const categories = ([\s\S]+?) as const;/)[1]);
  
  let fixedCount = 0;
  categories.forEach(category => {
    const newLayer = newLayerOrder[category.id];
    if (newLayer !== undefined && category.layer !== newLayer) {
      console.log(`  🔧 修复 ${category.id}: ${category.layer} → ${newLayer}`);
      category.layer = newLayer;
      fixedCount++;
    }
  });
  
  console.log(`✅ 修复了 ${fixedCount} 个分类的layer值`);
  
  // 更新文件
  const updatedCategoriesContent = `// 自动生成的全量分类数据\nexport const categories = ${JSON.stringify(categories, null, 2)} as const;\n`;
  fs.writeFileSync(categoriesFile, updatedCategoriesContent);
  
  // 2. 更新types/qqShow.ts中的LAYER_ORDER
  console.log('📋 更新types/qqShow.ts中的LAYER_ORDER...');
  let typesContent = fs.readFileSync(typesFile, 'utf8');
  
  // 新的LAYER_ORDER
  const newLAYER_ORDER = {
    backgrounds: 0,
    "background-decor": 1,
    vehicle: 2,
    wings: 3,
    bottom: 4,
    hair: 5, // 发型（组合前后头发）
    backHair: 5, // 后头发（发型组合的一部分）
    top: 6,
    outfit: 7,
    makeup: 8,
    "head-set": 9,
    frontHair: 10, // 前头发（发型组合的一部分）
    neckwear: 11,
    earrings: 12,
    "face-decor": 13,
    glasses: 14,
    headwear: 15,
    "other-accessories": 16,
    companion: 17,
    frame: 18,
    text: 19,
    sparkle: 20,
  };
  
  // 替换LAYER_ORDER
  const layerOrderRegex = /export const LAYER_ORDER = \{[\s\S]+?\} as const;/;
  const newLayerOrderString = `export const LAYER_ORDER = ${JSON.stringify(newLAYER_ORDER, null, 2)} as const;`;
  
  typesContent = typesContent.replace(layerOrderRegex, newLayerOrderString);
  fs.writeFileSync(typesFile, typesContent);
  
  console.log('✅ 更新了LAYER_ORDER');
  
  // 3. 更新QQShow.tsx和ShareQQShow.tsx中的发型分解逻辑
  console.log('📋 更新发型分解逻辑中的layer值...');
  
  const qqShowFile = join(__dirname, '../src/components/QQShow.tsx');
  const shareQQShowFile = join(__dirname, '../src/components/ShareQQShow.tsx');
  
  // 更新QQShow.tsx
  let qqShowContent = fs.readFileSync(qqShowFile, 'utf8');
  qqShowContent = qqShowContent.replace(/layer: 12, \/\/ 前头发layer 12/g, 'layer: 10, // 前头发layer 10');
  qqShowContent = qqShowContent.replace(/layer: 12,/g, 'layer: 10,');
  fs.writeFileSync(qqShowFile, qqShowContent);
  
  // 更新ShareQQShow.tsx
  let shareQQShowContent = fs.readFileSync(shareQQShowFile, 'utf8');
  shareQQShowContent = shareQQShowContent.replace(/layer: 12, \/\/ 前头发layer 12/g, 'layer: 10, // 前头发layer 10');
  shareQQShowContent = shareQQShowContent.replace(/layer: 12,/g, 'layer: 10,');
  fs.writeFileSync(shareQQShowFile, shareQQShowContent);
  
  console.log('✅ 更新了发型分解逻辑中的layer值');
  
  console.log('\n📋 新的图层渲染顺序：');
  Object.entries(newLayerOrder).forEach(([id, layer]) => {
    console.log(`  ${layer}. ${id}`);
  });
  
  console.log('\n✅ 图层渲染顺序更新完成！');
}

main().catch(console.error);
