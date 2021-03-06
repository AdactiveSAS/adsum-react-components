// @flow

import type { AdsumObject3D, CameraCenterOnOptions } from '@adactive/adsum-web-map';
import type { Place, Poi } from '@adactive/adsum-client-api';

export const types = {
    WILL_SELECT: 'map/WILL_SELECT',
    WILL_SELECT_A_POI: 'map/WILL_SELECT_A_POI',
    WILL_SELECT_A_PLACE: 'map/WILL_SELECT_A_PLACE',
    DID_SELECT: 'map/DID_SELECT',
    DID_RESET_SELECTION: 'map/DID_RESET_SELECTION',
};

export type WillSelectActionType = {|
  type: types.WILL_SELECT,
  adsumObject: ?AdsumObject3D,
  reset: boolean,
  centerOn: boolean,
  onlyIfPoi: boolean,
  highlightColor: string,
|};
export function selectAction(
    adsumObject: ?AdsumObject3D,
    reset: boolean = true,
    centerOn: boolean = false,
    onlyIfPoi: boolean = true,
    highlightColor: ?string = null,
): WillSelectActionType {
    return {
        type: types.WILL_SELECT,
        adsumObject,
        reset,
        centerOn,
        onlyIfPoi,
        highlightColor,
    };
}

export type WillSelectPlaceActionType = {|
  type: types.WILL_SELECT_A_PLACE,
  place: Place,
  reset: boolean,
  centerOn: boolean,
  highlightColor: string,
|};
export function selectPlaceAction(
    place: Place,
    reset: boolean = true,
    centerOn: boolean = false,
    highlightColor: ?string = null,
): WillSelectPlaceActionType {
    return {
        type: types.WILL_SELECT_A_PLACE,
        place,
        reset,
        centerOn,
        highlightColor,
    };
}

export type WillSelectPoiActionType = {|
  type: types.WILL_SELECT_A_POI,
  poi: Poi,
  reset: boolean,
  centerOn: boolean,
  centerOnOptions: CameraCenterOnOptions,
  stayOnCurrentFloor: boolean,
  ground: ?AdsumObject3D,
  animated: boolean,
  highlightColor: string,
|};
export function selectPoiAction(
    poi: Poi,
    reset: boolean = true,
    centerOn: boolean = false,
    centerOnOptions: CameraCenterOnOptions = null,
    stayOnCurrentFloor: boolean = true,
    ground: ?AdsumObject3D = null,
    animated: boolean = true,
    highlightColor: ?string = null,
): WillSelectPoiActionType {
    return {
        type: types.WILL_SELECT_A_POI,
        poi,
        reset,
        centerOn,
        centerOnOptions,
        stayOnCurrentFloor,
        ground,
        animated,
        highlightColor,
    };
}

export type DidSelectActionType = {|
  type: types.DID_SELECT,
  selection: AdsumObject3D[]
|};
export function didSelectAction(currentSelectedObject: AdsumObject3D[]): DidSelectActionType {
    return {
        type: types.DID_SELECT,
        currentSelectedObject,
    };
}

export type DidResetSelectionActionType = {|
    type: types.DID_RESET_SELECTION
|};
export function didResetSelectionAction(): DidResetSelectionActionType {
    return { type: types.DID_RESET_SELECTION };
}

export type SelectionActionsType =
  WillSelectActionType
  | WillSelectPlaceActionType
  | WillSelectPoiActionType
  | DidSelectActionType
  | DidResetSelectionActionType;
