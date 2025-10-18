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
  console.log('🔧 修复发型分类排序...');
  
  let content = fs.readFileSync(categoriesFile, 'utf8');
  
  // 找到发型分类的items数组
  const hairCategoryRegex = /"id": "hair"[\s\S]*?"items": \[([\s\S]*?)\]/;
  const match = content.match(hairCategoryRegex);
  
  if (!match) {
    console.log('❌ 未找到发型分类');
    return;
  }
  
  const itemsSection = match[1];
  
  // 提取所有发型物品
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
  
  console.log(`📋 找到 ${items.length} 个发型物品`);
  
  // 按名称排序
  items.sort((a, b) => chineseSort(a.name, b.name));
  
  // 重新构建items数组
  const sortedItems = items.map(item => item.text).join(',\n');
  const newItemsSection = `[\n${sortedItems}\n    ]`;
  
  // 替换原始内容
  const beforeItems = content.substring(0, match.index + match[0].indexOf('"items": [') + '"items": ['.length);
  const afterItems = content.substring(match.index + match[0].length);
  const newContent = beforeItems + newItemsSection + afterItems;
  
  // 写回文件
  fs.writeFileSync(categoriesFile, newContent);
  
  console.log('✅ 发型分类排序已修复');
  console.log('📝 所有发型物品现在按字母顺序排列');
}

main().catch(console.error);
