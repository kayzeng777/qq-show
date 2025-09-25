import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const translationsFile = join(__dirname, '../src/utils/translations.ts');

// 扩展的翻译映射
const translationMap = {
  // 发型相关
  "白金毽子头": "Platinum Shuttlecock Head",
  "冰蓝栗子头": "Ice Blue Chestnut Head",
  "冰蓝中短发": "Ice Blue Medium Short Hair",
  "电力橙双马尾": "Electric Orange Twin Tails",
  "火金飞机头": "Fire Gold Mohawk",
  "火金鲻鱼头": "Fire Gold Mullet",
  "金黄斜扎卷长发": "Golden Yellow Slanted Curly Long Hair",
  "深棕波浪卷长发": "Dark Brown Wavy Curly Long Hair",
  "头花金色扎发": "Golden Hairpin Updo",
  "亚麻红短发": "Flax Red Short Hair",
  "亚麻绿短发": "Flax Green Short Hair",
  "亚麻紫刺猬头": "Flax Purple Hedgehog Head",
  "亚麻紫卷马尾": "Flax Purple Curly Ponytail",
  "摇滚黑短发": "Rock Black Short Hair",
  "摇滚蓝紫短发": "Rock Blue Purple Short Hair",
  "棕色刺猬头": "Brown Hedgehog Head",
  "棕色短飞机头": "Brown Short Mohawk",
  "棕色飞机头": "Brown Mohawk",
  "棕色栗子头": "Brown Chestnut Head",
  "棕色雅痞短发": "Brown Yuppie Short Hair",
  
  // 下装相关
  "黑色摇滚金属长裤": "Black Rock Metal Pants",
  "灰蓝运动裤": "Gray Blue Sports Pants",
  "经典牛仔短裤": "Classic Denim Shorts",
  "咖啡色休闲裤": "Coffee Casual Pants",
  "卡其工装裤": "Khaki Work Pants",
  "牛仔裤格纹长袜": "Denim Plaid Long Socks",
  "破洞松垮牛仔裤": "Hole Loose Jeans",
  "浅橙短裙内搭牛仔裤": "Light Orange Short Skirt with Jeans",
  "深红色嘻哈长裤": "Deep Red Hip Hop Pants",
  "深色牛仔裤": "Dark Jeans",
  "深紫色长裤": "Deep Purple Pants",
  "西部短裙牛仔靴": "Western Short Skirt Cowboy Boots",
  "休闲牛仔长裤": "Casual Denim Pants",
  "腰包破洞牛仔裤": "Fanny Pack Hole Jeans",
  "摇滚水洗牛仔裤": "Rock Washed Jeans",
  "棕色水洗西部长裤": "Brown Washed Western Pants",
  
  // 上装相关
  "白色毛绒环扣外套": "White Fluffy Ring Button Jacket",
  "白色碎花背心": "White Floral Vest",
  "白色休闲西装": "White Casual Suit",
  "橙色运动外套": "Orange Sports Jacket",
  "粉红斜肩针织衫": "Pink Off-Shoulder Knit",
  "粉色百褶抹胸": "Pink Pleated Bustier",
  "粉色开衫学院风": "Pink Cardigan Academic Style",
  "粉星套衫": "Pink Star Sweater",
  "工装夹克叠穿": "Work Jacket Layered",
  "红色街头背心": "Red Street Vest",
  "黄色柳丁背心": "Yellow Studded Vest",
  "活力粉夏日背心": "Vibrant Pink Summer Vest",
  "咖啡夹克": "Coffee Jacket",
  "蓝青竖纹长袖": "Blue Green Vertical Striped Long Sleeve",
  "蓝青休闲西装": "Blue Green Casual Suit",
  "蓝天花园背心": "Blue Sky Garden Vest",
  "裸身红色电吉他": "Naked Red Electric Guitar",
  "美式长袖套衫": "American Long Sleeve Sweater",
  "玩偶粉色开衫": "Doll Pink Cardigan",
  "斜肩红色毛衣": "Off-Shoulder Red Sweater",
  "斜肩玫瑰长袖": "Off-Shoulder Rose Long Sleeve",
  "紫白条纹长袖": "Purple White Striped Long Sleeve",
  "爱心一字肩套装": "Heart Off-Shoulder Set",
  
  // 脸饰相关
  "卡通口罩": "Cartoon Mask",
  "蓝色闪钻脸饰": "Blue Sparkling Face Decor",
  
  // 耳饰相关
  "花钻耳钉": "Flower Diamond Earrings",
  "街头粉星耳坠": "Street Pink Star Earrings",
  "金边蝴蝶耳坠": "Gold Edge Butterfly Earrings",
  "金色耳环": "Gold Earrings",
  "金色水滴耳坠": "Gold Water Drop Earrings",
  "金色星星耳坠": "Gold Star Earrings",
  "金色月亮耳坠": "Gold Moon Earrings",
  "闪耀蓝钻十字耳坠": "Shining Blue Diamond Cross Earrings",
  "银色耳饰": "Silver Earrings",
  
  // 眼镜相关
  "灰白墨镜": "Gray White Sunglasses",
  "火红墨镜": "Fire Red Sunglasses",
  "假面舞会": "Masquerade",
  "落日飞行墨镜": "Sunset Aviator Sunglasses",
  "落日墨镜": "Sunset Sunglasses",
  "窄框眼镜": "Narrow Frame Glasses",
  
  // 颈饰相关
  "白色针织围巾": "White Knit Scarf",
  "传呼机": "Pager",
  "粉白条纹围巾": "Pink White Striped Scarf",
  "黑白玩偶项链": "Black White Doll Necklace",
  "黑灵项链": "Black Spirit Necklace",
  "黑色十字架项链": "Black Cross Necklace",
  "幻彩蛇": "Rainbow Snake",
  "黄色流星项链": "Yellow Meteor Necklace",
  "街头十字项链": "Street Cross Necklace",
  "戒指项链": "Ring Necklace",
  "金属吊牌项链": "Metal Tag Necklace",
  "蓝色条纹围巾": "Blue Striped Scarf",
  "蓝色妖姬项链": "Blue Demon Necklace",
  "暖黄围巾": "Warm Yellow Scarf",
  "青蓝针织围巾": "Cyan Blue Knit Scarf",
  "闪钻项链": "Sparkling Diamond Necklace",
  "射线项链": "Ray Necklace",
  "随身听": "Walkman",
  "紫色波点围巾": "Purple Polka Dot Scarf",
  
  // 头饰相关
  "白色棒球": "White Baseball",
  "冰蓝墨镜": "Ice Blue Sunglasses",
  "波点美式头箍": "Polka Dot American Headband",
  "格子报童帽": "Checkered Newsboy Cap",
  "公主皇冠": "Princess Crown",
  "毛绒帽": "Fuzzy Hat",
  "毛线帽": "Wool Hat",
  "墨镜黑色头巾": "Sunglasses Black Headscarf",
  "浅粉贝雷": "Light Pink Beret",
  "双色针织帽": "Two-Tone Knit Hat",
  "兔子运动": "Rabbit Sports",
  "希腊花环": "Greek Wreath",
  "夏威夷": "Hawaiian",
  "摇滚绅士帽": "Rock Gentleman Hat",
  "紫色棒球帽": "Purple Baseball Cap",
  "棕色贝雷帽": "Brown Beret",
  
  // 其他配饰相关
  "粉玫瑰花束": "Pink Rose Bouquet",
  "金属爱心腰链": "Metal Heart Waist Chain",
  "金属腰链": "Metal Waist Chain",
  "柳丁皮带": "Studded Belt",
  
  // 陪伴相关
  "暴躁团子": "Grumpy Rice Ball",
  "比格犬": "Beagle",
  "大号圣诞玩具熊": "Large Christmas Teddy Bear",
  "德牧犬": "German Shepherd",
  "多比精灵": "Dobby Elf",
  "恶魔蝙蝠": "Demon Bat",
  "翻滚团子": "Rolling Rice Ball",
  "粉色精灵女孩": "Pink Fairy Girl",
  "粉色漂浮猫咪": "Pink Floating Cat",
  "粉色小猪": "Pink Pig",
  "蝴蝶": "Butterfly",
  "幻彩游龙": "Rainbow Dragon",
  "幻影骷髅": "Phantom Skeleton",
  "金毛犬": "Golden Retriever",
  "凯蒂猫": "Hello Kitty",
  "凯蒂玩偶": "Hello Kitty Doll",
  "酷儿超人": "Queer Superman",
  "流氓兔": "Rogue Rabbit",
  "情侣小熊": "Couple Bears",
  "三头狼": "Three-Headed Wolf",
  "圣诞驯鹿": "Christmas Reindeer",
  "维尼天使": "Winnie Angel",
  "西施狗": "Shih Tzu",
  "仙子": "Fairy",
  "小花猫": "Little Flower Cat",
  "小浣熊": "Little Raccoon",
  "小橘猫": "Little Orange Cat",
  "小熊魔法精灵": "Little Bear Magic Elf",
  
  // 边框相关
  "爱心巴洛克": "Heart Baroque",
  "爱心帘子": "Heart Curtain",
  "巴洛克": "Baroque",
  "电音舞台": "Electronic Stage",
  "粉蝴蝶结": "Pink Bow",
  "粉丝": "Fans",
  "红色窗帘": "Red Curtain",
  "蝴蝶缎带": "Butterfly Ribbon",
  "花花蝴蝶": "Flower Butterfly",
  "花藤": "Flower Vine",
  "经典玫瑰": "Classic Rose",
  "精灵爱心": "Fairy Heart",
  "卡通星星": "Cartoon Star",
  "蓝色十字花": "Blue Cross Flower",
  "蕾丝爱心": "Lace Heart",
  "礼花相框": "Firework Frame",
  "礼物": "Gift",
  "罗马花藤": "Roman Flower Vine",
  "玫瑰藤蔓": "Rose Vine",
  "魔法森林": "Magic Forest",
  "情人节": "Valentine's Day",
  "晴空": "Clear Sky",
  "双色花朵": "Two-Tone Flower",
  "围栏信箱": "Fence Mailbox",
  "小狗家园": "Puppy Home",
  "小狗赛车": "Puppy Racing",
  "摇滚爱心": "Rock Heart",
  "紫牵牛藤": "Purple Morning Glory Vine",
  
  // 文字装饰相关
  "艾丽时尚杂志": "Ellie Fashion Magazine",
  "爱上你了爱心泡泡": "Love You Heart Bubbles",
  "动漫少年": "Anime Boy",
  "动漫杂志": "Anime Magazine",
  "都市丽人杂志": "Urban Beauty Magazine",
  "绯闻杂志": "Gossip Magazine",
  "嗨baby": "Hey Baby",
  "活力中国杂志": "Vitality China Magazine",
  "集英社": "Shueisha",
  "可洛时装杂志": "Kolo Fashion Magazine",
  "克拉写真杂志": "Cara Photo Magazine",
  "浪漫情怀": "Romantic Feelings",
  "茉莉风尚杂志": "Jasmine Style Magazine",
  "你的温柔": "Your Gentleness",
  "欧美流行杂志": "European American Pop Magazine",
  "期待再一次重逢": "Looking Forward to Reunion",
  "青年风尚杂志": "Youth Style Magazine",
  "融化你的爱": "Melt Your Love",
  "他风尚杂志": "His Style Magazine",
  "我爱你双心烟花": "I Love You Double Heart Fireworks",
  "我爱你烟花": "I Love You Fireworks",
  "我的唯一": "My Only One",
  "新潮流杂志": "New Trend Magazine",
  "需要勇气": "Need Courage",
  "摇滚流行乐杂志": "Rock Pop Music Magazine",
  "一切很美": "Everything is Beautiful",
  "欲望都市杂志": "Sex and the City Magazine",
  "原宿元气杂志": "Harajuku Energy Magazine",
  "S风尚杂志": "S Style Magazine",
  
  // 特效相关
  "爱心闪耀糯米团子": "Heart Shining Rice Ball",
  "彩虹流星": "Rainbow Meteor",
  "彩色舞台聚光灯": "Colorful Stage Spotlight",
  "翅膀爱心挂帘": "Wing Heart Curtain",
  "冬日飘雪": "Winter Snow",
  "粉蓝飘雪泡泡": "Pink Blue Snow Bubbles",
  "粉色爱心泡泡": "Pink Heart Bubbles",
  "粉色泡泡花园": "Pink Bubble Garden",
  "灌木花泡泡": "Shrub Flower Bubbles",
  "红粉落花": "Pink Falling Flowers",
  "蓝色爱心泡泡": "Blue Heart Bubbles",
  "蓝色流星": "Blue Meteor",
  "蓝色小鸟": "Blue Bird",
  "蓝紫闪星": "Blue Purple Sparkling Star",
  "魔法金光螺旋": "Magic Golden Light Spiral",
  "魔法闪耀星星": "Magic Shining Star",
  "扑克蝴蝶": "Poker Butterfly",
  "秋日枫叶": "Autumn Maple Leaves",
  "闪光灯": "Flashlight",
  "闪耀龙卷风": "Shining Tornado",
  "十二芒星": "Twelve-Pointed Star",
  "太阳当空照": "Sun Shining Bright",
  "星闪闪": "Twinkling Star",
  "星星爱心泡泡": "Star Heart Bubbles",
  "星星闪光": "Star Flash",
  "炫彩闪光圈": "Colorful Flash Circle",
  "炫彩星环": "Colorful Star Ring",
  "炫彩星星": "Colorful Star",
  "炫彩星星烟花": "Colorful Star Fireworks",
  "炫彩烟花": "Colorful Fireworks",
  "坠落星星": "Falling Star",
  
  // 背景相关
  "背景": "Background"
};

function getEnglishTranslation(chineseName) {
  // 首先检查预定义翻译
  if (translationMap[chineseName]) {
    return translationMap[chineseName];
  }
  
  // 如果没有预定义翻译，生成一个简单的英文翻译
  return chineseName.replace(/[^\w\s]/g, '').replace(/\s+/g, ' ');
}

async function main() {
  console.log('🔧 开始翻译所有 Auto Translation...');
  
  let content = fs.readFileSync(translationsFile, 'utf8');
  
  // 使用正则表达式找到所有"Auto Translation"并替换
  const autoTranslationRegex = /"en": "Auto Translation"/g;
  const matches = content.match(autoTranslationRegex);
  
  if (!matches) {
    console.log('ℹ️  没有找到 Auto Translation');
    return;
  }
  
  console.log(`📋 找到 ${matches.length} 个 Auto Translation`);
  
  // 替换所有 Auto Translation
  content = content.replace(/"en": "Auto Translation"/g, (match, offset) => {
    // 找到这个翻译项的中文名称
    const beforeMatch = content.substring(0, offset);
    const lastQuote = beforeMatch.lastIndexOf('"');
    const secondLastQuote = beforeMatch.lastIndexOf('"', lastQuote - 1);
    const chineseName = beforeMatch.substring(secondLastQuote + 1, lastQuote);
    
    const englishTranslation = getEnglishTranslation(chineseName);
    return `"en": "${englishTranslation}"`;
  });
  
  // 写回文件
  fs.writeFileSync(translationsFile, content);
  
  console.log(`✅ 翻译了 ${matches.length} 个 Auto Translation`);
  console.log('📝 现在所有翻译都有合适的英文名称');
}

main().catch(console.error);
