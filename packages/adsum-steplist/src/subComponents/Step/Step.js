// @flow

import * as React from 'react';

import './Step.css';

import type {
    StepType, StepStyleType, RenderStepType, RenderStepTailType
} from '../../StepList';

export type StepModeType = 'isDone' | 'current' | 'isNext' | 'isNotDoneYet';

type OwnPropsType = {|
    step: StepType,
    currentSectionIndex: ?number,
    onClick: (stepIndex: number) => () => void,
    stepStyle: StepStyleType,
    renderStep: RenderStepType,
    renderStepTail: RenderStepTailType,
|};
type PropsType = OwnPropsType;

type StateType = {|
    mode: StepModeType,
|};

class Step extends React.Component<PropsType, StateType> {
    state: StateType = {
        mode: 'isNotDoneYet',
    };

    componentDidUpdate() {
        this.updateMode();
    }

    getStepStyle() {
        const { stepStyle } = this.props;
        const { mode } = this.state;

        // merge default and mode-specific style
        return {
            ...stepStyle.default,
            ...stepStyle[mode],
        };
    }

    updateMode() {
        const { currentSectionIndex, step } = this.props;
        const { mode: oldMode } = this.state;

        const { index } = step;

        let mode = 'isNotDoneYet'; // default value

        if (currentSectionIndex) {
            if (index < currentSectionIndex) mode = 'isDone';
            if (index === currentSectionIndex) mode = 'current';
            if (index === currentSectionIndex + 1) mode = 'isNext';
        }

        if (mode !== oldMode) this.setState({ mode });
    }

    // ------------------------------------------ Render ------------------------------------------
    render() {
        const {
            renderStep, renderStepTail, step, onClick,
        } = this.props;
        const { mode } = this.state;

        const stepStyle = this.getStepStyle();

        return (
            <React.Fragment>
                {renderStepTail(mode, step)}
                {renderStep(mode, step, stepStyle, onClick)}
            </React.Fragment>
        );
    }
}

export default Step;
