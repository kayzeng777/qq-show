#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 读取现有的翻译文件
const existingTranslationsFile = path.join(__dirname, '..', 'src', 'utils', 'translations.ts');
const newTranslationsFile = path.join(__dirname, '..', 'src', 'utils', 'updated-translations.ts');

// 读取现有翻译
const existingContent = fs.readFileSync(existingTranslationsFile, 'utf8');

// 提取现有的翻译对象
const existingTranslationsMatch = existingContent.match(/export const itemNameTranslations: Record<string, Record<Language, string>> = ({[\s\S]*?});/);
if (!existingTranslationsMatch) {
  console.error('无法解析现有翻译文件');
  process.exit(1);
}

const existingTranslationsStr = existingTranslationsMatch[1];
const existingTranslations = eval(`(${existingTranslationsStr})`);

// 读取新翻译
const newContent = fs.readFileSync(newTranslationsFile, 'utf8');
const newTranslationsMatch = newContent.match(/export const itemNameTranslations: Record<string, Record<Language, string>> = ({[\s\S]*?});/);
if (!newTranslationsMatch) {
  console.error('无法解析新翻译文件');
  process.exit(1);
}

const newTranslationsStr = newTranslationsMatch[1];
const newTranslations = eval(`(${newTranslationsStr})`);

// 合并翻译
const mergedTranslations = { ...existingTranslations };

let addedCount = 0;
Object.entries(newTranslations).forEach(([key, value]) => {
  if (!mergedTranslations[key]) {
    mergedTranslations[key] = value;
    addedCount++;
    console.log(`添加新翻译: ${key} -> ${value.en}`);
  }
});

// 生成合并后的翻译文件内容
const mergedTranslationsStr = JSON.stringify(mergedTranslations, null, 2);

const mergedContent = `import type { Language } from "../contexts/LanguageContext";

// Item name translations - 合并了所有图片的翻译
export const itemNameTranslations: Record<string, Record<Language, string>> = ${mergedTranslationsStr};

export const translateItemName = (name: string, language: Language): string => {
  return itemNameTranslations[name]?.[language] || name;
};
`;

// 保存合并后的翻译文件
fs.writeFileSync(existingTranslationsFile, mergedContent);

console.log(`\n✅ 翻译合并完成!`);
console.log(`现有翻译: ${Object.keys(existingTranslations).length} 个`);
console.log(`新增翻译: ${addedCount} 个`);
console.log(`总计翻译: ${Object.keys(mergedTranslations).length} 个`);
console.log(`已更新文件: ${existingTranslationsFile}`);
