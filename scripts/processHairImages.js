#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 头发翻译映射
const hairTranslations = {
  // 后头发
  '亚麻紫中长发': { zh: '亚麻紫中长发', en: 'Lavender Medium Hair' },
  '亚麻绿中短发': { zh: '亚麻绿中短发', en: 'Mint Medium Short Hair' },
  '亚麻绿中长发': { zh: '亚麻绿中长发', en: 'Mint Medium Hair' },
  '动漫金棕长尾发': { zh: '动漫金棕长尾发', en: 'Anime Golden Brown Hair' },
  '头箍白金短发': { zh: '头箍白金短发', en: 'Platinum Short Hair' },
  '摇滚棕红中长发': { zh: '摇滚棕红中长发', en: 'Rock Brown Red Medium Hair' },
  '栗色中短发': { zh: '栗色中短发', en: 'Chestnut Medium Short Hair' },
  '棕红星星高马尾': { zh: '棕红星星高马尾', en: 'Brown Red High Ponytail' },
  '棕黄丸子卷发': { zh: '棕黄丸子卷发', en: 'Brown Yellow Bun Curls' },
  '棕黄栗子头': { zh: '棕黄栗子头', en: 'Brown Yellow Chestnut Hair' },
  '棕黄齐刘海': { zh: '棕黄齐刘海', en: 'Brown Yellow Bangs' },
  '浅棕中分长发': { zh: '浅棕中分长发', en: 'Light Brown Long Hair' },
  '浅棕绑带长发': { zh: '浅棕绑带长发', en: 'Light Brown Tied Long Hair' },
  '深棕斜扎卷马尾': { zh: '深棕斜扎卷马尾', en: 'Dark Brown Side Ponytail' },
  '深棕短发': { zh: '深棕短发', en: 'Dark Brown Short Hair' },
  '深紫色斜马尾长发': { zh: '深紫色斜马尾长发', en: 'Deep Purple Side Ponytail' },
  '深褐长直发': { zh: '深褐长直发', en: 'Dark Brown Long Straight' },
  '白金中分卷长发': { zh: '白金中分卷长发', en: 'Platinum Long Curly Hair' },
  '白金卷短发': { zh: '白金卷短发', en: 'Platinum Curly Short Hair' },
  '白金厚刘海短发': { zh: '白金厚刘海短发', en: 'Platinum Thick Bangs' },
  '白金双马尾': { zh: '白金双马尾', en: 'Platinum Twin Tails' },
  '白金蝴蝶结波浪长发': { zh: '白金蝴蝶结波浪长发', en: 'Platinum Bow Wave Long Hair' },
  '粉紫长直发': { zh: '粉紫长直发', en: 'Pink Purple Long Straight' },
  '蝴蝶结棕色长卷发': { zh: '蝴蝶结棕色长卷发', en: 'Bow Brown Long Curls' },
  '金色长卷发': { zh: '金色长卷发', en: 'Golden Long Curls' },
  '金色长直发': { zh: '金色长直发', en: 'Golden Long Straight' },
  '金黄卷长发': { zh: '金黄卷长发', en: 'Golden Yellow Long Curls' },

  // 前头发
  '亚麻紫卷马尾': { zh: '亚麻紫卷马尾', en: 'Lavender Curly Ponytail' },
  '亚麻绿短发': { zh: '亚麻绿短发', en: 'Mint Short Hair' },
  '亚麻绿长发': { zh: '亚麻绿长发', en: 'Mint Long Hair' },
  '墨镜电力紫短发': { zh: '墨镜电力紫短发', en: 'Electric Purple Short Hair' },
  '头巾棕橙色斜马尾': { zh: '头巾棕橙色斜马尾', en: 'Orange Brown Side Ponytail' },
  '头花金色扎发': { zh: '头花金色扎发', en: 'Golden Flower Hair' },
  '帽子棕红编发马尾': { zh: '帽子棕红编发马尾', en: 'Brown Red Braided Ponytail' },
  '摇滚蓝紫短发': { zh: '摇滚蓝紫短发', en: 'Rock Blue Purple Short Hair' },
  '栗子棕短发': { zh: '栗子棕短发', en: 'Chestnut Brown Short Hair' },
  '棕橙长编发': { zh: '棕橙长编发', en: 'Orange Brown Long Braids' },
  '棕色斜扎卷马尾': { zh: '棕色斜扎卷马尾', en: 'Brown Side Curly Ponytail' },
  '棕色斜扎发': { zh: '棕色斜扎发', en: 'Brown Side Hair' },
  '棕色星星斜扎发': { zh: '棕色星星斜扎发', en: 'Brown Star Side Hair' },
  '棕色栗子头': { zh: '棕色栗子头', en: 'Brown Chestnut Hair' },
  '棕褐扎发': { zh: '棕褐扎发', en: 'Brown Hair Tie' },
  '棕黄斜扎马尾': { zh: '棕黄斜扎马尾', en: 'Brown Yellow Side Ponytail' },
  '泡泡深棕双卷扎发': { zh: '泡泡深棕双卷扎发', en: 'Bubble Dark Brown Double Curls' },
  '活力红棕斜扎卷发': { zh: '活力红棕斜扎卷发', en: 'Energetic Red Brown Side Curls' },
  '活力金棕短发': { zh: '活力金棕短发', en: 'Energetic Golden Brown Short Hair' },
  '深蓝帽棕短发': { zh: '深蓝帽棕短发', en: 'Dark Blue Cap Brown Short Hair' },
  '电力橙双马尾': { zh: '电力橙双马尾', en: 'Electric Orange Twin Tails' },
  '白金短发': { zh: '白金短发', en: 'Platinum Short Hair' },
  '粉橙卷发': { zh: '粉橙卷发', en: 'Pink Orange Curls' },
  '粉紫双马尾': { zh: '粉紫双马尾', en: 'Pink Purple Twin Tails' },
  '粉紫斜扎高马尾': { zh: '粉紫斜扎高马尾', en: 'Pink Purple High Side Ponytail' },
  '粉色高马尾': { zh: '粉色高马尾', en: 'Pink High Ponytail' },
  '红棕丸子头': { zh: '红棕丸子头', en: 'Red Brown Bun' },
  '红棕卷双马尾': { zh: '红棕卷双马尾', en: 'Red Brown Curly Twin Tails' },
  '红棕斜扎长发': { zh: '红棕斜扎长发', en: 'Red Brown Side Long Hair' },
  '红色公主卷发': { zh: '红色公主卷发', en: 'Red Princess Curls' },
  '连帽金色卷长发': { zh: '连帽金色卷长发', en: 'Hooded Golden Long Curls' },
  '酒棕色丸子头': { zh: '酒棕色丸子头', en: 'Wine Brown Bun' },
  '酒红双马尾': { zh: '酒红双马尾', en: 'Wine Red Twin Tails' },
  '金黄斜扎卷长发': { zh: '金黄斜扎卷长发', en: 'Golden Yellow Side Long Curls' },
  '银灰短发': { zh: '银灰短发', en: 'Silver Gray Short Hair' }
};

// 获取中文名称
function getChineseName(filename) {
  return filename.replace(/\.(gif|png|jpg|jpeg)$/i, '');
}

// 获取英文翻译
function getEnglishTranslation(chineseName) {
  return hairTranslations[chineseName]?.en || chineseName;
}

// 处理头发目录
function processHairDirectory(dirPath, categoryName, layer) {
  const files = fs.readdirSync(dirPath);
  const items = [];

  files.forEach((file, index) => {
    if (file === 'default.gif' || file === 'default.png') {
      return; // 跳过默认文件
    }

    const filePath = path.join(dirPath, file);
    const stat = fs.statSync(filePath);

    if (stat.isFile() && /\.(gif|png|jpg|jpeg)$/i.test(file)) {
      const chineseName = getChineseName(file);
      const englishName = getEnglishTranslation(chineseName);

      const item = {
        id: `${categoryName}_${String(index + 1).padStart(3, '0')}`,
        name: chineseName,
        thumbnail: `/assets/${categoryName}/${file}`,
        image: `/assets/${categoryName}/${file}`,
        category: categoryName,
        layer: layer,
      };

      items.push(item);
    }
  });

  return items;
}

// 主函数
function main() {
  console.log('💇 开始处理头发图片...');
  
  const assetsDir = path.join(__dirname, '..', 'assets');
  const hairCategories = [];

  // 处理后头发
  const backHairDir = path.join(assetsDir, 'back-hair');
  if (fs.existsSync(backHairDir)) {
    console.log('📁 处理后头发...');
    const backHairItems = processHairDirectory(backHairDir, 'back-hair', 1);
    
    if (backHairItems.length > 0) {
      const backHairCategory = {
        id: "backHair",
        name: "后头发",
        thumbnail: backHairItems[0].thumbnail,
        layer: 1,
        items: backHairItems
      };
      
      hairCategories.push(backHairCategory);
      console.log(`  ✅ 找到 ${backHairItems.length} 个后头发物品`);
    }
  }

  // 处理前头发
  const frontHairDir = path.join(assetsDir, 'front-hair');
  if (fs.existsSync(frontHairDir)) {
    console.log('📁 处理前头发...');
    const frontHairItems = processHairDirectory(frontHairDir, 'front-hair', 2);
    
    if (frontHairItems.length > 0) {
      const frontHairCategory = {
        id: "frontHair",
        name: "前头发",
        thumbnail: frontHairItems[0].thumbnail,
        layer: 2,
        items: frontHairItems
      };
      
      hairCategories.push(frontHairCategory);
      console.log(`  ✅ 找到 ${frontHairItems.length} 个前头发物品`);
    }
  }

  // 生成头发分类数据文件
  const hairCategoriesFile = path.join(__dirname, '..', 'src', 'data', 'hair-categories.ts');
  const hairCategoriesContent = `// 自动生成的头发分类数据
export const hairCategories = ${JSON.stringify(hairCategories, null, 2)} as const;
`;

  fs.writeFileSync(hairCategoriesFile, hairCategoriesContent);
  console.log(`✅ 头发分类数据已保存到: ${hairCategoriesFile}`);

  // 生成头发翻译数据
  const hairTranslationsData = {};
  hairCategories.forEach(category => {
    category.items.forEach(item => {
      hairTranslationsData[item.name] = {
        zh: item.name,
        en: getEnglishTranslation(item.name)
      };
    });
  });

  const hairTranslationsFile = path.join(__dirname, '..', 'src', 'utils', 'hair-translations.ts');
  const hairTranslationsContent = `// 自动生成的头发翻译数据
import type { Language } from "../contexts/LanguageContext";

export const hairItemTranslations: Record<string, Record<Language, string>> = ${JSON.stringify(hairTranslationsData, null, 2)};

export const translateHairName = (name: string, language: Language): string => {
  return hairItemTranslations[name]?.[language] || name;
};
`;

  fs.writeFileSync(hairTranslationsFile, hairTranslationsContent);
  console.log(`✅ 头发翻译数据已保存到: ${hairTranslationsFile}`);

  // 生成摘要
  console.log('\n📊 头发处理摘要:');
  hairCategories.forEach(category => {
    console.log(`${category.name} (${category.id}): ${category.items.length} 个物品`);
  });

  console.log(`\n总计: ${hairCategories.length} 个头发分类, ${hairCategories.reduce((sum, cat) => sum + cat.items.length, 0)} 个头发物品`);
}

// 运行脚本
main();
