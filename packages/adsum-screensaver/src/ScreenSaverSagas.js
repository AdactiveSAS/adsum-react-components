// @flow

import { delay, takeEvery } from 'redux-saga';
import { put, select, fork, cancel, cancelled } from 'redux-saga/effects';
import {
    types,
    openModal,
    closeModal,
    decrementModal,
    openContent,
    closeContent
} from './ScreenSaverActions';

import type {
    OpenModalActionType,
    CloseModalActionType,
    IsHereActionType,
    CloseContentActionType
} from './ScreenSaverActions';
import type { ScreenSaverReducersStateType } from './ScreenSaverReducers';

type AppStateType = {
    screenSaver: ScreenSaverReducersStateType
};
type ModalHandlerActionsType = OpenModalActionType | CloseModalActionType | IsHereActionType;

const screenSaverSelector = (state: AppStateType): ScreenSaverReducersStateType => state.screenSaver;

function* startModalTimer(counter: number) {
    try {
        while (counter !== 0) {
            yield delay(1000);
            yield put(decrementModal());
            counter--;
        }
        yield put(closeModal('openContent'));
    } finally {
        if (yield cancelled()) yield put(closeModal());
    }
}

const modalHandler = ((): any => {
    let modalTimerTask = null;

    return function* (action: ModalHandlerActionsType): any {
        const screenSaverState = yield select(screenSaverSelector);

        switch (action.type) {
        case types.OPEN_MODAL:
            if (action.payload) {
                modalTimerTask = yield fork(startModalTimer, screenSaverState.modalTimer);
                yield put(openModal());
            }
            break;
        case types.CLOSE_MODAL:
            if (action.payload && action.payload === 'openContent') {
                yield put(openContent());
            }
            break;
        case types.IS_HERE:
            if (modalTimerTask) yield cancel(modalTimerTask);

            yield put(closeModal());
            yield put(closeContent());
            break;
        default: break;
        }
    };
})();

function* contentHandler(action: CloseContentActionType): any {
    if (action.payload) {
        yield put(closeContent());
    }
}

export default function* screenSaver(): any {
    yield takeEvery([types.OPEN_MODAL, types.IS_HERE, types.CLOSE_MODAL], modalHandler);
    yield takeEvery(types.CLOSE_CONTENT, contentHandler);
}
