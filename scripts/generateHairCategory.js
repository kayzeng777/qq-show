#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 获取项目根目录
const projectRoot = path.resolve(__dirname, '..');

// 读取categories.ts文件
const categoriesPath = path.join(projectRoot, 'src/data/categories.ts');
const categoriesContent = fs.readFileSync(categoriesPath, 'utf8');

console.log('💇 开始生成发型分类...');

// 解析categories.ts文件，提取前头发和后头发分类
const categoriesMatch = categoriesContent.match(/export const categories = (\[[\s\S]*?\]) as const;/);
if (!categoriesMatch) {
  console.error('❌ 无法解析categories.ts文件');
  process.exit(1);
}

const categories = JSON.parse(categoriesMatch[1]);

// 找到前头发和后头发分类
const frontHairCategory = categories.find(cat => cat.id === 'front-hair');
const backHairCategory = categories.find(cat => cat.id === 'back-hair');

if (!frontHairCategory || !backHairCategory) {
  console.error('❌ 找不到前头发或后头发分类');
  process.exit(1);
}

console.log(`📋 找到前头发分类: ${frontHairCategory.items.length} 个物品`);
console.log(`📋 找到后头发分类: ${backHairCategory.items.length} 个物品`);

// 生成发型分类
const hairItems = [];

// 为每个前头发创建发型item
frontHairCategory.items.forEach(frontItem => {
  // 跳过"无"选项
  if (frontItem.name === '无') return;
  
  // 查找对应的后头发
  const backItem = backHairCategory.items.find(back => back.name === frontItem.name);
  
  if (backItem) {
    // 有对应的后头发，创建组合发型
    const hairItem = {
      id: `hair_${frontItem.name}`,
      name: frontItem.name,
      thumbnail: frontItem.thumbnail, // 使用前头发作为缩略图
      image: frontItem.thumbnail,     // 使用前头发作为主图
      category: 'hair',
      layer: 4, // 发型层级
      frontHair: frontItem,  // 前头发
      backHair: backItem     // 后头发
    };
    hairItems.push(hairItem);
  } else {
    // 没有对应的后头发，只有前头发
    const hairItem = {
      id: `hair_${frontItem.name}`,
      name: frontItem.name,
      thumbnail: frontItem.thumbnail,
      image: frontItem.thumbnail,
      category: 'hair',
      layer: 4,
      frontHair: frontItem,  // 只有前头发
      backHair: null         // 没有后头发
    };
    hairItems.push(hairItem);
  }
});

// 创建发型分类
const hairCategory = {
  id: 'hair',
  name: '发型',
  thumbnail: hairItems[0]?.thumbnail || '',
  layer: 4,
  items: hairItems
};

console.log(`✅ 生成了 ${hairItems.length} 个发型物品`);

// 将发型分类插入到categories数组中
// 找到前头发分类的位置，在其前面插入发型分类
const frontHairIndex = categories.findIndex(cat => cat.id === 'front-hair');
categories.splice(frontHairIndex, 0, hairCategory);

// 生成新的categories.ts内容
const newCategoriesContent = `// 自动生成的全量分类数据
export const categories = ${JSON.stringify(categories, null, 2)} as const;
`;

// 写入文件
fs.writeFileSync(categoriesPath, newCategoriesContent);

console.log('✅ 发型分类已添加到categories.ts');
console.log('📝 发型分类特点：');
console.log('   - 每个发型item包含frontHair和backHair属性');
console.log('   - 如果只有前头发，backHair为null');
console.log('   - 使用前头发作为缩略图和主图');
console.log('   - 层级为4，在前后头发之间');
