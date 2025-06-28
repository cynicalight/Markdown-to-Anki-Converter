# Markdown to Anki v1.0.0

将Markdown文档中的标记内容自动转换为Anki闪卡的Obsidian插件。

## ✨ 主要功能

- **生词提取**：识别加粗文本（`**word**`），调用API翻译并生成卡片
- **词组识别**：识别斜体文本（`*phrase*`），获取上下文翻译
- **句子收集**：识别高亮文本（`==sentence==`），整句翻译
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
- 输出路径自定义（支持绝对路径如 `/Users/username/Downloads`）
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
