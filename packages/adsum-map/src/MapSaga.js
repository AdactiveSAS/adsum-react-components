// @flow

import { all } from 'redux-saga/effects';
import mainSagas from './sagas/MainSagas';
import wayfindingSagas from './sagas/WayfindingSagas';
import selectionSagas from './sagas/SelectionSagas';

function* mapSaga() {
    yield all([
        ...mainSagas,
        ...wayfindingSagas,
        ...selectionSagas,
    ]);
}

export default mapSaga;
