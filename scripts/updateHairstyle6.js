#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔧 更新"发型6"为"金棕波浪蓝发夹长发"...');

// 需要更新的文件列表
const filesToUpdate = [
  'src/utils/translations.ts',
  'src/utils/hair-translations.ts',
  'src/utils/updated-translations.ts',
  'src/data/categories.ts',
  'src/data/updated-categories.ts',
  'src/data/hair-categories.ts'
];

let totalUpdates = 0;

filesToUpdate.forEach(filePath => {
  const fullPath = path.join(__dirname, '..', filePath);
  
  if (fs.existsSync(fullPath)) {
    let content = fs.readFileSync(fullPath, 'utf8');
    let updateCount = 0;
    
    // 替换所有"发型6"为"金棕波浪蓝发夹长发"
    const originalContent = content;
    content = content.replace(/发型6/g, '金棕波浪蓝发夹长发');
    
    if (content !== originalContent) {
      fs.writeFileSync(fullPath, content);
      updateCount = (originalContent.match(/发型6/g) || []).length;
      totalUpdates += updateCount;
      console.log(`✅ 已更新文件: ${filePath} (${updateCount} 处)`);
    } else {
      console.log(`⏭️  跳过文件: ${filePath} (无需更新)`);
    }
  } else {
    console.log(`❌ 文件不存在: ${filePath}`);
  }
});

console.log(`\n🎉 更新完成! 总共更新了 ${totalUpdates} 处"发型6"为"金棕波浪蓝发夹长发"`);

// 验证更新结果
console.log('\n🔍 验证更新结果...');
const verificationFiles = [
  'src/utils/translations.ts',
  'src/utils/hair-translations.ts',
  'src/data/categories.ts'
];

verificationFiles.forEach(filePath => {
  const fullPath = path.join(__dirname, '..', filePath);
  if (fs.existsSync(fullPath)) {
    const content = fs.readFileSync(fullPath, 'utf8');
    const hasOldName = content.includes('发型6');
    const hasNewName = content.includes('金棕波浪蓝发夹长发');
    
    if (hasOldName) {
      console.log(`⚠️  ${filePath} 仍包含"发型6"`);
    } else if (hasNewName) {
      console.log(`✅ ${filePath} 已成功更新为"金棕波浪蓝发夹长发"`);
    } else {
      console.log(`ℹ️  ${filePath} 不包含相关名称`);
    }
  }
});
