# Markdown to Anki v1.0.0

将Markdown文档中的标记内容自动转换为Anki闪卡的Obsidian插件。

## ✨ 主要功能

- **智能原型提取**：自动识别单词和词组的基本形式（动词原形、名词单数、形容词原级等）
- **生词识别**：识别加粗文本（`**word**`），调用API翻译并生成卡片
- **词组识别**：识别斜体文本（`*phrase*`），获取上下文翻译
- **句子收集**：识别高亮文本（`==sentence==`），整句翻译
- **智能翻译**：集成DeepSeek API，提供准确的中英翻译
- **批量导出**：一键生成Anki可导入的txt格式文件
- **路径灵活**：支持相对路径和绝对路径输出

## 🎯 原型提取功能

### 支持的变位类型：
- **动词时态**: `walked` → `walk`, `went` → `go`, `broken` → `break`
- **名词复数**: `children` → `child`, `mice` → `mouse`
- **形容词变位**: `better` → `good`, `most efficient` → `efficient`
- **动词短语**: `has been working` → `work`, `will have finished` → `finish`

### 闪卡格式：
- **正面**: 显示原型形式（便于记忆）
- **背面**: 包含含义、例句，以及文中变位形式（如果不同）

## 🔧 使用方法

1. 在设置中配置DeepSeek API密钥
2. 打开包含标记文本的Markdown文件
3. 运行命令 "Generate Anki Cards"
4. 设置输出路径，等待生成完成
5. 将生成的txt文件导入Anki

## ⚙️ 配置选项

- **API密钥设置**: DeepSeek API密钥配置
- **输出路径自定义**: 支持绝对路径如 `/Users/username/Downloads`
- **功能开关**: 可选择性处理不同类型的标记内容
  - 生词卡片（加粗文本）
  - 词组卡片（斜体文本）
  - 句子卡片（高亮文本）

## 📦 安装文件

请下载以下文件并放入 Obsidian 插件目录：
- **main.js** (20KB) - 插件主文件
- **manifest.json** (352字节) - 插件元数据
- **styles.css** (692字节) - 样式文件

## 📝 示例

### 输入Markdown：
```markdown
The **algorithm** *runs efficiently* and ==produces accurate results==.
```

### 生成的Anki卡片：
1. **正面**: `algorithm` | **背面**: `算法<br><br>The algorithm runs efficiently and produces accurate results.`
2. **正面**: `run efficiently` | **背面**: `高效运行<br><br>文中形式: runs efficiently<br>The algorithm runs efficiently and produces accurate results.`
3. **正面**: `produces accurate results` | **背面**: `产生准确的结果`

## 🐛 技术细节

- **API调用延迟**: 每次调用间隔1秒，避免频率限制
- **绝对路径支持**: 自动触发浏览器下载
- **错误处理**: 完善的异常处理和用户提示
- **进度显示**: 实时显示处理进度

## 💡 学习优势

1. **标准化学习**: 掌握词汇的标准词典形式
2. **变位识别**: 理解文中的具体用法
3. **记忆效率**: 原型形式便于建立词汇联系
4. **上下文完整**: 保留完整的例句语境

## 📞 支持

如有问题请在 GitHub Issues 中反馈。
