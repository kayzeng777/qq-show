#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🚀 QQ秀图片处理流程启动...\n');

// 配置
const ASSETS_DIR = path.join(__dirname, '..', 'assets');
const OUTPUT_DIR = path.join(__dirname, '..', 'src', 'data');
const TRANSLATIONS_DIR = path.join(__dirname, '..', 'src', 'utils');

// 分类配置 - 匹配实际的目录结构
const CATEGORIES = {
  'backgrounds': { name: '背景', layer: 0 },
  'background-decor': { name: '背景装饰', layer: 0 },
  'vehicle': { name: '车辆', layer: 0 },
  'back-hair': { name: '后头发', layer: 1 },
  'front-hair': { name: '前头发', layer: 2 },
  'wings': { name: '翅膀', layer: 1 },
  'bottom': { name: '下装', layer: 1 },
  'top': { name: '上装', layer: 1 },
  'outfit': { name: '套装', layer: 1 },
  'makeup': { name: '妆容', layer: 1 },
  'head-set': { name: '妆发造型', layer: 1 },
  'face-decor': { name: '脸饰', layer: 1 },
  'earrings': { name: '耳饰', layer: 1 },
  'glasses': { name: '眼镜', layer: 1 },
  'neckwear': { name: '颈饰', layer: 1 },
  'headwear': { name: '头饰', layer: 1 },
  'other-accessories': { name: '其他配饰', layer: 1 },
  'companion': { name: '陪伴', layer: 1 },
  'frame': { name: '边框', layer: 1 },
  'text': { name: '称号', layer: 1 },
  'sparkle': { name: '特效', layer: 1 }
};

// 预定义翻译映射
const TRANSLATION_MAP = {
  // 背景相关
  '罗兰庄园': 'Roland Manor',
  '罗马阶梯': 'Roman Stairs',
  '兔子闪星': 'Rabbit Sparkles',
  '圣诞树': 'Christmas Tree',
  '彩色游龙': 'Colorful Dragon',
  '彩蛋气球': 'Easter Balloons',
  '我的舞台': 'My Stage',
  '游乐园气球': 'Amusement Park Balloons',
  '炫彩扫描': 'Colorful Scan',
  '爱心气球': 'Heart Balloons',
  '爱心泡泡': 'Heart Bubbles',
  '爱心粉云': 'Pink Heart Cloud',
  '爱心舞台': 'Heart Stage',
  '紫蓝星星': 'Purple Blue Stars',
  '经典气球': 'Classic Balloons',
  '花朵路灯': 'Flower Street Light',
  '草莓爱心': 'Strawberry Heart',
  '落叶飘飘': 'Falling Leaves',
  '蓝色聚光灯': 'Blue Spotlight',
  '飘落玫瑰': 'Falling Roses',
  '魔法封印': 'Magic Seal',
  
  // 车辆
  '卡通自行车': 'Cartoon Bicycle',
  '大众保罗': 'Volkswagen Polo',
  '摩托车': 'Motorcycle',
  '敞篷保时捷': 'Convertible Porsche',
  '敞篷奔驰': 'Convertible Mercedes',
  '敞篷小车': 'Convertible Car',
  '福特GT': 'Ford GT',
  '红色敞篷宝马': 'Red Convertible BMW',
  '红色赛车': 'Red Race Car',
  '蓝色法拉利': 'Blue Ferrari',
  '阿尔法罗密欧': 'Alfa Romeo',
  '黑色林肯': 'Black Lincoln',
  
  // 头发相关
  '亚麻紫中长发': 'Lavender Medium Hair',
  '亚麻绿中短发.': 'Mint Medium Short Hair',
  '亚麻绿中长发': 'Mint Medium Hair',
  '动漫金棕长尾发': 'Anime Golden Brown Hair',
  '头箍白金短发': 'Platinum Short Hair',
  '摇滚棕红中长发': 'Rock Brown Red Medium Hair',
  '栗色中短发': 'Chestnut Medium Short Hair',
  '棕红星星高马尾': 'Brown Red High Ponytail',
  '棕黄丸子卷发': 'Brown Yellow Bun Curls',
  '棕黄栗子头': 'Brown Yellow Chestnut Hair',
  '棕黄齐刘海': 'Brown Yellow Bangs',
  '浅棕中分长发': 'Light Brown Long Hair',
  '浅棕绑带长发': 'Light Brown Tied Long Hair',
  '深棕斜扎卷马尾': 'Dark Brown Side Ponytail',
  '深棕短发': 'Dark Brown Short Hair',
  '深紫色斜马尾长发': 'Deep Purple Side Ponytail',
  '深褐长直发': 'Dark Brown Long Straight',
  '白金中分卷长发': 'Platinum Long Curly Hair',
  '白金卷短发': 'Platinum Curly Short Hair',
  '白金厚刘海短发': 'Platinum Thick Bangs',
  '白金双马尾': 'Platinum Twin Tails',
  '白金蝴蝶结波浪长发.': 'Platinum Bow Wave Long Hair',
  '粉紫长直发': 'Pink Purple Long Straight',
  '蝴蝶结棕色长卷发': 'Bow Brown Long Curls',
  '金色长卷发': 'Golden Long Curls',
  '金色长直发': 'Golden Long Straight',
  '金黄卷长发': 'Golden Yellow Long Curls',
  '金棕波浪蓝发夹长发': 'Golden Brown Wavy Blue Hair Clip Long Hair',
  '黑棕飞机短发': 'Black Brown Mohawk Short Hair',
  
  // 翅膀
  '天使恶魔': 'Angel Demon',
  '小恶魔': 'Little Demon',
  '涅槃火凤凰': 'Phoenix Rebirth',
  '炫紫赛博': 'Cyber Purple',
  '白色天使': 'White Angel',
  '粉色天使': 'Pink Angel',
  '粉色小天使': 'Pink Little Angel',
  '蓝紫蝴蝶': 'Blue Purple Butterfly',
  '金色天使': 'Golden Angel',
  '闪粉蝴蝶': 'Sparkling Pink Butterfly',
  '闪耀紫金': 'Shining Purple Gold',
  
  // 下装
  '卡其工装裤': 'Khaki Cargo Pants',
  '摇滚水洗牛仔裤': 'Rock Washed Jeans',
  '格纹裤': 'Plaid Pants',
  '浅橙短裙内搭牛仔裤': 'Light Orange Skirt with Jeans',
  '深色牛仔裤': 'Dark Jeans',
  '粉色活力短裙': 'Pink Energetic Skirt',
  '粉色短裙皮靴': 'Pink Skirt with Boots',
  '紫兰牛仔阔腿裤': 'Purple Blue Wide Jeans',
  '经典牛仔短裤': 'Classic Denim Shorts',
  '经典牛仔裤帆布鞋': 'Classic Jeans with Sneakers',
  '美式复古黑色短裙': 'American Retro Black Skirt',
  '褐色工装裤': 'Brown Cargo Pants',
  '西部短裙牛仔靴': 'Western Skirt with Boots',
  '黑色短裙白靴': 'Black Skirt with White Boots',
  
  // 上装
  '咖啡夹克': 'Coffee Jacket',
  '学生白衫': 'Student White Shirt',
  '工装夹克叠穿': 'Work Jacket Layered',
  '摇滚皮衣': 'Rock Leather Jacket',
  '斜肩玫瑰长袖': 'Off-Shoulder Rose Long Sleeve',
  '条纹长袖': 'Striped Long Sleeve',
  '橙色恤衫叠背心': 'Orange Shirt Layered Vest',
  '橙色背心白套衫gif': 'Orange Vest White Sweater',
  '白色休闲西装': 'White Casual Suit',
  '绑带白色背心': 'Tied White Vest',
  '美式长袖套衫': 'American Long Sleeve Sweater',
  '霹雳运动开襟': 'Lightning Sports Cardigan',
  '黑灰套衫': 'Black Gray Sweater',
  
  // 套装
  '乐队键盘套装': 'Band Keyboard Set',
  '休闲白衬衫卡其裤': 'Casual White Shirt Khaki Pants',
  '冬日深蓝外套套装': 'Winter Dark Blue Jacket Set',
  '卡其咖啡休闲套装': 'Khaki Coffee Casual Set',
  '卡其羽绒套装': 'Khaki Down Set',
  '可爱粉色外套套装': 'Cute Pink Jacket Set',
  '嘻哈套衫叠穿套装': 'Hip Hop Sweater Layered Set',
  '嘻哈青蓝紫套装': 'Hip Hop Cyan Blue Purple Set',
  '围巾黑外套绿包套装': 'Scarf Black Jacket Green Bag Set',
  '夏日彩色活力套装': 'Summer Colorful Energetic Set',
  '多彩开衫裙装': 'Colorful Cardigan Dress',
  '天蓝羽绒服套装': 'Sky Blue Down Jacket Set',
  '天蓝背心波点裙套装': 'Sky Blue Vest Polka Dot Set',
  '天蓝背心白裙套装': 'Sky Blue Vest White Skirt Set',
  '宫廷礼裙套装': 'Court Formal Dress Set',
  '摇滚西装套装': 'Rock Suit Set',
  '月亮礼裙套装': 'Moon Formal Dress Set',
  '条纹休闲套装': 'Striped Casual Set',
  '条纹波点多彩套装': 'Striped Polka Dot Colorful Set',
  '格纹衫棕黄套装': 'Plaid Shirt Brown Yellow Set',
  '棕外套黄毛衣套装': 'Brown Jacket Yellow Sweater Set',
  '橙色坐姿套装': 'Orange Sitting Pose Set',
  '橙色外套格裙套装': 'Orange Jacket Plaid Skirt Set',
  '橙色花边礼裙': 'Orange Lace Formal Dress',
  '活力波点粉色套装': 'Energetic Polka Dot Pink Set',
  '浅蓝棒球运动套装': 'Light Blue Baseball Sports Set',
  '深蓝一字肩连衣裙': 'Dark Blue Off-Shoulder Dress',
  '爱心一字肩套装': 'Heart Off-Shoulder Outfit',
  '猫咪粉裙套装': 'Cat Pink Skirt Set',
  '白色T恤休闲套装': 'White T-Shirt Casual Set',
  '白色抹胸长裤套装': 'White Bustier Pants Set',
  '白色碎花吊带牛仔套装': 'White Floral Denim Set',
  '白色礼裙套装': 'White Formal Dress Set',
  '粉紫羽绒背心套装': 'Pink Purple Down Vest Set',
  '粉美人鱼魔杖套装': 'Pink Mermaid Wand Set',
  '粉色公主礼服套装': 'Pink Princess Gown Set',
  '粉色冬日圣诞套装': 'Pink Winter Christmas Set',
  '粉色短连衣裙套装': 'Pink Short Dress Set',
  '粉色背心白裙套装': 'Pink Vest White Skirt Set',
  '粉蓝翅膀套装': 'Pink Blue Wings Set',
  '粉靴套装': 'Pink Boots Set',
  '粉黑裙皮靴套装': 'Pink Black Skirt Boots Set',
  '紫罗兰白色礼裙套装': 'Violet White Formal Dress Set',
  '紫色围巾偶像套装': 'Purple Scarf Idol Set',
  '紫色礼裙花束套装': 'Purple Formal Dress Bouquet Set',
  '紫色背心恤衫套装': 'Purple Vest Shirt Set',
  '紫色魔法裙套装': 'Purple Magic Skirt Set',
  '紫色魔法骑士套装': 'Purple Magic Knight Set',
  '红色玫瑰礼裙套装': 'Red Rose Formal Dress Set',
  '绿短外套牛仔休闲': 'Green Short Jacket Denim Casual',
  '绿色T恤白裤套装': 'Green T-Shirt White Pants Set',
  '绿色仙子玩具熊套装': 'Green Fairy Teddy Bear Set',
  '缎面背心喇叭裤': 'Satin Vest Bell Bottoms',
  '舞池红色套装': 'Dance Floor Red Set',
  '英伦双排扣卡其套装': 'British Double Breasted Khaki Set',
  '蓝灰色休闲围巾套装': 'Blue Gray Casual Scarf Set',
  '蓝白街头套装': 'Blue White Street Set',
  '蓝色嘻哈套装': 'Blue Hip Hop Set',
  '蓝色套衫白袍套装': 'Blue Sweater White Robe Set',
  '蓝色街头休闲套装': 'Blue Street Casual Set',
  '蓝色运动17号套装': 'Blue Sports #17 Set',
  '蓝色连帽套装': 'Blue Hooded Set',
  '街头橙色背心套装': 'Street Orange Vest Set',
  '街头滑板套装': 'Street Skateboard Set',
  '街头黄色T恤套装': 'Street Yellow T-Shirt Set',
  '街舞黑色背心套装': 'Hip Hop Black Vest Set',
  '西装行走套装': 'Suit Walking Set',
  '西部红靴花裙套装': 'Western Red Boots Flower Skirt Set',
  '连帽运动背心套装': 'Hooded Sports Vest Set',
  '雅痞叠穿套装': 'Hipster Layered Set',
  '雅痞棕红套衫装': 'Hipster Brown Red Sweater Set',
  '魔法毛领西装': 'Magic Fur Collar Suit',
  '黄色套衫牛仔街头': 'Yellow Sweater Denim Street',
  '黄色抹胸牛仔裤套装': 'Yellow Bustier Jeans Set',
  '黄色滑轮套装': 'Yellow Roller Skates Set',
  '黄色猫咪套衫套装': 'Yellow Cat Sweater Set',
  '黑白学院套装': 'Black White School Set',
  '黑白条纹牛仔套装': 'Black White Striped Denim Set',
  '黑白纹短裙单肩包套装': 'Black White Patterned Short Skirt Shoulder Bag Set',
  '黑色西装套装': 'Black Suit Set',
  
  // 妆容
  '冰紫': 'Ice Purple',
  '剧院魅影灰': 'Phantom of the Opera Gray',
  '剧院魅影紫': 'Phantom of the Opera Purple',
  '卡布奇诺': 'Cappuccino',
  '挤眉弄眼': 'Winking',
  '春日': 'Spring Day',
  '晴夜': 'Clear Night',
  '曜黑眨眼': 'Shining Black Wink',
  '桃子汽水': 'Peach Soda',
  '梅子酒': 'Plum Wine',
  '森林': 'Forest',
  '樱花': 'Cherry Blossom',
  '活力街头': 'Energetic Street',
  '海洋蓝': 'Ocean Blue',
  '海蓝': 'Ocean Blue',
  '湖蓝': 'Lake Blue',
  '湖蓝微笑': 'Lake Blue Smile',
  '牛仔蓝': 'Denim Blue',
  '玉石绿': 'Jade Green',
  '琥珀': 'Amber',
  '眼泪汪汪': 'Tearful',
  '紫曜': 'Purple Shine',
  '紫曜眨眼': 'Purple Shine Wink',
  '罗兰': 'Violet',
  '薰衣草': 'Lavender',
  '迷棕': 'Mysterious Brown',
  '锐舞派对': 'Rave Party',
  '魔法紫': 'Magic Purple',
  '魔法绿': 'Magic Green',
  '黑曜': 'Obsidian',
  
  // 妆发造型
  '亚麻粉': 'Linen Pink',
  '亚麻紫编发': 'Linen Purple Braids',
  '动漫紫编发': 'Anime Purple Braids',
  '古风': 'Ancient Style',
  '墨镜栗子头': 'Sunglasses Chestnut Hair',
  '浅棕斜马尾': 'Light Brown Side Ponytail',
  '深棕': 'Dark Brown',
  '牛仔很忙': 'Busy Cowboy',
  '白金编发': 'Platinum Braids',
  '红棕栗子': 'Red Brown Chestnut',
  '金棕双马尾': 'Golden Brown Twin Tails',
  
  // 前头发
  '亚麻紫卷马尾': 'Lavender Curly Ponytail',
  '亚麻绿中短发': 'Mint Medium Short Hair',
  '亚麻绿短发': 'Mint Short Hair',
  '亚麻绿长发': 'Mint Long Hair',
  '墨镜电力紫短发': 'Electric Purple Short Hair',
  '头巾棕橙色斜马尾': 'Orange Brown Side Ponytail',
  '头花金色扎发': 'Golden Flower Hair',
  '帽子棕红编发马尾': 'Brown Red Braided Ponytail',
  '摇滚蓝紫短发': 'Rock Blue Purple Short Hair',
  '栗子棕短发': 'Chestnut Brown Short Hair',
  '棕橙长编发': 'Orange Brown Long Braids',
  '棕色斜扎卷马尾': 'Brown Side Curly Ponytail',
  '棕色斜扎发': 'Brown Side Hair',
  '棕色星星斜扎发': 'Brown Star Side Hair',
  '棕色栗子头': 'Brown Chestnut Hair',
  '棕褐扎发': 'Brown Hair Tie',
  '棕黄斜扎马尾': 'Brown Yellow Side Ponytail',
  '泡泡深棕双卷扎发': 'Bubble Dark Brown Double Curls',
  '活力红棕斜扎卷发': 'Energetic Red Brown Side Curls',
  '活力金棕短发': 'Energetic Golden Brown Short Hair',
  '深蓝帽棕短发': 'Dark Blue Cap Brown Short Hair',
  '电力橙双马尾': 'Electric Orange Twin Tails',
  '白金短发': 'Platinum Short Hair',
  '白金蝴蝶结波浪长发': 'Platinum Bow Wave Long Hair',
  '粉橙卷发': 'Pink Orange Curls',
  '粉紫双马尾': 'Pink Purple Twin Tails',
  '粉紫斜扎高马尾': 'Pink Purple High Side Ponytail',
  '粉色高马尾': 'Pink High Ponytail',
  '红棕丸子头': 'Red Brown Bun',
  '红棕公主卷发': 'Red Brown Princess Curls',
  '红棕卷双马尾': 'Red Brown Curly Twin Tails',
  '红棕斜扎长发': 'Red Brown Side Long Hair',
  '红色公主卷发': 'Red Princess Curls',
  '运动深棕短发': 'Sports Dark Brown Short Hair',
  '运动粉紫短发': 'Sports Pink Purple Short Hair',
  '连帽金色卷长发': 'Hooded Golden Long Curls',
  '酒棕色丸子头': 'Wine Brown Bun',
  '酒红双马尾': 'Wine Red Twin Tails',
  '金色中短发': 'Golden Medium Short Hair',
  '金色波浪扎发': 'Golden Wave Hair',
  '金黄斜扎卷长发': 'Golden Yellow Side Long Curls',
  '银灰短发': 'Silver Gray Short Hair',
  
  // 脸饰
  '嘴边玫瑰': 'Rose by Mouth',
  '月亮额头坠饰': 'Moon Forehead Pendant',
  '烟': 'Smoke',
  '粉色爱心': 'Pink Heart',
  '粉色面纱': 'Pink Veil',
  '粉蓝创可贴': 'Pink Blue Band-Aid',
  '蓝色闪钻脸饰': 'Blue Sparkling Face Decor',
  '钻石额头坠饰': 'Diamond Forehead Pendant',
  
  // 耳饰
  '派对紫色耳饰': 'Party Purple Earrings',
  '粉宝石耳坠': 'Pink Gem Earrings',
  '粉紫爱心耳钉': 'Pink Purple Heart Studs',
  '粉色十字星耳钉': 'Pink Cross Star Studs',
  '红色圆圈耳饰': 'Red Circle Earrings',
  '蓝钻耳饰': 'Blue Diamond Earrings',
  '金色月亮耳坠': 'Golden Moon Earrings',
  '金色粉爱心耳坠': 'Golden Pink Heart Earrings',
  '金色耳环': 'Golden Earrings',
  '金色黑钻耳坠': 'Golden Black Diamond Earrings',
  '银色耳饰': 'Silver Earrings',
  
  // 眼镜
  '假面舞会': 'Masquerade',
  '前卫摇滚': 'Avant-garde Rock',
  '圆形半框眼镜': 'Round Half-Frame Glasses',
  '炫彩墨镜': 'Colorful Sunglasses',
  '炫舞墨镜': 'Dance Sunglasses',
  '经典墨镜': 'Classic Sunglasses',
  '落日墨镜': 'Sunset Sunglasses',
  
  // 颈饰
  '星球项链': 'Planet Necklace',
  '星空颈饰': 'Starry Sky Necklace',
  '暖橙围巾': 'Warm Orange Scarf',
  '柳丁花颈饰': 'Studded Flower Necklace',
  '樱桃颈饰': 'Cherry Necklace',
  '白色针织围巾': 'White Knit Scarf',
  '粉心水晶': 'Pink Heart Crystal',
  '粉灰灯芯绒围巾': 'Pink Gray Corduroy Scarf',
  '粉白条纹围巾': 'Pink White Striped Scarf',
  '粉色羽毛围巾': 'Pink Feather Scarf',
  '红宝石心': 'Ruby Heart',
  '红色华丽颈饰': 'Red Luxurious Necklace',
  '经典红色围巾': 'Classic Red Scarf',
  '羊毛围巾': 'Wool Scarf',
  '蓝紫玫瑰颈饰': 'Blue Purple Rose Necklace',
  '蓝色十字架项链': 'Blue Cross Necklace',
  '蓝色妖姬项链': 'Blue Enchantress Necklace',
  '蓝钻项链': 'Blue Diamond Necklace',
  '金属吊牌项链': 'Metal Tag Necklace',
  '金属花项链': 'Metal Flower Necklace',
  '银色星星项链': 'Silver Star Necklace',
  '闪钻项链': 'Sparkling Diamond Necklace',
  '随身听': 'Walkman',
  '黄色流星项链': 'Yellow Meteor Necklace',
  '黑色十字架项链': 'Black Cross Necklace',
  
  // 头饰
  '兔子运动': 'Rabbit Sports',
  '公主皇冠': 'Princess Crown',
  '冰晶': 'Ice Crystal',
  '墨镜': 'Sunglasses',
  '复古美式头箍': 'Vintage American Headband',
  '夏威夷': 'Hawaiian',
  '摇滚粉墨镜': 'Rock Pink Sunglasses',
  '摇滚贝雷': 'Rock Beret',
  '春日踏青': 'Spring Outing',
  '晴空画家帽': 'Clear Sky Painter Hat',
  '毛线帽': 'Wool Hat',
  '波点美式头箍': 'Polka Dot American Headband',
  '浅粉贝雷': 'Light Pink Beret',
  '浅蓝头巾': 'Light Blue Headscarf',
  '浅蓝运动帽': 'Light Blue Sports Cap',
  '海军贝雷': 'Navy Beret',
  '海盗头巾': 'Pirate Headscarf',
  '炫粉墨镜': 'Glitter Pink Sunglasses',
  '炫蓝墨镜': 'Glitter Blue Sunglasses',
  '王冠': 'Crown',
  '白色棒球': 'White Baseball',
  '粉紫贝雷': 'Pink Purple Beret',
  '粉色头纱': 'Pink Veil',
  '粉色画家': 'Pink Painter',
  '粉色运动': 'Pink Sports',
  '粉色针织帽': 'Pink Knit Hat',
  '紫色棒球帽': 'Purple Baseball Cap',
  '红紫运动帽': 'Red Purple Sports Cap',
  '红色蝴蝶结小夹': 'Red Bow Clip',
  '红色针织头巾': 'Red Knit Headscarf',
  '绿色头箍': 'Green Headband',
  '菊黄满天星花环': 'Chrysanthemum Yellow Baby\'s Breath Wreath',
  '蓝色机车镜': 'Blue Motorcycle Glasses',
  '蝙蝠镜': 'Bat Glasses',
  '街头报童帽': 'Street Newsboy Cap',
  '闪钻': 'Sparkling Diamond',
  '青蓝贝雷帽': 'Cyan Blue Beret',
  '黄色贝雷': 'Yellow Beret',
  '黄色邮差': 'Yellow Postman',
  
  // 其他配饰
  '喷泉': 'Fountain',
  '复古美式邮差包': 'Vintage American Messenger Bag',
  '小院花盆': 'Courtyard Flower Pot',
  '巧克力爱心棒': 'Chocolate Heart Stick',
  '摇滚吉他': 'Rock Guitar',
  '柳丁皮带': 'Studded Belt',
  '粉玫瑰花束': 'Pink Rose Bouquet',
  '粉色迷你包': 'Pink Mini Bag',
  '粉色邮差包': 'Pink Messenger Bag',
  '紫色晶体': 'Purple Crystal',
  '红色异形装置': 'Red Alien Device',
  '绿色弓箭': 'Green Bow and Arrow',
  '运动包': 'Sports Bag',
  '郁金香': 'Tulip',
  '金色异性装置': 'Golden Alien Device',
  '金色弓箭': 'Golden Bow and Arrow',
  '麦克风': 'Microphone',
  '黄色水晶': 'Yellow Crystal',
  
  // 陪伴
  '云朵钓鱼狗': 'Cloud Fishing Dog',
  '仙子': 'Fairy',
  '凯蒂猫': 'Hello Kitty',
  '圣诞驯鹿': 'Christmas Reindeer',
  '天使': 'Angel',
  '小浣熊': 'Little Raccoon',
  '小熊魔法精灵': 'Bear Magic Elf',
  '德牧犬': 'German Shepherd',
  '比格犬': 'Beagle',
  '流氓兔': 'Rogue Rabbit',
  '白色睡觉小狗': 'White Sleeping Puppy',
  '米格鲁': 'Mickey',
  '粉色漂浮猫咪': 'Pink Floating Cat',
  '糯米团子': 'Glutinous Rice Ball',
  '蝴蝶': 'Butterfly',
  '蝴蝶结玩具熊': 'Bow Teddy Bear',
  '跳舞猫咪': 'Dancing Cat',
  '雪人': 'Snowman',
  
  // 边框
  '双色花朵': 'Two-Tone Flowers',
  '小狗家园': 'Puppy Home',
  '爱心帘子': 'Heart Curtain',
  '玫瑰藤蔓': 'Rose Vine',
  '电音舞台': 'Electronic Music Stage',
  '礼花相框': 'Firework Frame',
  '红色窗帘': 'Red Curtain',
  '蓝色十字花': 'Blue Cross Flower',
  '一切很美': 'Everything is Beautiful',
  '与你相遇': 'Meeting You',
  '你快乐所以我快乐': 'You Happy So I Happy',
  '你的温柔': 'Your Gentleness',
  '动漫少年': 'Anime Boy',
  '娱乐周刊': 'Entertainment Weekly',
  '寒气': 'Cold Air',
  '小熊错爱': 'Bear Wrong Love',
  '思念你': 'Missing You',
  '我的唯一': 'My Only One',
  '摩登生活': 'Modern Life',
  '时尚制造': 'Fashion Manufacturing',
  '时尚艾娃': 'Fashion Eva',
  '有你就够': 'Having You is Enough',
  '浪漫情怀': 'Romantic Feelings',
  '神奇的爱': 'Magical Love',
  '融化你的爱': 'Melting Your Love',
  '闪亮音符': 'Shining Notes',
  '需要勇气': 'Need Courage',
  '十二芒星': 'Twelve-Pointed Star',
  '彩色舞台聚光灯': 'Colorful Stage Spotlight',
  '星星闪光': 'Star Flash',
  '星闪闪': 'Shining Stars',
  '秋日枫叶': 'Autumn Maple Leaves',
  '蓝色流星': 'Blue Meteor'
};

// 生成唯一ID
function generateId(name, category) {
  const cleanName = name.replace(/[^\u4e00-\u9fff\w]/g, '');
  return `${category}_${cleanName}`;
}

// 生成英文翻译
function generateTranslation(chineseName) {
  return TRANSLATION_MAP[chineseName] || chineseName;
}

// 扫描目录获取所有图片
function scanDirectory(dirPath) {
  if (!fs.existsSync(dirPath)) {
    return [];
  }
  
  const files = fs.readdirSync(dirPath);
  return files.filter(file => 
    file.toLowerCase().endsWith('.gif') || 
    file.toLowerCase().endsWith('.png') || 
    file.toLowerCase().endsWith('.jpg') || 
    file.toLowerCase().endsWith('.jpeg')
  );
}

// 处理单个分类
function processCategory(categoryId, categoryInfo) {
  const categoryDir = path.join(ASSETS_DIR, categoryId);
  const files = scanDirectory(categoryDir);
  
  if (files.length === 0) {
    console.log(`⚠️  分类 ${categoryId} 没有找到图片文件`);
    return null;
  }
  
  const items = files.map(file => {
    const name = path.parse(file).name; // 去掉扩展名
    const id = generateId(name, categoryId);
    
    return {
      id,
      name,
      thumbnail: `/assets/${categoryId}/${file}`,
      image: `/assets/${categoryId}/${file}`,
      category: categoryId,
      layer: categoryInfo.layer
    };
  });
  
  // 按名称排序，"无"选项排在最前面
  items.sort((a, b) => {
    if (a.name === '无') return -1;
    if (b.name === '无') return 1;
    return a.name.localeCompare(b.name, 'zh-CN');
  });
  
  return {
    id: categoryId,
    name: categoryInfo.name,
    thumbnail: items[0]?.thumbnail || '',
    layer: categoryInfo.layer,
    items
  };
}

// 生成分类数据
function generateCategories() {
  console.log('📁 扫描图片文件...');
  
  const categories = [];
  let totalItems = 0;
  
  for (const [categoryId, categoryInfo] of Object.entries(CATEGORIES)) {
    const category = processCategory(categoryId, categoryInfo);
    if (category) {
      categories.push(category);
      totalItems += category.items.length;
      console.log(`✅ ${categoryInfo.name}: ${category.items.length} 个物品`);
    }
  }
  
  console.log(`\n📊 总计: ${categories.length} 个分类, ${totalItems} 个物品\n`);
  
  return categories;
}

// 生成翻译数据
function generateTranslations(categories) {
  console.log('🌐 生成翻译数据...');
  
  const translations = {};
  
  categories.forEach(category => {
    category.items.forEach(item => {
      // 跳过default项目，因为"无"项目已经包含了default的翻译
      if (item.name === 'default') {
        return;
      }
      
      translations[item.name] = {
        zh: item.name,
        en: generateTranslation(item.name)
      };
    });
  });
  
  console.log(`✅ 生成了 ${Object.keys(translations).length} 个翻译\n`);
  
  return translations;
}

// 保存分类数据
function saveCategories(categories) {
  const content = `// 自动生成的全量分类数据
export const categories = ${JSON.stringify(categories, null, 2)} as const;
`;
  
  const filePath = path.join(OUTPUT_DIR, 'categories.ts');
  fs.writeFileSync(filePath, content);
  console.log(`✅ 已保存分类数据: ${filePath}`);
}

// 保存翻译数据
function saveTranslations(translations) {
  const content = `// 自动生成的翻译数据
import type { Language } from "../contexts/LanguageContext";

export const itemNameTranslations: Record<string, Record<Language, string>> = ${JSON.stringify(translations, null, 2)};

export const translateItemName = (name: string, language: Language): string => {
  return itemNameTranslations[name]?.[language] || name;
};
`;
  
  const filePath = path.join(TRANSLATIONS_DIR, 'translations.ts');
  fs.writeFileSync(filePath, content);
  console.log(`✅ 已保存翻译数据: ${filePath}`);
}

// 主函数
function main() {
  try {
    // 1. 生成分类数据
    const categories = generateCategories();
    
    // 2. 生成翻译数据
    const translations = generateTranslations(categories);
    
    // 3. 保存数据
    saveCategories(categories);
    saveTranslations(translations);
    
    console.log('🎉 图片处理完成!');
    console.log('\n📋 处理结果:');
    console.log(`- 分类数量: ${categories.length}`);
    console.log(`- 物品总数: ${Object.keys(translations).length}`);
    console.log(`- 翻译数量: ${Object.keys(translations).length}`);
    
    console.log('\n🔧 下一步:');
    console.log('1. 检查生成的数据文件');
    console.log('2. 如有需要，手动调整翻译');
    console.log('3. 测试应用程序');
    
  } catch (error) {
    console.error('❌ 处理过程中出现错误:', error.message);
    process.exit(1);
  }
}

// 运行主函数
main();
