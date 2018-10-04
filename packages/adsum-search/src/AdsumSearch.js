// @flow

import * as React from 'react';
import type { Node } from 'react';
import Fuse from 'fuse.js';

import './adsumSearch.css';
import translate from './adsumSearch.lang.json';

type PropTypes = {|
    isOpen?: boolean,
    lang?: 'en' | 'fr',
    data?: Array<Object>,
    fuseOptions?: Object,
    queryValue?: string,
    searchWrapperCSS?: CSSStyleDeclaration,
    inputCSS?: CSSStyleDeclaration,
    searchIconCSS?: CSSStyleDeclaration,
    searchIcon?: string,
    placeHolder?: string
|};

type StateType = {|
    searchInput: string
|};

class AdsumSearch extends React.Component<PropTypes, StateType> {
    static defaultProps: PropTypes = {
        isOpen: false,
        lang: 'en',
        data: [],
        fuseOptions: {},
        queryValue: '',
        searchWrapperCSS: {},
        inputCSS: {},
        searchIconCSS: {},
        searchIcon: '',
        placeHolder: null,
    };

    constructor(props) {
        super(props);
        const { data, fuseOptions } = this.props;

        this.fuse = this.implementFuse(data, fuseOptions);
        this.textInput = React.createRef();
    }

    state = {
        searchInput: '',
    };

    componentDidMount() {
        const { queryValue } = this.props;
        this.setState({
            searchInput: queryValue,
        });
    }

    componentDidUpdate(prevProps: PropsType) {
        const { data, fuseOptions, queryValue } = this.props;

        if (prevProps.data !== data) {
            this.fuse = this.implementFuse(data, fuseOptions);
        }

        if (prevProps.queryValue !== queryValue) {
            this.updateValue(queryValue);
        } else {
            this.focusTextInput();
        }
    }

    focusTextInput = () => {
        this.textInput.current.focus();
    };

    updateValue = (queryValue: string) => {
        this.setState({
            searchInput: queryValue,
        });
    };

    implementFuse = (data: Array<Object>, options: Object) => new Fuse(data, options);

    search = (searchInput: string): Array<string> => {
        if (searchInput.length > 0) {
            return this.fuse.search(searchInput);
        }
        return [];
    };

    render(): Node {
        const {
            isOpen, lang, searchWrapperCSS, inputCSS, placeHolder, searchIcon, searchIconCSS,
        } = this.props;

        const { searchInput } = this.state;

        if (!isOpen) return null;

        return (
            <div className="search-input-wrapper" style={searchWrapperCSS}>
                <div className="form-group">
                    <div className="input-group">
                        {
                            searchIcon
                                ? <img className="icon-search" src={searchIcon} alt="search icon" style={searchIconCSS} />
                                : null
                        }
                        <input
                            type="text"
                            ref={this.textInput}
                            className="form-control search-input"
                            placeholder={placeHolder || translate[lang].search}
                            value={searchInput}
                            style={inputCSS}
                            onChange={() => {
                            }}
                        />
                    </div>
                </div>
            </div>
        );
    }
}

export default AdsumSearch;
