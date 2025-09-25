# 脚本说明

## 当前可用的脚本

### 1. uploadNewAssets.js
**用途**: 上传新资源到系统中

**使用方法**:
```bash
npm run upload-new-assets
```

**功能**:
- 扫描 `new asset` 文件夹中的所有新图片
- 将图片移动到对应的 `assets` 文件夹
- 读取图片名称并生成英文翻译
- 更新 `categories.ts` 和 `translations.ts`
- 保持所有现有的渲染逻辑不变

**工作流程**:
1. 将新图片放入 `new asset/对应分类文件夹/`
2. 运行 `npm run upload-new-assets`
3. 脚本自动处理所有后续步骤

## 已清理的脚本

以下脚本已经删除，因为它们是一次性的修复脚本，现在不再需要：

- `processAllImages.js` - 旧的图片处理脚本
- `processHairImages.js` - 旧的头发图片处理脚本
- `processNewImages.js` - 旧的图片处理脚本
- `runAllProcessing.js` - 旧的批量处理脚本
- `quick-update.sh` - 旧的快速更新脚本
- `completeTranslations.js` - 翻译补全脚本
- `fixAllTranslations.js` - 翻译修复脚本
- `fixCorrectLayerOrder.js` - 图层顺序修复脚本
- `fixDefaultAndSorting.js` - 默认项和排序修复脚本
- `fixDefaultIssues.js` - 默认项问题修复脚本
- `fixDuplicateNone.js` - 重复"无"项修复脚本
- `fixEnglishTranslations.js` - 英文翻译修复脚本
- `fixHairTranslations.js` - 头发翻译修复脚本
- `fixLayerOrder.js` - 图层顺序修复脚本
- `generateMissingTranslations.js` - 缺失翻译生成脚本
- `mergeTranslations.js` - 翻译合并脚本
- `removeDefaultItems.js` - 默认项移除脚本
- `removeHairCategories.js` - 头发分类移除脚本
- `testDisplayOrder.js` - 显示顺序测试脚本
- `updateHairstyle6.js` - 发型6更新脚本
- `updateMojingLizi.js` - 墨镜栗子头更新脚本
- `updateSpecificItems.js` - 特定物品更新脚本
- `verifyCategoryOrder.js` - 分类顺序验证脚本
- `generateHairCategory.js` - 头发分类生成脚本
- `reorderCategories.js` - 分类重新排序脚本
- `updateLayerOrder.js` - 图层顺序更新脚本
- `checkLayerOrder.js` - 图层顺序检查脚本
- `updateCategoryNames.js` - 分类名称更新脚本

## 注意事项

- 所有一次性修复脚本已经删除
- 只保留必要的 `uploadNewAssets.js` 脚本
- 新的工作流程更加简单和安全
- 不会影响任何现有的渲染逻辑