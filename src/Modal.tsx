import * as React from 'react';
import { Storage } from './Storage';

interface IState {
    counter: number;
    inputValue: string;
    keywords: string[];
}

export class Modal extends React.Component<{}, IState> {
    public storage = new Storage();
    
    constructor(props: {}) {
        super(props);
        this.state = {
            counter: 0,
            inputValue: '',
            keywords: [],
        }
    }

    public componentDidMount() {
        this.storage.getCounter().then((counter) => {
            if (counter !== this.state.counter) {
                this.setState({ counter })
            }
        });
        this.storage.getKeywordList().then((keywords) => {
            if (JSON.stringify(keywords) !== JSON.stringify(this.state.keywords)) {
                this.setState({ keywords });
            }
        });
        this.storage.onChange((e) => {
            if (typeof e["blocker_counter"]?.newValue === "number") {
                this.setState({ counter: e["blocker_counter"].newValue})
            }
            if (e['blocker_keyword_list']?.newValue instanceof Array) {
                this.setState({ keywords: e['blocker_keyword_list'].newValue });
            }
        });
    }

    public render() {
        return <div className="card">
            <div className="body">
                <div className="label blocked-counter">Заблокированно: <b>{this.state.counter}</b></div>
                <div className="label">Введите ключевое слово</div>
                <input 
                    value={this.state.inputValue}
                    onChange={({ currentTarget }) => {this.setState({ inputValue: currentTarget.value })}}
                    type="text"
                    className="key-word-field"
                />
                <button onClick={() => this.storage.addKeyWord(this.state.inputValue)} className="btn key-word-add">Внести</button>
                {this.state.keywords.map((keyword, id) => {
                    return <div onClick={() => {
                        this.storage.removeKeyWord(keyword);
                        this.setState({ inputValue: '' });
                    }} key={keyword}>{id}: {keyword}</div>
                })}
            </div>
        </div>;
    }
}