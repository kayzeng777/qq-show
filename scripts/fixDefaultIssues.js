#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 获取项目根目录
const projectRoot = path.resolve(__dirname, '..');

// 读取translations.ts文件
const translationsPath = path.join(projectRoot, 'src/utils/translations.ts');
const translationsContent = fs.readFileSync(translationsPath, 'utf8');

console.log('🔧 开始修复default相关问题...');

// 1. 从translations.ts中移除default的翻译条目
let updatedTranslationsContent = translationsContent;

// 移除default的翻译条目
updatedTranslationsContent = updatedTranslationsContent.replace(
  /"default": \{\s*"zh": "无",\s*"en": "None"\s*\},?\s*/g,
  ''
);

// 清理可能的多余逗号
updatedTranslationsContent = updatedTranslationsContent.replace(
  /,\s*,\s*/g,
  ','
);

// 清理开头或结尾的多余逗号
updatedTranslationsContent = updatedTranslationsContent.replace(
  /export const itemNameTranslations: Record<string, Record<Language, string>> = \{\s*,/,
  'export const itemNameTranslations: Record<string, Record<Language, string>> = {'
);

updatedTranslationsContent = updatedTranslationsContent.replace(
  /,\s*};$/,
  '\n};'
);

// 写入更新后的文件
fs.writeFileSync(translationsPath, updatedTranslationsContent);

console.log('✅ 修复完成！');
console.log('📝 更新内容：');
console.log('   - 从translations.ts中移除了default的翻译条目');
console.log('   - 保留了"无"的翻译条目');
console.log('   - 现在"无"选项直接使用default.png文件，不再有独立的default选项');

// 验证修复结果
const hasDefault = updatedTranslationsContent.includes('"default":');
const hasWu = updatedTranslationsContent.includes('"无":');

console.log('\n🔍 验证结果：');
console.log(`   - 是否还有default翻译: ${hasDefault ? '❌ 是' : '✅ 否'}`);
console.log(`   - 是否有"无"翻译: ${hasWu ? '✅ 是' : '❌ 否'}`);
