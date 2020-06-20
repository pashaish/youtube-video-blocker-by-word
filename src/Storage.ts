
export class Storage {
    private storage: typeof chrome.storage | undefined = chrome.storage;
    constructor() {
        this.storage?.onChanged.addListener((e) => {
            this.subsTrigger(e);
        });
    }

    public getKeywordList(): Promise<string[]> {
        return new Promise((resolve) => {
            if (!this.storage) {
                resolve([]);
            }
            this.storage?.local.get(['blocker_keyword_list'], (result) => {
                const list: string[] = result.blocker_keyword_list || [];
                resolve(list.map((k) => k.trim()));
            });
        });
    }

    public addKeyWord(keyword: string): Promise<void> {
        return new Promise((resolve) => {
            if (keyword.trim() === "") {
                resolve();
                return;
            }
            if (keyword.replace(/\s+/, "").length < 3) {
                resolve();
                return;
            }
            this.storage?.local.get(['blocker_keyword_list'], (result) => {
                const list = result.blocker_keyword_list || [];
                list.push(keyword.toLowerCase().trim());
                this.storage?.local.set({blocker_keyword_list: [...new Set(list)]}, () => {
                    resolve();
            });
            });
        });
    }

    public getCounter(): Promise<number> {
        return new Promise((resolve) => {
            if (!this.storage) {
                resolve(0);
            }
            this.storage?.local.get(["blocker_counter"], (result) => {
                const counter = parseInt(result.blocker_counter || 0, 10)
                resolve(counter);
            });
        });
    }

    public setCounter(counter: number) {
        return new Promise((resolve) => {
            this.storage?.local.set({blocker_counter: counter}, () => {
                resolve();
            });
        });
    }

    public removeKeyWord(keyword: string): Promise<void> {
        return new Promise((resolve) => {
            this.getKeywordList().then((list) => {
                const newList = list.filter((k) => k !== keyword.toLowerCase());
                this.storage?.local.set({blocker_keyword_list: newList}, () => {
                    resolve();
            })
            });
        });
    }

    private subs = new Set<(changes: {[key: string]: chrome.storage.StorageChange}) => void>();
    private subsTrigger(changes: {[key: string]: chrome.storage.StorageChange}) {
        for (const sub of this.subs) {
            sub(changes);
        }
    }
    public onChange(sub: (changes: {[key: string]: chrome.storage.StorageChange}) => void) {
        this.subs.add(sub);
    }
}