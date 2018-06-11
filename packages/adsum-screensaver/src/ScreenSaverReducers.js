// @flow

import { types as screenSaverActionsType } from './ScreenSaverActions';

import type { ScreensaverActionType } from './ScreenSaverActions';

export type ScreenSaverReducersStateType = {|
    +screensaverIsOpen: boolean,
    +modalIsOpen: boolean,
    +contentIsOpen: boolean,
    +modalTimer: number,
    +modalIsEnabled: boolean
|};

export type ScreenSaverReducersType = (state: ScreenSaverReducersStateType, action: ScreensaverActionType) => ScreenSaverReducersStateType;

export const initialState: ScreenSaverReducersStateType = {
    screensaverIsOpen: false,
    modalIsOpen: false,
    contentIsOpen: false,
    modalTimer: 10,
    modalIsEnabled: true
};

const screenSaverReducers = (state: ScreenSaverReducersStateType = initialState, action: ScreensaverActionType): ScreenSaverReducersStateType => {
    switch (action.type) {
    case screenSaverActionsType.OPEN_MODAL:
        return {
            ...state,
            modalIsOpen: true,
            screensaverIsOpen: true
        };
    case screenSaverActionsType.SET_MODAL_COUNTER:
        return {
            ...state,
            modalTimer: action.modalTimer
        };
    case screenSaverActionsType.DECREMENT_MODAL_TIMER:
        return {
            ...state,
            modalTimer: --state.modalTimer
        };
    case screenSaverActionsType.CLOSE_MODAL:
        return {
            ...state,
            modalIsOpen: false,
            screensaverIsOpen: false
        };
    case screenSaverActionsType.OPEN_CONTENT:
        return {
            ...state,
            contentIsOpen: true,
            screensaverIsOpen: true
        };
    case screenSaverActionsType.CLOSE_CONTENT:
        return {
            ...state,
            contentIsOpen: false,
            screensaverIsOpen: false
        };
    case screenSaverActionsType.DISABLE_MODAL:
        return {
            ...state,
            modalIsEnabled: false
        };
    default:
        return state;
    }
};

export default screenSaverReducers;
