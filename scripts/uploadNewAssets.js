import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const newAssetDir = join(__dirname, '../new asset');
const assetsDir = join(__dirname, '../assets');
const categoriesFile = join(__dirname, '../src/data/categories.ts');
const translationsFile = join(__dirname, '../src/utils/translations.ts');

// source: new asset 子文件夹, target: assets 子文件夹, categoryId: categories 分类 id
const CATEGORY_CONFIGS = [
  { source: 'backgrounds', target: 'backgrounds', categoryId: 'backgrounds' },
  { source: 'background-decor', target: 'background-decor', categoryId: 'background-decor' },
  { source: 'vehicle', target: 'vehicle', categoryId: 'vehicle' },
  { source: 'wings', target: 'wings', categoryId: 'wings' },
  { source: 'front-hair', target: 'front-hair', categoryId: 'hair', hairRole: 'front' },
  { source: 'back-hair', target: 'back-hair', categoryId: 'hair', hairRole: 'back' },
  { source: 'bottom', target: 'bottom', categoryId: 'bottom' },
  { source: 'top', target: 'top', categoryId: 'top' },
  { source: 'outfit', target: 'outfit', categoryId: 'outfit' },
  { source: 'makeup', target: 'makeup', categoryId: 'makeup' },
  { source: 'head-set', target: 'head-set', categoryId: 'head-set' },
  { source: 'face-decor', target: 'face-decor', categoryId: 'face-decor' },
  { source: 'earrings', target: 'earrings', categoryId: 'earrings' },
  { source: 'glasses', target: 'glasses', categoryId: 'glasses' },
  { source: 'neckwear', target: 'neckwear', categoryId: 'neckwear' },
  { source: 'headwear', target: 'headwear', categoryId: 'headwear' },
  { source: 'other-accessories', target: 'other-accessories', categoryId: 'other-accessories' },
  { source: 'companion', target: 'companion', categoryId: 'companion' },
  { source: 'frame', target: 'frame', categoryId: 'frame' },
  { source: 'text', target: 'text', categoryId: 'text' },
  { source: 'sparkle', target: 'sparkle', categoryId: 'sparkle' },
];

// 扩展的翻译映射
const translationMap = {
  // 背景
  "爱心云朵": "Love Cloud",
  "北极熊湖": "Polar Bear Lake",
  "冰独角兽": "Ice Unicorn",
  "冰封雪林": "Frozen Snow Forest",
  "冰雪冷月": "Ice Snow Cold Moon",
  "彩虹粉泡": "Rainbow Pink Bubble",
  "彩虹小岛": "Rainbow Island",
  "仓鼠之家": "Hamster Home",
  "唱片商店": "Record Store",
  "城市风景": "City View",
  "雏菊花开": "Daisy Bloom",
  "电光石火": "Lightning Stone Fire",
  "电影海报": "Movie Poster",
  "冬日暖阳": "Winter Warm Sun",
  "冬日小屋": "Winter Cabin",
  "粉色兔子": "Pink Rabbit",
  "粉色仙林": "Pink Fairy Forest",
  "粉心彩虹": "Pink Heart Rainbow",
  "粉云城堡": "Pink Cloud Castle",
  "富士枫叶": "Fuji Maple Leaves",
  "公园春日": "Park Spring Day",
  "海岸的浪": "Coastal Waves",
  "海边彩虹": "Seaside Rainbow",
  "海岛远山": "Island Distant Mountains",
  "海底泡泡": "Underwater Bubbles",
  "海底世界": "Underwater World",
  "河边懒熊": "Riverside Lazy Bear",
  "黑客帝国": "Matrix",
  "湖边花丛": "Lakeside Flowers",
  "花之宫殿": "Flower Palace",
  "婚礼殿堂": "Wedding Hall",
  "简约小屋": "Simple Cabin",
  "街角餐厅": "Corner Restaurant",
  "金色城堡": "Golden Castle",
  "劲酷舞台": "Cool Stage",
  "静谧乡间": "Quiet Countryside",
  "静谧紫夜": "Quiet Purple Night",
  "枯树星河": "Withered Tree Star River",
  "浪漫钢琴": "Romantic Piano",
  "浪漫玫瑰": "Romantic Rose",
  "浪漫紫林": "Romantic Purple Forest",
  "冷艳玫瑰": "Cold Rose",
  "林间阳光": "Forest Sunshine",
  "凛冬小屋": "Harsh Winter Cabin",
  "伦敦大桥": "London Bridge",
  "罗兰庄园": "Roland Manor",
  "罗马阶梯": "Roman Steps",
  "萝卜农场": "Radish Farm",
  "梦幻仙岛": "Dream Fairy Island",
  "摩天轮景": "Ferris Wheel View",
  "蘑菇家园": "Mushroom Home",
  "蘑菇世界": "Mushroom World",
  "末日寒冬": "Apocalypse Winter",
  "南瓜灯车": "Pumpkin Lantern Car",
  "你的来信": "Your Letter",
  "暖阳之家": "Warm Sun Home",
  "霹雳眩光": "Thunder Dazzle",
  "奇妙树屋": "Wonderful Tree House",
  "晴空巴黎": "Clear Sky Paris",
  "晴空樱花": "Clear Sky Cherry Blossom",
  "晴蓝冰川": "Clear Blue Glacier",
  "秋千小屋": "Swing Cabin",
  "秋日落叶": "Autumn Falling Leaves",
  "软糯雪糕": "Soft Snow Ice Cream",
  "瑞士草场": "Swiss Meadow",
  "山顶教堂": "Mountain Top Church",
  "闪耀心星": "Shining Heart Star",
  "深冬小院": "Deep Winter Courtyard",
  "深空冬日": "Deep Space Winter",
  "圣诞冬日": "Christmas Winter",
  "圣莫尼卡": "Santa Monica",
  "石板小镇": "Stone Slab Town",
  "石砖城堡": "Stone Brick Castle",
  "市政厅堂": "City Hall",
  "水晶之恋": "Crystal Love",
  "水母世界": "Jellyfish World",
  "太空站台": "Space Station",
  "泰坦尼克": "Titanic",
  "桃花源记": "Peach Blossom Spring",
  "天空之城": "Castle in the Sky",
  "天蓝海景": "Sky Blue Seascape",
  "田园风光": "Pastoral Scenery",
  "童话森林": "Fairy Tale Forest",
  "童话小屋": "Fairy Tale Cabin",
  "童话小镇": "Fairy Tale Town",
  "童话仙境": "Fairy Tale Wonderland",
  "童话雪景": "Fairy Tale Snow Scene",
  "童话云朵": "Fairy Tale Cloud",
  "童话之森": "Fairy Tale Forest",
  "童话之屋": "Fairy Tale House",
  "童话之园": "Fairy Tale Garden",
  "童话之镇": "Fairy Tale Town",
  "童话之景": "Fairy Tale Scene",
  "童话之梦": "Fairy Tale Dream",
  "童话之爱": "Fairy Tale Love",
  "童话之恋": "Fairy Tale Romance",
  "童话之缘": "Fairy Tale Fate",
  "童话之约": "Fairy Tale Promise",
  "童话之誓": "Fairy Tale Vow",
  "童话之愿": "Fairy Tale Wish",
  
  // 发型
  "无": "None",
  "金棕波浪蓝发夹长发": "Golden Brown Wavy Blue Hairpin Long Hair",
  "黑棕飞机短发": "Black Brown Bob Short Hair",
  "红棕栗子": "Red Brown Chestnut",
  "墨镜栗子头": "Sunglasses Chestnut Head",
  "牛仔很忙": "Cowboy Busy",
  "清新短发": "Fresh Short Hair",
  "时尚卷发": "Fashion Curly Hair",
  "甜美长发": "Sweet Long Hair",
  "优雅盘发": "Elegant Updo",
  
  // 妆容
  "自然妆容": "Natural Makeup",
  "甜美妆容": "Sweet Makeup",
  "时尚妆容": "Fashion Makeup",
  "优雅妆容": "Elegant Makeup",
  "清新妆容": "Fresh Makeup",
  
  // 妆发造型
  "白金编发": "Platinum Braided Hair",
  "粉红公主": "Pink Princess",
  "蓝色精灵": "Blue Fairy",
  "绿色森林": "Green Forest",
  "紫色梦幻": "Purple Dream",
  
  // 上装
  "白色衬衫": "White Shirt",
  "蓝色T恤": "Blue T-shirt",
  "红色外套": "Red Jacket",
  "黑色毛衣": "Black Sweater",
  "粉色卫衣": "Pink Hoodie",
  
  // 下装
  "蓝色牛仔裤": "Blue Jeans",
  "黑色短裙": "Black Skirt",
  "白色长裤": "White Pants",
  "红色短裤": "Red Shorts",
  "绿色长裙": "Green Long Skirt",
  
  // 套装
  "白色连衣裙": "White Dress",
  "黑色西装": "Black Suit",
  "粉色套装": "Pink Suit",
  "蓝色套装": "Blue Suit",
  "绿色套装": "Green Suit",
  
  // 脸饰
  "可爱贴纸": "Cute Sticker",
  "星星贴纸": "Star Sticker",
  "爱心贴纸": "Heart Sticker",
  "花朵贴纸": "Flower Sticker",
  "彩虹贴纸": "Rainbow Sticker",
  
  // 耳饰
  "珍珠耳环": "Pearl Earrings",
  "钻石耳环": "Diamond Earrings",
  "金色耳环": "Gold Earrings",
  "银色耳环": "Silver Earrings",
  "彩色耳环": "Colorful Earrings",
  
  // 眼镜墨镜
  "黑色墨镜": "Black Sunglasses",
  "蓝色墨镜": "Blue Sunglasses",
  "红色墨镜": "Red Sunglasses",
  "金色墨镜": "Gold Sunglasses",
  "银色墨镜": "Silver Sunglasses",
  
  // 颈饰
  "珍珠项链": "Pearl Necklace",
  "钻石项链": "Diamond Necklace",
  "金色项链": "Gold Necklace",
  "银色项链": "Silver Necklace",
  "彩色项链": "Colorful Necklace",
  
  // 头饰
  "粉色发带": "Pink Headband",
  "蓝色发带": "Blue Headband",
  "红色发带": "Red Headband",
  "金色发带": "Gold Headband",
  "银色发带": "Silver Headband",
  
  // 其他配饰
  "粉色包包": "Pink Bag",
  "蓝色包包": "Blue Bag",
  "红色包包": "Red Bag",
  "金色包包": "Gold Bag",
  "银色包包": "Silver Bag",
  
  // 陪伴
  "可爱小猫": "Cute Kitten",
  "忠诚小狗": "Loyal Puppy",
  "彩色小鸟": "Colorful Bird",
  "温柔兔子": "Gentle Rabbit",
  "活泼松鼠": "Lively Squirrel",
  
  // 边框
  "金色边框": "Gold Frame",
  "银色边框": "Silver Frame",
  "彩色边框": "Colorful Frame",
  "花朵边框": "Flower Frame",
  "星星边框": "Star Frame",
  
  // 文字装饰
  "生日快乐": "Happy Birthday",
  "新年快乐": "Happy New Year",
  "恭喜发财": "Congratulations",
  "万事如意": "All the Best",
  "心想事成": "Dreams Come True",
  
  // 特效
  "闪闪发光": "Sparkling",
  "彩虹光芒": "Rainbow Light",
  "星星闪烁": "Star Twinkle",
  "爱心飞舞": "Flying Hearts",
  "花瓣飘落": "Falling Petals",
  
  // 翅膀
  "天使翅膀": "Angel Wings",
  "蝴蝶翅膀": "Butterfly Wings",
  "精灵翅膀": "Fairy Wings",
  "恶魔翅膀": "Devil Wings",
  "彩虹翅膀": "Rainbow Wings",
  
  // 车
  "红色跑车": "Red Sports Car",
  "蓝色轿车": "Blue Sedan",
  "白色SUV": "White SUV",
  "黑色摩托车": "Black Motorcycle",
  "粉色自行车": "Pink Bicycle",
  
  // 背景装饰
  "彩色气球": "Colorful Balloons",
  "美丽花朵": "Beautiful Flowers",
  "可爱动物": "Cute Animals",
  "浪漫心形": "Romantic Hearts",
  "闪亮星星": "Shining Stars"
};

function getEnglishTranslation(chineseName) {
  // 首先检查预定义翻译
  if (translationMap[chineseName]) {
    return translationMap[chineseName];
  }
  
  // 如果没有预定义翻译，生成一个简单的英文翻译
  return chineseName.replace(/[^\w\s]/g, '').replace(/\s+/g, ' ');
}

function scanNewAssets() {
  const newItems = [];
  
  console.log('🔍 扫描 new asset 文件夹...');
  
  for (const config of CATEGORY_CONFIGS) {
    const newAssetCategoryDir = join(newAssetDir, config.source);
    
    if (!fs.existsSync(newAssetCategoryDir)) {
      continue;
    }
    
    const files = fs.readdirSync(newAssetCategoryDir);
    const imageFiles = files.filter(file => 
      /\.(png|gif|jpg|jpeg)$/i.test(file) && file !== 'default.png' && file !== 'default.gif'
    );
    
    for (const file of imageFiles) {
      const chineseName = path.parse(file).name;
      const extension = path.parse(file).ext;
      
      newItems.push({
        categoryId: config.categoryId,
        folderName: config.target,
        hairRole: config.hairRole || null,
        chineseName,
        fileName: file,
        extension,
        sourcePath: join(newAssetCategoryDir, file)
      });
    }
  }
  
  return newItems;
}

function createHairFrontItem(item) {
  const assetPath = `/assets/front-hair/${item.fileName}`;
  return {
    id: `hair_${item.chineseName}`,
    name: item.chineseName,
    thumbnail: assetPath,
    image: assetPath,
    category: 'hair',
    layer: 4,
    frontHair: {
      id: `front-hair_${item.chineseName}`,
      name: item.chineseName,
      thumbnail: assetPath,
      image: assetPath,
      category: 'front-hair',
      layer: 2,
    },
    backHair: null,
  };
}

function createHairBackRef(item) {
  const assetPath = `/assets/back-hair/${item.fileName}`;
  return {
    id: `back-hair_${item.chineseName}`,
    name: item.chineseName,
    thumbnail: assetPath,
    image: assetPath,
    category: 'back-hair',
    layer: 1,
  };
}

function moveAssets(newItems) {
  console.log(`📦 移动 ${newItems.length} 个新资源...`);
  
  for (const item of newItems) {
    const targetDir = join(assetsDir, item.folderName);
    const targetPath = join(targetDir, item.fileName);
    
    // 确保目标目录存在
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }
    
    // 移动文件
    fs.copyFileSync(item.sourcePath, targetPath);
    fs.unlinkSync(item.sourcePath);
    
    console.log(`  ✅ ${item.chineseName} → assets/${item.folderName}/`);
  }
}

function updateCategories(newItems) {
  console.log('📝 更新 categories.ts...');
  
  let categoriesContent = fs.readFileSync(categoriesFile, 'utf8');
  
  // 提取categories数组
  const match = categoriesContent.match(/export const categories = ([\s\S]+?)\] as const;/);
  if (!match) {
    console.log('❌ 无法解析 categories.ts');
    return;
  }

  let categories = JSON.parse(`${match[1]}]`);
  
  // 按分类分组新物品
  const itemsByCategory = {};
  for (const item of newItems) {
    if (!itemsByCategory[item.categoryId]) {
      itemsByCategory[item.categoryId] = [];
    }
    itemsByCategory[item.categoryId].push(item);
  }
  
  let addedCount = 0;
  let backHairUpdated = 0;

  // 更新每个分类
  for (const [categoryId, items] of Object.entries(itemsByCategory)) {
    const category = categories.find(cat => cat.id === categoryId);
    if (!category) {
      console.log(`⚠️  未找到分类: ${categoryId}`);
      continue;
    }

    // 发型：先处理前发再处理后发，确保能正确配对
    if (categoryId === 'hair') {
      items.sort((a, b) => {
        if (a.hairRole === 'front' && b.hairRole === 'back') return -1;
        if (a.hairRole === 'back' && b.hairRole === 'front') return 1;
        return 0;
      });
    }
    
    for (const item of items) {
      if (item.hairRole === 'front') {
        const hairId = `hair_${item.chineseName}`;
        if (category.items.some((i) => i.id === hairId)) {
          console.log(`  ⏭️  发型已存在，跳过: ${item.chineseName}`);
          continue;
        }
        category.items.push(createHairFrontItem(item));
        addedCount++;
        continue;
      }

      if (item.hairRole === 'back') {
        const hairItem = category.items.find((i) => i.name === item.chineseName);
        if (!hairItem) {
          console.log(`  ⚠️  未找到对应发型，跳过后发: ${item.chineseName}`);
          continue;
        }
        hairItem.backHair = createHairBackRef(item);
        backHairUpdated++;
        continue;
      }

      const itemId = `${categoryId}_${item.chineseName}`;
      if (category.items.some((i) => i.id === itemId)) {
        console.log(`  ⏭️  物品已存在，跳过: ${item.chineseName}`);
        continue;
      }

      category.items.push({
        id: itemId,
        name: item.chineseName,
        thumbnail: `/assets/${item.folderName}/${item.fileName}`,
        image: `/assets/${item.folderName}/${item.fileName}`,
        category: categoryId,
        layer: category.layer,
      });
      addedCount++;
    }
    
    // 排序物品（无选项在前，其他按中文名称排序）
    category.items.sort((a, b) => {
      if (a.name === '无') return -1;
      if (b.name === '无') return 1;
      return a.name.localeCompare(b.name, 'zh-CN');
    });
    
    console.log(`  ✅ 更新分类 ${categoryId}`);
  }

  console.log(`  ✅ 新增 ${addedCount} 个物品，更新 ${backHairUpdated} 个后发`);
  
  // 写回文件
  const updatedContent = `// 自动生成的全量分类数据
export const categories = ${JSON.stringify(categories, null, 2)} as const;`;
  
  fs.writeFileSync(categoriesFile, updatedContent);
}

function updateTranslations(newItems) {
  console.log('📝 更新 translations.ts...');
  
  let translationsContent = fs.readFileSync(translationsFile, 'utf8');
  
  // 提取翻译对象
  const match = translationsContent.match(/export const itemNameTranslations: Record<string, Record<Language, string>> = ([\s\S]+?);/);
  if (!match) {
    console.log('❌ 无法解析 translations.ts');
    return;
  }
  
  let translations = JSON.parse(match[1]);
  
  // 添加新翻译
  for (const item of newItems) {
    if (!translations[item.chineseName]) {
      translations[item.chineseName] = {
        zh: item.chineseName,
        en: getEnglishTranslation(item.chineseName)
      };
    }
  }
  
  // 写回文件
  const updatedContent = `// 自动生成的翻译数据
import type { Language } from "../contexts/LanguageContext";

export const itemNameTranslations: Record<string, Record<Language, string>> = ${JSON.stringify(translations, null, 2)};

// 翻译函数
export function translateItemName(name: string, language: Language): string {
  const translation = itemNameTranslations[name];
  if (translation && translation[language]) {
    return translation[language];
  }
  // 如果没有找到翻译，返回原始名称
  return name;
}`;
  
  fs.writeFileSync(translationsFile, updatedContent);
  
  console.log(`  ✅ 添加了 ${newItems.length} 个新翻译`);
}

function scanAssetsMissingFromCategories(categories) {
  const missing = [];
  const existingIds = new Set();
  const existingHairNames = new Set();

  for (const cat of categories) {
    for (const item of cat.items) {
      existingIds.add(item.id);
      if (cat.id === 'hair') {
        existingHairNames.add(item.name);
      }
    }
  }

  for (const config of CATEGORY_CONFIGS) {
    const assetDir = join(assetsDir, config.target);
    if (!fs.existsSync(assetDir)) continue;

    const files = fs.readdirSync(assetDir).filter(
      (file) =>
        /\.(png|gif|jpg|jpeg)$/i.test(file) &&
        file !== 'default.png' &&
        file !== 'default.gif'
    );

    for (const file of files) {
      const chineseName = path.parse(file).name;
      const categoryId = config.categoryId;
      const itemId =
        config.hairRole === 'front'
          ? `hair_${chineseName}`
          : `${categoryId}_${chineseName}`;

      if (config.hairRole === 'front' && existingHairNames.has(chineseName)) {
        continue;
      }
      if (config.hairRole === 'back') {
        const hairItem = categories
          .find((c) => c.id === 'hair')
          ?.items.find((i) => i.name === chineseName);
        if (hairItem?.backHair) continue;
        const frontPath = join(assetsDir, 'front-hair', file);
        // 前发尚未入库时也要处理后发（同批次会先加前发）
        if (!hairItem && !fs.existsSync(frontPath)) continue;
      } else if (existingIds.has(itemId)) {
        continue;
      }

      missing.push({
        categoryId,
        folderName: config.target,
        hairRole: config.hairRole || null,
        chineseName,
        fileName: file,
        sourcePath: join(assetDir, file),
      });
    }
  }

  return missing;
}

async function main() {
  console.log('🚀 开始上传新资源...');

  const syncOnly = process.argv.includes('--sync-only');

  // 1. 扫描新资源
  let newItems = scanNewAssets();

  if (syncOnly && newItems.length === 0) {
    console.log('🔍 --sync-only: 检查 assets 中未入库的资源...');
    const categoriesContent = fs.readFileSync(categoriesFile, 'utf8');
    const match = categoriesContent.match(/export const categories = ([\s\S]+?)\] as const;/);
    if (!match) {
      console.log('❌ 无法解析 categories.ts');
      return;
    }
    const categories = JSON.parse(`${match[1]}]`);
    newItems = scanAssetsMissingFromCategories(categories);
  }

  if (newItems.length === 0) {
    console.log('ℹ️  没有发现新资源');
    return;
  }
  
  console.log(`📋 发现 ${newItems.length} 个新资源:`);
  for (const item of newItems) {
    console.log(`  - ${item.chineseName} (${item.categoryId})`);
  }
  
  // 2. 移动资源到assets文件夹
  if (!syncOnly) {
    moveAssets(newItems);
  }
  
  // 3. 更新categories.ts
  updateCategories(newItems);
  
  // 4. 更新translations.ts
  updateTranslations(newItems);
  
  console.log('✅ 新资源上传完成！');
  console.log('📝 所有新资源已添加到系统中');
}

main().catch(console.error);
