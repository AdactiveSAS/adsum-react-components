import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { keysets } from './keysets/keysets.js';

import './AdsumKeyboard.css';

class AdsumKeyboard extends Component {
    constructor(props) {
        super(props);

        this.onKeyClick = this.onKeyClick.bind(this);
        this.changeLayout = this.changeLayout.bind(this);
        this.resetLayout = this.resetLayout.bind(this);

        this.state = {
            layout: 'layout1'
        };
    }

    resetLayout() {
        this.setState({
            layout: 'layout1'
        });
    }

    onKeyClick(key) {
        const { onKeyClicked } = this.props;

        if (key.class.includes('switchMode')) {
            this.changeLayout(key.dataAction);
        } else {
            onKeyClicked(key.value);
        }
    }

    changeLayout(layout) {
        this.setState({
            layout
        });
    }

    /**
     * Get images for certain keys
     */
    getAssetsStyle(classes) {
        if (classes.includes('backspace-icon')) {
            return {
                backgroundImage: "url('./assets/img/keyboard/white-backspaceKey.png')"
            };
        } else if (classes.includes('shift-icon')) {
            return {
                backgroundImage: "url('./assets/img/keyboard/white-shiftKey.png')"
            };
        }
    }

    /**
     * React render keyboard based on lang
     */
    render() {
        const { lang, isOpen } = this.props;
        const keyset = keysets[lang] ? keysets[lang] : keysets.en;

        if (!isOpen) return null;

        return (
            <div className="templateKeyboard keyboardMicrosoftStyle" ref="templateKeyboard">
                <div className="keyboard">
                    {
                        keyset.layouts.map((layout, i) => (
                            <div className={`${layout.class} ${layout.class.includes(this.state.layout) ? 'active' : 'hidden'}`} key={`layout ${i}`}>
                                {
                                    layout.lines.map((line, j) => (
                                        <div className={line.class} key={`line ${i + j}`}>
                                            {
                                                line.keys.map((key, k) => (
                                                    <button
                                                        value={key.value}
                                                        className={key.class}
                                                        data-action={key.dataAction}
                                                        key={`key ${i + j + k}`}
                                                        style={this.getAssetsStyle(key.class)}
                                                        onClick={() => this.onKeyClick(key)}
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

AdsumKeyboard.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    lang: PropTypes.string.isRequired,
    onKeyClicked: PropTypes.func.isRequired
};

AdsumKeyboard.defaultProps = {
    isOpen: false,
    lang: 'en'
};

export default AdsumKeyboard;
