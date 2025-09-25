import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const categoriesFile = join(__dirname, '../src/data/categories.ts');

async function main() {
  console.log('🔧 更新"墨镜栗子头"图片...');
  
  // 请在这里指定新的文件名（不包含扩展名）
  const newFileName = '墨镜栗子头'; // 请根据实际文件名修改这里
  
  let categoriesContent = fs.readFileSync(categoriesFile, 'utf8');
  let categories = JSON.parse(categoriesContent.match(/export const categories = ([\s\S]+?) as const;/)[1]);
  
  // 找到head-set分类
  const headSetCategory = categories.find(cat => cat.id === 'head-set');
  if (headSetCategory) {
    // 查找"墨镜栗子头"物品
    const itemIndex = headSetCategory.items.findIndex(item => item.name === '墨镜栗子头');
    if (itemIndex !== -1) {
      console.log('🔧 找到"墨镜栗子头"物品');
      
      // 检查文件扩展名
      const possibleExtensions = ['.gif', '.png'];
      let foundExtension = null;
      
      for (const ext of possibleExtensions) {
        const testPath = join(__dirname, `../assets/head-set/${newFileName}${ext}`);
        if (fs.existsSync(testPath)) {
          foundExtension = ext;
          break;
        }
      }
      
      if (foundExtension) {
        const newImagePath = `/assets/head-set/${newFileName}${foundExtension}`;
        headSetCategory.items[itemIndex].thumbnail = newImagePath;
        headSetCategory.items[itemIndex].image = newImagePath;
        
        console.log(`✅ 更新了"墨镜栗子头"的图片路径: ${newImagePath}`);
      } else {
        console.log(`⚠️ 未找到文件: assets/head-set/${newFileName}.gif 或 ${newFileName}.png`);
        console.log('📝 请确认文件名是否正确，或手动指定新的文件名');
      }
    } else {
      console.log('⚠️ 未找到"墨镜栗子头"物品');
    }
  }
  
  // 更新文件
  const updatedContent = `// 自动生成的全量分类数据\nexport const categories = ${JSON.stringify(categories, null, 2)} as const;\n`;
  fs.writeFileSync(categoriesFile, updatedContent);
  
  console.log('✅ 更新完成！');
}

main().catch(console.error);
