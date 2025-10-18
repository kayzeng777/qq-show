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
  console.log('🔍 检查所有分类物品的排序...');
  
  let content = fs.readFileSync(categoriesFile, 'utf8');
  
  // 使用正则表达式找到所有分类
  const categoryRegex = /"id": "([^"]+)",[\s\S]*?"name": "([^"]+)",[\s\S]*?"items": \[([\s\S]*?)\]/g;
  let match;
  let totalIssues = 0;
  
  while ((match = categoryRegex.exec(content)) !== null) {
    const categoryId = match[1];
    const categoryName = match[2];
    const itemsSection = match[3];
    
    // 提取所有物品名称
    const nameRegex = /"name": "([^"]+)"/g;
    const names = [];
    let nameMatch;
    
    while ((nameMatch = nameRegex.exec(itemsSection)) !== null) {
      names.push(nameMatch[1]);
    }
    
    if (names.length > 0) {
      // 检查排序
      const sortedNames = [...names].sort(chineseSort);
      const isSorted = JSON.stringify(names) === JSON.stringify(sortedNames);
      
      if (!isSorted) {
        console.log(`❌ ${categoryName} (${categoryId}) 排序不正确`);
        console.log(`   当前顺序: ${names.slice(0, 5).join(', ')}${names.length > 5 ? '...' : ''}`);
        console.log(`   正确顺序: ${sortedNames.slice(0, 5).join(', ')}${sortedNames.length > 5 ? '...' : ''}`);
        totalIssues++;
      } else {
        console.log(`✅ ${categoryName} (${categoryId}) 排序正确 (${names.length} 个物品)`);
      }
    }
  }
  
  if (totalIssues === 0) {
    console.log('🎉 所有分类物品都已按字母顺序排列！');
  } else {
    console.log(`⚠️  发现 ${totalIssues} 个分类需要重新排序`);
  }
}

main().catch(console.error);
