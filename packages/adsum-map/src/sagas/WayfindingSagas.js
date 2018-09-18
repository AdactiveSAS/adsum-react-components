// @flow

import { delay } from 'redux-saga';
import { put, call, takeLatest } from 'redux-saga/effects';
import wayfindingController from '../controllers/WayfindingController';
import placesController from '../controllers/PlacesController';
import type { WillDrawPathSectionActionType, WillGoToPlaceActionType, WillGoToPoiActionType, WillResetPathActionType } from '../actions/WayfindingActions';
import { didDrawAction, types } from '../actions/WayfindingActions';
import { didCatchErrorAction } from '../actions/MainActions';

function* onGoToPlace(action: WillGoToPlaceActionType): Generator {
    try {
        yield delay(200);
        const path = placesController.getPath(action.placeId, action.pmr);
        yield call([wayfindingController, wayfindingController.drawPath], path);
        put(didDrawAction(action.placeId, action.pmr));
    } catch (e) {
        console.error('Error while drawing path in Go To Place method', action, e);
        yield put(didCatchErrorAction());
    }
}

function* onGoToPoi(action: WillGoToPoiActionType): Generator {
    try {
        yield delay(200);
        const path = placesController.getClosestPathFromPoiId(action.poiId, action.pmr);
        yield call([wayfindingController, wayfindingController.drawPath], path);
        put(didDrawAction(path.to.placeId, action.pmr));
    } catch (e) {
        console.error('Error while drawing path in Go To POI method', action, e);
        yield put(didCatchErrorAction());
    }
}

function* onDrawPathSection(action: WillDrawPathSectionActionType): Generator {
    try {
        yield delay(200);
        const path = placesController.getPath(action.placeId, action.pmr);
        yield call([wayfindingController, wayfindingController.drawPath], path, action.pathSectionIndex);
        put(didDrawAction(action.placeId, action.pmr, action.pathSectionIndex));
    } catch (e) {
        console.error('Error while drawing path in Draw Path Section method', action, e);
        yield put(didCatchErrorAction());
    }
}

function* onResetPath(action: WillResetPathActionType): Generator {
    try {
        yield call([wayfindingController, wayfindingController.reset]);
    } catch (e) {
        console.error('Error while onResetPath method', action, e);
        yield put(didCatchErrorAction());
    }
}

const wayfindingSagas = [
    takeLatest(types.WILL_DRAW_TO_PLACE, onGoToPlace),
    takeLatest(types.WILL_DRAW_TO_POI, onGoToPoi),
    takeLatest(types.WILL_DRAW_PATH_SECTION, onDrawPathSection),
    takeLatest(types.WILL_RESET_PATH, onResetPath),
];

export default wayfindingSagas;
