// @flow

import * as React from 'react';
import type { Node } from 'react';
import Fuse from "fuse.js";

import './adsumSearch.css';
import translate from './adsumSearch.lang.json';

type PropTypes = {|
    +isOpen: boolean,
    +lang: 'en' | 'fr',
    +data: Array<Object>,
    +fuseOptions: Object,
    +queryValue: string
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
        queryValue: ''
    };

    constructor(props) {
        super(props);

        this.bindAll();
        this.fuse = this.implementFuse(this.props.data, this.props.fuseOptions);
    }

    state = {
        searchInput: ''
    }

    bindAll() {
        this.implementFuse = this.implementFuse.bind(this);
        this.updateValue = this.updateValue.bind(this);
        this.search = this.search.bind(this);
    }

    componentDidMount() {
        this.setState({
            searchInput: this.props.queryValue
        });
    }

    componentDidUpdate(prevProps: PropsType) {
        if (prevProps.data !== this.props.data) {
            this.fuse = this.implementFuse(this.props.data, this.props.fuseOptions);
        }

        if (prevProps.queryValue !== this.props.queryValue) {
            this.updateValue(this.props.queryValue);
        }
    }

    updateValue(queryValue: string) {
        this.setState({
            searchInput: queryValue
        });
    }

    implementFuse(data: Array<Object>, options: Object) {
        let fuse = new Fuse(data, options);
        return fuse;
    }

    search(searchInput: string): Array<string> {
        if (searchInput.length > 0) {
            return this.fuse.search(searchInput);
        } else {
            return [];
        }
    }

    render(): Node {
        const { isOpen, lang } = this.props;

        if (!isOpen) return null;

        return(
            <div className="search-input-wrapper">
                <div className="form-group">
                    <div className="input-group">
                        <div className="input-group-addon">
                            <span className="icon-search" />
                        </div>
                        <input
                            type="text"
                            className="form-control search-input"
                            placeholder={translate[lang].search}
                            value={this.state.searchInput}
                        />
                    </div>
                </div>
            </div>
        )
    }
}

export default AdsumSearch;