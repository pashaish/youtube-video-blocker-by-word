import { Storage } from "./Storage";

export class Observer {
    constructor(
        public readonly storage: Storage,
    ) {
        storage.setCounter(0);
        this.storage.onChange((changes) => {
            if (changes["blocker_keyword_list"]) {
                this.blockCards(document.querySelectorAll('div, span, a'));
            }
        });
    }


    private blockedCards = new Set<HTMLElement>();

    public async run (): Promise<void> {
        this.blockCards(document.querySelectorAll('div, span, a'));
        const obs = new MutationObserver((records) => {
            for (const record of records) {
                this.blockCards(record.addedNodes);
            }
        });
        obs.observe(document, {
            attributes: true,
            childList: true,
            subtree: true,
        });
    }

    private async blockCards(elements: NodeList) {
        elements.forEach(async (element) => {
            if (element instanceof HTMLElement) {
                if (!this.blockedCards?.has(element)) {
                    const list = await this.storage.getKeywordList();
                    for (const keyword of list) {
                        if (element.innerText.replace(/\s+/, " ").toLowerCase().indexOf(keyword) !== -1) {
                            this.blockCard(element, keyword);
                            break;
                        }
                    }
                }
            }
        });
    }

    private async blockCard(title: HTMLElement, keyword: string) {
        if (this.blockedCards.has(title)) {
            return;
        }

        

        const dis = title.closest('[id="dismissable"], .ytd-section-list-renderer > #contents  [class*="item"] > *');
        const content = dis?.parentElement;

        if(title.closest(".youtube-blocked-item") || dis?.previousElementSibling?.classList.contains("youtube-blocked-item")) {
            return;
        }

        if (!(dis instanceof HTMLElement) || !(content instanceof HTMLElement)) {
            return;
        }

        content.style.position = "relative";

        const style = `
            justify-content: center; 
            align-items: center;
            text-align: center;
            display: flex;
            position: absolute;
            background-color: gray;
            left: 0;
            right: 0;
            top: 0;
            bottom: 0;
        `;

        content.innerHTML += `<div class="youtube-blocked-item" style="${style}">
            <h4 style="font-size: 21px; color: white;">
                Заблокированно: <b>${keyword}</b>
            </h4>
        </div>
        `
        
        this.blockedCards.add(title);
        this.storage.setCounter(document.querySelectorAll(".youtube-blocked-item").length);
    }
}