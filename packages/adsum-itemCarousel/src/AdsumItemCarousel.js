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
    +logo?: LogoObject
};

type PropTypes = {|
    isOpen?: boolean,
    items?: Array<ItemObject>,
    itemsPerPage?: number,
    onItemClicked?: () => null,
    listWrapperCSS?: CSSStyleDeclaration,
    thumbNailWrapperCSS?: CSSStyleDeclaration,
    logoWrapperCSS?: CSSStyleDeclaration,
    logoCSS?: CSSStyleDeclaration,
    titleWrapperCSS?: CSSStyleDeclaration,
    titleCSS?: CSSStyleDeclaration,
    dashCSS?: CSSStyleDeclaration,
    carouselOptions?: Object,
    defaultLogo?: string
|};

type StateType = {|
    slideIndex: number
|};

class AdsumItemCarousel extends React.Component<PropTypes, StateType> {
    static defaultProps = {
        isOpen: false,
        items: [],
        itemsPerPage: 0,
        onItemClicked: null,
        listWrapperCSS: {},
        thumbNailWrapperCSS: {},
        logoWrapperCSS: {},
        logoCSS: {},
        titleWrapperCSS: {},
        titleCSS: {},
        dashCSS: {},
        carouselOptions: {},
        defaultLogo: '',
    };

    state = {
        slideIndex: 0,
    };

    componentDidUpdate(prevProps: PropTypes) {
        const { items } = this.props;

        if (prevProps.items !== items) {
            // eslint-disable-next-line react/no-did-update-set-state
            this.setState({
                slideIndex: 0,
            });
        }
    }

    onItemClicked = (item: ItemObject) => {
        const { onItemClicked } = this.props;
        onItemClicked(item);
    };

    createPagination = (): Array<Array<ItemObject>> => {
        const { items, itemsPerPage } = this.props;
        let ret = [];
        const pagination = [];
        let tempCount = 0;

        _.each(items, (item: ItemObject, key: number) => {
            if (key === items.length - 1) {
                if (tempCount < itemsPerPage) {
                    ret.push(item);
                    pagination.push(ret);
                } else {
                    pagination.push(ret);
                    ret = [];
                    ret.push(item);
                    pagination.push(ret);
                }
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

        return pagination;
    };

    generatePagination = (items: Array<Array<ItemObject>>): Array<Element<'ul'>> | Element<'ul'> => {
        const { listWrapperCSS } = this.props;

        if (items.length > 0) {
            return _.map(items, (item: Array<ItemObject>, index: number) => (
                <ul className="row item" key={index} style={listWrapperCSS}>
                    {this.generateThumbNails(item)}
                </ul>
            ));
        }
        return (
            <ul className="row item" key="0" style={listWrapperCSS}>
                <li className="no-result">No items</li>
            </ul>
        );
    };

    displayLogo = (item: ItemObject): Element<'img'> | Element<'span'> => {
        const { logoCSS, defaultLogo } = this.props;

        if (item.logo && item.logo.uri) {
            return (
                <img className="thumbnail-panel-logo" src={item.logo.uri} alt="thumbnail panel logo" style={logoCSS} />
            );
        }
        if (defaultLogo) {
            return (
                <img className="thumbnail-panel-logo" src={defaultLogo} alt="thumbnail panel logo" style={logoCSS} />
            );
        }
        return (
            <span className="thumbnail-panel-logo" style={logoCSS}>{item.name}</span>
        );
    };

    generateThumbNails = (items: Array<ItemObject>): Element<'li'> => {
        const {
            thumbNailWrapperCSS, logoWrapperCSS, titleWrapperCSS, dashCSS, titleCSS,
        } = this.props;

        return _.map(items, (item: ItemObject, index: number) => (
            <li className="thumbnail-wrapper" key={index} onClick={(): void => this.onItemClicked(item)} style={thumbNailWrapperCSS}>
                <span className="btn btn-standard width height">
                    <div className="flex-center">
                        <div className="thumbnail-panel">
                            <div className="thumbnail-panel-logo-div" style={logoWrapperCSS}>
                                {
                                    this.displayLogo(item)
                                }
                            </div>
                            <div className="thumbnail-panel-title-div" style={titleWrapperCSS}>
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
            </li>
        ));
    };

    render(): Node {
        const { isOpen, carouselOptions } = this.props;
        const { slideIndex } = this.state;

        if (!isOpen) return null;

        const pagination = this.createPagination();

        return (
            <div className="templateCarousel-container">
                <div className="templateCarousel">
                    <Carousel
                        {...carouselOptions}
                        slideIndex={slideIndex}
                        afterSlide={newSlideIndex => this.setState({ slideIndex: newSlideIndex })}
                    >
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
