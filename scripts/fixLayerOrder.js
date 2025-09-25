import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const categoriesFile = join(__dirname, '../src/data/categories.ts');

async function main() {
  console.log('🔧 开始修复所有分类的layer顺序...');
  
  let categoriesContent = fs.readFileSync(categoriesFile, 'utf8');
  let categories = JSON.parse(categoriesContent.match(/export const categories = ([\s\S]+?) as const;/)[1]);
  
  // 预期的layer顺序
  const expectedLayers = {
    'backgrounds': 0,
    'background-decor': 1,
    'vehicle': 2,
    'wings': 3,
    'hair': 4,
    'bottom': 5,
    'top': 6,
    'outfit': 7,
    'makeup': 8,
    'head-set': 9,
    'face-decor': 10,
    'earrings': 11,
    'glasses': 12,
    'neckwear': 13,
    'headwear': 14,
    'other-accessories': 15,
    'companion': 16,
    'frame': 17,
    'text': 18,
    'sparkle': 19
  };
  
  console.log('📋 修复前的layer值：');
  categories.forEach(category => {
    console.log(`  ${category.id}: ${category.layer}`);
  });
  
  // 修复每个分类的layer值
  let fixedCount = 0;
  categories.forEach(category => {
    const expectedLayer = expectedLayers[category.id];
    if (expectedLayer !== undefined && category.layer !== expectedLayer) {
      console.log(`  🔧 修复 ${category.id}: ${category.layer} → ${expectedLayer}`);
      category.layer = expectedLayer;
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
  
  console.log('\n✅ 所有分类的layer顺序已修复！');
}

main().catch(console.error);
