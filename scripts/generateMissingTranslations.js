#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 读取新生成的翻译文件
const newTranslationsFile = path.join(__dirname, '..', 'src', 'utils', 'updated-translations.ts');
const newContent = fs.readFileSync(newTranslationsFile, 'utf8');

// 提取翻译对象
const translationsMatch = newContent.match(/export const itemNameTranslations: Record<string, Record<Language, string>> = ({[\s\S]*?});/);
if (!translationsMatch) {
  console.error('无法解析翻译文件');
  process.exit(1);
}

const translationsStr = translationsMatch[1];
const translations = eval(`(${translationsStr})`);

// 为缺失翻译的中文名字生成英文翻译
const newTranslations = { ...translations };

// 扩展的翻译映射，包含更多新的中文名字
const extendedTranslations = {
  // 背景相关
  '万圣城堡': 'Halloween Castle',
  '伦敦大桥': 'London Bridge',
  '兔子果林': 'Rabbit Fruit Forest',
  '冬日小屋': 'Winter Cottage',
  '冰封雪林': 'Frozen Snow Forest',
  '凛冬小屋': 'Severe Winter Cottage',
  '北极熊湖': 'Polar Bear Lake',
  '城市风景': 'Cityscape',
  '夜半城市': 'Midnight City',
  '天天向上': 'Every Day Upward',
  '奇妙树屋': 'Wonderful Tree House',
  '小路彩虹': 'Path Rainbow',
  '山顶教堂': 'Mountain Top Church',
  '市政厅堂': 'City Hall',
  '摩天轮景': 'Ferris Wheel View',
  '新加坡河': 'Singapore River',
  '新春佳节': 'Spring Festival',
  '末日寒冬': 'Apocalyptic Winter',
  '松树飘雪': 'Pine Tree Snow',
  '水晶之恋': 'Crystal Love',
  '海岛远山': 'Island Distant Mountains',
  '海边彩虹': 'Seaside Rainbow',
  '深冬小院': 'Deep Winter Courtyard',
  '深空冬日': 'Deep Space Winter',
  '湖边花丛': 'Lakeside Flower Garden',
  '爱心云朵': 'Heart Clouds',
  '犹他公园': 'Utah Park',
  '瑞士草场': 'Swiss Meadow',
  '电影海报': 'Movie Poster',
  '石板小镇': 'Stone Slate Town',
  '石砖城堡': 'Stone Brick Castle',
  '秋千小屋': 'Swing Cottage',
  '突破渴望': 'Break Through Desire',
  '简约小屋': 'Simple Cottage',
  '粉心彩虹': 'Pink Heart Rainbow',
  '粉色仙林': 'Pink Fairy Forest',
  '萝卜农场': 'Radish Farm',
  '蘑菇家园': 'Mushroom Home',
  '街角餐厅': 'Corner Restaurant',
  '雨林飘雾': 'Rainforest Mist',
  '霹雳眩光': 'Thunder Lightning',
  '静谧紫夜': 'Quiet Purple Night',
  '音乐百事': 'Music Pepsi',
  '黑客帝国': 'Matrix',

  // 头发相关
  '亚麻紫刺猬头': 'Lavender Hedgehog Hair',
  '亚麻红短发': 'Linen Red Short Hair',
  '冰蓝中短发': 'Ice Blue Medium Short Hair',
  '冰蓝栗子头': 'Ice Blue Chestnut Hair',
  '发型6': 'Hairstyle 6',
  '摇滚黑短发': 'Rock Black Short Hair',
  '棕色刺猬头': 'Brown Hedgehog Hair',
  '棕色短飞机头': 'Brown Short Mohawk',
  '棕色雅痞短发': 'Brown Hipster Short Hair',
  '棕色飞机头': 'Brown Mohawk',
  '深棕波浪卷长发': 'Dark Brown Wavy Long Hair',
  '火金飞机头': 'Fire Gold Mohawk',
  '火金鲻鱼头': 'Fire Gold Mullet',
  '白金发夹短发': 'Platinum Hair Clip Short Hair',
  '白金毽子头': 'Platinum Shuttlecock Hair',
  '黑总飞机短发': 'Black Boss Mohawk Short Hair',

  // 服装相关
  '休闲牛仔长裤': 'Casual Denim Pants',
  '咖啡色休闲裤': 'Coffee Casual Pants',
  '棕色水洗西部长裤': 'Brown Washed Western Pants',
  '深红色嘻哈长裤': 'Dark Red Hip Hop Pants',
  '深紫色长裤': 'Deep Purple Pants',
  '灰蓝运动裤': 'Gray Blue Sports Pants',
  '牛仔裤格纹长袜': 'Jeans Plaid Long Socks',
  '破洞松垮牛仔裤': 'Hole Loose Jeans',
  '腰包破洞牛仔裤': 'Fanny Pack Hole Jeans',
  '黑色摇滚金属长裤': 'Black Rock Metal Pants',

  // 上装相关
  '白色毛绒环扣外套': 'White Fluffy Ring Coat',
  '白色碎花背心': 'White Floral Vest',
  '橙色运动外套': 'Orange Sports Jacket',
  '粉红斜肩针织衫': 'Pink Off-Shoulder Knit',
  '粉色百褶抹胸': 'Pink Pleated Bustier',
  '粉色开衫学院风': 'Pink Cardigan School Style',
  '粉星套衫': 'Pink Star Sweater',
  '红色街头背心': 'Red Street Vest',
  '黄色柳丁背心': 'Yellow Studded Vest',
  '活力粉夏日背心': 'Energetic Pink Summer Vest',
  '蓝青竖纹长袖': 'Blue Green Striped Long Sleeve',
  '蓝青休闲西装': 'Blue Green Casual Suit',
  '蓝天花园背心': 'Sky Blue Garden Vest',
  '裸身红色电吉他': 'Red Electric Guitar',
  '天蓝短袖T恤': 'Sky Blue T-Shirt',
  '玩偶粉色开衫': 'Doll Pink Cardigan',
  '斜肩红色毛衣': 'Off-Shoulder Red Sweater',
  '紫白条纹长袖': 'Purple White Striped Long Sleeve',

  // 脸饰相关
  '卡通口罩': 'Cartoon Mask',

  // 耳饰相关
  '花钻耳钉': 'Flower Diamond Studs',
  '街头粉星耳坠': 'Street Pink Star Earrings',
  '金色星星耳坠': 'Golden Star Earrings',
  '金色水滴耳坠': 'Golden Water Drop Earrings',
  '金边蝴蝶耳坠': 'Golden Edge Butterfly Earrings',
  '闪耀蓝钻十字耳坠': 'Shining Blue Diamond Cross Earrings',

  // 眼镜相关
  '火红墨镜': 'Fire Red Sunglasses',
  '灰白墨镜': 'Gray White Sunglasses',
  '窄框眼镜': 'Narrow Frame Glasses',
  '落日飞行墨镜': 'Sunset Aviator Sunglasses',

  // 颈饰相关
  '传呼机': 'Pager',
  '射线项链': 'Ray Necklace',
  '幻彩蛇': 'Rainbow Snake',
  '戒指项链': 'Ring Necklace',
  '暖黄围巾': 'Warm Yellow Scarf',
  '紫色波点围巾': 'Purple Polka Dot Scarf',
  '蓝色条纹围巾': 'Blue Striped Scarf',
  '街头十字项链': 'Street Cross Necklace',
  '青蓝针织围巾': 'Cyan Blue Knit Scarf',
  '黑灵项链': 'Black Spirit Necklace',
  '黑白玩偶项链': 'Black White Doll Necklace',

  // 头饰相关
  '双色针织帽': 'Two-Tone Knit Hat',
  '墨镜黑色头巾': 'Sunglasses Black Headscarf',
  '希腊花环': 'Greek Wreath',
  '摇滚绅士帽': 'Rock Gentleman Hat',
  '格子报童帽': 'Plaid Newsboy Cap',
  '棕色贝雷帽': 'Brown Beret',
  '毛绒帽': 'Fuzzy Hat',
  '冰蓝墨镜': 'Ice Blue Sunglasses',

  // 其他配饰相关
  'e季风05 (22)': 'e Monsoon 05 (22)',
  '金属爱心腰链': 'Metal Heart Waist Chain',
  '金属腰链': 'Metal Waist Chain',

  // 陪伴相关
  '三头狼': 'Three-Headed Wolf',
  '凯蒂玩偶': 'Hello Kitty Doll',
  '多比精灵': 'Dobby Elf',
  '大号圣诞玩具熊': 'Large Christmas Teddy Bear',
  '小橘猫': 'Little Orange Cat',
  '小花猫': 'Little Flower Cat',
  '幻彩游龙': 'Rainbow Dragon',
  '幻影骷髅': 'Phantom Skeleton',
  '恶魔蝙蝠': 'Demon Bat',
  '情侣小熊': 'Couple Bears',
  '暴躁团子': 'Grumpy Rice Ball',
  '粉色小猪': 'Pink Pig',
  '粉色精灵女孩': 'Pink Fairy Girl',
  '维尼天使': 'Winnie Angel',
  '翻滚团子': 'Rolling Rice Ball',
  '西施狗': 'Shih Tzu',
  '酷儿超人': 'Queer Superman',
  '金毛犬': 'Golden Retriever',

  // 边框相关
  '爱心巴洛克': 'Heart Baroque',
  '巴洛克': 'Baroque',
  '粉蝴蝶结': 'Pink Bow',
  '粉丝': 'Fans',
  '蝴蝶缎带': 'Butterfly Ribbon',
  '花花蝴蝶': 'Flower Butterfly',
  '花藤': 'Flower Vine',
  '经典玫瑰': 'Classic Rose',
  '精灵爱心': 'Fairy Heart',
  '卡通星星': 'Cartoon Star',
  '蕾丝爱心': 'Lace Heart',
  '礼物': 'Gift',
  '罗马花藤': 'Roman Flower Vine',
  '魔法森林': 'Magic Forest',
  '情人节': 'Valentine\'s Day',
  '晴空': 'Clear Sky',
  '围栏信箱': 'Fence Mailbox',
  '小狗赛车': 'Puppy Racing',
  '摇滚爱心': 'Rock Heart',
  '紫牵牛藤': 'Purple Morning Glory',

  // 装饰字相关
  '艾丽时尚杂志': 'Ellie Fashion Magazine',
  '爱上你了爱心泡泡': 'I Love You Heart Bubbles',
  '动漫杂志': 'Anime Magazine',
  '都市丽人杂志': 'Urban Beauty Magazine',
  '绯闻杂志': 'Gossip Magazine',
  '嗨baby': 'Hi Baby',
  '活力中国杂志': 'Vitality China Magazine',
  '集英社': 'Shueisha',
  '可洛时装杂志': 'Kolo Fashion Magazine',
  '克拉写真杂志': 'Cara Photo Magazine',
  '茉莉风尚杂志': 'Jasmine Style Magazine',
  '欧美流行杂志': 'Western Pop Magazine',
  '青年风尚杂志': 'Youth Style Magazine',
  '他风尚杂志': 'His Style Magazine',
  '我爱你双心烟花': 'I Love You Double Heart Fireworks',
  '我爱你烟花': 'I Love You Fireworks',
  '新潮流杂志': 'New Trend Magazine',
  '摇滚流行乐杂志': 'Rock Pop Music Magazine',
  '欲望都市杂志': 'Sex and the City Magazine',
  '原宿元气杂志': 'Harajuku Energy Magazine',
  'S风尚杂志': 'S Style Magazine',

  // 特效相关
  '爱心闪耀糯米团子': 'Shining Heart Rice Ball',
  '彩虹流星': 'Rainbow Meteor',
  '翅膀爱心挂帘': 'Wing Heart Curtain',
  '冬日飘雪': 'Winter Snowfall',
  '粉蓝飘雪泡泡': 'Pink Blue Snow Bubbles',
  '粉色爱心泡泡': 'Pink Heart Bubbles',
  '粉色泡泡花园': 'Pink Bubble Garden',
  '灌木花泡泡': 'Shrub Flower Bubbles',
  '红粉落花': 'Red Pink Falling Flowers',
  '蓝色爱心泡泡': 'Blue Heart Bubbles',
  '蓝色小鸟': 'Blue Bird',
  '蓝紫闪星': 'Blue Purple Sparkling Stars',
  '魔法金光螺旋': 'Magic Golden Spiral',
  '魔法闪耀星星': 'Magic Shining Stars',
  '扑克蝴蝶': 'Poker Butterfly',
  '期待再一次重逢': 'Looking Forward to Meeting Again',
  '闪光灯': 'Flashlight',
  '闪耀龙卷风': 'Shining Tornado',
  '太阳当空照': 'Sun Shining Bright',
  '星星爱心泡泡': 'Star Heart Bubbles',
  '炫彩闪光圈': 'Colorful Flash Ring',
  '炫彩星环': 'Colorful Star Ring',
  '炫彩星星': 'Colorful Stars',
  '炫彩星星烟花': 'Colorful Star Fireworks',
  '炫彩烟花': 'Colorful Fireworks',
  '坠落星星': 'Falling Stars'
};

// 更新翻译
let updatedCount = 0;
Object.entries(newTranslations).forEach(([key, value]) => {
  if (value.en === key) { // 如果英文翻译还是中文，说明需要翻译
    if (extendedTranslations[key]) {
      newTranslations[key] = {
        zh: key,
        en: extendedTranslations[key]
      };
      updatedCount++;
      console.log(`更新翻译: ${key} -> ${extendedTranslations[key]}`);
    }
  }
});

// 生成更新后的翻译文件内容
const updatedTranslationsStr = JSON.stringify(newTranslations, null, 2);

const updatedContent = `// 自动生成的翻译数据 - 已补充缺失的英文翻译
import type { Language } from "../contexts/LanguageContext";

export const itemNameTranslations: Record<string, Record<Language, string>> = ${updatedTranslationsStr};

export const translateItemName = (name: string, language: Language): string => {
  return itemNameTranslations[name]?.[language] || name;
};
`;

// 保存更新后的翻译文件
fs.writeFileSync(newTranslationsFile, updatedContent);

console.log(`\n✅ 翻译更新完成!`);
console.log(`更新了 ${updatedCount} 个翻译`);
console.log(`总计翻译: ${Object.keys(newTranslations).length} 个`);
console.log(`已更新文件: ${newTranslationsFile}`);
