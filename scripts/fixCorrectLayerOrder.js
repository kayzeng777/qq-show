import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const categoriesFile = join(__dirname, '../src/data/categories.ts');

async function main() {
  console.log('🔧 开始修复正确的layer顺序...');
  
  let categoriesContent = fs.readFileSync(categoriesFile, 'utf8');
  let categories = JSON.parse(categoriesContent.match(/export const categories = ([\s\S]+?) as const;/)[1]);
  
  // 正确的layer顺序
  const correctLayers = {
    'backgrounds': 0,
    'background-decor': 1,
    'vehicle': 2,
    'wings': 3,
    'bottom': 4,
    'hair': 5, // 发型（组合前后头发）
    'top': 6,
    'outfit': 7,
    'makeup': 8,
    'head-set': 9,
    'neckwear': 10,
    'face-decor': 11,
    'earrings': 12,
    'glasses': 13,
    'headwear': 14,
    'other-accessories': 15,
    'companion': 16,
    'frame': 17,
    'text': 18,
    'sparkle': 19,
  };
  
  console.log('📋 修复前的layer值：');
  categories.forEach(category => {
    console.log(`  ${category.id}: ${category.layer}`);
  });
  
  // 修复每个分类的layer值
  let fixedCount = 0;
  categories.forEach(category => {
    const correctLayer = correctLayers[category.id];
    if (correctLayer !== undefined && category.layer !== correctLayer) {
      console.log(`  🔧 修复 ${category.id}: ${category.layer} → ${correctLayer}`);
      category.layer = correctLayer;
      fixedCount++;
    }
  });
  
  console.log(`\n✅ 修复了 ${fixedCount} 个分类的layer值`);
  
  // 更新文件
  const updatedContent = `// 自动生成的全量分类数据\nexport const categories = ${JSON.stringify(categories, null, 2)} as const;\n`;
  fs.writeFileSync(categoriesFile, updatedContent);
  
  console.log('📋 修复后的layer值：');
  categories.forEach(category => {
    console.log(`  ${category.id}: ${category.layer}`);
  });
  
  console.log('\n✅ 所有分类的layer顺序已修复为正确的顺序！');
}

main().catch(console.error);
