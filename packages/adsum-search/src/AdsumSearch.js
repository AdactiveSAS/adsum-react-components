// @flow

import * as React from 'react';
import type { Node } from 'react';
import Fuse from 'fuse.js';

import './adsumSearch.css';
import translate from './adsumSearch.lang.json';

type PropTypes = {|
    +isOpen: boolean,
    +lang: 'en' | 'fr',
    +data: Array<Object>,
    +fuseOptions: Object,
    +queryValue: string,
    +searchWrapperCSS?: CSSStyleDeclaration,
    +inputCSS?: CSSStyleDeclaration,
	+searchIconCSS?: CSSStyleDeclaration,
	+searchIcon?: string,
    +placeHolder?: string
|};

type StateType = {|
    searchInput: string
|};

class AdsumSearch extends React.Component<PropTypes, StateType> {
    static defaultProps = {
        isOpen: false,
        lang: 'en',
        data: [],
        fuseOptions: {},
        queryValue: '',
        placeHolder: null,
    };

    constructor(props) {
        super(props);

        this.bindAll();
        this.fuse = this.implementFuse(this.props.data, this.props.fuseOptions);
        this.textInput = React.createRef();
    }

    state = {
        searchInput: '',
    };

    bindAll() {
        this.implementFuse = this.implementFuse.bind(this);
        this.updateValue = this.updateValue.bind(this);
        this.search = this.search.bind(this);
        this.focusTextInput = this.focusTextInput.bind(this);
    }

    componentDidMount() {
        this.setState({
            searchInput: this.props.queryValue,
        });
    }

    componentDidUpdate(prevProps: PropsType) {
        if (prevProps.data !== this.props.data) {
            this.fuse = this.implementFuse(this.props.data, this.props.fuseOptions);
        }

        if (prevProps.queryValue !== this.props.queryValue) {
            this.updateValue(this.props.queryValue);
        } else {
            this.focusTextInput();
        }
    }

    focusTextInput() {
        this.textInput.current.focus();
    }

    updateValue(queryValue: string) {
        this.setState({
            searchInput: queryValue,
        });
    }

    implementFuse(data: Array<Object>, options: Object) {
        const fuse = new Fuse(data, options);
        return fuse;
    }

    search(searchInput: string): Array<string> {
        if (searchInput.length > 0) {
            return this.fuse.search(searchInput);
        }
        return [];
    }

    render(): Node {
        const {
            isOpen, lang, searchWrapperCSS, inputCSS, placeHolder, searchIcon, searchIconCSS,
        } = this.props;

        if (!isOpen) return null;

        return (
            <div className="search-input-wrapper" style={searchWrapperCSS}>
                <div className="form-group">
                    <div className="input-group">
                        {
		                    searchIcon
		                      ? <img className="icon-search" src={searchIcon} style={searchIconCSS} />
			                    : null
	                    }
                        <input
                            type="text"
                            ref={this.textInput}
                            className="form-control search-input"
                            placeholder={placeHolder || translate[lang].search}
                            value={this.state.searchInput}
                            style={inputCSS}
                            onChange={(_) => {}}
                        />
                    </div>
                </div>
            </div>
        );
    }
}

export default AdsumSearch;
