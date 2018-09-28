// @flow

import type { Store } from 'redux';
import type { AdsumWebMap, FloorObject, LabelObject, PathSection } from '@adactive/adsum-web-map';

export const types = {
    WILL_INIT: 'map/WILL_INIT',
    DID_INIT: 'map/DID_INIT',
    WILL_OPEN: 'map/WILL_OPEN',
    DID_OPEN: 'map/DID_OPEN',
    WILL_CLOSE: 'map/WILL_CLOSE',
    DID_CLOSE: 'map/DID_CLOSE',
    WILL_RESET: 'map/WILL_RESET',
    DID_RESET: 'map/DID_RESET',
    WILL_SET_ZOOM: 'map/WILL_SET_ZOOM',
    DID_SET_ZOOM: 'map/DID_SET_ZOOM',
    FLOOR_WILL_CHANGE: 'map/FLOOR_WILL_CHANGE',
    FLOOR_DID_CHANGE: 'map/FLOOR_DID_CHANGE',
    DID_CATCH_ERROR: 'map/DID_CATCH_ERROR'
};

/**
 * INIT
 */
export type WillInitActionType = {|
    type: types.WILL_INIT,
    awm: AdsumWebMap,
    store: Store,
    userObjectLabel: ?LabelObject,
    onClick?: () => any,
    getDrawPathSectionOptions?: (pathSection: PathSection) => {
        drawOptions: ?object,
        setCurrentFloorOptions: ?object
    },
    zoom?: { min?: number, max?: number },
    autoSelectOnClick?: boolean
|};
export function initAction(
    awm: AdsumWebMap,
    store: Store,
    onClick: () => any,
    autoSelectOnClick?: boolean = true,
    userObjectLabel: ?LabelObject = null,
    getDrawPathSectionOptions: (pathSection: PathSection) => {
        drawOptions: ?object,
        setCurrentFloorOptions: ?object
    } = null,
    zoom: { min?: number, max?: number } = null
): WillInitActionType {
    return {
        type: types.WILL_INIT,
        awm,
        store,
        onClick,
        autoSelectOnClick,
        userObjectLabel,
        getDrawPathSectionOptions,
        zoom
    };
}

export type DidInitActionType = {| type: types.DID_INIT |};
export function didInitAction(currentFloor: ?FloorObject, getPath): DidInitActionType {
    return {
        type: types.DID_INIT,
        currentFloor: currentFloor === null ? null : currentFloor.id,
        getPath,
    };
}

/**
 * OPEN
 */
export type WillOpenActionType = {| type: types.WILL_OPEN |};
export function openAction(): WillOpenActionType {
    return { type: types.WILL_OPEN };
}

export type DidOpenActionType = {| type: types.DID_OPEN |};
export function didOpenAction(): DidOpenActionType {
    return { type: types.DID_OPEN };
}

/**
 * CLOSE
 */
export type WillCloseActionType = {| type: types.WILL_CLOSE, reset: boolean |};
export function closeAction(reset: boolean = true): WillCloseActionType {
    return { type: types.WILL_CLOSE, reset };
}

export type DidCloseActionType = {| type: types.DID_CLOSE |};
export function didCloseAction(): DidCloseActionType {
    return { type: types.DID_CLOSE };
}

/**
 * RESET
 */
export type WillResetActionType = {|
    type: types.WILL_RESET,
    stop: boolean,
    resetFloor: boolean,
    resetFloorAnimated: boolean
|};
export function resetAction(
    stop: boolean = false,
    resetFloor: boolean = true,
    resetFloorAnimated: boolean = false
): WillResetActionType {
    return { type: types.WILL_RESET, stop, resetFloor, resetFloorAnimated };
}
export type DidResetActionType = {| type: types.DID_RESET |};
export function didResetAction(): DidResetActionType {
    return { type: types.DID_RESET };
}

/**
 * ZOOM
 */
export type WillZoomActionType = {| type: types.WILL_SET_ZOOM, value: number |};
export function zoomAction(value: number): WillZoomActionType {
    return { type: types.WILL_SET_ZOOM, value };
}
export type DidZoomActionType = {| type: types.DID_SET_ZOOM |};
export function didZoomAction(value: number): DidZoomActionType {
    return { type: types.DID_SET_ZOOM, value };
}

/**
 * FLOORS
 */
export type WillChangeFloorType = {|
    type: types.FLOOR_WILL_CHANGE,
    floorId: ?number,
    centerOn: boolean,
    animated: boolean
|};
export function changeFloorAction(
    floorId: ?number,
    centerOn: boolean = true,
    animated: boolean = true
): WillChangeFloorType {
    return {
        type: types.FLOOR_WILL_CHANGE,
        floorId,
        centerOn,
        animated,
    };
}
export type DidChangeFloorType = {|
  type: types.FLOOR_DID_CHANGE,
  currentFloor: ?number,
  previousFloor: ?number
|};
export function didChangeFloorAction(current: ?FloorObject, previous: ?FloorObject): DidChangeFloorType {
    return {
        type: types.FLOOR_DID_CHANGE,
        currentFloor: current === null ? null : current.id,
        previousFloor: previous === null ? null : previous.id,
    };
}

/**
 * ERROR
 */
export type DidCatchErrorType = {|
  type: types.DID_CATCH_ERROR
|};
export function didCatchErrorAction(): DidCatchErrorType {
    return {
        type: types.DID_CATCH_ERROR
    };
}

export type MainActionsType =
  WillInitActionType
  | DidInitActionType
  | WillOpenActionType
  | DidOpenActionType
  | WillCloseActionType
  | DidCloseActionType
  | WillResetActionType
  | DidResetActionType
  | WillZoomActionType
  | DidZoomActionType
  | WillChangeFloorType
  | DidChangeFloorType
  | DidCatchErrorType;
