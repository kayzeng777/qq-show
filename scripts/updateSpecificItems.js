import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const categoriesFile = join(__dirname, '../src/data/categories.ts');
const translationsFile = join(__dirname, '../src/utils/translations.ts');

async function main() {
  console.log('🔧 开始更新特定物品...');
  
  // 1. 更新categories.ts
  console.log('📋 更新categories.ts...');
  let categoriesContent = fs.readFileSync(categoriesFile, 'utf8');
  let categories = JSON.parse(categoriesContent.match(/export const categories = ([\s\S]+?) as const;/)[1]);
  
  // 找到head-set分类
  const headSetCategory = categories.find(cat => cat.id === 'head-set');
  if (headSetCategory) {
    console.log(`📋 找到head-set分类，包含 ${headSetCategory.items.length} 个物品`);
    
    // 查找"墨镜栗子头"物品
    const itemIndex = headSetCategory.items.findIndex(item => item.name === '墨镜栗子头');
    if (itemIndex !== -1) {
      console.log('🔧 找到"墨镜栗子头"物品，需要更新图片');
      // 这里需要您提供新的图片文件名
      // 假设新图片文件名是"墨镜栗子头_new.gif"
      const newImageName = '墨镜栗子头_new'; // 请根据实际文件名修改
      const newImagePath = `/assets/head-set/${newImageName}.gif`;
      
      headSetCategory.items[itemIndex].thumbnail = newImagePath;
      headSetCategory.items[itemIndex].image = newImagePath;
      
      console.log(`✅ 更新了"墨镜栗子头"的图片路径: ${newImagePath}`);
    } else {
      console.log('⚠️ 未找到"墨镜栗子头"物品');
    }
  }
  
  // 找到backgrounds分类
  const backgroundsCategory = categories.find(cat => cat.id === 'backgrounds');
  if (backgroundsCategory) {
    console.log(`📋 找到backgrounds分类，包含 ${backgroundsCategory.items.length} 个物品`);
    
    // 查找"流水车马"物品
    const itemIndex = backgroundsCategory.items.findIndex(item => item.name === '流水车马');
    if (itemIndex !== -1) {
      console.log('🔧 找到"流水车马"物品，准备移除');
      backgroundsCategory.items.splice(itemIndex, 1);
      console.log('✅ 移除了"流水车马"物品');
    } else {
      console.log('⚠️ 未找到"流水车马"物品');
    }
  }
  
  // 更新categories.ts文件
  const updatedCategoriesContent = `// 自动生成的全量分类数据\nexport const categories = ${JSON.stringify(categories, null, 2)} as const;\n`;
  fs.writeFileSync(categoriesFile, updatedCategoriesContent);
  
  // 2. 更新translations.ts
  console.log('📋 更新translations.ts...');
  let translationsContent = fs.readFileSync(translationsFile, 'utf8');
  
  // 提取翻译对象
  const match = translationsContent.match(/export const itemNameTranslations: Record<string, Record<Language, string>> = ([\s\S]+?);/);
  if (match) {
    let translations = JSON.parse(match[1]);
    
    // 移除"流水车马"的翻译
    if (translations['流水车马']) {
      delete translations['流水车马'];
      console.log('✅ 移除了"流水车马"的翻译');
    }
    
    // 更新文件
    const updatedTranslationsContent = `// 自动生成的翻译数据
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
    
    fs.writeFileSync(translationsFile, updatedTranslationsContent);
  }
  
  console.log('✅ 特定物品更新完成！');
  console.log('📝 请确认"墨镜栗子头"的新图片文件名是否正确');
}

main().catch(console.error);
