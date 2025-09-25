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

console.log('🔧 开始移除前头发和后头发分类...');

// 解析categories.ts文件
const categoriesMatch = categoriesContent.match(/export const categories = (\[[\s\S]*?\]) as const;/);
if (!categoriesMatch) {
  console.error('❌ 无法解析categories.ts文件');
  process.exit(1);
}

const categories = JSON.parse(categoriesMatch[1]);

// 移除前头发和后头发分类
const filteredCategories = categories.filter(cat => 
  cat.id !== 'front-hair' && cat.id !== 'back-hair'
);

console.log(`📋 原始分类数量: ${categories.length}`);
console.log(`📋 过滤后分类数量: ${filteredCategories.length}`);

// 生成新的categories.ts内容
const newCategoriesContent = `// 自动生成的全量分类数据
export const categories = ${JSON.stringify(filteredCategories, null, 2)} as const;
`;

// 写入文件
fs.writeFileSync(categoriesPath, newCategoriesContent);

console.log('✅ 前头发和后头发分类已移除！');
console.log('📝 现在只保留发型分类，用户选择发型时会自动组合前后头发');
