// @flow

import { delay } from 'redux-saga';
import { put, call, takeLatest } from 'redux-saga/effects';
import { SCENE_EVENTS, MOUSE_EVENTS } from '@adactive/adsum-web-map';

import { types as mapActionTypes, changeFloor, floorDidChanged, onClick, willSelect, didSelect, didDraw, setCurrentPath, didClose, didOpen } from './MapActions';
import mapController from './controllers/MapController';
import selectionController from './controllers/SelectionController';
import clickController from './controllers/ClickController';
import wayfindingController from './controllers/WayfindingController';
import placesController from './controllers/PlacesController';

import type {
    FloorWillChangeActionType,
    WillSelectActionType,
    WillDrawActionType,
    WillDrawToPoiActionType,
    WillDrawToPlaceActionType,
    WillDrawPathSectionActionType,
    WillSelectPoiActionType,
    WillSelectPlaceActionType,
    WillSelectMultiPlacesActionType,
    ResetDrawActionType,
    WillInitActionType
} from './MapActions';

const {
    init,
    reset,
    start,
    getAllFloors,
    getAllBuildings,
    setCurrentFloor
} = mapController;
const { getSortedPaths, sortAllPlaces } = placesController;

const { updateSelection, selectMultiplePlaces } = selectionController;
const { drawPath, goToKioskLocation } = wayfindingController;

let store = null;
let resetPromise = null;
let resetDrawPromise = null;
let onClickCallBack = null;

/* ------------------------------------ MAP EVENT  --------------------------------------------*/
const initMapEvents = () => {
    mapController.awm.sceneManager.addEventListener(
        SCENE_EVENTS.floor.didChanged,
        (floorDidChangedEvent) => {
            const currentFloor = floorDidChangedEvent.current;
            const previousFloor = floorDidChangedEvent.previous === null ? null : floorDidChangedEvent.previous;

            store.dispatch(floorDidChanged(
                (currentFloor === null ? null : currentFloor.id),
                (previousFloor === null ? null : previousFloor.id),
            ));
        }
    );

    mapController.awm.mouseManager.addEventListener(
        MOUSE_EVENTS.click,
        (event) => {
            clickController.onClick(event);
            store.dispatch(onClick(clickController.getEvent.bind(clickController)));
            const firstIntersectObject = clickController.getFirstIntersectObject();
            store.dispatch(willSelect(() => firstIntersectObject));
            if (onClickCallBack) {
                onClickCallBack(firstIntersectObject);
            }
        }
    );
};

/* ------------------------------------ MAP ASYNC METHODS  --------------------------------------------*/
function* onInit(action: WillInitActionType) {
    yield delay(200);
    store = action.store;
    yield call([mapController, init], action.device, action.display, action.backgroundImage, action.PopOver, action.wireFraming, action.multiPlaceSelection);

    initMapEvents();

    const currentFloor = mapController.getCurrentFloor();

    yield call([placesController, sortAllPlaces]);

    yield put({
        type: mapActionTypes.DID_INIT,
        getFloors: getAllFloors.bind(mapController),
        getBuildings: getAllBuildings.bind(mapController),
        currentFloor: currentFloor === null ? null : currentFloor.id,
        reset: reset.bind(mapController),
        getSortedPaths: getSortedPaths.bind(placesController),
        wayFinder: wayfindingController
    });

    if (action.onClick) {
        onClickCallBack = action.onClick;
    }
}

function* onReset(action: FloorWillChangeActionType) {
    yield delay(200);
    resetPromise = call([mapController, reset]);
    yield resetPromise;
    resetPromise = null;
    yield put({
        type: mapActionTypes.DID_RESET,
    });
}

function* onSetCurrentFloor(action: FloorWillChangeActionType) {
    yield delay(200);
    yield call([mapController, setCurrentFloor], action.floorID, action.centerOn);
}

function* onSelect(action: WillSelectActionType) {
    yield call([selectionController, updateSelection], action.object(), true);
    store.dispatch(didSelect(selectionController.getCurrent.bind(selectionController)));
}

function* onSelectPoi(action: WillSelectPoiActionType) {
    yield delay(200);
    const path = placesController.getClosestPathFromPoiId(action.poiId);
    if (path) {
        const to = path.to.adsumObject;
        if (to.parent) {
            store.dispatch(changeFloor(to.parent.id, false)); // TODO to.parent.isFLoor
        }
        store.dispatch(willSelect(() => to));
    }
}

function* onSelectPlace(action: WillSelectPlaceActionType) {
    yield delay(200);
    const path = placesController.getPath(action.placeId);
    const to = path.to.adsumObject;
    store.dispatch(changeFloor(to.parent.id)); // TODO to.parent.isFLoor
    store.dispatch(willSelect(() => to));
}

function* onSelectMultiPlaces(action: WillSelectMultiPlacesActionType) {
    yield delay(200);
    yield call([selectionController, selectMultiplePlaces], action.poi);
    store.dispatch(didSelect(selectionController.getCurrent.bind(selectionController)));
}

function* onGoTo(action: WillDrawActionType) {
    const path = wayfindingController.getPath(action.object());
    store.dispatch(setCurrentPath(() => path));
    yield call([wayfindingController, drawPath], path);
    store.dispatch(didDraw());
}

function* resetDraw(action: ResetDrawActionType) {
    const resetDrawnPath = wayfindingController.reset;
    resetDrawPromise = call([wayfindingController, resetDrawnPath]);
    yield resetDrawPromise;
    resetDrawPromise = null;
}

function* onGoToPoi(action: WillDrawToPoiActionType) {
    yield delay(200);

    if (resetDrawPromise) {
        yield resetDrawPromise;
    }

    const path = placesController.getClosestPathFromPoiId(action.poiId);

    store.dispatch(setCurrentPath(() => path));

    if (path) {
        const to = path.to.adsumObject;
        store.dispatch(willSelect(() => to));
    }

    yield call([wayfindingController, drawPath], path);

    store.dispatch(didDraw());
}

function* onGoToPlace(action: WillDrawToPlaceActionType) {
    yield delay(200);
    if (resetDrawPromise) {
        yield resetDrawPromise;
    }
    const path = placesController.getPath(action.placeId);
    store.dispatch(setCurrentPath(() => path));
    yield call([wayfindingController, drawPath], path);
    store.dispatch(didDraw());
}

function* onDrawPathSection(action: WillDrawPathSectionActionType) {
    yield delay(200);
    if (resetDrawPromise) {
        yield resetDrawPromise;
    }
    //
    const path = placesController.getPath(action.placeId);
    store.dispatch(setCurrentPath(() => path));
    yield call([wayfindingController, drawPath], path, action.pathSectionIndex);
    store.dispatch(didDraw());
}

function* onOpen() {
    yield delay(200);
    if (resetPromise) {
        yield resetPromise;
    }
    yield call([mapController, start]);
    store.dispatch(didOpen());
}

function* onClose() {
    yield delay(200);
    resetPromise = call([mapController, reset], true);
    yield resetPromise;
    resetPromise = null;
    store.dispatch(didClose());
}

function* onGoMyLocation() {
    yield call([wayfindingController, goToKioskLocation]);
    yield put({
        type: mapActionTypes.DID_GO_MY_LOCATION,
    });
}

function* mapSaga() {
    yield takeLatest(mapActionTypes.WILL_INIT, onInit);
    yield takeLatest(mapActionTypes.WILL_RESET, onReset);
    yield takeLatest(mapActionTypes.FLOOR_WILL_CHANGE, onSetCurrentFloor);
    yield takeLatest(mapActionTypes.WILL_SELECT, onSelect);
    yield takeLatest(mapActionTypes.WILL_SELECT_A_POI, onSelectPoi);
    yield takeLatest(mapActionTypes.WILL_SELECT_A_PLACE, onSelectPlace);
    yield takeLatest(mapActionTypes.WILL_SELECT_MULTI_PLACES, onSelectMultiPlaces);
    yield takeLatest(mapActionTypes.WILL_DRAW, onGoTo);
    yield takeLatest(mapActionTypes.WILL_DRAW_TO_POI, onGoToPoi);
    yield takeLatest(mapActionTypes.WILL_DRAW_TO_PLACE, onGoToPlace);
    yield takeLatest(mapActionTypes.WILL_DRAW_PATH_SECTION, onDrawPathSection);
    yield takeLatest(mapActionTypes.RESET_DRAW, resetDraw);
    yield takeLatest(mapActionTypes.WILL_OPEN, onOpen);
    yield takeLatest(mapActionTypes.WILL_CLOSE, onClose);
    yield takeLatest(mapActionTypes.WILL_GO_MY_LOCATION, onGoMyLocation);
}

export default mapSaga;
