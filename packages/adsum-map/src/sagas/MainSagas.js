// @flow

import { delay } from 'redux-saga';
import { put, call, takeLatest } from 'redux-saga/effects';
import { MOUSE_EVENTS, SCENE_EVENTS, WAYFINDING_EVENTS } from '@adactive/adsum-web-map';
import mainController from '../controllers/MainController';
import wayfindingController from '../controllers/WayfindingController';
import placesController from '../controllers/PlacesController';
import type {
    WillInitActionType, WillChangeFloorType, WillResetActionType,
    WillZoomActionType, WillCloseActionType, WillOpenActionType
} from '../actions/MainActions';
import {
    didInitAction, didResetAction, didChangeFloorAction,
    didZoomAction, didCloseAction, didOpenAction, didCatchErrorAction, types,
} from '../actions/MainActions';
import { selectAction } from '../actions/SelectionActions';
import clickController from '../controllers/ClickController';

function* onInit(action: WillInitActionType): Generator {
    yield delay(200);
    yield call([mainController, mainController.init], action);

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

    action.awm.wayfindingManager.addEventListener(
        WAYFINDING_EVENTS.user.position.didChanged,
        () => {
            wayfindingController.updateUserObjectLabelPosition();
        }
    );

    yield call([placesController, placesController.sortAllAdsumPlaces]);

    yield put(didInitAction(
        mainController.getCurrentFloor(),
        placesController.getPath.bind(placesController),
    ));
}

function* onReset(action: WillResetActionType): Generator {
    try {
        yield delay(200);
        yield call([mainController, mainController.reset], action.stop, action.resetFloor, action.resetFloorAnimated);

        yield put(didResetAction());
    } catch (e) {
        console.error('Error while resetting Map in Reset method', action, e);
        yield put(didCatchErrorAction());
    }
}

function* onChangeFloor(action: WillChangeFloorType): Generator {
    try {
        yield delay(200);
        yield call([mainController, mainController.setCurrentFloor], action.floorId, action.centerOn, action.animated);
    } catch (e) {
        console.error('Error while changing floor in Set Current Floor', action, e);
        yield put(didCatchErrorAction());
    }
}

function* onZoom(action: WillZoomActionType): Generator {
    try {
        yield delay(200);
        yield call([mainController, mainController.zoom], action.value);

        yield put(didZoomAction());
    } catch (e) {
        console.error('Error while zooming Map in Zoom method', action, e);
        yield put(didCatchErrorAction());
    }
}

function* onClose(action: WillCloseActionType): Generator {
    try {
        yield delay(200);
        yield call([mainController, mainController.stop], action.reset);

        yield put(didCloseAction());
    } catch (e) {
        console.error('Error while closing Map in Stop method', action, e);
        yield put(didCatchErrorAction());
    }
}

function* onOpen(action: WillOpenActionType): Generator {
    try {
        yield delay(200);
        mainController.start();

        yield put(didOpenAction());
    } catch (e) {
        console.error('Error while opening Map in Start method', action, e);
        yield put(didCatchErrorAction());
    }
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
