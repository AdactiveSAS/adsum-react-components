// @flow

export type MapZoomType = {|
  current: number,
  max: number,
  min: number
|};
export type MapModeType = '2D' | '3D';
export type MapStateType = 'initial' | 'idle' | 'transition' | 'pause';
export type MapReducerStateType = {|
  +isOpen: boolean,
  +state: MapStateType,
  +mode: MapModeType,
  +zoom: MapZoomType,
  +currentFloor: ?number,
  +previousFloor: ?number,
  +currentPath: ?Object,
  +currentClickedEvent: ?Object,
  +currentSelectedObject: ?Object,
  +cameraMoved: boolean,
  +getPath: ?(id: number, pmr: boolean) => ?Path,
  +reset: ?Object,
  +wayfindingState: {|
    +drawing: boolean,
    +currentSectionIndex: ?number
  |}
|};

/**
 * Map actions types
 * @memberof! module:Map#
 * @name ActionsTypes
 * @alias ActionsTypes
 * @property {string} [state=initial|idle|transition|pause] - Current canvas state indicator
 * @property {string} [mode=3D|2D] - map display mode
 */
export const initialState: MapReducerStateType = {
    isOpen: false,
    state: 'initial',
    mode: '3D',
    getBuildings: null,
    getFloors: null,
    zoom: {
        current: 0,
        max: 0,
        min: 0,
    },
    currentFloor: null,
    previousFloor: null,
    currentPath: null,
    wayFinder: null,
    currentClickedEvent: null,
    currentSelectedObject: [],
    cameraMoved: false,
    getPath: null,
    reset: null,
    wayfindingState: {
        drawing: false,
        currentSectionIndex: null,
    },
};
