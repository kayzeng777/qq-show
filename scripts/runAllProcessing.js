#!/usr/bin/env node

import { execSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🚀 开始完整的图片处理工作流程...\n');

try {
  // 步骤1: 处理所有图片
  console.log('📤 步骤1: 处理所有图片...');
  execSync('node scripts/processAllImages.js', { stdio: 'inherit' });
  console.log('✅ 所有图片处理完成!\n');

  // 步骤2: 专门处理头发图片
  console.log('💇 步骤2: 处理头发图片...');
  execSync('node scripts/processHairImages.js', { stdio: 'inherit' });
  console.log('✅ 头发图片处理完成!\n');

  console.log('🎉 所有任务完成成功!');
  console.log('\n📋 下一步:');
  console.log('1. 检查生成的文件:');
  console.log('   - src/data/updated-categories.ts');
  console.log('   - src/data/hair-categories.ts');
  console.log('   - src/utils/updated-translations.ts');
  console.log('   - src/utils/hair-translations.ts');
  console.log('2. 更新你的主 categories.ts 文件');
  console.log('3. 更新你的 translations.ts 文件');
  console.log('4. 测试应用程序确保一切正常工作');

} catch (error) {
  console.error('❌ 执行过程中出错:', error.message);
  process.exit(1);
}
