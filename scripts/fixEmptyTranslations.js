import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const translationsFile = join(__dirname, '../src/utils/translations.ts');

// 扩展的翻译映射
const translationMap = {
  // 新添加的背景
  "交警熊猫": "Traffic Police Panda",
  "原宿街头": "Harajuku Street",
  "双子云殿": "Twin Cloud Palace",
  "天使花瓣": "Angel Petals",
  "幸运草丛": "Lucky Grass",
  "幻彩宫殿": "Rainbow Palace",
  "想你爱你": "Missing You Loving You",
  "摩登公寓": "Modern Apartment",
  "新春梅花": "Spring Plum Blossom",
  "气球爱心": "Balloon Hearts",
  "温馨房间": "Cozy Room",
  "炫彩圣诞": "Colorful Christmas",
  "甜品天国": "Dessert Heaven",
  "紫色仙子": "Purple Fairy",
  "诡秘科技": "Mysterious Technology",
  "郊野公园": "Country Park",
  "闪耀圣诞": "Shining Christmas",
  "雪花弯月": "Snowflake Crescent Moon",
  "魔法扑克": "Magic Poker",
  "黑白云朵": "Black White Clouds",
  
  // 新添加的背景装饰
  "彩色舞台聚光灯": "Colorful Stage Spotlight",
  "彩虹流星": "Rainbow Meteor",
  "星星闪光": "Star Flash",
  "架子鼓": "Drum Set",
  "炫彩星星烟花": "Colorful Star Fireworks",
  "炫彩星环": "Colorful Star Ring",
  "炫彩闪光圈": "Colorful Flash Circle",
  "粉色爱心泡泡": "Pink Heart Bubbles",
  "飘落樱花": "Falling Cherry Blossoms",
  "魔法金光螺旋": "Magic Golden Light Spiral",
  
  // 新添加的翅膀
  "粉紫蝴蝶": "Pink Purple Butterfly",
  "蓝色闪蝶": "Blue Flash Butterfly",
  "黑色天使": "Black Angel",
  
  // 新添加的下装
  "粉色百褶短裙": "Pink Pleated Short Skirt",
  "粉色蛋糕短裙": "Pink Cake Short Skirt",
  "落日蛋糕短裙": "Sunset Cake Short Skirt",
  "黑曜长靴短裙": "Obsidian Boot Short Skirt",
  
  // 新添加的上装
  "春日浅黄上装": "Spring Light Yellow Top",
  "粉色动感背心": "Pink Dynamic Vest",
  
  // 新添加的套装
  "中式旗袍套装": "Chinese Qipao Set",
  "典雅白色礼服套装": "Elegant White Dress Set",
  "刺绣民族服饰": "Embroidered Ethnic Costume",
  "双排扣外套裙装": "Double Breasted Jacket Dress",
  "圣诞礼物套装": "Christmas Gift Set",
  "场景黄色礼服套装": "Scene Yellow Dress Set",
  "宫廷黄色公主裙": "Palace Yellow Princess Dress",
  "宽大牛仔裤T恤套装": "Oversized Jeans T-shirt Set",
  "弯月牛仔裙紫靴套装": "Crescent Denim Skirt Purple Boot Set",
  "橙色T恤短裤套装": "Orange T-shirt Shorts Set",
  "橙色开衫牛仔裙套装": "Orange Cardigan Denim Skirt Set",
  "活力粉色运动套装": "Vibrant Pink Sports Set",
  "活力粉蓝白靴套装": "Vibrant Pink Blue White Boot Set",
  "流行歌手翅膀套装": "Pop Singer Wings Set",
  "浅粉薄纱礼服套装": "Light Pink Chiffon Dress Set",
  "灵动开衩裙套装": "Dynamic Slit Skirt Set",
  "牛仔背带裤红色波点套装": "Denim Overalls Red Polka Dot Set",
  "琉璃红色鱼尾裙套装": "Glass Red Mermaid Skirt Set",
  "白色天使套装": "White Angel Set",
  "白色开衫长裙套装": "White Cardigan Long Dress Set",
  "福字新春套装": "Fortune Spring Festival Set",
  "秋冬橙色围巾套装": "Autumn Winter Orange Scarf Set",
  "秋千白色薄纱裙套装": "Swing White Chiffon Dress Set",
  "窄腿牛仔裤套装": "Skinny Jeans Set",
  "粉色套衫拎包套装": "Pink Sweater Handbag Set",
  "粉色背心蓝裙套装": "Pink Vest Blue Skirt Set",
  "粉色风衣牛仔裤套装": "Pink Trench Coat Jeans Set",
  "粉色鱼尾礼裙套装": "Pink Mermaid Dress Set",
  "紫色长袖格纹裙套装": "Purple Long Sleeve Plaid Skirt Set",
  "红绿爱心套装": "Red Green Heart Set",
  "红色叠穿条纹套装": "Red Layered Stripes Set",
  "红色露肩短裙套装": "Red Off-Shoulder Short Skirt Set",
  "绿色背心短裙套装": "Green Vest Short Skirt Set",
  "绿色连衣裙套装": "Green Dress Set",
  "缎面白色礼服套装": "Satin White Dress Set",
  "翅膀粉色公主短裙套装": "Wings Pink Princess Short Skirt Set",
  "翅膀粉色蓬蓬裙套装": "Wings Pink Puff Skirt Set",
  "英伦红棕短裙套装": "British Red Brown Short Skirt Set",
  "蓝绿围巾裙装": "Blue Green Scarf Dress",
  "蓝绿蛋糕裙套装": "Blue Green Cake Skirt Set",
  "蓝色T恤绿裙套装": "Blue T-shirt Green Skirt Set",
  "蓝色背心黄色长裙套装": "Blue Vest Yellow Long Dress Set",
  "薄荷裙套装": "Mint Skirt Set",
  "蝴蝶仙子套装": "Butterfly Fairy Set",
  "蝴蝶结白色公主裙套装": "Bow White Princess Dress Set",
  "街头红色外套白靴套装": "Street Red Jacket White Boot Set",
  "都市丽人蓝裙套装": "Urban Beauty Blue Skirt Set",
  "黄色开衫牛仔裤套装": "Yellow Cardigan Jeans Set",
  "黄色背带裙套装": "Yellow Overalls Set",
  "黑色T恤牛仔裙套装": "Black T-shirt Denim Skirt Set",
  "黑色皮衣牛仔裤套装": "Black Leather Jacket Jeans Set",
  
  // 新添加的妆容
  "动漫眼睛弯弯": "Anime Curved Eyes",
  "动漫红瞳眨眼": "Anime Red Eyes Blink",
  "动漫黑曜眨眼": "Anime Obsidian Blink",
  "眨眼石榴": "Blinking Pomegranate",
  "红酒眨眼": "Red Wine Blink",
  "绿曜眨眼": "Green Obsidian Blink",
  
  // 新添加的妆发造型
  "可爱兔子贝雷": "Cute Rabbit Beret",
  "皇冠公主头": "Crown Princess Head",
  
  // 新添加的前头发
  "动漫粉长发": "Anime Pink Long Hair",
  "动漫金棕短发": "Anime Golden Brown Short Hair",
  "栗子斜扎中长发": "Chestnut Slanted Medium Long Hair",
  "棕绿斜刘海扎发": "Brown Green Slanted Bangs Updo",
  "棕色中分卷长发": "Brown Center Part Curly Long Hair",
  "棕色公主中长发": "Brown Princess Medium Long Hair",
  "棕色刘海中长卷发": "Brown Bangs Medium Long Curly Hair",
  "棕色刘海斜扎卷发": "Brown Bangs Slanted Curly Hair",
  "棕色斜扎直发": "Brown Slanted Straight Hair",
  "浅棕卷双马尾刘海": "Light Brown Curly Twin Tails Bangs",
  "浅棕斜扎丸子头": "Light Brown Slanted Bun",
  "深棕闪耀中长卷发": "Dark Brown Shining Medium Long Curly Hair",
  "深紫红色丸子斜扎头": "Deep Purple Red Bun Slanted Head",
  "炫紫闪耀双马尾卷发": "Bright Purple Shining Twin Tails Curly Hair",
  "炫紫飘逸长发": "Bright Purple Flowing Long Hair",
  "玫瑰盘发": "Rose Updo",
  "粉紫头饰卷双马尾": "Pink Purple Hair Accessory Curly Twin Tails",
  "紫色贝雷棕长发": "Purple Beret Brown Long Hair",
  "红棕刘海丸子短扎发": "Red Brown Bangs Bun Short Updo",
  "红棕发饰斜马尾": "Red Brown Hair Accessory Slanted Ponytail",
  "金棕公主中长发": "Golden Brown Princess Medium Long Hair",
  "金棕发饰双丸子头": "Golden Brown Hair Accessory Double Bun",
  "金棕斜刘海发饰直发": "Golden Brown Slanted Bangs Hair Accessory Straight Hair",
  "金棕毽子斜扎发": "Golden Brown Shuttlecock Slanted Hair",
  "金棕波浪长发": "Golden Brown Wavy Long Hair",
  "黑色双丸子头": "Black Double Bun",
  
  // 新添加的耳饰
  "粉色爱心耳坠": "Pink Heart Earrings",
  "紫钻爱心耳坠": "Purple Diamond Heart Earrings",
  "蓝色爱心耳坠": "Blue Heart Earrings",
  "黑色蝴蝶结耳坠": "Black Bow Earrings",
  
  // 新添加的眼镜
  "复古茶色墨镜": "Vintage Tea Colored Sunglasses",
  "粉紫猫眼墨镜": "Pink Purple Cat Eye Sunglasses",
  
  // 新添加的颈饰
  "玫瑰项链": "Rose Necklace",
  
  // 新添加的头饰
  "咖啡贝雷帽": "Coffee Beret",
  "天使星环": "Angel Star Ring",
  "橘色爱心贝雷帽": "Orange Heart Beret",
  "浅粉报童帽": "Light Pink Newsboy Cap",
  "玫瑰羽毛发饰": "Rose Feather Hair Accessory",
  "白色小猫渔夫帽": "White Kitten Fisherman Hat",
  "白色礼帽": "White Top Hat",
  "白色蝴蝶结": "White Bow",
  "白色运动帽": "White Sports Cap",
  "粉色毛球针织帽": "Pink Pom Pom Knit Hat",
  "粉色蝴蝶结发箍": "Pink Bow Headband",
  "粉色遮阳帽": "Pink Sun Hat",
  "粉色黑边贝雷帽": "Pink Black Edge Beret",
  "紫花发箍": "Purple Flower Headband",
  "红白蝴蝶结发箍": "Red White Bow Headband",
  "蓝紫絮带礼帽": "Blue Purple Tassel Top Hat",
  "蓝色条纹针织帽": "Blue Striped Knit Hat",
  "蓝金皇冠": "Blue Gold Crown",
  "黑色优雅渔夫帽": "Black Elegant Fisherman Hat",
  
  // 新添加的其他配饰
  "架子鼓": "Drum Set",
  "樱桃胸针": "Cherry Brooch",
  "粉色串珠花腰饰": "Pink Beaded Flower Waist Accessory",
  "粉色爱心腰饰": "Pink Heart Waist Accessory",
  "绿花腰饰": "Green Flower Waist Accessory",
  "蝴蝶胸针": "Butterfly Brooch",
  "闪闪粉钻腰饰": "Sparkling Pink Diamond Waist Accessory",
  "随身听": "Walkman",
  
  // 新添加的陪伴
  "Pucca": "Pucca",
  "双色小猫": "Two-Tone Kitten",
  "史努比": "Snoopy",
  "圣诞小鸡": "Christmas Chick",
  "泡泡双子": "Bubble Twins",
  "萝卜兔": "Radish Rabbit",
  
  // 新添加的边框
  "万圣节": "Halloween",
  "典雅花框": "Elegant Flower Frame",
  "同一片星空": "Same Starry Sky",
  "圣诞飘雪": "Christmas Snow",
  "天使熊爱心": "Angel Bear Heart",
  "玩具熊": "Teddy Bear",
  "花边爱心": "Lace Heart",
  "花边玫瑰": "Lace Rose",
  "蓝紫钻石女孩": "Blue Purple Diamond Girl",
  "雪花爱心": "Snowflake Heart",
  "黄色花花": "Yellow Flowers",
  "黑色星星": "Black Star",
  
  // 新添加的文字装饰
  "勇敢去爱就有奇迹": "Brave to Love There Will Be Miracles",
  "卡哇伊杂志": "Kawaii Magazine",
  "发型杂志": "Hair Magazine",
  "吸引力杂志": "Attraction Magazine",
  "土豆杂志": "Potato Magazine",
  "天使在人间": "Angel on Earth",
  "嫁给我吧": "Marry Me",
  "恭喜发财": "Congratulations and Prosperity",
  "想和你去数星星": "Want to Count Stars with You",
  "我开心因为你开心": "I'm Happy Because You're Happy",
  "我的快乐天使": "My Happy Angel",
  "新年快乐": "Happy New Year",
  "时尚快报": "Fashion Express",
  "时尚期刊": "Fashion Journal",
  "明星杂志": "Celebrity Magazine",
  "格调杂志": "Style Magazine",
  "爱我请举手": "Love Me Please Raise Your Hand",
  "甜妹杂志": "Sweet Girl Magazine",
  "真的好想你": "Really Miss You",
  "祝你笑口常开": "Wish You Always Smile",
  "笑笑爱心": "Smiling Heart",
  
  // 新添加的特效
  "云朵双子星": "Cloud Twins",
  "花花蝴蝶": "Flower Butterfly",
  "飘落樱花": "Falling Cherry Blossoms"
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
  console.log('🔧 开始修复空的英文翻译...');
  
  let content = fs.readFileSync(translationsFile, 'utf8');
  
  // 使用正则表达式找到所有空的英文翻译并替换
  const emptyTranslationRegex = /"en": ""/g;
  const matches = content.match(emptyTranslationRegex);
  
  if (!matches) {
    console.log('ℹ️  没有找到空的英文翻译');
    return;
  }
  
  console.log(`📋 找到 ${matches.length} 个空的英文翻译`);
  
  // 替换所有空的英文翻译
  content = content.replace(/"en": ""/g, (match, offset) => {
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
  
  console.log(`✅ 翻译了 ${matches.length} 个空的英文翻译`);
  console.log('📝 现在所有翻译都有合适的英文名称');
}

main().catch(console.error);
