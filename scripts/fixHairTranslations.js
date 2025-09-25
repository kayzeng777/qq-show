#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 读取当前的翻译文件
const translationsFile = path.join(__dirname, '..', 'src', 'utils', 'translations.ts');
const hairTranslationsFile = path.join(__dirname, '..', 'src', 'utils', 'hair-translations.ts');
const categoriesFile = path.join(__dirname, '..', 'src', 'data', 'categories.ts');

// 1. 修复主翻译文件中的"黑总飞机短发"为"黑棕飞机短发"
console.log('🔧 修复主翻译文件中的"黑总飞机短发"...');
let content = fs.readFileSync(translationsFile, 'utf8');
content = content.replace(/黑总飞机短发/g, '黑棕飞机短发');
fs.writeFileSync(translationsFile, content);
console.log('✅ 主翻译文件已更新');

// 2. 修复分类文件中的"黑总飞机短发"为"黑棕飞机短发"
console.log('🔧 修复分类文件中的"黑总飞机短发"...');
let categoriesContent = fs.readFileSync(categoriesFile, 'utf8');
categoriesContent = categoriesContent.replace(/黑总飞机短发/g, '黑棕飞机短发');
fs.writeFileSync(categoriesFile, categoriesContent);
console.log('✅ 分类文件已更新');

// 3. 处理hair-translations文件中的未翻译项
console.log('🔧 处理hair-translations文件中的未翻译项...');
const hairContent = fs.readFileSync(hairTranslationsFile, 'utf8');

// 提取翻译对象
const hairTranslationsMatch = hairContent.match(/export const hairItemTranslations: Record<string, Record<Language, string>> = ({[\s\S]*?});/);
if (!hairTranslationsMatch) {
  console.error('无法解析hair-translations文件');
  process.exit(1);
}

const hairTranslationsStr = hairTranslationsMatch[1];
const hairTranslations = eval(`(${hairTranslationsStr})`);

// 头发翻译映射
const hairTranslationMap = {
  '亚麻绿中短发.': 'Mint Medium Short Hair',
  '白金蝴蝶结波浪长发.': 'Platinum Bow Wave Long Hair',
  '亚麻紫刺猬头': 'Lavender Spiky Hair',
  '亚麻红短发': 'Linen Red Short Hair',
  '冰蓝中短发': 'Ice Blue Medium Short Hair',
  '冰蓝栗子头': 'Ice Blue Chestnut Hair',
  '发型6': 'Hairstyle 6',
  '摇滚黑短发': 'Rock Black Short Hair',
  '棕色刺猬头': 'Brown Spiky Hair',
  '棕色短飞机头': 'Brown Short Mohawk',
  '棕色雅痞短发': 'Brown Hipster Short Hair',
  '棕色飞机头': 'Brown Mohawk',
  '深棕波浪卷长发': 'Dark Brown Wavy Long Hair',
  '火金飞机头': 'Fire Gold Mohawk',
  '火金鲻鱼头': 'Fire Gold Mullet',
  '白金发夹短发': 'Platinum Hair Clip Short Hair',
  '白金毽子头': 'Platinum Shuttlecock Hair',
  '红棕公主卷发': 'Red Brown Princess Curls',
  '运动深棕短发': 'Sports Dark Brown Short Hair',
  '运动粉紫短发': 'Sports Pink Purple Short Hair',
  '金色中短发': 'Golden Medium Short Hair',
  '金色波浪扎发': 'Golden Wave Hair',
  '黑总飞机短发': 'Black Brown Mohawk Short Hair' // 修复后的名字
};

// 更新头发翻译
let updatedCount = 0;
Object.entries(hairTranslations).forEach(([key, value]) => {
  if (value.en === key || hairTranslationMap[key]) { // 如果英文翻译还是中文，或者有新的翻译
    if (hairTranslationMap[key]) {
      hairTranslations[key] = {
        zh: key,
        en: hairTranslationMap[key]
      };
      updatedCount++;
      console.log(`更新头发翻译: ${key} -> ${hairTranslationMap[key]}`);
    }
  }
});

// 生成更新后的头发翻译文件内容
const updatedHairTranslationsStr = JSON.stringify(hairTranslations, null, 2);

const updatedHairContent = `// 自动生成的头发翻译数据 - 已补充所有缺失的英文翻译
import type { Language } from "../contexts/LanguageContext";

export const hairItemTranslations: Record<string, Record<Language, string>> = ${updatedHairTranslationsStr};

export const translateHairItemName = (name: string, language: Language): string => {
  return hairItemTranslations[name]?.[language] || name;
};
`;

// 保存更新后的头发翻译文件
fs.writeFileSync(hairTranslationsFile, updatedHairContent);

console.log(`\n✅ 头发翻译更新完成!`);
console.log(`更新了 ${updatedCount} 个头发翻译`);
console.log(`总计头发翻译: ${Object.keys(hairTranslations).length} 个`);
console.log(`已更新文件: ${hairTranslationsFile}`);

// 4. 检查是否还有其他文件需要更新
console.log('\n🔍 检查其他需要更新的文件...');
const filesToCheck = [
  'src/data/updated-categories.ts',
  'src/data/hair-categories.ts',
  'src/utils/updated-translations.ts'
];

filesToCheck.forEach(file => {
  const filePath = path.join(__dirname, '..', file);
  if (fs.existsSync(filePath)) {
    let fileContent = fs.readFileSync(filePath, 'utf8');
    if (fileContent.includes('黑总飞机短发')) {
      fileContent = fileContent.replace(/黑总飞机短发/g, '黑棕飞机短发');
      fs.writeFileSync(filePath, fileContent);
      console.log(`✅ 已更新文件: ${file}`);
    }
  }
});

console.log('\n🎉 所有修复完成!');
