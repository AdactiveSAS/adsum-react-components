// @flow

import * as React from 'react';
import type { Node } from 'react';
import _ from 'lodash';
import Carousel from 'nuka-carousel';

import './adsumItemCarousel.css';

export type LogoObject = {
    +uri: string
};

export type ItemObject = {
    +name: string,
    +logo: LogoObject
};

type PropTypes = {|
    +isOpen: boolean,
    +items: Array<ItemObject>,
    +itemsPerPage: number,
    +onItemClicked: () => null,
    logoCSS?: Object,
    titleCSS?: Object,
    dashCSS?: Object,
    carouselDecorators?: Array<Object>,
    carouselOptions?: Object
|};

class AdsumItemCarousel extends React.Component<PropTypes> {
    static defaultProps = {
        isOpen: false,
        items: [],
        itemsPerPage: 0,
        onItemClicked: null,
        logoCSS: {},
        titleCSS: {},
        dashCSS: {},
        carouselDecorators: [],
        carouselOptions: {}
    };

    constructor(props: PropTypes) {
        super(props);

        this.bindAll();
    }

    bindAll() {
        this.generateThumbNails = this.generateThumbNails.bind(this);
        this.generatePagination = this.generatePagination.bind(this);
        this.createPagination = this.createPagination.bind(this);
        this.displayLogo = this.displayLogo.bind(this);
        this.onItemClicked = this.onItemClicked.bind(this);
    }

    componentDidMount() {
        const { items } = this.props;
        console.log('[COMPONENT DID MOUNT - CHECKING DATA] : ', items);
    }

    onItemClicked(item: ItemObject) {
        const { onItemClicked } = this.props;
        onItemClicked(item);
    }

    createPagination(): Array<Array<ItemObject>> {
        const { items, itemsPerPage } = this.props;
        let ret = [];
        const pagination = [];
        let tempCount = 0;

        _.each(items, (item: ItemObject, key: number) => {
            if (key === items.length - 1) {
                ret.push(item);
                pagination.push(ret);
            } else if (tempCount < itemsPerPage) {
                ret.push(item);
                tempCount++;
            } else if (tempCount === itemsPerPage) {
                pagination.push(ret);
                ret = [];
                ret.push(item);
                tempCount = 1;
            }
        });

        console.log(pagination);
        return pagination;
    }

    generatePagination(items: Array<Array<ItemObject>>) {
        const ret = [];

        if (items.length > 0) {
            _.each(items, (item: Array<ItemObject>, index: number) => {
                ret.push(
                    <ul className="row item" key={index}>
                        { this.generateThumbNails(item) }
                    </ul>
                );
            });
        } else {
            ret.push(
                <ul className="row item" key="0">
                    <li className="no-result" >No items</li>
                </ul>);
        }

        return ret;
    }

    displayLogo(item: ItemObject) {
        if (item.logo && item.logo.uri) {
            return (
                <img className="thumbnail-panel-logo" src={item.logo.uri} />
            );
        }
        return (
            <span className="thumbnail-panel-logo">{item.name}</span>
        );
    }

    generateThumbNails(items: Array<ItemObject>) {
        const { logoCSS, titleCSS, dashCSS } = this.props;
        const ret = [];
        _.each(items, (item: ItemObject, index: number) => {
            ret.push(
                <li className="col-md-3 thumbnail-wrapper" key={index} onClick={(): void => this.onItemClicked(item)}>
                    <span className="btn btn-standard width height">
                        <div className="flex-center">
                            <div className="thumbnail-panel">
                                <div className="thumbnail-panel-logo-div" style={logoCSS}>
                                    {
                                        this.displayLogo(item)
                                    }
                                </div>
                                <div className="thumbnail-panel-title-div" style={titleCSS}>
                                    <div className="thumbnail-panel-dash-div">
                                        <span className="thumbnail-panel-dash" style={dashCSS} />
                                    </div>
                                    <div className="thumbnail-panel-title-wrapper">
                                        <span className="thumbnail-panel-title" style={titleCSS}>{item.name}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </span>
                </li>);
        });

        return ret;
    }

    render(): Node {
        const { isOpen, carouselDecorators, carouselOptions } = this.props;

        if (!isOpen) return null;

        const pagination = this.createPagination();

        return (
            <div className="templateCarousel-container">
                <div className="templateCarousel">
                    <Carousel {...carouselOptions} decorators={carouselDecorators}>
                        {
                            this.generatePagination(pagination)
                        }
                    </Carousel>
                </div>
            </div>
        );
    }
}

export default AdsumItemCarousel;
