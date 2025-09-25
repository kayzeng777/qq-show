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

// 读取translations.ts文件
const translationsPath = path.join(projectRoot, 'src/utils/translations.ts');
const translationsContent = fs.readFileSync(translationsPath, 'utf8');

console.log('🔧 开始修复default名称和排序...');

// 1. 修复categories.ts中的default名称和排序
let updatedCategoriesContent = categoriesContent;

// 修复所有default项目的名称
updatedCategoriesContent = updatedCategoriesContent.replace(
  /"name": "default"/g,
  '"name": "无"'
);

// 修复所有default项目的id
updatedCategoriesContent = updatedCategoriesContent.replace(
  /"id": "([^"]+)_default"/g,
  '"id": "$1_无"'
);

// 2. 按首字母排序items - 使用更精确的正则表达式
updatedCategoriesContent = updatedCategoriesContent.replace(
  /"items": \[([\s\S]*?)\]/g,
  (match, itemsContent) => {
    // 提取所有完整的item对象
    const itemMatches = itemsContent.match(/\{[^{}]*"id":\s*"[^"]+",[\s\S]*?"layer":\s*\d+\s*\}/g);
    
    if (!itemMatches) return match;
    
    // 解析每个item并提取name用于排序
    const items = itemMatches.map(itemStr => {
      const nameMatch = itemStr.match(/"name":\s*"([^"]+)"/);
      const name = nameMatch ? nameMatch[1] : '';
      return { name, content: itemStr };
    });
    
    // 按name的首字母排序（中文按拼音，英文按字母）
    items.sort((a, b) => {
      const nameA = a.name;
      const nameB = b.name;
      
      // 特殊处理：将"无"放在最前面
      if (nameA === '无') return -1;
      if (nameB === '无') return 1;
      
      // 其他按首字母排序
      return nameA.localeCompare(nameB, 'zh-CN');
    });
    
    // 重新构建items数组，确保正确的JSON格式
    const sortedItems = items.map(item => item.content).join(',\n      ');
    return `"items": [\n      ${sortedItems}\n    ]`;
  }
);

// 3. 修复translations.ts中的default翻译
let updatedTranslationsContent = translationsContent;

// 修复default的翻译
updatedTranslationsContent = updatedTranslationsContent.replace(
  /"default": \{\s*"zh": "default",\s*"en": "default"\s*\}/g,
  '"default": {\n    "zh": "无",\n    "en": "None"\n  }'
);

// 同时添加"无"的翻译（如果还没有的话）
if (!updatedTranslationsContent.includes('"无": {')) {
  // 在translations对象中添加"无"的翻译
  updatedTranslationsContent = updatedTranslationsContent.replace(
    /export const itemNameTranslations: Record<string, Record<Language, string>> = \{/,
    `export const itemNameTranslations: Record<string, Record<Language, string>> = {
  "无": {
    "zh": "无",
    "en": "None"
  },`
  );
}

// 写入更新后的文件
fs.writeFileSync(categoriesPath, updatedCategoriesContent);
fs.writeFileSync(translationsPath, updatedTranslationsContent);

console.log('✅ 修复完成！');
console.log('📝 更新内容：');
console.log('   - 所有default项目名称改为"无"');
console.log('   - 所有default项目英文翻译改为"None"');
console.log('   - 所有分类中的items按首字母顺序排序');
console.log('   - "无"选项排在每个分类的最前面');

// 统计信息
const defaultCount = (updatedCategoriesContent.match(/"name": "无"/g) || []).length;
console.log(`📊 共修复了 ${defaultCount} 个default项目`);