![react-badge](https://img.shields.io/badge/react-js-53c1de.svg?style=flat)
![touch-badge](https://img.shields.io/badge/for-touch--screen-ff69b4.svg?style=flat)

# Loading Screen

![Screenshot of LoadingScreen component](https://user-images.githubusercontent.com/24209524/49127057-e443d380-f300-11e8-95e2-86531a0353fd.png)

## Getting started

    npm i --save-dev @adactive/arc-loading-screen

OR

    yarn add --dev @adactive/arc-loading-screen


## How to use

Just add the component as below:

```javascript

import * as React from 'react';

/*...*/

// import LoadingScreen component and Actions
import LoadingScreen, { LoadingScreenActions } from '@adactive/arc-loading-screen';

import ACA from '@adactive/adsum-utils/services/ClientAPI';
import deviceConfig from './services/Config';

/*...*/

class App extends React.Component<PropsType, StateType> {
    state = {
        configLoaded: false,
        mapLoaded: false,
    };

    /*...*/

    componentDidMount() {
        // use setPercentage to dispatch LoadingScreen action
        const { setPercentage } = this.props;

        deviceConfig.init()
            // 10 %
            .then((): void => setPercentage(10))
            .then((): void => ACA.init(deviceConfig.config.api))
            // 25 %
            .then((): void => setPercentage(25))
            .then((): void => ACA.load())
            // 75 %
            .then((): void => setPercentage(75))
            .then(() => {
                this.awm = new AdsumWebMap({/*...*/});

                // 90 %
                setPercentage(90);
                this.setState({ configLoaded: true });
            });
    }

    componentDidUpdate() {
        // use setPercentage to dispatch LoadingScreen action
        const { mapState, setPercentage } = this.props;
        const { mapLoaded, configLoaded } = this.state;

        if (configLoaded && !mapLoaded && mapState === 'idle') {
            // 100 %, because app will be ready when mapLoaded set to true
            setPercentage(100);
            this.setState({ mapLoaded: true });
        }
    }

    renderMap = () => {/*...*/};

    render(): Element<'div'> {
        return (
            <div className="App">
                <LoadingScreen />

                <Header logo={logo} />

                { this.renderMap() }
            </div>
        );
    }
}
    
const mapStateToProps = (state: AppStateType): MappedStatePropsType => ({
    mapState: state.map.state,
    /*...*/
});

const mapDispatchToProps = (dispatch: *): MappedDispatchPropsType => ({
    // allow us to dispatch LoadingScreen setPercentage action
    setPercentage: (percentage: ?number): void => {
        dispatch(LoadingScreenActions.setPercentage(percentage));
    },
    /*...*/
});

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(App);

```

Do not forget to link the reducer to your app root reducer in **rootReducer.js**:

```javascript

import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
 
/*...*/

// import LoadingScreen reducer
import loadingScreen from '@adactive/arc-loading-screen/src/LoadingScreenReducer';
// import LoadingScreen reducer type
import type { LoadingScreenReducerType } from '@adactive/arc-loading-screen/src/LoadingScreenReducer';

export type AppStateType = {|
    /*...*/
    loadingScreen: LoadingScreenReducerType,
|};

const appState: AppStateType = {
    /*...*/
    loadingScreen,
};

export default combineReducers(appState);

```

## Optional props

```javascript

type OwnPropsType = {|
    open?: boolean,
    hideLogo?: boolean,
    hidePercentage?: boolean,
    hideBar?: boolean,
    transition?: ?string,
    minPercentage?: ?number,
    mainColor?: string,
    barColor?: string,
    logo?: Object | string,
|};

```

#### open
Control the opening of the loading screen.
Note that **Loading Screen closes automatically when it reaches 100%**,
so NO NEED to link ```mapLoaded``` to ```open``` prop as below if you set percentage to 100%
at some point in your code:

```javascript

<LoadingScreen
    open={!mapLoaded} // not needed
/>

```

#### hideLogo
Hide Logo in the Loading Screen when set to ```true```.

#### hidePercentage
Hide Percentage number in the Loading Screen when set to ```true```.

#### hideBar
Hide Loading Bar in the Loading Screen when set to ```true```.

#### transition
Set transition of the Loading Bar width.
Can be useful to adjust transition duration: if Loading Screen is going to be displayed for a long
time, we have enough time to set a bigger transition duration for a prettier design.
On the contrary, timing needs to be low when Loading Bar loads quickly.

#### minPercentage
Set minPercentage. Set percentage in redux store is used only when greater than minPercentage.
This is a sort of design workaround for the rounded radius and padding getting messed up when
Loading Bar is too small.

#### mainColor
Set Loading Screen background color.

#### barColor
Set Loading Bar & percentage color.

#### logo
Set displayed logo. Better effect with a PNG file with transparent background.

## Redux

```javascript

type LoadingScreenReducerStateType = {|
    percentage: ?number,
|};

```

>The only value in the Loading Screen redux store is ```percentage```.


2 actions are available:
- **setPercentage**: set percentage to the given value.
    
```javascript

    LoadingScreenActions.setPercentage(80); // set percentage to 80 %

```
    
- **addPercentage**: add the given value to the current percentage.

```javascript

    LoadingScreenActions.setPercentage(10); // set percentage to 10 %

    /*...*/

    LoadingScreenActions.addPercentage(20); // percentage is now 30 %

```

## Default props

```javascript

static defaultProps = {
    open: true,
    hideLogo: false,
    hidePercentage: false,
    hideBar: false,
    transition: 'width .1s ease-in-out',
    minPercentage: 10,
    mainColor: '#6EC8F1', // same blue color as splashscreen in Adsum AdLoader
    barColor: 'white',
    logo: adactiveLogo,
};

```

## Copy component inside your project src folder  

It will copy the component inside your project, in **src/components/adsum-loading-screen/**.

    npx @adactive/arc-loading-screen copy
