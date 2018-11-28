// @flow

import { types } from './LoadingScreenActions';
import type { LoadingScreenActionsType } from './LoadingScreenActions';

export type LoadingScreenReducerStateType = {|
    percentage: ?number,
|};

export type LoadingScreenReducerType = (
    state: LoadingScreenReducerStateType,
    action: LoadingScreenActionsType
) => LoadingScreenReducerStateType;

export default function LoadingScreenReducer(
    state: LoadingScreenReducerStateType = {
        percentage: 0,
    },
    action: LoadingScreenActionsType,
) {
    switch (action.type) {
    case types.SET_PERCENTAGE: {
        const { percentage } = action;

        return {
            ...state,
            percentage
        };
    }
    case types.ADD_PERCENTAGE: {
        const { addValue } = action;

        return {
            ...state,
            percentage: state.percentage + addValue
        };
    }
    default: return state;
    }
}
