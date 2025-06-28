// Obsidian API类型定义
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
        addStatusBarItem(): StatusBarItem;
        addCommand(command: Command): void;
        addSettingTab(tab: PluginSettingTab): void;
        loadData(): Promise<any>;
        saveData(data: any): Promise<void>;
    }

    export class Modal {
        contentEl: ObsidianElement;
        constructor(app: App);
        open(): void;
        close(): void;
        onOpen(): void;
        onClose(): void;
    }

    export class PluginSettingTab {
        containerEl: ObsidianElement;
        constructor(app: App, plugin: Plugin);
        display(): void;
    }

    export class Setting {
        constructor(containerEl: HTMLElement);
        setName(name: string): Setting;
        setDesc(desc: string): Setting;
        addText(callback: (component: TextComponent) => void): Setting;
        addToggle(callback: (component: ToggleComponent) => void): Setting;
    }

    export class Notice {
        constructor(message: string);
    }

    export class TFile {
        basename: string;
        parent: TFolder | null;
    }

    export class TFolder {
        path: string;
    }

    interface StatusBarItem {
        setText(text: string): void;
    }

    interface Command {
        id: string;
        name: string;
        callback: () => void;
    }

    interface TextComponent {
        setPlaceholder(placeholder: string): TextComponent;
        setValue(value: string): TextComponent;
        onChange(callback: (value: string) => void): TextComponent;
    }

    interface ToggleComponent {
        setValue(value: boolean): ToggleComponent;
        onChange(callback: (value: boolean) => void): ToggleComponent;
    }

    interface ObsidianElement extends HTMLElement {
        createEl<T extends keyof HTMLElementTagNameMap>(
            tag: T,
            attrs?: { text?: string; cls?: string; }
        ): ObsidianElement;
        empty(): void;
    }
}
