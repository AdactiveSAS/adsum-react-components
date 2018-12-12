// @flow
// libs declaration, to use until we have properly flow-typed adsum-map component

declare module '@adactive/arc-map' {
    declare export var MainActions: any;
    declare export var WayfindingActions: any;
}

declare module '@adactive/arc-map/src/initialState' {
    declare type Path = any;
    declare type MapZoomType = {|
        current: number,
        max: number,
        min: number
    |};
    declare type MapModeType = '2D' | '3D';
    declare type MapStateType = 'initial' | 'idle' | 'transition' | 'pause';

    declare export type MapReducerStateType = {|
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
}
