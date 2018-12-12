// @flow

import * as React from 'react';
import { connect } from 'react-redux';

import { MainActions, WayfindingActions } from '@adactive/arc-map';
import type { MapReducerStateType } from '@adactive/arc-map/src/initialState';
import type { Path } from '@adactive/adsum-web-map';

import Step, { type StepModeType } from './subComponents/Step';

import './StepList.css';

export type StepType = {|
    index: number,
    floor: ?{|
        id: number,
        name: ?string,
        deltaAltitudeWithPrevStep: number,
    |},
    message: string,
|};

export type MessagesType = (step: StepType) => {|
    firstStep?: string,
    lastStep?: string,
    isInterfloor?: string,
    default?: string,
|};

export type StepStyleType = {|
    default?: { [key: string]: string},
    isDone?: { [key: string]: string},
    current?: { [key: string]: string},
    isNext?: { [key: string]: string},
    isNotDoneYet?: { [key: string]: string},
|};

export type RenderStepType = (
    mode: StepModeType,
    step: StepType,
    stepStyle: StepStyleType,
    onClick: (stepIndex: number) => () => void,
) => ?Node;

export type RenderStepTailType = (mode: StepModeType, step: StepType) => ?Node;

type MappedStatePropsType = {|
    +wayfindingState: {|
        +drawing: boolean,
        +currentSectionIndex: ?number,
    |},
    +getPath: ?(id: number, pmr: boolean) => ?Path,
|};
type MappedDispatchPropsType = {|
    +goToPlace: (placeId: ?number, pmr: boolean) => void,
    +drawPathSection: (placeId: ?number, stepIndex: number, pmr: boolean) => void,
|};
type OwnPropsType = {|
    placeId: ?number,
    pmr: boolean, // optional
    messages: MessagesType, // optional
    stepStyle: StepStyleType, // optional
    renderStep: RenderStepType, // optional
    renderStepTail: RenderStepTailType, // optional
|};
type PropsType = MappedStatePropsType & MappedDispatchPropsType & OwnPropsType;

type StateType = {|
    steps: Array<StepType>,
|};

class StepList extends React.Component<PropsType, StateType> {
    static defaultProps = {
        pmr: false,
        messages: (step: StepType) => {
            const { floor } = step;

            let floorName = null;
            let upOrDown = '';

            if (floor) {
                const { name, deltaAltitudeWithPrevStep } = floor;

                // floor name
                floorName = name;

                // interfloor direction
                if (deltaAltitudeWithPrevStep > 0) upOrDown = ' up'; // space before on purpose
                else if (deltaAltitudeWithPrevStep < 0) upOrDown = ' down'; // same
            }

            return {
                firstStep: `Start here${floorName ? `, at ${floorName}` : ''}`,
                lastStep: 'You are at your destination',
                isInterfloor: floorName ? `Go${upOrDown} to ${floorName}` : 'Change floor',
                default: 'Continue',
            };
        },
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

    static convertSectionToStep(section: *, index: number, sections: Array<*>): StepType {
        const { ground } = section;

        // floor name
        const floorName = ground && ground.name
            ? ground.name.replace('_', ' ')
            : null;

        // is interfloor?
        // yes if delta altitude with previous step is !== 0
        const prevSection = index > 0 ? sections[index - 1] : null;
        const deltaAltitudeWithPrevStep = prevSection
            ? ground.altitude - prevSection.ground.altitude
            : 0;

        // floor
        const floor = {
            id: ground.id,
            name: floorName,
            deltaAltitudeWithPrevStep,
        };

        return {
            index: index + 1, // because we add a first step manually
            floor,
            message: '', // will be filled later
        };
    }

    state: StateType = {
        steps: [],
    };

    componentDidMount() {
        this.init();
    }

    componentDidUpdate(prevProps: PropsType) {
        const { placeId, pmr } = this.props;

        // if placeId or pmr changes, reload the steplist
        if (prevProps.placeId !== placeId || prevProps.pmr !== pmr) this.init();
    }

    addMessageToStep = (step: StepType, index: number, steps: Array<StepType>) => {
        const { messages: propsMessages } = this.props;

        // merge default props messages and messages passed in the props
        const messages = {
            ...StepList.defaultProps.messages(step),
            ...propsMessages(step),
        };

        // first step
        if (step.index === 0) step.message = messages.firstStep;

        // last step
        else if (index === steps.length - 1) step.message = messages.lastStep;

        // step is interfloor
        else if (step.floor && step.floor.deltaAltitudeWithPrevStep !== 0) step.message = messages.isInterfloor;

        // default
        else step.message = messages.default;
    };

    onStepClick = (stepIndex: number) => () => {
        const { steps } = this.state;
        const {
            goToPlace, drawPathSection, placeId, pmr
        } = this.props;

        // if is first step, restart the whole wayfinding
        if (stepIndex === 0) {
            goToPlace(placeId, pmr);
            return;
        }

        // if is last step, do nothing
        if (stepIndex === steps.length - 1) return;

        // else draw path section of the selected step
        drawPathSection(placeId, stepIndex, pmr);
    };

    generateSteps(path: Path): Array<StepType> {
        if (!path) return [];

        // generate steps
        const steps = path.getPathSections()
            .map(StepList.convertSectionToStep);

        // manually add first step
        if (steps.length > 0) {
            const firstStep = {
                index: 0,
                floor: {
                    ...steps[0].floor, // copy floor from first step
                    deltaAltitudeWithPrevStep: 0, // overwrite delta altitude to 0
                },
                message: '', // will be filled later
            };
            steps.splice(0, 0, firstStep);
        }

        // manually add a last step only if path is longer than 2 steps
        if (steps.length > 2) {
            const lastStep = {
                index: steps.length,
                floor: {
                    ...steps[steps.length - 1].floor, // copy floor from last step
                    deltaAltitudeWithPrevStep: 0, // overwrite delta altitude to 0
                },
                message: '', // will be filled later
            };
            steps.splice(steps.length, steps.length, lastStep);
        }

        // add message
        steps.forEach(this.addMessageToStep);

        return steps;
    }

    init() {
        const { placeId, getPath } = this.props;

        if (!placeId || !getPath) {
            this.setState({ steps: [] });
            return;
        }

        const path = getPath(placeId, false); // pmr = false
        const steps = this.generateSteps(path);

        this.setState({ steps });
    }

    renderSteps(steps: Array<StepType>) {
        const {
            wayfindingState, stepStyle: propStepStyle, renderStep, renderStepTail,
        } = this.props;

        const { drawing } = wayfindingState;
        let { currentSectionIndex } = wayfindingState;

        // need this workaround to force selection on last step
        // since we are adding first step manually to the steps array
        // set last step mode to 'current' if drawing is finished
        const shouldApplyWorkaround = currentSectionIndex === steps.length - 2 && !drawing;
        if (shouldApplyWorkaround) currentSectionIndex = steps.length - 1;

        // merge default props step style and the one given in the props
        const stepStyle = {
            ...StepList.defaultProps.stepStyle,
            ...propStepStyle,
        };

        return steps.map((step: StepType): React.Element<typeof Step> => (
            <Step
                key={step.index}
                step={step}
                currentSectionIndex={currentSectionIndex}
                onClick={this.onStepClick}
                stepStyle={stepStyle}
                renderStep={renderStep}
                renderStepTail={renderStepTail}
            />
        ));
    }

    // ------------------------------------------ Render ------------------------------------------
    render() {
        const { steps } = this.state;

        // TODO: fallback component
        return !steps.length ? null : (
            <div className="steplist">
                {this.renderSteps(steps)}
            </div>
        );
    }
}

const mapStateToProps = ({ map }: { map: MapReducerStateType }): MappedStatePropsType => ({
    wayfindingState: map.wayfindingState,
    getPath: map.getPath,
});

const mapDispatchToProps = (dispatch: *): MappedDispatchPropsType => ({
    goToPlace: (placeId: ?number, pmr: boolean): void => {
        dispatch(MainActions.resetAction());
        if (placeId) {
            dispatch(WayfindingActions.goToPlaceAction(placeId, pmr));
        }
    },
    drawPathSection: (placeId: ?number, pathSectionIndex: number, pmr: boolean) => {
        if (placeId) {
            dispatch(WayfindingActions.drawPathSectionAction(placeId, pathSectionIndex, pmr));
        }
    },
});

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(StepList);
