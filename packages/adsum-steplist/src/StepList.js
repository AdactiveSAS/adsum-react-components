// @flow
/* eslint-disable */

import * as React from 'react';
import { connect } from 'react-redux';

import { MainActions, WayfindingActions } from '@adactive/arc-map';
import type { MapReducerStateType } from '@adactive/arc-map/src/initialState';
import type { Path } from '@adactive/adsum-web-map';

import Step, { type RenderStepTailType, type RenderStepType } from './subComponents/Step';

import './StepList.css';

export type StepType = {|
    index: number,
    floor: ?{|
        id: number,
        name: ?string,
    |},
    interfloor: boolean,
    message: string,
|};

type MessagesType = (step: StepType) => {|
    firstStep?: string,
    lastStep?: string,
    isInterfloor?: string,
    default?: string,
|};

export type StepStyleType = {|
    default?: CSSStyleDeclaration,
    isDone?: CSSStyleDeclaration,
    current?: CSSStyleDeclaration,
    isNext?: CSSStyleDeclaration,
    isNotDoneYet?: CSSStyleDeclaration,
|};

type MappedStatePropsType = {|
    wayfindingState: {|
        drawing: boolean,
        currentSectionIndex: ?number,
    |},
    getPath: ?(id: number, pmr: boolean) => ?Path,
|};
type MappedDispatchPropsType = {|
    goToPlace: (placeId: number) => void,
    drawPathSection: (stepIndex: number) => void,
|};
type OwnPropsType = {|
    placeId: ?number,
    messages?: MessagesType,
    stepStyle?: StepStyleType,
    renderStep?: RenderStepType,
    renderStepTail?: RenderStepTailType,
|};
type PropsType = MappedStatePropsType & MappedDispatchPropsType & OwnPropsType;

type StateType = {|
    steps: Array<StepType>,
    color: ?string,
|};

class StepList extends React.Component<PropsType, StateType> {
    static defaultProps = {
        messages: (step: StepType) => {
            const floorName = step.floor && step.floor.name;

            return {
                firstStep: `Start here${floorName ? `, at ${floorName}` : ''}`,
                lastStep: 'You are at your destination',
                isInterfloor: floorName ? `Go to ${floorName}` : 'Change floor',
                default: 'Continue',
            };
        },
    };

    static convertSectionToStep(section, index: number, sections: Array<*>): StepType {
        const { ground } = section;

        // is interfloor?
        const prevSection = index > 0 ? sections[index - 1] : null;
        const interfloor = prevSection ? prevSection.ground !== section.ground : false;

        // floor name
        const floorName = ground && ground.name
            ? ground.name.replace('_', ' ')
            : null;

        // floor
        const floor = {
            id: ground.id,
            name: floorName,
        };

        return {
            index: index + 1, // because we add a first step manually
            floor,
            interfloor,
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
        const { placeId } = this.props;

        if (prevProps.placeId !== placeId) this.init();
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
        else if (step.interfloor) step.message = messages.isInterfloor;

        // default
        else step.message = messages.default;
    };

    onStepClick = (stepIndex: number) => () => {
        const { goToPlace, drawPathSection, placeId } = this.props;
        const { steps } = this.state;

        // if is first step, restart the whole wayfinding
        if (stepIndex === 0) {
            goToPlace(placeId);
            return;
        }

        // if is last step, do nothing
        if (stepIndex === steps.length - 1) return;

        // else draw path section of the selected step
        drawPathSection(placeId, stepIndex);
    };

    generateSteps(path: Path): Array<StepType> {
        if (!path) return [];

        // generate steps
        const steps = path.getPathSections()
            .map(StepList.convertSectionToStep);

        // manually add first step
        const firstStep = {
            index: 0,
            floor: null, // we do not need it
            interfloor: false,
            message: '', // will be filled later
        };
        steps.splice(0, 0, firstStep);

        // manually add a last step only if path is longer than 2 steps
        if (steps.length > 2) {
            const lastStep = {
                index: steps.length,
                floor: null, // we do not need it
                interfloor: false,
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

        const path = getPath(placeId);
        const steps = this.generateSteps(path);

        this.setState({ steps });
    }

    renderSteps(steps: Array<StepType>) {
        const {
            wayfindingState, stepStyle, renderStep, renderStepTail,
        } = this.props;

        const { drawing } = wayfindingState;
        let { currentSectionIndex } = wayfindingState;

        // need this workaround to force selection on last step
        // since we are adding first step manually to the steps array
        // set last step mode to 'current' if drawing is finished
        const shouldApplyWorkaround = currentSectionIndex === steps.length - 2 && !drawing;
        if (shouldApplyWorkaround) currentSectionIndex = steps.length - 1;

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
    render(): React.Element<'div'> {
        const { steps } = this.state;

        // TODO: fallback component
        return !steps.length ? null : (
            <div className="steplist">
                {this.renderSteps(steps)}
            </div>
        );
    }
}

const mapStateToProps = ({ map } : { map: MapReducerStateType }): MappedStatePropsType => ({
    wayfindingState: map.wayfindingState,
    getPath: map.getPath,
});

const mapDispatchToProps = (dispatch: *): MappedDispatchPropsType => ({
    goToPlace: (placeId: number): void => {
        dispatch(MainActions.resetAction());
        dispatch(WayfindingActions.goToPlaceAction(placeId));
    },
    drawPathSection: (placeId: number, pathSectionIndex: number) => {
        dispatch(WayfindingActions.drawPathSectionAction(placeId, pathSectionIndex));
    },
});

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(StepList);
