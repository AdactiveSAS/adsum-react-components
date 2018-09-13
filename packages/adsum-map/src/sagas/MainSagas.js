// @flow

import { delay } from 'redux-saga';
import { put, call, takeLatest } from 'redux-saga/effects';
import { MOUSE_EVENTS, SCENE_EVENTS } from '@adactive/adsum-web-map';
import mainController from '../controllers/MainController';
import placesController from '../controllers/PlacesController';
import type {
    WillInitActionType, WillChangeFloorType, WillResetActionType,
    WillZoomActionType, WillCloseActionType, WillOpenActionType
} from '../actions/MainActions';
import {
    didInitAction, didResetAction, didChangeFloorAction,
    didZoomAction, didCloseAction, didOpenAction, types,
} from '../actions/MainActions';
import { selectAction } from '../actions/SelectionActions';
import clickController from '../controllers/ClickController';

function* onInit(action: WillInitActionType): Generator {
    yield delay(200);
    yield call([mainController, mainController.init], action.awm, action.store.dispatch);

    const { dispatch } = action.store;

    action.awm.sceneManager.addEventListener(
        SCENE_EVENTS.floor.didChanged,
        ({ current, previous }) => { dispatch(didChangeFloorAction(current, previous)); }
    );

    action.awm.mouseManager.addEventListener(
        MOUSE_EVENTS.click,
        (event) => {
            const firstIntersectObject = clickController.getFirstIntersectObject(event);
            dispatch(selectAction(firstIntersectObject, true, true));
            if (action.onClick) {
                action.onClick(firstIntersectObject, event.intersects);
            }
        }
    );

    yield call([placesController, placesController.sortAllAdsumPlaces]);

    yield put(didInitAction(
        mainController.getCurrentFloor(),
        placesController.getPath.bind(placesController),
    ));
}

function* onReset(action: WillResetActionType): Generator {
    yield delay(200);

    yield call([mainController, mainController.reset], action.stop);

    yield put(didResetAction());
}

function* onChangeFloor(action: WillChangeFloorType): Generator {
    yield delay(200);
    yield call([mainController, mainController.setCurrentFloor], action.floorId, action.centerOn, action.animated);
}

function* onZoom(action: WillZoomActionType): Generator {
    yield delay(200);
    yield call([mainController, mainController.zoom], action.value);

    yield put(didZoomAction());
}

function* onClose(action: WillCloseActionType): Generator {
    yield delay(200);
    yield call([mainController, mainController.stop], action.reset);

    yield put(didCloseAction());
}

function* onOpen(action: WillOpenActionType): Generator {
    yield delay(200);

    mainController.start();

    yield put(didOpenAction());
}

const mainSagas = [
    takeLatest(types.WILL_INIT, onInit),
    takeLatest(types.WILL_CLOSE, onClose),
    takeLatest(types.WILL_OPEN, onOpen),
    takeLatest(types.WILL_RESET, onReset),
    takeLatest(types.FLOOR_WILL_CHANGE, onChangeFloor),
    takeLatest(types.WILL_SET_ZOOM, onZoom),
];

export default mainSagas;
