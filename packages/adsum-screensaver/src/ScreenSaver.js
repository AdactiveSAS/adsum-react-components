// @flow

import * as React from 'react';
import type { Node, Element, ComponentType } from 'react';
import { connect } from 'react-redux';
import { screenSaverActions } from '../index';

import './screenSaver.css';

import type { ScreenSaverReducersStateType } from './ScreenSaverReducers';
import type { PropsType as ModalWrapperPropsType } from './subComponents/ModalWrapper';

export type AppStateType = {
    screenSaver: ScreenSaverReducersStateType
};

type MappedStatePropsType = {|
    screensaverIsOpen: boolean,
    modalIsOpen: boolean,
    contentIsOpen: boolean,
    modalIsEnabled: boolean
|};

type MappedDispatchPropsType = {|
    onTouchToNavigateClicked: () => void,
    setModalCounter: (counter: number) => void,
    openModal: (payload: boolean) => void,
    openContent: () => void,
    isHere: () => void,
    disableModal: () => void
|};

type OwnPropsType = {|
    inactivityTimer: number,
    initialModalCounter: number,
    overlayClassName?: string,
    onOverlayClicked?: () => void,
    modalComponent: ComponentType<ModalWrapperPropsType>,
    children: Element<any>
|};

type PropsType = MappedStatePropsType & MappedDispatchPropsType & OwnPropsType;

/**
 * ScreenSaver widget, display a carousel of medias (images or videos) or "Touch to Navigate" message
 * @memberof module:ScreenSaver
 * @class
 * @extends React.Component
 */
class ScreenSaver extends React.Component<PropsType> {
    static defaultProps = {
        initialModalCounter: 10,
        inactivityTimer: 10000,
    };

    timer: ?TimeoutID = null;

    /**
     * Start screensaver timeout
     *
     */
    componentDidMount() {
        const {
            setModalCounter, initialModalCounter, modalComponent, disableModal,
        } = this.props;

        if (modalComponent) {
            setModalCounter(initialModalCounter);
        } else {
            disableModal();
        }

        document.addEventListener('touchend', this.clearInactivityTimer.bind(this), false);

        this.clearInactivityTimer();
    }

    componentWillUpdate(nextProps: PropsType) {
        const { modalIsOpen, contentIsOpen } = this.props;

        if (nextProps.modalIsOpen === true && modalIsOpen === false) {
            this.stopInactivityTimer();
        } else if (modalIsOpen === true && nextProps.modalIsOpen === false && nextProps.contentIsOpen === false) {
            this.clearInactivityTimer();
        } else if (nextProps.contentIsOpen === false && contentIsOpen === true) this.clearInactivityTimer();
    }

    clearInactivityTimer = () => {
        const {
            openModal, openContent, inactivityTimer, modalIsOpen, contentIsOpen, initialModalCounter, modalIsEnabled, setModalCounter,
        } = this.props;

        if (this.timer) clearTimeout(this.timer);

        this.timer = setTimeout(() => {
            if (!modalIsOpen && !contentIsOpen) {
                if (modalIsEnabled) {
                    setModalCounter(initialModalCounter);
                    openModal(true);
                } else {
                    openContent();
                }
            }
        }, inactivityTimer);
    };

    stopInactivityTimer() {
        if (this.timer) clearTimeout(this.timer);
    }

    /**
     * React render method
     *
     */
    render(): Node {
        const {
            children,
            screensaverIsOpen,
            overlayClassName,
            modalIsOpen,
            modalComponent,
            contentIsOpen,
            onTouchToNavigateClicked,
            onOverlayClicked,
            isHere,
        } = this.props;

        const overlayClassNames = ['screenSaver'];

        if (screensaverIsOpen) overlayClassNames.push('open');
        if (overlayClassName) overlayClassNames.push(overlayClassName);

        return (
            <div
                role="complementary"
                className={overlayClassNames.join(' ')}
                onClick={() => {
                    console.log('COMPLEMENTARY');
                    onTouchToNavigateClicked();
                    isHere();

                    if (onOverlayClicked) onOverlayClicked();

                    this.clearInactivityTimer();
                }}
            >
                <div className="centralised">
                    {modalIsOpen ? modalComponent : null}
                    {contentIsOpen ? children : null}
                </div>

            </div>
        );
    }
}

const mapStateToProps = (state: AppStateType): MappedStatePropsType => ({
    screensaverIsOpen: state.screenSaver.screensaverIsOpen,
    modalIsOpen: state.screenSaver.modalIsOpen,
    contentIsOpen: state.screenSaver.contentIsOpen,
    modalIsEnabled: state.screenSaver.modalIsEnabled,
});

const mapDispatchToProps = (dispatch: *): MappedDispatchPropsType => ({
    isHere: (): void => dispatch(screenSaverActions.isHere()),
    openModal: (payload: boolean): void => dispatch(screenSaverActions.openModal(payload)),
    openContent: (): void => dispatch(screenSaverActions.openContent()),
    onTouchToNavigateClicked: () => {
        dispatch(screenSaverActions.closeContent(true));
    },
    setModalCounter: (counter: number): void => dispatch(screenSaverActions.setModalCounter(counter)),
    disableModal: (): void => dispatch(screenSaverActions.disableModal()),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(ScreenSaver);
