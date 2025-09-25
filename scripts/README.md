# QQ秀图片处理脚本

## 🚀 快速使用

当您上传新图片后，只需要运行一个命令：

```bash
node scripts/processNewImages.js
```

## 📁 脚本功能

这个脚本会自动完成以下工作：

1. **扫描图片文件** - 自动扫描 `/assets/` 目录下的所有分类
2. **提取中文名称** - 从文件名中提取中文名称
3. **生成英文翻译** - 使用预定义的翻译映射生成英文翻译
4. **更新数据文件** - 自动更新 `categories.ts` 和 `translations.ts`

## 📂 支持的分类

脚本支持以下21个分类：

- `backgrounds` - 背景
- `background-decor` - 背景装饰
- `vehicle` - 车辆
- `back-hair` - 后头发
- `front-hair` - 前头发
- `wings` - 翅膀
- `bottom` - 下装
- `top` - 上装
- `outfit` - 套装
- `makeup` - 妆容
- `head-set` - 妆发造型
- `face-decor` - 脸饰
- `earrings` - 耳饰
- `glasses` - 眼镜
- `neckwear` - 颈饰
- `headwear` - 头饰
- `other-accessories` - 其他配饰
- `companion` - 陪伴
- `frame` - 边框
- `text` - 称号
- `sparkle` - 特效

## 🔧 使用步骤

### 1. 上传新图片

将新图片放入对应的分类文件夹中，例如：

```
assets/
├── backgrounds/
│   └── 新背景.gif
├── hair/
│   └── 新发型.gif
└── ...
```

### 2. 运行处理脚本

```bash
node scripts/processNewImages.js
```

### 3. 检查结果

脚本会显示处理结果：

```
🚀 QQ秀图片处理流程启动...

📁 扫描图片文件...
✅ 背景: 45 个物品
✅ 头发: 82 个物品
...

📊 总计: 21 个分类, 731 个物品

🌐 生成翻译数据...
✅ 生成了 731 个翻译

✅ 已保存分类数据: src/data/categories.ts
✅ 已保存翻译数据: src/utils/translations.ts

🎉 图片处理完成!
```

## ⚙️ 自定义翻译

如果需要添加新的翻译，可以编辑脚本中的 `TRANSLATION_MAP` 对象：

```javascript
const TRANSLATION_MAP = {
  新物品名称: "New Item Name",
  // 添加更多翻译...
};
```

## 🐛 故障排除

### 问题：找不到图片文件

- 确保图片文件放在正确的分类文件夹中
- 检查文件名是否包含中文字符
- 支持的文件格式：`.gif`, `.png`, `.jpg`, `.jpeg`

### 问题：翻译不正确

- 检查 `TRANSLATION_MAP` 中是否有对应的翻译
- 如果没有，脚本会使用中文名称作为英文翻译
- 可以手动编辑生成的翻译文件

### 问题：脚本运行失败

- 确保在项目根目录运行脚本
- 检查 Node.js 版本（需要支持 ES 模块）
- 查看错误信息并检查文件路径

## 📝 注意事项

1. **备份数据** - 运行脚本前建议备份现有的数据文件
2. **文件命名** - 图片文件名应该使用中文，不要包含特殊字符
3. **分类结构** - 保持现有的分类文件夹结构
4. **翻译质量** - 脚本使用预定义翻译，可能需要手动调整

## 🔄 更新流程

每次添加新图片后：

1. 将图片放入对应分类文件夹
2. 运行 `node scripts/processNewImages.js`
3. 检查生成的数据
4. 如有需要，手动调整翻译
5. 测试应用程序

这样您就可以轻松地管理QQ秀的所有图片资源了！
