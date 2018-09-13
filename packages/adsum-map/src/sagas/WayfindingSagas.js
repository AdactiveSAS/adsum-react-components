// @flow

import { delay } from 'redux-saga';
import { put, call, takeLatest } from 'redux-saga/effects';
import wayfindingController from '../controllers/WayfindingController';
import placesController from '../controllers/PlacesController';
import type {
    WillDrawPathSectionActionType, WillGoToPlaceActionType, WillGoToPoiActionType
} from '../actions/WayfindingActions';
import { didDrawAction, types } from '../actions/WayfindingActions';

function* onGoToPlace(action: WillGoToPlaceActionType): Generator {
    yield delay(200);
    const path = placesController.getPath(action.placeId, action.pmr);
    yield call([wayfindingController, wayfindingController.drawPath], path);
    put(didDrawAction(action.placeId, action.pmr));
}

function* onGoToPoi(action: WillGoToPoiActionType): Generator {
    yield delay(200);
    const path = placesController.getClosestPathFromPoiId(action.poiId, action.pmr);
    yield call([wayfindingController, wayfindingController.drawPath], path);
    put(didDrawAction(path.to.placeId, action.pmr));
}

function* onDrawPathSection(action: WillDrawPathSectionActionType): Generator {
    yield delay(200);
    const path = placesController.getPath(action.placeId, action.pmr);
    yield call([wayfindingController, wayfindingController.drawPath], path, action.pathSectionIndex);
    put(didDrawAction(action.placeId, action.pmr, action.pathSectionIndex));
}

const wayfindingSagas = [
    takeLatest(types.WILL_DRAW_TO_PLACE, onGoToPlace),
    takeLatest(types.WILL_DRAW_TO_POI, onGoToPoi),
    takeLatest(types.WILL_DRAW_PATH_SECTION, onDrawPathSection),
];

export default wayfindingSagas;
