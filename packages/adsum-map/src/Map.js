// @flow

import * as React from 'react';
import { bindActionCreators, Store } from 'redux';
import { connect } from 'react-redux';
import type { AdsumWebMap, LabelObject, PathSection } from '@adactive/adsum-web-map';

import { initAction, openAction, closeAction } from './actions/MainActions';

import './map.css';

import type { MapStateType } from './initialState';

type MappedStatePropsType = {|
    // eslint-disable-next-line react/no-unused-prop-types
    mapState: MapStateType
|};

type MappedDispatchPropsType = {|
    init: (awm: AdsumWebMap, store: Store) => void,
    open: () => void,
    close: (reset: boolean) => void
|};

type OwnPropsType = {|
    awm: AdsumWebMap,
    store: Store,
    onClick: () => any,
    isOpen: boolean,
    children?: React.Node,
    className?: string,
    userObjectLabel?: ?LabelObject,
    getDrawPathSectionOptions?: ?(pathSection: PathSection) => {
        drawOptions: ?object,
        setCurrentFloorOptions: ?object
    },
    resetOnClose: boolean,
    zoom?: { min?: number, max?: number },
    autoSelectOnClick: boolean,
    backgroundImage?: ?string,
    highlightColor?: string,
|};

type PropsType = MappedStatePropsType & MappedDispatchPropsType & OwnPropsType;

/**
 * Map widget: display map
 * @memberof module:Map
 * @class
 * @extends React.Component
 */
class Map extends React.Component<PropsType> {
    static defaultProps = {
        resetOnClose: true,
        autoSelectOnClick: true,
        highlightColor: '#78e08f',
    };

    initialized: boolean = false;

    componentWillUpdate(nextProps: PropsType) {
        const {
            awm,
            store,
            onClick,
            autoSelectOnClick,
            init,
            userObjectLabel,
            getDrawPathSectionOptions,
            zoom,
            backgroundImage,
            highlightColor,
        } = nextProps;

        if (!this.initialized && awm !== null) {
            init(
                awm,
                store,
                onClick,
                autoSelectOnClick,
                userObjectLabel,
                getDrawPathSectionOptions,
                zoom,
                backgroundImage,
                highlightColor,
            );
            this.initialized = true;
        }

        const {
            isOpen, open, close, resetOnClose,
        } = this.props;

        if (!isOpen && nextProps.isOpen) {
            open();
        } else if (isOpen && !nextProps.isOpen) {
            close(resetOnClose);
        }
    }

    render() {
        const {
            isOpen,
            children,
            className,
        } = this.props;

        return (
            <div className={`map-wrapper ${isOpen ? 'open' : ''} ${className || ''}`}>
                {children}
            </div>
        );
    }
}

const mapStateToProps = (state: MapStateType): MappedStatePropsType => ({
    mapState: state.map.state,
});

const mapDispatchToProps = (dispatch: *): MappedDispatchPropsType => bindActionCreators({
    init: (
        awm: AdsumWebMap,
        store: Store,
        onClick: () => any,
        autoSelectOnClick: boolean = true,
        userObjectLabel: ?LabelObject = null,
        getDrawPathSectionOptions: (pathSection: PathSection) => {
            drawOptions: ?object,
            setCurrentFloorOptions: ?object
        } = null,
        zoom: { min?: number, max?: number } = null,
        backgroundImage: ?string = null,
        highlightColor: string = '#78e08f',
    ): void => dispatch(initAction(
        awm,
        store,
        onClick,
        autoSelectOnClick,
        userObjectLabel,
        getDrawPathSectionOptions,
        zoom,
        backgroundImage,
        highlightColor,
    )),
    open: (): void => dispatch(openAction()),
    close: (reset: boolean): void => dispatch(closeAction(reset)),
}, dispatch);

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(Map);
