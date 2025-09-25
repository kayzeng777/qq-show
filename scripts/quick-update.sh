#!/bin/bash

# QQ秀图片快速更新脚本
# 使用方法: ./scripts/quick-update.sh

echo "🚀 QQ秀图片快速更新..."
echo ""

# 检查是否在正确的目录
if [ ! -d "assets" ]; then
    echo "❌ 错误: 请在项目根目录运行此脚本"
    exit 1
fi

# 运行图片处理脚本
echo "📁 处理图片文件..."
node scripts/processNewImages.js

# 检查是否成功
if [ $? -eq 0 ]; then
    echo ""
    echo "✅ 更新完成!"
    echo ""
    echo "📋 下一步:"
    echo "1. 检查生成的数据文件"
    echo "2. 如有需要，手动调整翻译"
    echo "3. 运行 'npm run dev' 测试应用程序"
else
    echo ""
    echo "❌ 更新失败，请检查错误信息"
    exit 1
fi
