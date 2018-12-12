![react-badge](https://img.shields.io/badge/react-js-53c1de.svg?style=flat)
![touch-badge](https://img.shields.io/badge/for-touch--screen-ff69b4.svg?style=flat)

# Step List

![Screenshot of Step List component](
https://user-images.githubusercontent.com/24209524/49843968-01e26400-fdfc-11e8-85d6-0433036a44d0.png
)

## Getting started

    npm i --save @adactive/arc-steplist

OR

    yarn add @adactive/arc-steplist

## How to use

Just add the component as below:

```js

import * as React from 'react';

// import StepList component
import StepList from '@adactive/arc-steplist';

/*...*/

class MyComponent extends React.Component {
    render() {
        return (
            <StepList placeId={placeId} />
        );
    }
}

```

## Props

```js

type OwnPropsType = {|
    placeId: ?number,
    pmr: boolean, // optional
    messages: MessagesType, // optional
    stepStyle: StepStyleType, // optional
    renderStep: RenderStepType, // optional
    renderStepTail: RenderStepTailType, // optional
|};

```

>You can see here as well what flow types are exported. You can import them from the component to
enhance your flow typing in your app.

```js

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

```

### placeId
Place ID of the place targeted by the steplist. This is the only necessary prop of the component.
    
### pmr
Draw the wayfinding with PMR (avoid stairs, use elevator instead) or not.

##### default value
```js

defaultPmr = false

```

### messages
Customize message shown on each step, following this structure:

```js

type MessagesType = (step: StepType) => {|
    firstStep?: string,
    lastStep?: string,
    isInterfloor?: string,
    default?: string,
|};

```

- **firstStep**: the first step.
- **lastStep**: the last step.
- **isInterfloor**: steps where the floor is different from the previous one.
- **default**: message for steps that don't fall into any of the previous categories.

##### default value
```js

defaultMessages = (step: StepType) => {
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
}

```

### stepStyle
Customize style of each step, following this structure:

```js

export type StepStyleType = {|
    default?: CSSStyleDeclaration,
    isDone?: CSSStyleDeclaration,
    current?: CSSStyleDeclaration,
    isNext?: CSSStyleDeclaration,
    isNotDoneYet?: CSSStyleDeclaration,
|};

```

- **default**: style applied to each step, whatever their current mode.
- **isDone**: style added to step that are done.
- **current**: style added to current step.
- **isNext**: style added to the step just after the current step.
- **isNotDoneYet**: style added to the steps that are after the 'isNext' step, not done yet.

>Be aware that you don't have to modify all the styles. For examples, you can modify only the
'isNext' style, and the others default styles will be kept.

If you want to modify the style of the whole step list, you can overwrite the **'steplist'**
classname in your component stylesheet.

##### default value
```js

defaultStepStyle = {
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
}

```

### renderStep
Overwrite the default render step function. This is one step further than just customizing the
style with **stepStyle** prop.

```js

export type RenderStepType = (
    mode: StepModeType,
    step: StepType,
    stepStyle: StepStyleType,
    onClick: (stepIndex: number) => () => void,
) => ?Node;

```

This is a function that return some JSX,for you to be able to use the *current mode*, the *step*,
the *stepStyle* and the default *click handler* in your own steps.

##### default value
```js

defaultRenderStep = (
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
)

```

### renderStepTail
Same as **renderStep**, but for the step tail: the space before each step.

>If you want to remove the tails, simply pass a function that returns **null**.

```js

export type RenderStepTailType = (mode: StepModeType, step: StepType) => ?Node;

```

Again, this a function, so you can use the *current mode* and the *step* in your own step tails.

##### default value
```js

defaultRenderStepTail = (mode: StepModeType, step: StepType) => {
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
}

```

## Copy component inside your project src folder  

It will copy the component inside your project, in **src/components/adsum-steplist/**.

    npx @adactive/arc-steplist copy
