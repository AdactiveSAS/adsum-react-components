// @flow

import { delay } from 'redux-saga';
import { put, call, takeLatest } from 'redux-saga/effects';
import selectionController from '../controllers/SelectionController';
import placesController from '../controllers/PlacesController';
import type {
    WillSelectActionType, WillSelectPlaceActionType, WillSelectPoiActionType
} from '../actions/SelectionActions';
import { didSelectAction, types } from '../actions/SelectionActions';

function* onSelect(action: WillSelectActionType): Generator {
    yield delay(200);
    yield call(
        [selectionController, selectionController.select],
        action.adsumObject, action.reset, action.centerOn, action.onlyIfPoi,
    );
    put(didSelectAction(selectionController.getSelection()));
}

function* onSelectPoi(action: WillSelectPoiActionType): Generator {
    yield delay(200);
    yield call(
        [selectionController, selectionController.selectPoi],
        action.poi, action.reset, action.centerOn,
    );
    put(didSelectAction(selectionController.getSelection()));
}

function* onSelectPlace(action: WillSelectPlaceActionType): Generator {
    yield delay(200);
    yield call(
        [selectionController, selectionController.selectPlace],
        action.place, action.reset, action.centerOn,
    );
    put(didSelectAction(selectionController.getSelection()));
}

const selectionSagas = [
    takeLatest(types.WILL_SELECT, onSelect),
    takeLatest(types.WILL_SELECT_A_PLACE, onSelectPlace),
    takeLatest(types.WILL_SELECT_A_POI, onSelectPoi),
];

export default selectionSagas;
