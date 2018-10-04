// @flow

import type { ElementType } from 'react';
import * as React from 'react';
import { connect } from 'react-redux';

import { screenSaverActions } from '../../..';

type AppStateType = {
    screenSaver: {
        modalTimer: number
    }
};
type MappedStatePropsType = {|
    modalTimer: number
|};

type MappedDispatchPropsType = {|
    closeModal: () => void,
    isHere: () => void
|};

type OwnPropsType = {||};

export type PropsType = MappedStatePropsType & MappedDispatchPropsType & OwnPropsType;

function ModalWrapper<T: ElementType>(Modal: T): React.ComponentType<PropsType> {
    // const WrappedModal = (props: PropsType): Node => <Modal {...props} />;
    function WrappedModal(props: PropsType) {
        return <Modal {...props} />;
    }

    const mapStateToProps = (state: AppStateType): MappedStatePropsType => ({
        modalTimer: state.screenSaver.modalTimer,
    });

    const mapDispatchToProps = (dispatch: *): MappedDispatchPropsType => ({
        closeModal: (): void => dispatch(screenSaverActions.isHere()),
        isHere: (): void => dispatch(screenSaverActions.isHere()),
    });

    return connect(
        mapStateToProps,
        mapDispatchToProps,
    )(WrappedModal);
}

export default ModalWrapper;
