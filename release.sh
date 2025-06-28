#!/bin/bash

# GitHub仓库发布脚本
# 用于将Obsidian插件发布到GitHub

set -e

echo "🚀 开始发布 Markdown to Anki Obsidian Plugin"
echo "================================================"

# 检查必需文件
echo "📋 检查必需文件..."
if [ ! -f "main.js" ] || [ ! -f "manifest.json" ] || [ ! -f "styles.css" ]; then
    echo "❌ 缺少必需文件！请确保存在 main.js, manifest.json, styles.css"
    exit 1
fi

echo "✅ 必需文件检查完成"

# 获取版本号
VERSION=$(grep '"version"' manifest.json | sed 's/.*"version": "\(.*\)".*/\1/')
echo "📦 当前版本: $VERSION"

# 构建插件
echo "🔨 构建插件..."
npm run build

# 提交代码
echo "📝 提交代码到Git..."
git add .
git commit -m "Release v$VERSION" || echo "无新改动或已提交"

# 推送到GitHub
echo "⬆️  推送代码到GitHub..."
echo "请确保已添加远程仓库："
echo "git remote add origin https://github.com/cynicalight/markdown-to-anki.git"
echo ""
echo "推送命令："
echo "git push -u origin main"
echo ""

# 创建Release说明
echo "📋 创建Release说明文件..."
cat > release_notes.md << EOF
# Markdown to Anki v$VERSION

将Markdown文档中的标记内容自动转换为Anki闪卡的Obsidian插件。

## ✨ 主要功能

- **生词提取**：识别加粗文本（\`**word**\`），调用API翻译并生成卡片
- **词组识别**：识别斜体文本（\`*phrase*\`），获取上下文翻译
- **句子收集**：识别高亮文本（\`==sentence==\`），整句翻译
- **智能翻译**：集成DeepSeek API，提供准确的中英翻译
- **批量导出**：一键生成Anki可导入的txt格式文件
- **路径灵活**：支持相对路径和绝对路径输出

## 🔧 使用方法

1. 在设置中配置DeepSeek API密钥
2. 打开包含标记文本的Markdown文件
3. 运行命令 "Generate Anki Cards"
4. 设置输出路径，等待生成完成
5. 将生成的txt文件导入Anki

## ⚙️ 配置选项

- API密钥设置
- 输出路径自定义（支持绝对路径如 \`/Users/username/Downloads\`）
- 功能开关（可选择性处理不同类型的标记）

## 📦 安装文件

请下载以下文件并放入 Obsidian 插件目录：
- main.js
- manifest.json
- styles.css

## 🐛 已知问题

- API调用有1秒延迟以避免频率限制
- 绝对路径输出会自动触发浏览器下载

## 📞 支持

如有问题请在 GitHub Issues 中反馈。
EOF

echo "✅ Release说明文件已创建: release_notes.md"

# 显示文件信息
echo ""
echo "📊 发布文件信息："
ls -la main.js manifest.json styles.css

echo ""
echo "🎯 下一步操作："
echo "1. 推送代码到GitHub："
echo "   git push -u origin main"
echo ""
echo "2. 在GitHub上创建Release："
echo "   - Tag: v$VERSION"
echo "   - Title: Markdown to Anki v$VERSION"
echo "   - 上传文件: main.js, manifest.json, styles.css"
echo "   - 描述: 使用 release_notes.md 的内容"
echo ""
echo "3. 提交到Obsidian社区插件库 (可选)"

echo ""
echo "🎉 发布准备完成！"
