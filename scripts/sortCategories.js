import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const categoriesFile = join(__dirname, '../src/data/categories.ts');

// 中文字符排序函数
function chineseSort(a, b) {
  return a.localeCompare(b, 'zh-CN');
}

async function main() {
  console.log('🔧 开始按字母顺序排序所有分类物品...');
  
  let content = fs.readFileSync(categoriesFile, 'utf8');
  
  // 提取JSON部分（在export const categories = 之后，as const之前）
  const startIndex = content.indexOf('export const categories = [');
  const endIndex = content.lastIndexOf('] as const;');
  
  if (startIndex === -1 || endIndex === -1) {
    console.log('❌ 无法找到categories数组');
    return;
  }
  
  const jsonContent = content.substring(startIndex + 'export const categories = '.length, endIndex + 1);
  const categories = JSON.parse(jsonContent);
  
  let sortedCount = 0;
  
  // 遍历所有分类
  for (const category of categories) {
    if (category.items && category.items.length > 0) {
      console.log(`📋 排序分类: ${category.name} (${category.items.length} 个物品)`);
      
      // 按名称排序物品
      const originalOrder = category.items.map(item => item.name);
      category.items.sort((a, b) => chineseSort(a.name, b.name));
      const newOrder = category.items.map(item => item.name);
      
      // 检查是否重新排序了
      if (JSON.stringify(originalOrder) !== JSON.stringify(newOrder)) {
        console.log(`  ✅ 重新排序了 ${category.name} 分类`);
        sortedCount++;
      } else {
        console.log(`  ℹ️  ${category.name} 分类已经是正确顺序`);
      }
    }
  }
  
  // 重新生成文件内容
  const newContent = `// 自动生成的全量分类数据
export const categories = ${JSON.stringify(categories, null, 2)} as const;`;
  
  // 写回文件
  fs.writeFileSync(categoriesFile, newContent);
  
  console.log(`✅ 完成排序！重新排序了 ${sortedCount} 个分类`);
  console.log('📝 所有分类物品现在按字母顺序排列');
}

main().catch(console.error);
