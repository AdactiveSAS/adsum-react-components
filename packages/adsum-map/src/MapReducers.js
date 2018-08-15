// @flow

import { types as mapActionsType } from './MapActions';
import { initialState } from './initialState';

import type { MapReducerStateType } from './initialState';
import type { MapActionType } from './MapActions';

export type MapReducersType = (state: MapReducerStateType, action: MapActionType) => MapReducerStateType;

const mapReducers: MapReducersType = (state: MapReducerStateType = initialState, action: MapActionType): MapReducerStateType => {
    switch (action.type) {
    case mapActionsType.DID_INIT: {
        
        const { 
            getFloors, getBuildings, currentFloor, reset, getSortedPaths, wayFinder 
        } : { floors: any, buildings: any, currentFloor: number, reset: any, sortedPlaces: any, wayFinder: any } = action; 

        return {
            ...state,
            state: 'idle',
            getFloors,
            getBuildings,
            currentFloor,
            reset,
            getSortedPaths,
            wayFinder
        };
    }
    case mapActionsType.WILL_SELECT:
    case mapActionsType.WILL_SELECT_MULTI_PLACES:
    case mapActionsType.WILL_DRAW:
    case mapActionsType.WILL_DRAW_TO_POI:
    case mapActionsType.WILL_DRAW_TO_PLACE:
    case mapActionsType.FLOOR_WILL_CHANGE:
    case mapActionsType.WILL_OPEN:
    case mapActionsType.WILL_CLOSE:
    case mapActionsType.WILL_GO_MY_LOCATION:
    case mapActionsType.WILL_RESET:
        return {
            ...state,
            state: 'transition',
        };
    case mapActionsType.FLOOR_DID_CHANGE: {
        const { currentFloor, previousFloor } = action;

        return {
            ...state,
            state: 'idle',
            currentFloor,
            previousFloor,
        };
    }
    case mapActionsType.DID_SELECT: {
        const { getCurrentSelectedObject } = action;

        return {
            ...state,
            state: 'idle',
            getCurrentSelectedObject
        };
    }
    case mapActionsType.DID_GO_MY_LOCATION:
    case mapActionsType.DID_RESET:
    case mapActionsType.DID_DRAW: {
        return {
            ...state,
            state: 'idle',
        };
    }
    case mapActionsType.ON_CLICK: {
        const { currentClickedEvent } = action;

        return {
            ...state,
            currentClickedEvent
        };
    }
    case mapActionsType.SET_CURRENT_PATH: {
        const { object } : { object: any }  = action;

        return {
            ...state,
            currentPath: object
        };
    }
    case mapActionsType.DID_OPEN: {
        return {
            ...state,
            state: 'idle',
            isOpen: true,
        };
    }
    case mapActionsType.DID_CLOSE: {
        return {
            ...state,
            state: 'idle',
            isOpen: false,
        };
    }
    case mapActionsType.SWITCH_MODE:
        return {
            ...state,
            mode: action.mode
        };
    case mapActionsType.WILL_INIT:
    default:
        return state;
    }
};

export default mapReducers;
