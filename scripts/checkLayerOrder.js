import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const categoriesFile = join(__dirname, '../src/data/categories.ts');

async function main() {
  console.log('🔍 检查所有分类的layer顺序...');
  
  let categoriesContent = fs.readFileSync(categoriesFile, 'utf8');
  let categories = JSON.parse(categoriesContent.match(/export const categories = ([\s\S]+?) as const;/)[1]);
  
  console.log('\n📋 当前分类的layer值：');
  console.log('='.repeat(50));
  
  categories.forEach(category => {
    console.log(`${category.id.padEnd(20)} | layer: ${category.layer} | ${category.name}`);
  });
  
  console.log('\n📋 预期的layer顺序：');
  console.log('='.repeat(50));
  const expectedOrder = [
    { id: 'backgrounds', layer: 0, name: '背景' },
    { id: 'background-decor', layer: 1, name: '背景装饰' },
    { id: 'vehicle', layer: 2, name: '车辆' },
    { id: 'wings', layer: 3, name: '翅膀' },
    { id: 'hair', layer: 4, name: '发型' },
    { id: 'bottom', layer: 5, name: '下装' },
    { id: 'top', layer: 6, name: '上装' },
    { id: 'outfit', layer: 7, name: '套装' },
    { id: 'makeup', layer: 8, name: '妆容' },
    { id: 'head-set', layer: 9, name: '妆发造型' },
    { id: 'face-decor', layer: 10, name: '脸饰' },
    { id: 'earrings', layer: 11, name: '耳饰' },
    { id: 'glasses', layer: 12, name: '眼镜' },
    { id: 'neckwear', layer: 13, name: '颈饰' },
    { id: 'headwear', layer: 14, name: '头饰' },
    { id: 'other-accessories', layer: 15, name: '其他配饰' },
    { id: 'companion', layer: 16, name: '陪伴' },
    { id: 'frame', layer: 17, name: '边框' },
    { id: 'text', layer: 18, name: '称号' },
    { id: 'sparkle', layer: 19, name: '特效' }
  ];
  
  expectedOrder.forEach(expected => {
    const actual = categories.find(cat => cat.id === expected.id);
    if (actual) {
      const status = actual.layer === expected.layer ? '✅' : '❌';
      console.log(`${expected.id.padEnd(20)} | layer: ${actual.layer} (expected: ${expected.layer}) | ${status} ${expected.name}`);
    } else {
      console.log(`${expected.id.padEnd(20)} | 未找到分类 | ❌ ${expected.name}`);
    }
  });
  
  console.log('\n🔍 检查结果：');
  console.log('='.repeat(50));
  
  let hasErrors = false;
  expectedOrder.forEach(expected => {
    const actual = categories.find(cat => cat.id === expected.id);
    if (!actual) {
      console.log(`❌ 缺少分类: ${expected.id} (${expected.name})`);
      hasErrors = true;
    } else if (actual.layer !== expected.layer) {
      console.log(`❌ layer不匹配: ${expected.id} - 实际: ${actual.layer}, 预期: ${expected.layer}`);
      hasErrors = true;
    }
  });
  
  if (!hasErrors) {
    console.log('✅ 所有分类的layer顺序都正确！');
  } else {
    console.log('❌ 发现layer顺序问题，需要修复');
  }
}

main().catch(console.error);
