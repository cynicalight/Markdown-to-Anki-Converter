// 简化的Obsidian API类型定义
declare module 'obsidian' {
    export class App {
        workspace: {
            getActiveFile(): TFile | null;
        };
        vault: {
            read(file: TFile): Promise<string>;
            create(path: string, content: string): Promise<TFile>;
        };
    }

    export class Plugin {
        app: App;
        addStatusBarItem(): { setText(text: string): void };
        addCommand(command: { id: string; name: string; callback: () => void }): void;
        addSettingTab(tab: PluginSettingTab): void;
        loadData(): Promise<any>;
        saveData(data: any): Promise<void>;
    }

    export class Modal {
        contentEl: HTMLElement & {
            createEl(tag: string, attrs?: { text?: string; cls?: string }): HTMLElement;
            empty(): void;
        };
        constructor(app: App);
        open(): void;
        close(): void;
        onOpen(): void;
        onClose(): void;
    }

    export class PluginSettingTab {
        containerEl: HTMLElement & {
            createEl(tag: string, attrs?: { text?: string; cls?: string }): HTMLElement;
            empty(): void;
        };
        constructor(app: App, plugin: Plugin);
        display(): void;
    }

    export class Setting {
        constructor(containerEl: HTMLElement);
        setName(name: string): Setting;
        setDesc(desc: string): Setting;
        addText(callback: (component: any) => void): Setting;
        addToggle(callback: (component: any) => void): Setting;
    }

    export class Notice {
        constructor(message: string);
    }

    export class TFile {
        basename: string;
        parent: { path: string } | null;
    }
}
