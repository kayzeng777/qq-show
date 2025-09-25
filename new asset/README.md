# 新资源上传说明

## 使用方法

1. **准备新图片**：
   - 将新图片放入对应的分类文件夹中
   - 图片文件名应该是中文名称（不包含扩展名）
   - 支持的格式：`.png`, `.gif`, `.jpg`, `.jpeg`

2. **运行上传脚本**：
   ```bash
   npm run upload-new-assets
   ```
   或者
   ```bash
   node scripts/uploadNewAssets.js
   ```

3. **脚本会自动**：
   - 扫描 `new asset` 文件夹中的所有新图片
   - 将图片移动到对应的 `assets` 文件夹
   - 读取图片名称并生成英文翻译
   - 更新 `categories.ts` 和 `translations.ts`
   - 保持所有现有的渲染逻辑不变

## 文件夹结构

```
new asset/
├── backgrounds/          # 背景图片
├── background-decor/     # 背景装饰
├── vehicle/             # 车辆
├── wings/               # 翅膀
├── hair/                # 发型（组合）
├── back-hair/           # 后头发
├── bottom/              # 下装
├── top/                 # 上装
├── outfit/              # 套装
├── makeup/              # 妆容
├── head-set/            # 妆发造型
├── front-hair/          # 前头发
├── face-decor/          # 脸饰
├── earrings/            # 耳饰
├── glasses/             # 眼镜墨镜
├── neckwear/            # 颈饰
├── headwear/            # 头饰
├── other-accessories/   # 其他配饰
├── companion/           # 陪伴
├── frame/               # 边框
├── text/                # 文字装饰
└── sparkle/             # 特效
```

## 注意事项

- 图片文件名应该是中文名称，脚本会自动生成英文翻译
- 不要上传 `default.png` 或 `default.gif` 文件
- 脚本不会修改任何现有的渲染逻辑、图层顺序、随机方式等
- 上传完成后，新图片会出现在对应的分类中
