// @flow

export const types = {
    OPEN_MODAL: 'ScreenSaver/OPEN_MODAL',
    CLOSE_MODAL: 'ScreenSaver/CLOSE_MODAL',
    DECREMENT_MODAL_TIMER: 'ScreenSaver/DECREMENT_MODAL_TIMER',
    OPEN_CONTENT: 'ScreenSaver/OPEN_CONTENT',
    CLOSE_CONTENT: 'ScreenSaver/CLOSE_CONTENT',
    CLEAR_INACTIVITY_TIMER: 'ScreenSaver/CLEAR_INACTIVITY_TIMER',
    IS_HERE: 'ScreenSaver/IS_HERE',
    SET_MODAL_COUNTER: 'ScreenSaver/SET_MODAL_COUNTER',
    DISABLE_MODAL: 'ScreenSaver/DISABLE_MODAL'
};

export type OpenModalActionType = {| type: 'ScreenSaver/OPEN_MODAL', payload?: boolean |};
export type CloseModalActionType = {| type: 'ScreenSaver/CLOSE_MODAL', payload?: boolean | string |};
export type DecrementModalTimerActionType = {| type: 'ScreenSaver/DECREMENT_MODAL_TIMER'|};
export type OpenContentActionType = {| type: 'ScreenSaver/OPEN_CONTENT'|};
export type CloseContentActionType = {| type: 'ScreenSaver/CLOSE_CONTENT', payload?: boolean | 'openContent' |};
export type IsHereActionType = {| type: 'ScreenSaver/IS_HERE'|};
export type SetModalCounterActionType = {| type: 'ScreenSaver/SET_MODAL_COUNTER', modalTimer: number |};
export type DisableModalActionType = {| type: 'ScreenSaver/SET_MODAL_COUNTER' |};

export type ScreensaverActionType =
    | OpenModalActionType
    | CloseModalActionType
    | DecrementModalTimerActionType
    | OpenContentActionType
    | CloseContentActionType
    | IsHereActionType
    | SetModalCounterActionType
    | DisableModalActionType;

export type OpenModalActionCreatorType = (payload?: boolean) => OpenModalActionType;
export type CloseModalActionCreatorType = (payload?: boolean | string) => CloseModalActionType;
export type DecrementModalTimerActionCreatorType = () => DecrementModalTimerActionType;
export type OpenContentActionCreatorType = () => OpenContentActionType;
export type CloseContentActionCreatorType = (payload?: boolean | 'openContent') => CloseContentActionType;
export type IsHereActionCreatorType = () => IsHereActionType;
export type SetModalCounterActionCreatorType = (modalTimer: number) => SetModalCounterActionType;
export type DisableModalActionCreatorType = () => DisableModalActionType;

export const openModal: OpenModalActionCreatorType
    = (payload?: boolean): OpenModalActionType => ({ type: types.OPEN_MODAL, payload });
export const closeModal: CloseModalActionCreatorType
    = (payload?: boolean | string): CloseModalActionType => ({ type: types.CLOSE_MODAL, payload });
export const decrementModal: DecrementModalTimerActionCreatorType
    = (): DecrementModalTimerActionType => ({ type: types.DECREMENT_MODAL_TIMER });
export const openContent: OpenContentActionCreatorType
    = (): OpenContentActionType => ({ type: types.OPEN_CONTENT });
export const closeContent: CloseContentActionCreatorType
    = (payload?: boolean | 'openContent'): CloseContentActionType => ({ type: types.CLOSE_CONTENT, payload });
export const isHere: IsHereActionCreatorType
    = (): IsHereActionType => ({ type: types.IS_HERE });
export const setModalCounter: SetModalCounterActionCreatorType
    = (modalTimer: number): SetModalCounterActionType => ({ type: types.SET_MODAL_COUNTER, modalTimer });
export const disableModal: DisableModalActionCreatorType
    = (): DisableModalActionType => ({ type: types.DISABLE_MODAL });
