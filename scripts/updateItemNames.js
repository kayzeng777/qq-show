import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const translationsFile = join(__dirname, '../src/utils/translations.ts');

// 在这里定义您要更新的item名称
const nameUpdates = {
  // 格式：原中文名称: { zh: "新中文名称", en: "新英文名称" }
  "爱心云朵": {
    zh: "浪漫爱心云",
    en: "Romantic Love Cloud"
  },
  "北极熊湖": {
    zh: "北极熊湖",
    en: "Arctic Bear Lake"
  },
  // 添加更多更新...
};

async function main() {
  console.log('🔧 开始更新item名称...');
  
  let content = fs.readFileSync(translationsFile, 'utf8');
  
  // 提取翻译对象
  const match = content.match(/export const itemNameTranslations: Record<string, Record<Language, string>> = ([\s\S]+?);/);
  if (!match) {
    console.log('❌ 无法解析翻译文件');
    return;
  }
  
  let translations = JSON.parse(match[1]);
  
  let updatedCount = 0;
  
  // 更新指定的item名称
  for (const [oldName, newNames] of Object.entries(nameUpdates)) {
    if (translations[oldName]) {
      // 更新现有item
      translations[oldName].zh = newNames.zh;
      translations[oldName].en = newNames.en;
      updatedCount++;
      console.log(`✅ 更新: ${oldName} → ${newNames.zh} / ${newNames.en}`);
    } else {
      console.log(`⚠️  未找到: ${oldName}`);
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
  
  console.log(`✅ 更新完成！共更新了 ${updatedCount} 个item名称`);
}

main().catch(console.error);
