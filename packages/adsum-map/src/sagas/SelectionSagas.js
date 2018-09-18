// @flow

import { delay } from 'redux-saga';
import { put, call, takeLatest } from 'redux-saga/effects';
import selectionController from '../controllers/SelectionController';
import type {
    WillSelectActionType, WillSelectPlaceActionType, WillSelectPoiActionType
} from '../actions/SelectionActions';
import { didSelectAction, types } from '../actions/SelectionActions';
import { didCatchErrorAction } from '../actions/MainActions';

function* onSelect(action: WillSelectActionType): Generator {
    try {
        yield delay(200);
        yield call(
            [selectionController, selectionController.select],
            action.adsumObject, action.reset, action.centerOn, action.onlyIfPoi,
        );
        put(didSelectAction(selectionController.getSelection()));
    } catch (e) {
        console.error('Error while selecting in Select method', action, e);
        yield put(didCatchErrorAction());
    }
}

function* onSelectPoi(action: WillSelectPoiActionType): Generator {
    try {
        yield delay(200);
        yield call(
            [selectionController, selectionController.selectPoi],
            action.poi, action.reset, action.centerOn,
        );
        put(didSelectAction(selectionController.getSelection()));
    } catch (e) {
        console.error('Error while selecting POI in Select POI method', action, e);
        yield put(didCatchErrorAction());
    }
}

function* onSelectPlace(action: WillSelectPlaceActionType): Generator {
    try {
        yield delay(200);
        yield call(
            [selectionController, selectionController.selectPlace],
            action.place, action.reset, action.centerOn,
        );
        put(didSelectAction(selectionController.getSelection()));
    } catch (e) {
        console.error('Error while selecting Place in Select Place method', action, e);
        yield put(didCatchErrorAction());
    }
}

const selectionSagas = [
    takeLatest(types.WILL_SELECT, onSelect),
    takeLatest(types.WILL_SELECT_A_PLACE, onSelectPlace),
    takeLatest(types.WILL_SELECT_A_POI, onSelectPoi),
];

export default selectionSagas;
