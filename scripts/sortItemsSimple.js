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
  
  // 找到每个分类的items数组并排序
  const categoryRegex = /"items": \[([\s\S]*?)\]/g;
  let match;
  let sortedCount = 0;
  
  while ((match = categoryRegex.exec(content)) !== null) {
    const itemsSection = match[1];
    
    // 提取所有物品对象
    const itemRegex = /\{[^{}]*(?:\{[^{}]*\}[^{}]*)*\}/g;
    const items = [];
    let itemMatch;
    
    while ((itemMatch = itemRegex.exec(itemsSection)) !== null) {
      try {
        const itemObj = JSON.parse(itemMatch[0]);
        items.push({
          text: itemMatch[0],
          name: itemObj.name
        });
      } catch (e) {
        // 跳过无法解析的物品
        continue;
      }
    }
    
    if (items.length > 0) {
      // 按名称排序
      items.sort((a, b) => chineseSort(a.name, b.name));
      
      // 重新构建items数组
      const sortedItems = items.map(item => item.text).join(',\n');
      const newItemsSection = `[\n${sortedItems}\n      ]`;
      
      // 替换原始内容
      const beforeItems = content.substring(0, match.index + '"items": '.length);
      const afterItems = content.substring(match.index + match[0].length);
      content = beforeItems + newItemsSection + afterItems;
      
      sortedCount++;
      console.log(`✅ 排序了 ${items.length} 个物品`);
    }
  }
  
  // 写回文件
  fs.writeFileSync(categoriesFile, content);
  
  console.log(`✅ 完成排序！处理了 ${sortedCount} 个分类`);
  console.log('📝 所有分类物品现在按字母顺序排列');
}

main().catch(console.error);
