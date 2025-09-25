import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const translationsFile = join(__dirname, '../src/utils/translations.ts');

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

async function main() {
  console.log('🔧 开始修复所有翻译...');
  
  let translationsContent = fs.readFileSync(translationsFile, 'utf8');
  
  // 提取翻译对象
  const match = translationsContent.match(/export const itemNameTranslations: Record<string, Record<Language, string>> = ([\s\S]+?);/);
  if (!match) {
    console.log('❌ 无法解析翻译文件');
    return;
  }
  
  let translations = JSON.parse(match[1]);
  
  console.log(`📋 找到 ${Object.keys(translations).length} 个翻译项`);
  
  let fixedCount = 0;
  let addedCount = 0;
  
  // 修复现有翻译
  Object.keys(translations).forEach(key => {
    if (!translations[key].en || translations[key].en === '') {
      // 英文翻译缺失或为空
      if (translationMap[key]) {
        translations[key].en = translationMap[key];
        fixedCount++;
      } else {
        // 如果没有预定义翻译，生成一个简单的英文翻译
        translations[key].en = key.replace(/[^\w\s]/g, '').replace(/\s+/g, ' ');
        addedCount++;
      }
    }
  });
  
  console.log(`✅ 修复了 ${fixedCount} 个翻译项`);
  console.log(`✅ 添加了 ${addedCount} 个新翻译项`);
  
  // 更新文件
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
  
  console.log('✅ 所有翻译修复完成！');
  console.log('📝 现在英文模式下应该显示正确的英文翻译');
}

main().catch(console.error);
