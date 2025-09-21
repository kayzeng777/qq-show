#!/usr/bin/env node

/**
 * 背景图片处理脚本
 * 用于批量处理背景图片，生成对应的数据文件
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 资源根目录
const ASSETS_DIR = path.join(__dirname, '../public/assets');
// 背景图片目录
const BACKGROUNDS_DIR = path.join(ASSETS_DIR, 'backgrounds');

// 其它分类目录与顺序（从后到前越大越靠前）
const CATEGORY_CONFIG = [
  { id: 'background', name: '背景', dir: 'backgrounds', layer: 0 },
  { id: 'backgroundDecor', name: '背景装饰', dir: 'background-decor', layer: 1 },
  { id: 'vehicle', name: '车', dir: 'vehicle', layer: 2 },
  { id: 'wings', name: '翅膀', dir: 'wings', layer: 3 },
  { id: 'hair', name: '发型', dir: 'hair', layer: 4, isCombined: true },
  { id: 'bottom', name: '下装', dir: 'bottom', layer: 5 },
  { id: 'top', name: '上装', dir: 'top', layer: 6 },
  { id: 'outfit', name: '套装', dir: 'outfit', layer: 7 },
  { id: 'fullFace', name: '妆容', dir: 'full-face', layer: 8 },
  { id: 'fullHead', name: '妆发造型', dir: 'full-head', layer: 9 },
  { id: 'faceDecor', name: '脸饰', dir: 'face-decor', layer: 10 },
  { id: 'earrings', name: '耳饰', dir: 'earrings', layer: 11 },
  { id: 'glasses', name: '眼镜墨镜', dir: 'glasses', layer: 12 },
  { id: 'necklace', name: '颈饰', dir: 'necklace', layer: 13 },
  { id: 'headwear', name: '头饰', dir: 'headwear', layer: 14 },
  { id: 'otherAccessories', name: '其他配饰', dir: 'other-accessories', layer: 15 },
  { id: 'companion', name: '陪伴', dir: 'companion', layer: 16 },
  { id: 'frame', name: '边框', dir: 'frame', layer: 17 },
  { id: 'textDecor', name: '装饰字', dir: 'text', layer: 18 },
  { id: 'sparkle', name: '闪闪', dir: 'sparkle', layer: 19 },
];

// 生成背景数据的函数
function generateBackgroundData() {
  try {
    // 检查目录是否存在
    if (!fs.existsSync(BACKGROUNDS_DIR)) {
      console.log('创建背景图片目录...');
      fs.mkdirSync(BACKGROUNDS_DIR, { recursive: true });
    }

    // 读取目录中的文件
    const files = fs.readdirSync(BACKGROUNDS_DIR);
    const imageFiles = files.filter(file => 
      /\.(gif|png|jpg|jpeg)$/i.test(file)
    );

    console.log(`找到 ${imageFiles.length} 个背景图片文件:`);
    imageFiles.forEach((file, index) => {
      console.log(`${index + 1}. ${file}`);
    });

    // 生成背景数据
    const backgrounds = imageFiles.map((file, index) => {
      const name = file.replace(/\.[^/.]+$/, ""); // 移除扩展名
      return {
        id: `bg_${String(index + 1).padStart(3, '0')}`,
        name: name,
        filename: file,
        description: `背景图片 ${index + 1}`,
        category: 'background'
      };
    });

    // 生成TypeScript数据文件
    const tsContent = `// 自动生成的背景数据
export const backgroundItems = ${JSON.stringify(backgrounds, null, 2)};

export const backgroundCategories = [
  {
    id: 'background',
    name: '背景',
    thumbnail: '/assets/backgrounds/background_001.gif', // 默认缩略图
    layer: 0,
    items: backgroundItems.map(item => ({
      id: item.id,
      name: item.name,
      thumbnail: \`/assets/backgrounds/\${item.filename}\`,
      image: \`/assets/backgrounds/\${item.filename}\`,
      category: 'background',
      layer: 0,
    }))
  }
];
`;

    // 写入数据文件
    const outputPath = path.join(__dirname, '../src/data/backgrounds.ts');
    const outputDir = path.dirname(outputPath);
    
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    fs.writeFileSync(outputPath, tsContent);
    console.log(`\n背景数据已生成: ${outputPath}`);
    console.log(`\n请将你的背景图片文件复制到: ${BACKGROUNDS_DIR}`);
    console.log('\n建议的文件命名格式:');
    console.log('- background_001.gif');
    console.log('- background_002.gif');
    console.log('- ...');
    
  } catch (error) {
    console.error('处理背景图片时出错:', error);
  }
}

// 检查重复文件的函数
function checkDuplicates() {
  try {
    const files = fs.readdirSync(BACKGROUNDS_DIR);
    const imageFiles = files.filter(file => 
      /\.(gif|png|jpg|jpeg)$/i.test(file)
    );

    console.log('\n检查重复文件...');
    
    // 这里可以添加更复杂的重复检查逻辑
    // 比如文件大小比较、内容哈希等
    const fileSizes = {};
    const duplicates = [];

    imageFiles.forEach(file => {
      const filePath = path.join(BACKGROUNDS_DIR, file);
      const stats = fs.statSync(filePath);
      const size = stats.size;
      
      if (fileSizes[size]) {
        duplicates.push({
          size: size,
          files: [fileSizes[size], file]
        });
      } else {
        fileSizes[size] = file;
      }
    });

    if (duplicates.length > 0) {
      console.log('\n发现可能重复的文件:');
      duplicates.forEach(dup => {
        console.log(`大小 ${dup.size} bytes: ${dup.files.join(', ')}`);
      });
    } else {
      console.log('未发现重复文件');
    }

  } catch (error) {
    console.error('检查重复文件时出错:', error);
  }
}

// 扫描所有分类并生成统一数据文件
function generateAllCategories() {
  console.log('\n扫描所有分类并生成数据...');
  const categories = [];
  const defaults = {};

  CATEGORY_CONFIG.forEach((cfg) => {
    if (cfg.isCombined && cfg.id === 'hair') {
      // 处理发型组合逻辑 - 基于文件名自动配对
      const frontHairDir = path.join(ASSETS_DIR, 'front-hair');
      const backHairDir = path.join(ASSETS_DIR, 'back-hair');
      
      if (!fs.existsSync(frontHairDir)) return;
      
      const frontHairFiles = fs.existsSync(frontHairDir) ? 
        fs.readdirSync(frontHairDir).filter((f) => /\.(gif|png|jpg|jpeg)$/i.test(f)) : [];
      const backHairFiles = fs.existsSync(backHairDir) ? 
        fs.readdirSync(backHairDir).filter((f) => /\.(gif|png|jpg|jpeg)$/i.test(f)) : [];
      
      const hairItems = [];
      let index = 1;
      const usedBackFiles = new Set();
      
      // 处理前头发文件，自动查找匹配的后头发
      frontHairFiles.forEach((frontFile) => {
        const frontName = path.parse(frontFile).name;
        
        // 查找匹配的后头发文件（基于相同的文件名）
        const matchingBackFile = backHairFiles.find(backFile => {
          const backName = path.parse(backFile).name;
          // 检查文件名是否相同（去掉扩展名）
          return backName === frontName;
        });
        
        const hairItem = {
          id: `hair_${String(index).padStart(3, '0')}`,
          name: frontName,
          thumbnail: `/assets/front-hair/${frontFile}`,
          image: `/assets/front-hair/${frontFile}`,
          category: 'hair',
          layer: cfg.layer,
          frontHair: {
            id: `frontHair_${String(index).padStart(3, '0')}`,
            name: frontName,
            image: `/assets/front-hair/${frontFile}`,
            category: 'frontHair',
            layer: 10, // 前头发层级
          },
          backHair: matchingBackFile ? {
            id: `backHair_${String(index).padStart(3, '0')}`,
            name: path.parse(matchingBackFile).name,
            image: `/assets/back-hair/${matchingBackFile}`,
            category: 'backHair',
            layer: 5, // 后头发层级
          } : null,
        };
        
        hairItems.push(hairItem);
        if (matchingBackFile) {
          usedBackFiles.add(matchingBackFile);
        }
        index++;
      });
      
      categories.push({ 
        id: cfg.id, 
        name: cfg.name, 
        thumbnail: hairItems[0]?.thumbnail || '', 
        layer: cfg.layer, 
        items: hairItems 
      });
    } else {
      // 处理普通分类
      const dir = path.join(ASSETS_DIR, cfg.dir);
      if (!fs.existsSync(dir)) return;
      const files = fs.readdirSync(dir).filter((f) => /\.(gif|png|jpg|jpeg)$/i.test(f)).sort((a, b) => {
        // 按照拼音首字母A-Z顺序排序
        return a.localeCompare(b, 'zh-CN', { numeric: true });
      });
      const items = files.map((file, index) => ({
        id: `${cfg.id}_${String(index + 1).padStart(3, '0')}`,
        name: path.parse(file).name,
        thumbnail: `/assets/${cfg.dir}/${file}`,
        image: `/assets/${cfg.dir}/${file}`,
        category: cfg.id,
        layer: cfg.layer,
      }));
      categories.push({ id: cfg.id, name: cfg.name, thumbnail: items[0]?.thumbnail || '', layer: cfg.layer, items });
    }

    // 扫描默认图（public/assets/default/）
    const defDir = path.join(ASSETS_DIR, 'default');
    if (fs.existsSync(defDir)) {
      const defFiles = fs.readdirSync(defDir).filter((f) => /\.(gif|png|jpg|jpeg)$/i.test(f));
      
      // 特殊处理发型分类的默认图
      if (cfg.id === 'hair') {
        // 为发型分类添加默认的前头发和后头发
        const frontHairDefault = defFiles.find(f => f.includes('front-hair'));
        const backHairDefault = defFiles.find(f => f.includes('back-hair'));
        
        if (frontHairDefault) {
          defaults['frontHair'] = {
            id: 'default_frontHair',
            name: '默认前头发',
            thumbnail: `/assets/default/${frontHairDefault}`,
            image: `/assets/default/${frontHairDefault}`,
            category: 'frontHair',
            layer: 10, // 前头发层级
          };
        }
        
        if (backHairDefault) {
          defaults['backHair'] = {
            id: 'default_backHair',
            name: '默认后头发',
            thumbnail: `/assets/default/${backHairDefault}`,
            image: `/assets/default/${backHairDefault}`,
            category: 'backHair',
            layer: 5, // 后头发层级
          };
        }
      } else {
        // 普通分类的默认图处理
        const matchingFile = defFiles.find(file => {
          const fileName = file.toLowerCase();
          const categoryName = cfg.dir.toLowerCase();
          return fileName.includes(categoryName) || fileName.includes(cfg.id.toLowerCase());
        });
        
        if (matchingFile) {
          defaults[cfg.id] = {
            id: `default_${cfg.id}`,
            name: `默认${cfg.name}`,
            thumbnail: `/assets/default/${matchingFile}`,
            image: `/assets/default/${matchingFile}`,
            category: cfg.id,
            layer: cfg.layer,
          };
        }
      }
    }
  });

  const ts = `// 自动生成的全量分类数据\nexport const categories = ${JSON.stringify(categories, null, 2)} as const;\n`;
  const out = path.join(__dirname, '../src/data/categories.ts');
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, ts);
  console.log(`生成分类数据: ${out}`);

  const tsDef = `// 自动生成的各分类默认素材（当未选择该类物件时展示）\nexport const defaults = ${JSON.stringify(defaults, null, 2)} as const;\n`;
  const outDef = path.join(__dirname, '../src/data/defaults.ts');
  fs.writeFileSync(outDef, tsDef);
  console.log(`生成默认映射: ${outDef}`);
}

// 主函数
function main() {
  console.log('QQ秀背景图片处理工具');
  console.log('====================');
  
  generateBackgroundData();
  checkDuplicates();
  generateAllCategories();
  
  console.log('\n处理完成！');
  console.log('\n下一步:');
  console.log('1. 将你的背景图片复制到 public/assets/backgrounds/ 目录');
  console.log('2. 将其他分类素材放入 public/assets/<分类目录>/');
  console.log('3. 运行 npm run dev 查看效果');
  console.log('4. 在背景管理或分类页面中重命名和整理');
}

// 运行脚本
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { generateBackgroundData, checkDuplicates };
