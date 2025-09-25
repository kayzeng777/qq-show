import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const categoriesFile = join(__dirname, '../src/data/categories.ts');

async function main() {
  console.log('🔧 开始重新排序分类显示顺序...');
  
  let categoriesContent = fs.readFileSync(categoriesFile, 'utf8');
  let categories = JSON.parse(categoriesContent.match(/export const categories = ([\s\S]+?) as const;/)[1]);
  
  // 您想要的显示顺序
  const displayOrder = [
    'backgrounds',      // 背景
    'sparkle',          // 特效
    'hair',             // 发型
    'makeup',           // 妆容
    'head-set',         // 妆发造型
    'top',              // 上装
    'bottom',           // 下装
    'outfit',           // 套装
    'wings',            // 翅膀
    'glasses',          // 眼镜墨镜
    'neckwear',         // 颈饰
    'face-decor',       // 脸饰
    'earrings',         // 耳饰
    'headwear',         // 头饰
    'other-accessories', // 其他配饰
    'frame',            // 边框
    'background-decor', // 背景装饰
    'vehicle',          // 车
    'companion',        // 陪伴
    'text'              // 装饰字
  ];
  
  console.log('📋 原始分类顺序：');
  categories.forEach((category, index) => {
    console.log(`${index + 1}. ${category.id} - ${category.name}`);
  });
  
  // 按照新的显示顺序重新排序
  const reorderedCategories = [];
  
  displayOrder.forEach(categoryId => {
    const category = categories.find(cat => cat.id === categoryId);
    if (category) {
      reorderedCategories.push(category);
    } else {
      console.log(`⚠️ 警告：未找到分类 ${categoryId}`);
    }
  });
  
  // 检查是否有遗漏的分类
  const usedIds = new Set(reorderedCategories.map(cat => cat.id));
  const missingCategories = categories.filter(cat => !usedIds.has(cat.id));
  
  if (missingCategories.length > 0) {
    console.log('📋 遗漏的分类（将添加到末尾）：');
    missingCategories.forEach(category => {
      console.log(`  - ${category.id} - ${category.name}`);
      reorderedCategories.push(category);
    });
  }
  
  console.log('\n📋 重新排序后的分类顺序：');
  reorderedCategories.forEach((category, index) => {
    console.log(`${index + 1}. ${category.id} - ${category.name}`);
  });
  
  // 更新文件
  const updatedContent = `// 自动生成的全量分类数据\nexport const categories = ${JSON.stringify(reorderedCategories, null, 2)} as const;\n`;
  fs.writeFileSync(categoriesFile, updatedContent);
  
  console.log('\n✅ 分类显示顺序已重新排序！');
  console.log('📝 注意：这只是改变了分类在菜单中的显示顺序，不会影响图层的渲染顺序');
}

main().catch(console.error);
