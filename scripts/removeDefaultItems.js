import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const categoriesFile = join(__dirname, '../src/data/categories.ts');

async function main() {
  console.log('🔧 开始移除所有default选项...');
  
  let categoriesContent = fs.readFileSync(categoriesFile, 'utf8');
  let categories = JSON.parse(categoriesContent.match(/export const categories = ([\s\S]+?) as const;/)[1]);
  
  console.log(`📋 原始分类数量: ${categories.length}`);
  
  let totalRemoved = 0;
  
  // 遍历所有分类，移除default选项
  categories.forEach(category => {
    const originalLength = category.items.length;
    category.items = category.items.filter(item => item.name !== 'default');
    const removed = originalLength - category.items.length;
    if (removed > 0) {
      console.log(`  - ${category.name}: 移除了 ${removed} 个default选项`);
      totalRemoved += removed;
    }
  });
  
  console.log(`📋 总共移除了 ${totalRemoved} 个default选项`);
  
  // 更新文件
  const updatedContent = `// 自动生成的全量分类数据\nexport const categories = ${JSON.stringify(categories, null, 2)} as const;\n`;
  fs.writeFileSync(categoriesFile, updatedContent);
  
  console.log('✅ 所有default选项已移除！');
  console.log('📝 现在每个分类只包含实际的物品，不包含default选项');
}

main().catch(console.error);
