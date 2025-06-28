import { App, Plugin, PluginSettingTab, Setting, Notice, TFile, Modal } from 'obsidian';

interface MdToAnkiSettings {
    deepseekApiKey: string;
    outputPath: string;
    enableWordCards: boolean;
    enablePhraseCards: boolean;
    enableSentenceCards: boolean;
}

const DEFAULT_SETTINGS: MdToAnkiSettings = {
    deepseekApiKey: '',
    outputPath: '',
    enableWordCards: true,
    enablePhraseCards: true,
    enableSentenceCards: true
}

interface ExtractedContent {
    words: Array<{ text: string, context: string }>;
    phrases: Array<{ text: string, context: string }>;
    sentences: string[];
}

interface Translation {
    meaning: string;
    example: string;
}

class DeepSeekAPI {
    private apiKey: string;
    private baseUrl = 'https://api.deepseek.com/v1/chat/completions';

    constructor(apiKey: string) {
        this.apiKey = apiKey;
    }

    async translateWord(word: string, context: string): Promise<Translation> {
        const prompt = `请翻译英文单词"${word}"在以下句子中的含义：

句子：${context}

请按以下JSON格式回复：
{
    "meaning": "该单词在此句子中的中文含义",
    "example": "原句子"
}

只返回JSON，不要其他内容。`;

        try {
            const response = await this.makeRequest(prompt);
            return JSON.parse(response);
        } catch (e) {
            console.error(`翻译单词 '${word}' 时出错:`, e);
            return {
                meaning: `翻译失败: ${word}`,
                example: context
            };
        }
    }

    async translatePhrase(phrase: string, context: string): Promise<Translation> {
        const prompt = `请翻译英文词组"${phrase}"在以下句子中的含义：

句子：${context}

请按以下JSON格式回复：
{
    "meaning": "该词组在此句子中的中文含义", 
    "example": "原句子"
}

只返回JSON，不要其他内容。`;

        try {
            const response = await this.makeRequest(prompt);
            return JSON.parse(response);
        } catch (e) {
            console.error(`翻译词组 '${phrase}' 时出错:`, e);
            return {
                meaning: `翻译失败: ${phrase}`,
                example: context
            };
        }
    }

    async translateSentence(sentence: string): Promise<string> {
        const prompt = `请将以下英文句子翻译成中文，要求翻译准确、自然：

${sentence}

只返回中文翻译，不要其他内容。`;

        try {
            const response = await this.makeRequest(prompt);
            return response.trim();
        } catch (e) {
            console.error('翻译句子时出错:', e);
            return `翻译失败: ${sentence}`;
        }
    }

    private async makeRequest(prompt: string): Promise<string> {
        const data = {
            model: 'deepseek-chat',
            messages: [
                { role: 'user', content: prompt }
            ],
            temperature: 0.3,
            max_tokens: 1000
        };

        const response = await fetch(this.baseUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.apiKey}`
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error(`API请求失败: ${response.status}, ${await response.text()}`);
        }

        const result = await response.json();
        return result.choices[0].message.content;
    }
}

class MarkdownParser {
    private content: string;

    constructor(content: string) {
        this.content = content;
    }

    extractContent(): ExtractedContent {
        return {
            words: this.extractBoldText(),
            phrases: this.extractItalicText(),
            sentences: this.extractHighlightedText()
        };
    }

    private extractBoldText(): Array<{ text: string, context: string }> {
        const pattern = /\*\*([^*]+)\*\*/g;
        const matches: Array<{ text: string, context: string }> = [];
        let match;

        while ((match = pattern.exec(this.content)) !== null) {
            const boldText = match[1];
            const context = this.getSentenceContext(match.index, match.index + match[0].length);
            matches.push({ text: boldText, context });
        }

        return matches;
    }

    private extractItalicText(): Array<{ text: string, context: string }> {
        const pattern = /(?<!\*)\*([^*]+)\*(?!\*)/g;
        const matches: Array<{ text: string, context: string }> = [];
        let match;

        while ((match = pattern.exec(this.content)) !== null) {
            const italicText = match[1];
            const context = this.getSentenceContext(match.index, match.index + match[0].length);
            matches.push({ text: italicText, context });
        }

        return matches;
    }

    private extractHighlightedText(): string[] {
        const pattern = /==([^=]+)==/g;
        const matches: string[] = [];
        let match;

        while ((match = pattern.exec(this.content)) !== null) {
            matches.push(match[1].trim());
        }

        return matches;
    }

    private getSentenceContext(startPos: number, endPos: number): string {
        // 向前查找句子开始
        let sentenceStart = startPos;
        while (sentenceStart > 0 && !/[.!?]/.test(this.content[sentenceStart])) {
            sentenceStart--;
        }
        if (sentenceStart > 0) {
            sentenceStart++;
        }

        // 向后查找句子结束
        let sentenceEnd = endPos;
        while (sentenceEnd < this.content.length && !/[.!?]/.test(this.content[sentenceEnd])) {
            sentenceEnd++;
        }
        if (sentenceEnd < this.content.length) {
            sentenceEnd++;
        }

        let sentence = this.content.substring(sentenceStart, sentenceEnd).trim();

        // 清理markdown标记
        sentence = sentence.replace(/\*\*([^*]+)\*\*/g, '$1');
        sentence = sentence.replace(/\*([^*]+)\*/g, '$1');
        sentence = sentence.replace(/==([^=]+)==/g, '$1');

        return sentence;
    }
}

class AnkiExporter {
    private cards: Array<{ front: string, back: string }> = [];

    addWordCard(word: string, translation: Translation) {
        const front = word;
        const back = `${translation.meaning}<br><br><i>${translation.example}</i>`;
        this.cards.push({ front, back });
    }

    addPhraseCard(phrase: string, translation: Translation) {
        const front = phrase;
        const back = `${translation.meaning}<br><br><i>${translation.example}</i>`;
        this.cards.push({ front, back });
    }

    addSentenceCard(sentence: string, translation: string) {
        this.cards.push({ front: sentence, back: translation });
    }

    exportToAnkiFormat(): string {
        let output = '#separator:tab\n#html:true\n\n';

        for (const card of this.cards) {
            output += `${card.front}\t${card.back}\n`;
        }

        return output;
    }

    getCardCount(): number {
        return this.cards.length;
    }

    clear() {
        this.cards = [];
    }
}

class ProcessingModal extends Modal {
    private currentStep: string = '';
    private totalSteps: number = 0;
    private currentStepNumber: number = 0;
    private progressEl: HTMLElement;

    constructor(app: App) {
        super(app);
    }

    onOpen() {
        const { contentEl } = this;
        contentEl.empty();
        contentEl.createEl('h2', { text: '正在处理Anki闪卡...' });
        this.progressEl = contentEl.createEl('div', {
            cls: 'progress-container',
            text: '准备中...'
        });
    }

    updateProgress(step: string, current: number, total: number) {
        this.currentStep = step;
        this.currentStepNumber = current;
        this.totalSteps = total;

        if (this.progressEl) {
            this.progressEl.textContent = `${step} (${current}/${total})`;
        }
    }

    onClose() {
        const { contentEl } = this;
        contentEl.empty();
    }
}

export default class MdToAnkiPlugin extends Plugin {
    settings: MdToAnkiSettings;

    async onload() {
        await this.loadSettings();

        // 添加状态栏按钮
        this.addStatusBarItem().setText('Anki');

        // 添加命令
        this.addCommand({
            id: 'convert-to-anki',
            name: '转换当前文件为Anki闪卡',
            callback: () => this.convertCurrentFile()
        });

        // 添加设置页面
        this.addSettingTab(new MdToAnkiSettingTab(this.app, this));
    }

    async convertCurrentFile() {
        const activeFile = this.app.workspace.getActiveFile();
        if (!activeFile) {
            new Notice('请先打开一个Markdown文件');
            return;
        }

        if (!this.settings.deepseekApiKey) {
            new Notice('请先在设置中配置DeepSeek API密钥');
            return;
        }

        const content = await this.app.vault.read(activeFile);
        const parser = new MarkdownParser(content);
        const extracted = parser.extractContent();

        // 检查是否有标记内容
        const totalItems = extracted.words.length + extracted.phrases.length + extracted.sentences.length;
        if (totalItems === 0) {
            new Notice('当前文件中没有找到标记内容（加粗、斜体或高亮文本）');
            return;
        }

        // 显示处理模态框
        const modal = new ProcessingModal(this.app);
        modal.open();

        try {
            const api = new DeepSeekAPI(this.settings.deepseekApiKey);
            const exporter = new AnkiExporter();

            let processed = 0;

            // 处理生词
            if (this.settings.enableWordCards && extracted.words.length > 0) {
                for (const word of extracted.words) {
                    modal.updateProgress(`正在处理生词: ${word.text}`, ++processed, totalItems);
                    const translation = await api.translateWord(word.text, word.context);
                    exporter.addWordCard(word.text, translation);

                    // 添加延迟避免API频率限制
                    await this.sleep(100);
                }
            }

            // 处理词组
            if (this.settings.enablePhraseCards && extracted.phrases.length > 0) {
                for (const phrase of extracted.phrases) {
                    modal.updateProgress(`正在处理词组: ${phrase.text}`, ++processed, totalItems);
                    const translation = await api.translatePhrase(phrase.text, phrase.context);
                    exporter.addPhraseCard(phrase.text, translation);

                    // 添加延迟避免API频率限制
                    await this.sleep(100);
                }
            }

            // 处理句子
            if (this.settings.enableSentenceCards && extracted.sentences.length > 0) {
                for (const sentence of extracted.sentences) {
                    modal.updateProgress(`正在处理句子: ${sentence.substring(0, 30)}...`, ++processed, totalItems);
                    const translation = await api.translateSentence(sentence);
                    exporter.addSentenceCard(sentence, translation);

                    // 添加延迟避免API频率限制
                    await this.sleep(100);
                }
            }

            // 生成输出文件
            const ankiContent = exporter.exportToAnkiFormat();
            const outputFileName = `${activeFile.basename}_anki_cards.txt`;

            // 检查是否为绝对路径
            if (this.settings.outputPath && this.isAbsolutePath(this.settings.outputPath)) {
                // 绝对路径：使用文件系统API写入
                await this.writeToAbsolutePath(this.settings.outputPath, outputFileName, ankiContent);
            } else {
                // 相对路径：在Obsidian库内创建
                const outputPath = this.settings.outputPath || activeFile.parent?.path || '';
                const fullOutputPath = outputPath ? `${outputPath}/${outputFileName}` : outputFileName;
                await this.app.vault.create(fullOutputPath, ankiContent);
            }

            modal.close();
            new Notice(`成功生成 ${exporter.getCardCount()} 张Anki闪卡！文件已保存为: ${outputFileName}`);

        } catch (error) {
            modal.close();
            console.error('转换过程中出现错误:', error);
            new Notice(`转换失败: ${error.message}`);
        }
    }

    private sleep(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    private isAbsolutePath(path: string): boolean {
        // 检查是否为绝对路径
        return path.startsWith('/') || // Unix/Mac 绝对路径
            /^[A-Za-z]:\\/.test(path) || // Windows 绝对路径 (C:\)
            path.startsWith('~'); // 用户主目录路径
    }

    private async writeToAbsolutePath(dirPath: string, fileName: string, content: string): Promise<void> {
        try {
            // 展开用户主目录路径
            let fullDirPath = dirPath;
            if (dirPath.startsWith('~')) {
                // 在浏览器环境中，我们无法直接访问用户主目录
                // 这里提供一个提示信息
                throw new Error('浏览器环境下无法访问用户主目录，请使用完整路径');
            }

            const fullPath = `${fullDirPath}/${fileName}`;

            // 创建下载链接（浏览器环境下的替代方案）
            const blob = new Blob([content], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);

            // 创建临时下载链接
            const link = document.createElement('a');
            link.href = url;
            link.download = fileName;
            link.style.display = 'none';

            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            // 清理URL对象
            URL.revokeObjectURL(url);

            new Notice(`文件已下载到浏览器默认下载目录: ${fileName}`);
        } catch (error) {
            throw new Error(`无法写入到绝对路径: ${error.message}`);
        }
    }

    async loadSettings() {
        this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
    }

    async saveSettings() {
        await this.saveData(this.settings);
    }
}

class MdToAnkiSettingTab extends PluginSettingTab {
    plugin: MdToAnkiPlugin;

    constructor(app: App, plugin: MdToAnkiPlugin) {
        super(app, plugin);
        this.plugin = plugin;
    }

    display(): void {
        const { containerEl } = this;

        containerEl.empty();

        containerEl.createEl('h2', { text: 'Markdown to Anki Converter 设置' });

        // API密钥设置
        new Setting(containerEl)
            .setName('DeepSeek API密钥')
            .setDesc('请输入您的DeepSeek API密钥（获取地址：https://platform.deepseek.com/）')
            .addText(text => text
                .setPlaceholder('sk-...')
                .setValue(this.plugin.settings.deepseekApiKey)
                .onChange(async (value) => {
                    this.plugin.settings.deepseekApiKey = value;
                    await this.plugin.saveSettings();
                }));

        // 输出路径设置
        new Setting(containerEl)
            .setName('输出文件路径')
            .setDesc('生成的Anki文件保存路径。支持：\n• 相对路径（在当前库内）：如 "Anki Cards"\n• 绝对路径（下载到系统目录）：如 "/Users/用户名/Downloads"\n• 留空则保存在当前文件同目录')
            .addText(text => text
                .setPlaceholder('例如: /Users/jz/Downloads 或 Anki Cards')
                .setValue(this.plugin.settings.outputPath)
                .onChange(async (value) => {
                    this.plugin.settings.outputPath = value;
                    await this.plugin.saveSettings();
                }));

        // 功能开关
        containerEl.createEl('h3', { text: '功能设置' });

        new Setting(containerEl)
            .setName('生成生词卡片')
            .setDesc('是否处理加粗文本（**word**）并生成生词卡片')
            .addToggle(toggle => toggle
                .setValue(this.plugin.settings.enableWordCards)
                .onChange(async (value) => {
                    this.plugin.settings.enableWordCards = value;
                    await this.plugin.saveSettings();
                }));

        new Setting(containerEl)
            .setName('生成词组卡片')
            .setDesc('是否处理斜体文本（*phrase*）并生成词组卡片')
            .addToggle(toggle => toggle
                .setValue(this.plugin.settings.enablePhraseCards)
                .onChange(async (value) => {
                    this.plugin.settings.enablePhraseCards = value;
                    await this.plugin.saveSettings();
                }));

        new Setting(containerEl)
            .setName('生成句子卡片')
            .setDesc('是否处理高亮文本（==sentence==）并生成句子翻译卡片')
            .addToggle(toggle => toggle
                .setValue(this.plugin.settings.enableSentenceCards)
                .onChange(async (value) => {
                    this.plugin.settings.enableSentenceCards = value;
                    await this.plugin.saveSettings();
                }));

        // 使用说明
        containerEl.createEl('h3', { text: '使用说明' });
        const usageEl = containerEl.createEl('div');
        usageEl.createEl('p', { text: '1. 在Markdown文档中使用以下格式标记学习内容：' });
        usageEl.createEl('ul').innerHTML = `
			<li><strong>**单词**</strong> - 生成生词卡片</li>
			<li><em>*词组*</em> - 生成词组卡片</li>
			<li><mark>==句子==</mark> - 生成句子翻译卡片</li>
		`;
        usageEl.createEl('p', { text: '2. 使用命令面板（Ctrl/Cmd+P）搜索"转换当前文件为Anki闪卡"或使用快捷键' });
        usageEl.createEl('p', { text: '3. 处理完成后会在指定目录生成Anki可导入的txt文件' });
    }
}
