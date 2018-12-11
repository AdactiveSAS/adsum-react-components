/* eslint-disable */
// @flow

import * as React from 'react';

import './Step.css';

import type { StepType, StepStyleType } from '../../StepList';

export type StepModeType = 'isDone' | 'current' | 'isNext' | 'isNotDoneYet';

export type RenderStepType = (
    mode: StepModeType,
    step: StepType,
    stepStyle: StepStyleType,
    onClick: () => void,
) => ?Node;

export type RenderStepTailType = (mode: StepModeType, step: StepType) => ?Node;

type OwnPropsType = {|
    step: StepType,
    currentSectionIndex: ?number,
    onClick: (stepIndex: number) => () => void,
    stepStyle?: StepStyleType,
    renderStep?: RenderStepType,
    renderStepTail?: RenderStepTailType,
|};
type PropsType = OwnPropsType;

type StateType = {|
    mode: StepModeType,
|};

class Step extends React.Component<PropsType, StateType> {
    static defaultProps = {
        stepStyle: {
            default: {
                transition: 'all .5s',
            },
            isDone: {
                opacity: 0.3,
            },
            current: {
                backgroundColor: 'green',
            },
            isNext: {
                backgroundColor: 'lightgreen',
            },
            isNotDoneYet: {},
        },
        renderStep: (
            mode: StepModeType,
            step: StepType,
            stepStyle: StepStyleType,
            onClick: (stepIndex: number) => () => void,
        ) => (
            <div
                className="step"
                style={stepStyle}
                onClick={onClick(step.index)}
                role="complementary"
                onKeyDown={() => {}}
            >
                <div className="badge">{step.index + 1}</div>
                <div className="message">{step.message}</div>
            </div>
        ),
        renderStepTail: (mode: StepModeType, step: StepType) => {
            if (step.index === 0) return null; // no tail before first step

            const numberOfCircles = 4;

            // [0, 1, ..., numberOfCircles - 1]
            const dumbArrayToMap = [...Array(numberOfCircles).keys()];

            const delayBetweenEachCircle = 1 / 10;

            // wait for the last circle to finish + add 1 more delay to make it smoother
            const animationDuration = (numberOfCircles + 2) * delayBetweenEachCircle;

            const circleStyle = delay => (
                {
                    width: `${100 / (numberOfCircles * 3)}%`,
                    maxWidth: '1em',
                    animation: mode !== 'isNext' ? null // animation only if step is next
                        : `blink ${animationDuration}s linear ${delay}s infinite alternate`,
                }
            );

            return (
                <div className="tail">
                    {dumbArrayToMap.map(index => (
                        <div
                            // 'index' as key is ok here,
                            // because no modification will happen on numberOfCircles array
                            key={index}
                            className="circle"
                            style={circleStyle(index * delayBetweenEachCircle)}
                        />
                    ))}
                </div>
            );
        },
    };

    state: StateType = {
        mode: 'isNotDoneYet',
    };

    componentDidUpdate() {
        this.updateMode();
    }

    getStepStyle() {
        const { stepStyle: propStepStyle } = this.props;
        const { mode } = this.state;

        // merge default props step style and the one given in the props
        const stepStyle = {
            ...Step.defaultProps.stepStyle,
            ...propStepStyle,
        };

        return {
            ...stepStyle.default, // apply default style
            ...stepStyle[mode], // add mode-specific style
        };
    }

    updateMode() {
        const { currentSectionIndex, step } = this.props;
        const { mode: oldMode } = this.state;

        const { index } = step;

        let mode = 'isNotDoneYet'; // default value

        if (index < currentSectionIndex) mode = 'isDone';
        if (index === currentSectionIndex) mode = 'current';
        if (index === currentSectionIndex + 1) mode = 'isNext';

        if (mode !== oldMode) this.setState({ mode });
    }

    // ------------------------------------------ Render ------------------------------------------
    render(): React.Element<'div'> {
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
