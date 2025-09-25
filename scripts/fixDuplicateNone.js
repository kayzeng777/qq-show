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

console.log('🔧 开始修复重复的"无"选项...');

// 移除所有"无"选项的item
let updatedCategoriesContent = categoriesContent;

// 使用正则表达式移除"无"选项的完整item对象
updatedCategoriesContent = updatedCategoriesContent.replace(
  /\{\s*"id": "[^"]*_无",\s*"name": "无",\s*"thumbnail": "[^"]*",\s*"image": "[^"]*",\s*"category": "[^"]*",\s*"layer": \d+\s*\},?\s*/g,
  ''
);

// 清理可能的多余逗号
updatedCategoriesContent = updatedCategoriesContent.replace(
  /,\s*,\s*/g,
  ','
);

// 清理开头或结尾的多余逗号
updatedCategoriesContent = updatedCategoriesContent.replace(
  /"items": \[\s*,/g,
  '"items": ['
);

updatedCategoriesContent = updatedCategoriesContent.replace(
  /,\s*\]/g,
  '\n    ]'
);

// 写入更新后的文件
fs.writeFileSync(categoriesPath, updatedCategoriesContent);

console.log('✅ 移除完成！');
console.log('📝 更新内容：');
console.log('   - 从categories.ts中移除了所有"无"选项的item');
console.log('   - "无"选项现在由ItemSelector.tsx中的硬编码逻辑处理');

// 验证修复结果
const noneCount = (updatedCategoriesContent.match(/"name": "无"/g) || []).length;
console.log(`\n🔍 验证结果：`);
console.log(`   - 剩余的"无"选项数量: ${noneCount}`);
