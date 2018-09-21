// @flow

import { types as mainActionsTypes } from './actions/MainActions';
import { types as wayfindingActionsTypes } from './actions/WayfindingActions';
import { types as selectionActionsTypes } from './actions/SelectionActions';
import { initialState } from './initialState';

import type { MapReducerStateType } from './initialState';
import type { MainActionsType } from './actions/MainActions';
import type { SelectionActionsType } from './actions/SelectionActions';
import type { WayfindingActionsType } from './actions/WayfindingActions';

export type MapReducersType = (state: MapReducerStateType, action: WayfindingActionsType | SelectionActionsType | MainActionsType) => MapReducerStateType;

const mapReducers: MapReducersType = (
    state: MapReducerStateType = initialState,
    action: WayfindingActionsType | SelectionActionsType | MainActionsType
): MapReducerStateType => {
    switch (action.type) {
    case mainActionsTypes.DID_INIT: {
        const { currentFloor, getPath } = action;

        return {
            ...state,
            state: 'idle',
            currentFloor,
            getPath,
        };
    }
    case selectionActionsTypes.WILL_SELECT:
    case selectionActionsTypes.WILL_SELECT_A_POI:
    case selectionActionsTypes.WILL_SELECT_A_PLACE:
    case wayfindingActionsTypes.WILL_DRAW_TO_POI:
    case wayfindingActionsTypes.WILL_DRAW_TO_PLACE:
    case mainActionsTypes.FLOOR_WILL_CHANGE:
    case mainActionsTypes.WILL_OPEN:
    case mainActionsTypes.WILL_CLOSE:
    case mainActionsTypes.WILL_RESET:
        return {
            ...state,
            state: 'transition',
        };
    case mainActionsTypes.FLOOR_DID_CHANGE: {
        const { currentFloor, previousFloor } = action;

        return {
            ...state,
            state: 'idle',
            currentFloor,
            previousFloor,
        };
    }
    case wayfindingActionsTypes.EVENT_WILL_DRAW_PATH_SECTION: {
        const { currentIndex } = action;

        return {
            ...state,
            wayfindingState: {
                drawing: true,
                currentSectionIndex: currentIndex
            }
        };
    }
    case wayfindingActionsTypes.EVENT_DID_DRAW_PATH_SECTION: {
        const { currentIndex } = action;

        return {
            ...state,
            wayfindingState: {
                drawing: false,
                currentSectionIndex: currentIndex
            }
        };
    }
    case wayfindingActionsTypes.EVENT_DID_RESET_PATH: {
        return {
            ...state,
            wayfindingState: {
                drawing: false,
                currentSectionIndex: null
            }
        };
    }
    case selectionActionsTypes.DID_SELECT: {
        const { getCurrentSelectedObject } = action;

        return {
            ...state,
            state: 'idle',
            getCurrentSelectedObject
        };
    }
    case mainActionsTypes.DID_RESET:
    case mainActionsTypes.DID_DRAW: {
        return {
            ...state,
            state: 'idle',
        };
    }
    case wayfindingActionsTypes.SET_CURRENT_PATH: {
        const { object }: { object: any } = action;

        return {
            ...state,
            currentPath: object
        };
    }
    case mainActionsTypes.DID_OPEN: {
        return {
            ...state,
            state: 'idle',
            isOpen: true,
        };
    }
    case mainActionsTypes.DID_CLOSE: {
        return {
            ...state,
            state: 'idle',
            isOpen: false,
        };
    }
    case mainActionsTypes.DID_CATCH_ERROR: {
        return {
            ...state,
            state: 'idle'
        };
    }
    case mainActionsTypes.WILL_INIT:
    default:
        return state;
    }
};

export default mapReducers;
