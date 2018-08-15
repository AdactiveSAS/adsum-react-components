// @flow

import type { MapModeType } from './initialState';

/**
 * Map actions types
 * @memberof! module:Map#
 * @name ActionsTypes
 * @alias ActionsTypes
 * @property {constant} WILL_INIT will initialize the adsum web map
 * @property {constant} SWITCH_MODE switch between 2d/3d
 */
export const types = {
    WILL_INIT: 'map/WILL_INIT',
    DID_INIT: 'map/DID_INIT',
    SWITCH_MODE: 'map/SWITCH_MODE',
    FLOOR_WILL_CHANGE: 'map/FLOOR_WILL_CHANGE',
    FLOOR_DID_CHANGE: 'map/FLOOR_DID_CHANGE',
    ON_CLICK: 'map/ON_CLICK',
    WILL_SELECT: 'map/WILL_SELECT',
    WILL_SELECT_A_POI: 'map/WILL_SELECT_A_POI',
    WILL_SELECT_A_PLACE: 'map/WILL_SELECT_A_PLACE',
    WILL_SELECT_MULTI_PLACES: 'map/WILL_SELECT_MULTI_PLACES',
    DID_SELECT: 'map/DID_SELECT',
    WILL_DRAW: 'map/WILL_DRAW',
    WILL_DRAW_PATH_SECTION: 'map/WILL_DRAW_PATH_SECTION',
    WILL_DRAW_TO_POI: 'map/WILL_DRAW_TO_POI',
    WILL_DRAW_TO_PLACE: 'map/WILL_DRAW_TO_PLACE',
    DID_DRAW: 'map/DID_DRAW',
    RESET_DRAW: 'map/RESET_DRAW',
    SET_CURRENT_PATH: 'map/SET_CURRENT_PATH',
    DID_OPEN: 'map/DID_OPEN',
    WILL_OPEN: 'map/WILL_OPEN',
    WILL_CLOSE: 'map/WILL_CLOSE',
    DID_CLOSE: 'map/DID_CLOSE',
    WILL_GO_MY_LOCATION: 'map/WILL_GO_MY_LOCATION',
    DID_GO_MY_LOCATION: 'map/DID_GO_MY_LOCATION',
    WILL_RESET: 'map/WILL_RESET',
    DID_RESET: 'map/DID_RESET',
};

export type WillInitActionType = {| type: 'map/WILL_INIT', store: any, device: number, display: string, backgroundImage: string, onClick: any, PopOver: any, wireFraming: boolean |};
export type SwitchModeActionType = {| type: 'map/SWITCH_MODE', mode: MapModeType |};
export type DidInitActionType = {| type: 'map/DID_INIT' |};
export type FloorWillChangeActionType = {|
    type: 'map/FLOOR_WILL_CHANGE',
    floorID: number,
    centerOn: boolean
|};
export type FloorDidChangeActionType = {|
    type: 'map/FLOOR_DID_CHANGE',
    currentFloor: ?number,
    previousFloor: ?number
|};
export type OnClickActionType = {| type: 'map/ON_CLICK', currentClickedEvent: any |};
export type WillSelectActionType = {| type: 'map/WILL_SELECT', object: any |};
export type WillSelectPoiActionType = {| type: 'map/WILL_SELECT_A_POI', poiId: number |};
export type WillSelectPlaceActionType = {| type: 'map/WILL_SELECT_A_PLACE', placeId: number, pmr: boolean |};
export type WillSelectMultiPlacesActionType = {| type: 'map/WILL_SELECT_MULTI_PLACES', poi: Object |};
export type DidSelectActionType = {| type: 'map/DID_SELECT', currentSelectedObject: any |};
export type WillDrawActionType = {| type: 'map/WILL_DRAW', object: any, pmr: boolean |};
export type WillDrawPathSectionActionType = {| type: 'map/WILL_DRAW_PATH_SECTION', placeId: number, pathSectionIndex: number, pmr: boolean |};
export type WillDrawToPoiActionType = {| type: 'map/WILL_DRAW_TO_POI', poiId: number, pmr: boolean |};
export type WillDrawToPlaceActionType = {| type: 'map/WILL_DRAW_TO_PLACE', placeId: number, pmr: boolean |};
export type DidDrawActionType = {| type: 'map/DID_DRAW' |};
export type ResetDrawActionType = {| type: 'map/RESET_DRAW' |};
export type SetCurrentPathActionType = {| type: 'map/SET_CURRENT_PATH', object: any |};
export type WillOpenActionType = {| type: 'map/WILL_OPEN' |};
export type DidOpenActionType = {| type: 'map/DID_OPEN' |};
export type WillCloseActionType = {| type: 'map/WILL_CLOSE' |};
export type DidCloseActionType = {| type: 'map/DID_CLOSE' |};
export type WillGoToMyLocationType = {| type: 'map/WILL_GO_MY_LOCATION' |};
export type DidGoToMyLocationType = {| type: 'map/DID_GO_MY_LOCATION' |};
export type WillResetActionType = {| type: 'map/WILL_RESET' |};
export type DidResetActionType = {| type: 'map/DID_RESET' |};

export type MapActionType =
    | WillInitActionType
    | DidInitActionType
    | SwitchModeActionType
    | FloorWillChangeActionType
    | FloorDidChangeActionType
    | OnClickActionType
    | WillSelectActionType
    | WillSelectPoiActionType
    | WillSelectPlaceActionType
    | WillSelectMultiPlacesActionType
    | DidSelectActionType
    | WillDrawActionType
    | WillDrawPathSectionActionType
    | WillDrawToPoiActionType
    | WillDrawToPlaceActionType
    | SetCurrentPathActionType
    | DidDrawActionType
    | ResetDrawActionType
    | WillOpenActionType
    | DidOpenActionType
    | WillCloseActionType
    | DidCloseActionType
    | WillGoToMyLocationType
    | DidGoToMyLocationType
    | WillResetActionType
    | DidResetActionType;

export type WilResetActionCreatorType = () => WillResetActionType;
export type DidResetActionCreatorType = () => DidResetActionType;
export type WillInitActionCreatorType = (store: any, device: number, display: string, backgroundImage: string, onClick: any, PopOver: any, wireFraming: boolean, multiPlaceSelection: string, pmr: boolean) => WillInitActionType;
export type SwitchModeActionCreatorType = () => SwitchModeActionType;
export type DidInitActionCreatorType = () => DidInitActionType;
export type FloorWillChangeActionCreatorType = (floorId: number, centerOn: boolean) => FloorWillChangeActionType;
export type FloorDidChangeActionCreatorType = (currentFloor: ?number, previousFloor: ?number) => FloorDidChangeActionType;
export type OnClickActionCreatorType = (currentClickedEvent: any) => OnClickActionType;
export type WillSelectActionCreatorType = (object: any) => WillSelectActionType;
export type WillSelectPoiActionCreatorType = (poiId: number) => WillSelectPoiActionType;
export type WillSelectPlaceActionCreatorType = (placeId: number, pmr: boolean) => WillSelectPlaceActionType;
export type WillSelectMultiPlacesActionCreatorType = (poi: Object) => WillSelectMultiPlacesActionType;
export type DidSelectActionCreatorType = (getCurrentSelectedObject: any) => DidSelectActionType;
export type WillDrawActionCreatorType = (object: any, pmr: boolean) => WillDrawActionType;
export type WillDrawPathSectionActionCreatorType = (placeId: number, pathSectionIndex: number, pmr: boolean) => WillDrawPathSectionActionType;
export type DidDrawActionCreatorType = () => DidDrawActionType;
export type ResetDrawActionCreatorType = () => ResetDrawActionType;
export type WillOpenActionCreatorType = () => WillOpenActionType;
export type DidOpenActionCreatorType = () => DidOpenActionType;
export type WillCloseActionCreatorType = () => WillCloseActionType;
export type DidCloseActionCreatorType = () => DidCloseActionType;
export type WillGoToMyLocationActionCreatorType = () => WillGoToMyLocationType;
export type DidGoToMyLocationActionCreatorType = () => DidGoToMyLocationType;
export type SetCurrentPathActionCreatorType = (object: any) => SetCurrentPathActionType;
export type WillDrawToPoiActionCreatorType = (poiId: number, pmr: boolean) => WillDrawToPoiActionType;
export type WillDrawToPlaceActionCreatorType = (placeId: number, pmr: boolean) => WillDrawToPlaceActionType;


/**
 * Init adsum web map
 * @function <i>mapActions</i> <strong>init</strong>
 * @memberof! module:Map#
 * @returns {object}
 */
export const init: WillInitActionCreatorType = (store: any, device: number, display: string, backgroundImage: string, onClick: any, PopOver: any, wireFraming: boolean, multiPlaceSelection: string, pmr: boolean): WillInitActionType => ({
    type: types.WILL_INIT,
    store,
    device,
    display,
    backgroundImage,
    onClick,
    PopOver,
    wireFraming,
    multiPlaceSelection,
    pmr
});

/**
 * Reset adsum web map
 * @function <i>mapActions</i> <strong>reset</strong>
 * @memberof! module:Map#
 * @returns {object}
 */
export const reset: WilResetActionCreatorType = (): WillResetActionType => ({
    type: types.WILL_RESET
});

/**
 * Switching between 3D and 2D
 * @function <i>mapActions</i> <strong>switchMode</strong>
 * @memberof! module:Map#
 * @returns {object}
 */
let mode: MapModeType = '3D';

export const switchMode: SwitchModeActionCreatorType = (): SwitchModeActionType => {
    mode = (mode === '3D') ? '2D' : '3D';
    return {
        type: types.SWITCH_MODE,
        mode
    };
};

/**
 * Finished map initialization
 * @function <i>mapActions</i> <strong>didInit</strong>
 * @memberof! module:Map#
 * @returns {object}
 */
export const didInit: DidInitActionCreatorType = (): DidInitActionType => ({
    type: types.DID_INIT
});

/**
 * Change floor
 * @function <i>mapActions</i> <strong>changeFloor</strong>
 * @memberof! module:Map#
 * @returns {object}
 */
export const changeFloor: FloorWillChangeActionCreatorType = (floorID: number, centerOn: boolean = true): FloorWillChangeActionType => ({
    type: types.FLOOR_WILL_CHANGE,
    floorID,
    centerOn
});

/**
 * floor did change
 * @function <i>mapActions</i> <strong>floorDidChanged</strong>
 * @memberof! module:Map#
 * @returns {object}
 */
export const floorDidChanged: FloorDidChangeActionCreatorType = (currentFloor: ?number, previousFloor: ?number): FloorDidChangeActionType => ({
    type: types.FLOOR_DID_CHANGE,
    currentFloor,
    previousFloor,
});

/**
 * Trigger on click on the map
 * @function <i>mapActions</i> <strong>onClick</strong>
 * @memberof! module:Map#
 * @returns {object}
 */
export const onClick: OnClickActionCreatorType = (getEventMethod: any): OnClickActionType => ({
    type: types.ON_CLICK,
    currentClickedEvent: getEventMethod
});


/**
 * Trigger selection on the map
 * @function <i>mapActions</i> <strong>willSelect</strong>
 * @memberof! module:Map#
 * @returns {object}
 */
export const willSelect: WillSelectActionCreatorType = (object: any): WillSelectActionType => ({
    type: types.WILL_SELECT,
    object
});

/**
 * Will highlight the closest poi
 * @function <i>mapActions</i> <strong>highlightPoi</strong>
 * @memberof! module:Map#
 * @returns {object}
 */
export const highlightPoi: WillSelectPoiActionCreatorType = (poiId: any): WillSelectPoiActionType => ({
    type: types.WILL_SELECT_A_POI,
    poiId
});

/**
 * Will highlight a place
 * @function <i>mapActions</i> <strong>highlightPlace</strong>
 * @memberof! module:Map#
 * @returns {object}
 */
export const highlightPlace: WillSelectPlaceActionCreatorType = (placeId: any, pmr: boolean): WillSelectPlaceActionType => ({
    type: types.WILL_SELECT_A_PLACE,
    placeId,
    pmr
});

/**
 * Will highlight Multiple places
 * @function <i>mapActions</i> <strong>highlightMultiPlace</strong>
 * @memberof! module:Map#
 * @returns {object}
 */
export const highlightMultiPlacesFromPoi: WillSelectMultiPlacesActionCreatorType = (poi: Object): WillSelectMultiPlacesActionType => ({
    type: types.WILL_SELECT_MULTI_PLACES,
    poi
});


/**
 * Trigger selection on the map
 * @function <i>mapActions</i> <strong>willSelect</strong>
 * @memberof! module:Map#
 * @returns {object}
 */
export const didSelect: DidSelectActionCreatorType = (getCurrentSelectedObject: any): DidSelectActionType => ({
    type: types.DID_SELECT,
    getCurrentSelectedObject
});


/**
 * Will draw a path to an object
 * @function <i>mapActions</i> <strong>goTo</strong>
 * @memberof! module:Map#
 * @returns {object}
 */
export const goTo: WillDrawActionCreatorType = (object: any, pmr: boolean): WillDrawActionType => ({
    type: types.WILL_DRAW,
    object,
    pmr
});

/**
 * Will draw a pathSection of the current path
 * @function <i>mapActions</i> <strong>drawPathSection</strong>
 * @memberof! module:Map#
 * @returns {object}
 */
export const drawPathSection: WillDrawPathSectionActionCreatorType = (placeId: number, pathSectionIndex: number, pmr: boolean): WillDrawPathSectionActionType => ({
    type: types.WILL_DRAW_PATH_SECTION,
    placeId,
    pathSectionIndex,
    pmr
});

/**
 * Will draw a path to the closest poi
 * @function <i>mapActions</i> <strong>goToPoi</strong>
 * @memberof! module:Map#
 * @returns {object}
 */
export const goToPoi: WillDrawToPoiActionCreatorType = (poiId: any, pmr: boolean): WillDrawToPoiActionType => ({
    type: types.WILL_DRAW_TO_POI,
    poiId,
    pmr
});

/**
 * Will draw a path to a place
 * @function <i>mapActions</i> <strong>goToPlace</strong>
 * @memberof! module:Map#
 * @returns {object}
 */
export const goToPlace: WillDrawToPlaceActionCreatorType = (placeId: any, pmr: boolean): WillDrawToPlaceActionType => ({
    type: types.WILL_DRAW_TO_PLACE,
    placeId,
    pmr
});


/**
 * Did draw a path to an object
 * @function <i>mapActions</i> <strong>didDraw</strong>
 * @memberof! module:Map#
 * @returns {object}
 */
export const didDraw: DidDrawActionCreatorType = (placeId: number): DidDrawActionType => ({
    type: types.DID_DRAW,
    placeId,
});


/**
 * Remove drawn path
 * @function <i>mapActions</i> <strong>resetDraw</strong>
 * @memberof! module:Map#
 * @returns {object}
 */
export const resetDrawnPath: ResetDrawActionCreatorType = (): ResetDrawActionType => ({
    type: types.RESET_DRAW,
});

/**
 * Set current path
 * @function <i>mapActions</i> <strong>setCurrentPath</strong>
 * @memberof! module:Map#
 * @returns {object}
 */
export const setCurrentPath: SetCurrentPathActionCreatorType = (object: any): SetCurrentPathActionType => ({
    type: types.SET_CURRENT_PATH,
    object
});

/**
 * Map will open
 * @function <i>mapActions</i> <strong>willOpen</strong>
 * @memberof! module:Map#
 * @returns {object}
 */
export const willOpen: WillOpenActionCreatorType = (): WillOpenActionType => ({
    type: types.WILL_OPEN,
});

/**
 * Map did open
 * @function <i>mapActions</i> <strong>didOpen</strong>
 * @memberof! module:Map#
 * @returns {object}
 */
export const didOpen: DidOpenActionCreatorType = (): DidOpenActionType => ({
    type: types.DID_OPEN,
});

/**
 * Map will close
 * @function <i>mapActions</i> <strong>willClose</strong>
 * @memberof! module:Map#
 * @returns {object}
 */
export const willClose: WillCloseActionCreatorType = (): WillCloseActionType => ({
    type: types.WILL_CLOSE,
});

/**
 * Map did close
 * @function <i>mapActions</i> <strong>didClose</strong>
 * @memberof! module:Map#
 * @returns {object}
 */
export const didClose: DidCloseActionCreatorType = (): DidCloseActionType => ({
    type: types.DID_CLOSE,
});

/**
 * Map will go to my location
 * @function <i>mapActions</i> <strong>myPosition</strong>
 * @memberof! module:Map#
 * @returns {object}
 */
export const myPosition: WillGoToMyLocationActionCreatorType = (): WillGoToMyLocationType => ({
    type: types.WILL_GO_MY_LOCATION,
});
