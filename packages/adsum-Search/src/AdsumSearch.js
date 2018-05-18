import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Fuse from "fuse.js";

import './adsumSearch.css';
import translate from './adsumSearch.lang.json';

class AdsumSearch extends Component {
    constructor(props) {
        super(props);

        this.implementFuse = this.implementFuse.bind(this);
        this.updateValue = this.updateValue.bind(this);
        this.search = this.search.bind(this);

        this.fuse = this.implementFuse(this.props.data, this.props.fuseOptions);

        this.state = {
            searchInput: ''
        }
    }

    componentDidMount() {
        this.setState({
            searchInput: this.props.queryValue
        });
    }

    componentDidUpdate(prevProps) {
        if (prevProps.data !== this.props.data) {
            this.fuse = this.implementFuse(this.props.data, this.props.fuseOptions);
        }

        if (prevProps.queryValue !== this.props.queryValue) {
            this.updateValue(this.props.queryValue);
        }
    }

    updateValue(queryValue) {
        this.setState({
            searchInput: queryValue
        });
    }

    implementFuse(data, options) {
        let fuse = new Fuse(data, options);
        return fuse;
    }

    search(value) {
        if (value.length > 0) {
            return this.fuse.search(value);
        } else {
            return [];
        }
    }

    render() {
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

AdsumSearch.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    lang: PropTypes.string.isRequired,
    data: PropTypes.arrayOf(PropTypes.object).isRequired,
    fuseOptions: PropTypes.object.isRequired,
    queryValue: PropTypes.string.isRequired
};

AdsumSearch.defaultProps = {
    isOpen: false,
    lang: 'en',
    data: [],
    fuseOptions: {},
    queryValue: ''
};

export default AdsumSearch;