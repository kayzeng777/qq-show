import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const categoriesFile = join(__dirname, '../src/data/categories.ts');

async function main() {
  console.log('🔧 开始重新排序分类...');
  
  let categoriesContent = fs.readFileSync(categoriesFile, 'utf8');
  let categories = JSON.parse(categoriesContent.match(/export const categories = ([\s\S]+?) as const;/)[1]);
  
  console.log(`📋 原始分类数量: ${categories.length}`);
  
  // 您想要的显示顺序
  const desiredOrder = [
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
  
  console.log('📋 期望的分类顺序：');
  desiredOrder.forEach((id, index) => {
    const category = categories.find(cat => cat.id === id);
    if (category) {
      console.log(`  ${index + 1}. ${category.id} - ${category.name}`);
    } else {
      console.log(`  ${index + 1}. ${id} - 未找到`);
    }
  });
  
  // 重新排序分类
  const reorderedCategories = [];
  
  // 按照期望顺序添加分类
  desiredOrder.forEach(id => {
    const category = categories.find(cat => cat.id === id);
    if (category) {
      reorderedCategories.push(category);
    }
  });
  
  // 添加任何遗漏的分类（如果有的话）
  categories.forEach(category => {
    if (!desiredOrder.includes(category.id)) {
      console.log(`⚠️ 发现未在期望顺序中的分类: ${category.id} - ${category.name}`);
      reorderedCategories.push(category);
    }
  });
  
  console.log(`\n📋 重新排序后的分类数量: ${reorderedCategories.length}`);
  
  // 更新文件
  const updatedContent = `// 自动生成的全量分类数据\nexport const categories = ${JSON.stringify(reorderedCategories, null, 2)} as const;\n`;
  fs.writeFileSync(categoriesFile, updatedContent);
  
  console.log('✅ 分类重新排序完成！');
  console.log('📝 现在分类在菜单中的显示顺序已按您的要求调整');
  console.log('📝 注意：这只是改变了显示顺序，不会影响图层的渲染顺序');
}

main().catch(console.error);
