// @flow

import * as React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { mapActions } from '../index';

import './map.css';

import type { MapStateType } from './initialState';

type MappedStatePropsType = {|
    mapState: MapStateType
|};
type MappedDispatchPropsType = {|
    init: (onClickFunc: () => any) => void,
    willOpen: () => void,
    willClose: () => void
|};
type OwnPropsType = {|
    isOpen: boolean,
    store: any,
    onClick: () => any,
    device: number,
    display: string,
    backgroundImage: string,
    PopOver: any
|};
type PropsType = MappedStatePropsType & MappedDispatchPropsType & OwnPropsType;
/**
 * Map widget: display map
 * @memberof module:Map
 * @class
 * @extends React.Component
 */
class Map extends React.Component<PropsType> {
    /**
     * Initialize map
     */
    componentDidMount() {
        const {
            store,
            onClick,
            device,
            display,
            backgroundImage,
            PopOver,
        } = this.props;
        this.props.init(store, device, display, backgroundImage, onClick, PopOver);
    }

    componentWillUpdate(nextProps: PropsType) {
        const {
            isOpen,
            willOpen,
            willClose,
        } = this.props;

        if (!isOpen && nextProps.isOpen) {
            willOpen();
        } else if (isOpen && !nextProps.isOpen) {
            willClose();
        }
    }

    render() {
        const {
            isOpen,
            children,
            className
        } = this.props;

        return (
            <div className={`map-wrapper ${isOpen ? 'open' : ''} ${className || ''}`}>
                {children}
                <div id="adsum-web-map-container" />
            </div>
        );
    }
}

const mapStateToProps = (state: MapStateType): MappedStatePropsType => ({
    mapState: state.map.state,
});

const mapDispatchToProps = (dispatch: *): MappedDispatchPropsType => bindActionCreators({
    init: (store: any, device: number, display: string, backgroundImage: string, onClick: () => any, PopOver: any): void => dispatch(mapActions.init(store, device, display, backgroundImage, onClick, PopOver)),
    willOpen: (): void => dispatch(mapActions.willOpen()),
    willClose: (): void => dispatch(mapActions.willClose()),
}, dispatch);

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Map);
