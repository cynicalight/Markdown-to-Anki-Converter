# Obsidian插件安装指南

## 方法一：手动安装（推荐）

### 1. 准备插件文件

首先构建插件：

```bash
cd obsidian-plugin
npm install
npm run build
```

**注意**：如果遇到TypeScript编译错误，这是正常的。构建脚本已经配置为使用 esbuild 进行构建，会自动跳过 TypeScript 类型检查。

### 2. 安装到Obsidian

1. 打开你的Obsidian库文件夹
2. 导航到 `.obsidian/plugins/` 目录
3. 创建新文件夹 `md-to-anki-converter`
4. 将以下文件复制到该文件夹：
   - `main.js` (约15KB)
   - `manifest.json`  
   - `styles.css`

### 3. 启用插件

1. 打开Obsidian
2. 进入设置 → 第三方插件
3. 找到 "Markdown to Anki Converter" 并启用
4. 配置DeepSeek API密钥

## 方法二：开发者模式

如果你想修改插件代码：

```bash
# 开发模式（自动重新构建）
npm run dev
```

## 使用步骤

### 1. 配置API密钥
- 在插件设置中输入DeepSeek API密钥
- 可选择输出文件路径

### 2. 标记内容
在Markdown文档中使用：
- `**单词**` - 生词
- `*词组*` - 词组
- `==句子==` - 句子

### 3. 转换
- 命令面板搜索"转换当前文件为Anki闪卡"
- 等待处理完成

### 4. 导入Anki
- 打开生成的txt文件
- 在Anki中导入（分隔符：制表符，允许HTML）

## 故障排除

### 构建问题

如果在运行 `npm run build` 时遇到 TypeScript 错误：
- **正常情况**：TypeScript 类型检查错误不会影响最终构建
- **解决方案**：构建脚本使用 esbuild，会自动生成 `main.js` 文件
- **验证成功**：检查是否生成了 `main.js` 文件（约15KB）

### 插件无法加载
- 检查文件是否正确放置在插件目录
- 确认文件权限正确
- 重启Obsidian

### API调用失败
- 检查网络连接
- 验证API密钥是否正确
- 确认账户余额充足

### 找不到标记内容
- 确认使用正确的Markdown语法
- 检查文档编码是否为UTF-8

## 文件结构

```
.obsidian/plugins/md-to-anki-converter/
├── main.js           # 主程序文件
├── manifest.json     # 插件清单
└── styles.css        # 样式文件
```

## 更新插件

1. 下载新版本文件
2. 替换插件目录中的文件
3. 重启Obsidian
