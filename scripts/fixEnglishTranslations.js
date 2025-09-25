import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const translationsFile = join(__dirname, '../src/utils/translations.ts');

// 简单的翻译映射（这里可以扩展更多翻译）
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
  "流水车马": "Flowing Water Carriage",
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
  "童话之梦": "Fairy Tale Dream",
  "童话之爱": "Fairy Tale Love",
  "童话之恋": "Fairy Tale Romance",
  "童话之缘": "Fairy Tale Fate",
  "童话之约": "Fairy Tale Promise",
  "童话之誓": "Fairy Tale Vow",
  "童话之愿": "Fairy Tale Wish",
  
  // 分类名称
  "背景": "Background",
  "背景装饰": "Background Decor",
  "车辆": "Vehicle",
  "翅膀": "Wings",
  "发型": "Hairstyle",
  "下装": "Bottom",
  "上装": "Top",
  "套装": "Outfit",
  "妆容": "Makeup",
  "妆发造型": "Head Set",
  "脸饰": "Face Decor",
  "耳饰": "Earrings",
  "眼镜": "Glasses",
  "颈饰": "Neckwear",
  "头饰": "Headwear",
  "其他配饰": "Other Accessories",
  "陪伴": "Companion",
  "边框": "Frame",
  "称号": "Title",
  "特效": "Sparkle",
  
  // 通用词汇
  "无": "None",
  "默认": "Default",
};

async function main() {
  console.log('🔧 开始修复英文翻译...');
  
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
    if (translations[key].en === key) {
      // 英文翻译是中文，需要修复
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
  
  // 添加缺失的分类翻译
  const categoryTranslations = {
    "背景": "Background",
    "背景装饰": "Background Decor", 
    "车辆": "Vehicle",
    "翅膀": "Wings",
    "发型": "Hairstyle",
    "下装": "Bottom",
    "上装": "Top",
    "套装": "Outfit",
    "妆容": "Makeup",
    "妆发造型": "Head Set",
    "脸饰": "Face Decor",
    "耳饰": "Earrings",
    "眼镜": "Glasses",
    "颈饰": "Neckwear",
    "头饰": "Headwear",
    "其他配饰": "Other Accessories",
    "陪伴": "Companion",
    "边框": "Frame",
    "称号": "Title",
    "特效": "Sparkle",
  };
  
  Object.keys(categoryTranslations).forEach(key => {
    if (!translations[key]) {
      translations[key] = {
        zh: key,
        en: categoryTranslations[key]
      };
      addedCount++;
    }
  });
  
  console.log(`✅ 修复了 ${fixedCount} 个翻译项`);
  console.log(`✅ 添加了 ${addedCount} 个新翻译项`);
  
  // 更新文件
  const updatedContent = `// 自动生成的翻译数据
import type { Language } from "../contexts/LanguageContext";

export const itemNameTranslations: Record<string, Record<Language, string>> = ${JSON.stringify(translations, null, 2)};
`;
  
  fs.writeFileSync(translationsFile, updatedContent);
  
  console.log('✅ 英文翻译修复完成！');
  console.log('📝 现在英文模式下应该显示正确的英文翻译');
}

main().catch(console.error);
