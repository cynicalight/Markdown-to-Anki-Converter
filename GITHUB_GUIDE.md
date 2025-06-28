# GitHub发布指南

## 🎯 操作步骤

### 1. 创建GitHub仓库

1. 登录 GitHub (https://github.com)
2. 点击右上角的 "+" → "New repository"
3. 仓库设置：
   - **Repository name**: `markdown-to-anki`
   - **Description**: `Obsidian plugin to convert marked content in Markdown documents into Anki flashcards`
   - **Visibility**: Public
   - **不要** 勾选 "Add a README file"
   - **不要** 勾选 "Add .gitignore"
   - **不要** 勾选 "Choose a license"
4. 点击 "Create repository"

### 2. 推送代码到GitHub

在当前目录执行以下命令：

```bash
# 添加远程仓库（替换 YOUR_USERNAME 为你的GitHub用户名）
git remote add origin https://github.com/cynicalight/markdown-to-anki.git

# 推送代码
git push -u origin main
```

### 3. 创建Release

1. 在GitHub仓库页面，点击右侧的 "Releases"
2. 点击 "Create a new release"
3. 填写Release信息：
   - **Tag version**: `v1.0.0`
   - **Release title**: `Markdown to Anki v1.0.0`
   - **Description**: 复制 `release_notes.md` 的内容

4. 上传发布文件：
   - 拖拽或选择 `main.js`
   - 拖拽或选择 `manifest.json`
   - 拖拽或选择 `styles.css`

5. 点击 "Publish release"

### 4. 验证Release

- 检查文件是否正确上传
- 确认下载链接正常工作
- 验证manifest.json中的版本号与Tag一致

## 📋 发布检查清单

- [ ] GitHub仓库已创建
- [ ] 代码已推送到main分支
- [ ] Release已创建 (Tag: v1.0.0)
- [ ] 三个核心文件已上传：
  - [ ] main.js (约17KB)
  - [ ] manifest.json (360字节)
  - [ ] styles.css (692字节)
- [ ] Release描述完整
- [ ] 下载链接测试正常

## 🔗 重要链接

- **仓库URL**: https://github.com/cynicalight/markdown-to-anki
- **Release页面**: https://github.com/cynicalight/markdown-to-anki/releases
- **安装链接**: https://github.com/cynicalight/markdown-to-anki/releases/latest

## 📝 后续步骤（可选）

### 提交到Obsidian社区插件库

1. Fork https://github.com/obsidianmd/obsidian-releases
2. 编辑 `community-plugins.json`，在末尾添加：

```json
{
    "id": "markdown-to-anki",
    "name": "Markdown to Anki", 
    "author": "Jie Zhang",
    "description": "Convert the marked content in the Markdown document into Anki flash card.",
    "repo": "cynicalight/markdown-to-anki"
}
```

3. 创建Pull Request：
   - 标题：`Add plugin: Markdown to Anki`
   - 模板选择：Community Plugin

## 🎉 完成！

发布完成后，用户可以通过以下方式安装：

1. 手动安装：下载Release文件复制到Obsidian插件目录
2. 社区插件库：等待审核通过后可直接在Obsidian中安装
