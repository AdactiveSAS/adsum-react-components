// @flow

import type { PathSection, Path } from '@adactive/adsum-web-map';

export const types = {
    WILL_DRAW_TO_PLACE: 'map/WILL_DRAW_TO_PLACE',
    WILL_DRAW_TO_POI: 'map/WILL_DRAW_TO_POI',
    WILL_DRAW_PATH_SECTION: 'map/WILL_DRAW_PATH_SECTION',
    DID_DRAW: 'map/DID_DRAW',
    SET_CURRENT_PATH: 'map/SET_CURRENT_PATH',
    EVENT_WILL_DRAW_PATH_SECTION: 'map/EVENT_WILL_DRAW_PATH_SECTION',
    EVENT_DID_DRAW_PATH_SECTION: 'map/EVENT_DID_DRAW_PATH_SECTION',
    EVENT_RESET_PATH: 'map/EVENT_RESET_PATH',
};

export type WillGoToPlaceActionType = {|
  type: types.WILL_DRAW_TO_PLACE,
  placeId: ?number,
  pmr: boolean
|};
export function goToPlaceAction(placeId: ?number, pmr: boolean = false): WillGoToPlaceActionType {
    return {
        type: types.WILL_DRAW_TO_PLACE,
        placeId,
        pmr
    };
}

export type WillGoToPoiActionType = {|
  type: types.WILL_DRAW_TO_POI,
  poiId: ?number,
  pmr: boolean
|};
export function goToPoiAction(poiId: ?number, pmr: boolean = false): WillGoToPoiActionType {
    return {
        type: types.WILL_DRAW_TO_POI,
        poiId,
        pmr
    };
}

export type DidDrawActionType = {|
  type: types.DID_DRAW,
  placeId: ?number,
  pmr: boolean,
  pathSectionIndex: ?number
|};
export function didDrawAction(placeId: ?number, pmr: boolean = false, pathSectionIndex: ?number = null): DidDrawActionType {
    return {
        type: types.DID_DRAW,
        placeId,
        pmr,
        pathSectionIndex
    };
}

export type WillDrawPathSectionActionType = {|
  type: types.WILL_DRAW_TO_PLACE,
  placeId: ?number,
  pathSectionIndex: number,
  pmr: boolean
|};
export function drawPathSectionAction(placeId: ?number, pathSectionIndex: number, pmr: boolean = false): WillDrawPathSectionActionType {
    return {
        type: types.WILL_DRAW_PATH_SECTION,
        placeId,
        pathSectionIndex,
        pmr
    };
}

export type SetCurrentPathActionType = {|
  type: types.SET_CURRENT_PATH,
  path: ?Path
|};
export function setCurrentPathAction(path: ?Path): SetCurrentPathActionType {
    return {
        type: types.SET_CURRENT_PATH,
        path,
    };
}

/**
 * DRAW EVENTS
 */
export type WillDrawPathSectionEventType = {|
  type: types.EVENT_WILL_DRAW_PATH_SECTION,
  previous: ?PathSection,
  current: PathSection,
  currentIndex: number
|};
export function willDrawPathSectionEvent(current: PathSection, previous: ?PathSection, currentIndex: number): WillDrawPathSectionEventType {
    return {
        type: types.EVENT_WILL_DRAW_PATH_SECTION,
        previous,
        current,
        currentIndex,
    };
}

export type DidDrawPathSectionEventType = {|
  type: types.EVENT_DID_DRAW_PATH_SECTION,
  previous: ?PathSection,
  current: PathSection,
  currentIndex: number
|};
export function didDrawPathSectionEvent(current: PathSection, previous: ?PathSection, currentIndex: number): DidDrawPathSectionEventType {
    return {
        type: types.EVENT_DID_DRAW_PATH_SECTION,
        previous,
        current,
        currentIndex,
    };
}

export type ResetPathEventType = {|
  type: types.EVENT_RESET_PATH
|};
export function resetPathEvent(): ResetPathEventType {
    return {
        type: types.EVENT_RESET_PATH,
    };
}

export type WayfindingActionsType =
  WillGoToPlaceActionType
  | WillGoToPoiActionType
  | DidDrawActionType
  | WillDrawPathSectionActionType
  | SetCurrentPathActionType
  | WillDrawPathSectionEventType
  | DidDrawPathSectionEventType
  | ResetPathEventType;
