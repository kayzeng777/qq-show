import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const categoriesFile = join(__dirname, '../src/data/categories.ts');

// 新添加的前头发列表
const newFrontHairItems = [
  "动漫粉长发",
  "动漫金棕短发", 
  "栗子斜扎中长发",
  "棕绿斜刘海扎发",
  "棕色中分卷长发",
  "棕色公主中长发",
  "棕色刘海中长卷发",
  "棕色刘海斜扎卷发",
  "棕色斜扎直发",
  "浅棕卷双马尾刘海",
  "浅棕斜扎丸子头",
  "深棕闪耀中长卷发",
  "深紫红色丸子斜扎头",
  "炫紫闪耀双马尾卷发",
  "炫紫飘逸长发",
  "玫瑰盘发",
  "粉紫头饰卷双马尾",
  "紫色贝雷棕长发",
  "红棕刘海丸子短扎发",
  "红棕发饰斜马尾",
  "金棕公主中长发",
  "金棕发饰双丸子头",
  "金棕斜刘海发饰直发",
  "金棕毽子斜扎发",
  "金棕波浪长发",
  "黑色双丸子头"
];

async function main() {
  console.log('🔧 开始添加新前头发到发型分类...');
  
  let content = fs.readFileSync(categoriesFile, 'utf8');
  
  // 找到发型分类的items数组结束位置
  const hairCategoryStart = content.indexOf('"id": "hair"');
  if (hairCategoryStart === -1) {
    console.log('❌ 未找到发型分类');
    return;
  }
  
  // 找到items数组的开始
  const itemsStart = content.indexOf('"items": [', hairCategoryStart);
  if (itemsStart === -1) {
    console.log('❌ 未找到items数组');
    return;
  }
  
  // 找到items数组的结束位置（最后一个item的结束）
  let itemsEnd = itemsStart + 9; // 跳过 "items": [
  let braceCount = 0;
  let inItems = false;
  
  for (let i = itemsStart + 9; i < content.length; i++) {
    if (content[i] === '[') {
      braceCount++;
      inItems = true;
    } else if (content[i] === ']') {
      braceCount--;
      if (braceCount === 0 && inItems) {
        itemsEnd = i;
        break;
      }
    }
  }
  
  // 生成新前头发的items
  let newItems = '';
  for (const itemName of newFrontHairItems) {
    const itemId = `hair_${itemName}`;
    const frontHairId = `front-hair_${itemName}`;
    
    newItems += `      {
        "id": "${itemId}",
        "name": "${itemName}",
        "thumbnail": "/assets/front-hair/${itemName}.gif",
        "image": "/assets/front-hair/${itemName}.gif",
        "category": "hair",
        "layer": 4,
        "frontHair": {
          "id": "${frontHairId}",
          "name": "${itemName}",
          "thumbnail": "/assets/front-hair/${itemName}.gif",
          "image": "/assets/front-hair/${itemName}.gif",
          "category": "front-hair",
          "layer": 2
        },
        "backHair": null
      },
`;
  }
  
  // 在items数组结束前插入新items
  const beforeItems = content.substring(0, itemsEnd);
  const afterItems = content.substring(itemsEnd);
  
  // 移除最后一个item的逗号（如果有的话）
  const lastCommaIndex = beforeItems.lastIndexOf(',');
  if (lastCommaIndex > beforeItems.lastIndexOf('}')) {
    const beforeLastComma = beforeItems.substring(0, lastCommaIndex);
    const afterLastComma = beforeItems.substring(lastCommaIndex + 1);
    content = beforeLastComma + afterLastComma + newItems + afterItems;
  } else {
    content = beforeItems + newItems + afterItems;
  }
  
  // 写回文件
  fs.writeFileSync(categoriesFile, content);
  
  console.log(`✅ 成功添加了 ${newFrontHairItems.length} 个新前头发到发型分类`);
  console.log('📝 新前头发已添加到categories.ts');
}

main().catch(console.error);
