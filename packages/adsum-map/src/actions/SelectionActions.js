// @flow

import type { AdsumObject3D } from '@adactive/adsum-web-map';
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
  onlyIfPoi: boolean
|};
export function selectAction(adsumObject: ?AdsumObject3D, reset: boolean = true, centerOn: boolean = false, onlyIfPoi: boolean = true): WillSelectActionType {
    return {
        type: types.WILL_SELECT,
        adsumObject,
        reset,
        centerOn,
        onlyIfPoi
    };
}

export type WillSelectPlaceActionType = {|
  type: types.WILL_SELECT_A_PLACE,
  place: Place,
  reset: boolean,
  centerOn: boolean
|};
export function selectPlaceAction(place: Place, reset: boolean = true, centerOn: boolean = false): WillSelectPlaceActionType {
    return {
        type: types.WILL_SELECT_A_PLACE,
        place,
        reset,
        centerOn
    };
}

export type WillSelectPoiActionType = {|
  type: types.WILL_SELECT_A_POI,
  poi: Poi,
  reset: boolean,
  centerOn: boolean
|};
export function selectPoiAction(poi: Poi, reset: boolean = true, centerOn: boolean = false): WillSelectPoiActionType {
    return {
        type: types.WILL_SELECT_A_POI,
        poi,
        reset,
        centerOn
    };
}

export type DidSelectActionType = {|
  type: types.DID_SELECT,
  selection: AdsumObject3D[]
|};
export function didSelectAction(selection: AdsumObject3D[]): DidSelectActionType {
    return {
        type: types.DID_SELECT,
        selection,
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
