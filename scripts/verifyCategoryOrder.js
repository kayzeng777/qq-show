import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const categoriesFile = join(__dirname, '../src/data/categories.ts');

async function main() {
  console.log('🔍 验证分类顺序...');
  
  let categoriesContent = fs.readFileSync(categoriesFile, 'utf8');
  let categories = JSON.parse(categoriesContent.match(/export const categories = ([\s\S]+?) as const;/)[1]);
  
  console.log('📋 当前分类顺序：');
  categories.forEach((category, index) => {
    console.log(`  ${index + 1}. ${category.id} - ${category.name} (layer: ${category.layer})`);
  });
  
  // 期望的顺序
  const expectedOrder = [
    'backgrounds',      // 背景
    'sparkle',          // 特效
    'hair',             // 发型
    'makeup',           // 妆容
    'head-set',         // 妆发造型
    'top',              // 上装
    'bottom',           // 下装
    'outfit',           // 套装
    'headwear',         // 头饰
    'glasses',          // 眼镜墨镜
    'neckwear',         // 颈饰
    'earrings',         // 耳饰
    'face-decor',       // 脸饰
    'wings',            // 翅膀
    'other-accessories', // 其他配饰
    'frame',            // 边框
    'background-decor', // 背景装饰
    'vehicle',          // 车
    'companion',        // 陪伴
    'text'              // 装饰字
  ];
  
  console.log('\n📋 期望的分类顺序：');
  expectedOrder.forEach((id, index) => {
    console.log(`  ${index + 1}. ${id}`);
  });
  
  console.log('\n🔍 验证结果：');
  let isCorrect = true;
  expectedOrder.forEach((expectedId, index) => {
    const actualId = categories[index]?.id;
    if (actualId === expectedId) {
      console.log(`  ✅ ${index + 1}. ${expectedId} - 正确`);
    } else {
      console.log(`  ❌ ${index + 1}. 期望: ${expectedId}, 实际: ${actualId}`);
      isCorrect = false;
    }
  });
  
  if (isCorrect) {
    console.log('\n✅ 分类顺序完全正确！');
  } else {
    console.log('\n❌ 分类顺序不正确，需要修复');
  }
}

main().catch(console.error);
