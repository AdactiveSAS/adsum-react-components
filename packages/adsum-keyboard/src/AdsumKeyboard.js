// @flow

import * as React from 'react';
import type { Node } from 'react';

import { keysets } from './keysets/keysets.js';
import './adsumKeyboard.css';

type KeyType = { value: string, test: string, class: string }

type PropsType = {|
    +isOpen: boolean,
    +lang: 'en' | 'fr',
    +currentValue: string,
    +onKeyClicked: (string) => void,
    keyboardCSS?: CSSStyleDeclaration,
    keyboardLineCSS?: CSSStyleDeclaration,
    buttonCSS?: CSSStyleDeclaration
|};

type StateType = {|
    layout: 'layout1' | 'layout2'
|};

class AdsumKeyboard extends React.Component<PropsType, StateType> {
    static defaultProps = {
        isOpen: false,
        lang: 'en',
        currentValue: '',
        onKeyClicked: null
    }

    constructor(props: PropsType) {
        super(props);

        this.bindAll();
    }

    state = {
        layout: 'layout1'
    }

    bindAll() {
        this.onKeyClick = this.onKeyClick.bind(this);
        this.changeLayout = this.changeLayout.bind(this);
        this.resetLayout = this.resetLayout.bind(this);
    }

    resetLayout(): void {
        this.setState({
            layout: 'layout1'
        });
    }

    onKeyClick(key: KeyType): void {
        const { onKeyClicked, currentValue } = this.props;

        if (key.class.includes('switchMode')) {
            this.changeLayout(key.dataAction);
        } else if (key.value === '<---') {
            onKeyClicked(currentValue.substring(0, currentValue.length - 1));
        } else {
            onKeyClicked(currentValue + key.value);
        }
    }

    changeLayout(layout: string): void {
        this.setState({
            layout
        });
    }

    /**
     * React render keyboard based on lang
     */
    render(): Node {
        const { lang, isOpen, keyboardCSS, keyboardLineCSS, buttonCSS } = this.props;
        const keyset = keysets[lang] ? keysets[lang] : keysets.en;

        if (!isOpen) return null;

        return (
            <div className="templateKeyboard keyboardMicrosoftStyle" ref="templateKeyboard" style={keyboardCSS}>
                <div className="keyboard">
                    {
                        keyset.layouts.map((layout, i) => (
                            <div className={`${layout.class} ${layout.class.includes(this.state.layout) ? 'active' : 'hidden'}`} key={`layout ${i}`}>
                                {
                                    layout.lines.map((line, j) => (
                                        <div className={line.class} key={`line ${i + j}`} style={keyboardLineCSS}>
                                            {
                                                line.keys.map((key, k) => (
                                                    <button
                                                        value={key.value}
                                                        className={key.class}
                                                        data-action={key.dataAction}
                                                        key={`key ${i + j + k}`}
                                                        onClick={() => this.onKeyClick(key)}
                                                        style={buttonCSS}
                                                    >
                                                        {key.text}
                                                    </button>
                                                ))
                                            }
                                        </div>
                                    ))
                                }
                            </div>
                        ))
                    }
                </div>
            </div>
        );
    }
}

export default AdsumKeyboard;
