import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const languageContextFile = join(__dirname, '../src/contexts/LanguageContext.tsx');

async function main() {
  console.log('🔧 开始更新分类名称...');
  
  // 新的分类名称映射
  const newCategoryNames = {
    'backgrounds': { zh: '背景', en: 'Background' },
    'background-decor': { zh: '背景装饰', en: 'Background Decor' },
    'vehicle': { zh: '车', en: 'Vehicle' },
    'wings': { zh: '翅膀', en: 'Wings' },
    'hair': { zh: '发型', en: 'Hairstyles' },
    'backHair': { zh: '后头发', en: 'Back Hair' },
    'bottom': { zh: '下装', en: 'Bottom' },
    'top': { zh: '上装', en: 'Top' },
    'outfit': { zh: '套装', en: 'Outfit Set' },
    'makeup': { zh: '妆容', en: 'Makeup' },
    'head-set': { zh: '妆发造型', en: 'Head Set' },
    'frontHair': { zh: '前头发', en: 'Front Hair' },
    'face-decor': { zh: '脸饰', en: 'Face Decor' },
    'earrings': { zh: '耳饰', en: 'Earrings' },
    'glasses': { zh: '眼镜墨镜', en: 'Glasses' },
    'neckwear': { zh: '颈饰', en: 'Neckwear' },
    'headwear': { zh: '头饰', en: 'Headwear' },
    'other-accessories': { zh: '其他配饰', en: 'Other Accessories' },
    'companion': { zh: '陪伴', en: 'Companion' },
    'frame': { zh: '边框', en: 'Frame' },
    'text': { zh: '文字装饰', en: 'Text Decor' },
    'sparkle': { zh: '特效', en: 'Effects' }
  };
  
  console.log('📋 要更新的分类名称：');
  Object.entries(newCategoryNames).forEach(([id, names]) => {
    console.log(`  ${id}: ${names.zh} / ${names.en}`);
  });
  
  // 读取LanguageContext.tsx文件
  let content = fs.readFileSync(languageContextFile, 'utf8');
  
  // 更新中文分类名称
  console.log('\n📋 更新中文分类名称...');
  Object.entries(newCategoryNames).forEach(([id, names]) => {
    const regex = new RegExp(`"${id}": "([^"]+)"`, 'g');
    const match = content.match(regex);
    if (match) {
      const oldName = match[0].match(/"([^"]+)"/)[1];
      if (oldName !== names.zh) {
        console.log(`  🔧 ${id}: "${oldName}" → "${names.zh}"`);
        content = content.replace(regex, `"${id}": "${names.zh}"`);
      }
    }
  });
  
  // 更新英文分类名称
  console.log('\n📋 更新英文分类名称...');
  Object.entries(newCategoryNames).forEach(([id, names]) => {
    const regex = new RegExp(`"${id}": "([^"]+)"`, 'g');
    const matches = content.match(regex);
    if (matches && matches.length > 1) {
      // 找到第二个匹配（英文部分）
      const secondMatch = matches[1];
      const oldName = secondMatch.match(/"([^"]+)"/)[1];
      if (oldName !== names.en) {
        console.log(`  🔧 ${id}: "${oldName}" → "${names.en}"`);
        // 替换第二个匹配
        const parts = content.split(secondMatch);
        if (parts.length > 1) {
          content = parts[0] + `"${id}": "${names.en}"` + parts.slice(1).join(secondMatch);
        }
      }
    }
  });
  
  // 写回文件
  fs.writeFileSync(languageContextFile, content);
  
  console.log('\n✅ 分类名称更新完成！');
  console.log('📝 现在分类名称已按您的要求更新');
}

main().catch(console.error);
