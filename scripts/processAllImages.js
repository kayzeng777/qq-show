#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 分类配置
const categoryConfig = {
  'backgrounds': { name: '背景', layer: 0, id: 'background' },
  'background-decor': { name: '背景装饰', layer: 0.5, id: 'backgroundDecor' },
  'vehicle': { name: '车', layer: 0.8, id: 'vehicle' },
  'wings': { name: '翅膀', layer: 1.2, id: 'wings' },
  'back-hair': { name: '后头发', layer: 1, id: 'backHair' },
  'bottom': { name: '下装', layer: 1.5, id: 'bottom' },
  'top': { name: '上装', layer: 1.6, id: 'top' },
  'outfit': { name: '套装', layer: 1.7, id: 'outfit' },
  'full-face': { name: '妆容', layer: 1.8, id: 'fullFace' },
  'full-head': { name: '妆发造型', layer: 1.9, id: 'fullHead' },
  'front-hair': { name: '前头发', layer: 2, id: 'frontHair' },
  'face-decor': { name: '脸饰', layer: 2.1, id: 'faceDecor' },
  'earrings': { name: '耳饰', layer: 2.2, id: 'earrings' },
  'glasses': { name: '眼镜墨镜', layer: 2.3, id: 'glasses' },
  'necklace': { name: '颈饰', layer: 2.4, id: 'necklace' },
  'headwear': { name: '头饰', layer: 2.5, id: 'headwear' },
  'other-accessories': { name: '其他配饰', layer: 2.6, id: 'otherAccessories' },
  'companion': { name: '陪伴', layer: 2.7, id: 'companion' },
  'frame': { name: '边框', layer: 2.8, id: 'frame' },
  'text': { name: '装饰字', layer: 2.9, id: 'textDecor' },
  'sparkle': { name: '特效', layer: 3, id: 'sparkle' }
};

// 翻译映射
const translations = {
  // 背景
  '冰独角兽': { zh: '冰独角兽', en: 'Winter Unicorn' },
  '冰雪冷月': { zh: '冰雪冷月', en: 'Icy Moon' },
  '彩虹粉泡': { zh: '彩虹粉泡', en: 'Rainbow Pink Bubbles' },
  '彩虹小岛': { zh: '彩虹小岛', en: 'Rainbow Island' },
  '仓鼠之家': { zh: '仓鼠之家', en: 'Hamster Land' },
  'QQ之星': { zh: 'QQ之星', en: 'QQ Star' },
  '云上余音': { zh: '云上余音', en: 'Cloud Echo' },
  '云朵月台': { zh: '云朵月台', en: 'Cloud Platform' },
  '你的来信': { zh: '你的来信', en: 'Your Letter' },
  '公园春日': { zh: '公园春日', en: 'Spring Park' },
  '冬日暖阳': { zh: '冬日暖阳', en: 'Winter Sunshine' },
  '冷艳玫瑰': { zh: '冷艳玫瑰', en: 'Cold Rose' },
  '劲酷舞台': { zh: '劲酷舞台', en: 'Performance Stage' },
  '午后阶梯': { zh: '午后阶梯', en: 'Afternoon Stairs' },
  '南瓜灯车': { zh: '南瓜灯车', en: 'Pumpkin Car' },
  '唱片商店': { zh: '唱片商店', en: 'Record Store' },
  '圣莫尼卡': { zh: '圣莫尼卡', en: 'Santa Monica' },
  '圣诞冬日': { zh: '圣诞冬日', en: 'Christmas Winter' },
  '夜之石冢': { zh: '夜之石冢', en: 'Night Stone Tomb' },
  '夜金字塔': { zh: '夜金字塔', en: 'Night Pyramid' },
  '婚礼殿堂': { zh: '婚礼殿堂', en: 'Wedding Hall' },
  '宴会餐厅': { zh: '宴会餐厅', en: 'Banquet Restaurant' },
  '富士枫叶': { zh: '富士枫叶', en: 'Fuji Maple' },
  '巴黎街头': { zh: '巴黎街头', en: 'Paris Street' },
  '乡间别墅': { zh: '乡间别墅', en: 'Country Villa' },
  '乡间彩虹': { zh: '乡间彩虹', en: 'Country Rainbow' },
  '乡间春日': { zh: '乡间春日', en: 'Country Spring' },
  '我爱的你': { zh: '我爱的你', en: 'The One I Love' },
  '我的小屋': { zh: '我的小屋', en: 'My Cottage' },
  '新年快乐': { zh: '新年快乐', en: 'Happy New Year' },
  '星座云台': { zh: '星座云台', en: 'Constellation Cloud' },
  '星星点灯': { zh: '星星点灯', en: 'Star Light' },
  '晴空巴黎': { zh: '晴空巴黎', en: 'Sunny Paris' },
  '晴空樱花': { zh: '晴空樱花', en: 'Sunny Cherry Blossom' },
  '晴蓝冰川': { zh: '晴蓝冰川', en: 'Sunny Blue Glacier' },
  '暖阳之家': { zh: '暖阳之家', en: 'Warm Sun Home' },
  '林间阳光': { zh: '林间阳光', en: 'Forest Sunshine' },
  '枯树星河': { zh: '枯树星河', en: 'Dead Tree Galaxy' },
  '梦幻仙岛': { zh: '梦幻仙岛', en: 'Dream Fairy Island' },
  '樱花别墅': { zh: '樱花别墅', en: 'Cherry Blossom Villa' },
  '樱花喷泉': { zh: '樱花喷泉', en: 'Cherry Blossom Fountain' },
  '樱花阶梯': { zh: '樱花阶梯', en: 'Cherry Blossom Stairs' },
  '河边懒熊': { zh: '河边懒熊', en: 'Lazy Bear by River' },
  '流水车马': { zh: '流水车马', en: 'Flowing Carriage' },
  '浪漫玫瑰': { zh: '浪漫玫瑰', en: 'Romantic Rose' },
  '浪漫紫林': { zh: '浪漫紫林', en: 'Romantic Purple Forest' },
  '浪漫钢琴': { zh: '浪漫钢琴', en: 'Romantic Piano' },
  '海岸的浪': { zh: '海岸的浪', en: 'Coastal Waves' },
  '海底世界': { zh: '海底世界', en: 'Underwater World' },
  '海底泡泡': { zh: '海底泡泡', en: 'Underwater Bubbles' },
  '温馨的家': { zh: '温馨的家', en: 'Cozy Home' },
  '电光石火': { zh: '电光石火', en: 'Lightning' },
  '睡梦云朵': { zh: '睡梦云朵', en: 'Dream Clouds' },
  '睡梦兔紫': { zh: '睡梦兔紫', en: 'Dream Purple Rabbit' },
  '秋日落叶': { zh: '秋日落叶', en: 'Autumn Leaves' },
  '童话岛屿': { zh: '童话岛屿', en: 'Fairy Tale Island' },
  '竹间清风': { zh: '竹间清风', en: 'Bamboo Breeze' },
  '粉云城堡': { zh: '粉云城堡', en: 'Pink Cloud Castle' },
  '粉色兔子': { zh: '粉色兔子', en: 'Pink Rabbit' },
  '糖浆山谷': { zh: '糖浆山谷', en: 'Syrup Valley' },
  '紫晶城堡': { zh: '紫晶城堡', en: 'Amethyst Castle' },
  '紫晶阶梯': { zh: '紫晶阶梯', en: 'Amethyst Stairs' },
  '紫月城堡': { zh: '紫月城堡', en: 'Purple Moon Castle' },
  '紫罗兰台': { zh: '紫罗兰台', en: 'Violet Platform' },
  '紫薇城堡': { zh: '紫薇城堡', en: 'Crape Myrtle Castle' },
  '花之宫殿': { zh: '花之宫殿', en: 'Flower Palace' },
  '藤蔓与兔': { zh: '藤蔓与兔', en: 'Vines and Rabbit' },
  '蘑菇世界': { zh: '蘑菇世界', en: 'Mushroom World' },
  '软糯雪糕': { zh: '软糯雪糕', en: 'Soft Ice Cream' },
  '金色城堡': { zh: '金色城堡', en: 'Golden Castle' },
  '闪耀心星': { zh: '闪耀心星', en: 'Shining Heart Star' },
  '雏菊花开': { zh: '雏菊花开', en: 'Daisy Bloom' },
  '静谧乡间': { zh: '静谧乡间', en: 'Quiet Countryside' },
  '街角咖啡': { zh: '街角咖啡', en: 'Corner Cafe' }
};

// 获取中文名称
function getChineseName(filename) {
  return filename.replace(/\.(gif|png|jpg|jpeg)$/i, '');
}

// 获取英文翻译
function getEnglishTranslation(chineseName) {
  return translations[chineseName]?.en || chineseName;
}

// 处理目录
function processDirectory(dirPath, categoryName) {
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
      const config = categoryConfig[categoryName];

      const item = {
        id: `${config.id}_${String(index + 1).padStart(3, '0')}`,
        name: chineseName,
        thumbnail: `/assets/${categoryName}/${file}`,
        image: `/assets/${categoryName}/${file}`,
        category: config.id,
        layer: config.layer,
      };

      items.push(item);
    }
  });

  return items;
}

// 主函数
function main() {
  console.log('🚀 开始处理所有图片...');
  
  const assetsDir = path.join(__dirname, '..', 'assets');
  const categories = [];

  // 处理每个分类目录
  Object.entries(categoryConfig).forEach(([dirName, config]) => {
    const categoryDir = path.join(assetsDir, dirName);
    
    if (fs.existsSync(categoryDir)) {
      console.log(`📁 处理分类: ${dirName} -> ${config.name}`);
      const items = processDirectory(categoryDir, dirName);
      
      if (items.length > 0) {
        const category = {
          id: config.id,
          name: config.name,
          thumbnail: items[0].thumbnail,
          layer: config.layer,
          items: items
        };
        
        categories.push(category);
        console.log(`  ✅ 找到 ${items.length} 个物品`);
      }
    } else {
      console.log(`⚠️  目录不存在: ${categoryDir}`);
    }
  });

  // 按层级排序
  categories.sort((a, b) => a.layer - b.layer);

  // 生成分类数据文件
  const categoriesFile = path.join(__dirname, '..', 'src', 'data', 'updated-categories.ts');
  const categoriesContent = `// 自动生成的全量分类数据
export const categories = ${JSON.stringify(categories, null, 2)} as const;
`;

  fs.writeFileSync(categoriesFile, categoriesContent);
  console.log(`✅ 分类数据已保存到: ${categoriesFile}`);

  // 生成翻译数据
  const allTranslations = {};
  categories.forEach(category => {
    category.items.forEach(item => {
      allTranslations[item.name] = {
        zh: item.name,
        en: getEnglishTranslation(item.name)
      };
    });
  });

  const translationsFile = path.join(__dirname, '..', 'src', 'utils', 'updated-translations.ts');
  const translationsContent = `// 自动生成的翻译数据
import type { Language } from "../contexts/LanguageContext";

export const itemNameTranslations: Record<string, Record<Language, string>> = ${JSON.stringify(allTranslations, null, 2)};

export const translateItemName = (name: string, language: Language): string => {
  return itemNameTranslations[name]?.[language] || name;
};
`;

  fs.writeFileSync(translationsFile, translationsContent);
  console.log(`✅ 翻译数据已保存到: ${translationsFile}`);

  // 生成摘要
  console.log('\n📊 处理摘要:');
  categories.forEach(category => {
    console.log(`${category.name} (${category.id}): ${category.items.length} 个物品`);
  });

  console.log(`\n总计: ${categories.length} 个分类, ${categories.reduce((sum, cat) => sum + cat.items.length, 0)} 个物品`);
}

// 运行脚本
main();
