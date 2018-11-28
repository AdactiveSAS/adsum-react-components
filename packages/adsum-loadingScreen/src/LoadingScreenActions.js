// @flow

export const types = {
    SET_PERCENTAGE: 'loadingScreen/SET_PERCENTAGE',
    ADD_PERCENTAGE: 'loadingScreen/ADD_PERCENTAGE',
};

export type SetPercentageActionType = {|
    type: types.SET_PERCENTAGE,
    percentage: ?number,
|};
export function setPercentage(percentage: ?number): SetPercentageActionType {
    return {
        type: types.SET_PERCENTAGE,
        percentage,
    };
}

export type AddPercentageActionType = {|
    type: types.ADD_PERCENTAGE,
    addValue: number,
|};
export function addPercentage(addValue: ?number): AddPercentageActionType {
    return {
        type: types.ADD_PERCENTAGE,
        addValue,
    };
}

export type LoadingScreenActionsType = SetPercentageActionType | AddPercentageActionType;
