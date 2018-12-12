# Carousel component

![image](https://user-images.githubusercontent.com/5297278/40351912-38f849c8-5db6-11e8-8690-8198ca33bad4.pnghttps://user-images.githubusercontent.com/5297278/40352018-82424548-5db6-11e8-838b-a0b4e64bc921.png)

[Example with adsum-carousel](https://adactivesas.github.io/adsum-react-components/packages/adsum-screensaver/examples/example-with-carousel)

[Example with image](https://adactivesas.github.io/adsum-react-components/packages/adsum-screensaver/examples/example-with-image)

[Example with random content](https://adactivesas.github.io/adsum-react-components/packages/adsum-screensaver/examples/example-with-random-content)

[Example with changed modal timer](https://adactivesas.github.io/adsum-react-components/packages/adsum-screensaver/examples/example-with-changed-modal-timer)

## Getting started

This are the things, which can be imported from the screenSaver:

```javascript
export type { ScreenSaverReducersStateType, ScreenSaverReducersType } from './src/ScreenSaverReducers';
export type { PropsType as ModalWrapperPropsType } from './src/subComponents/ModalWrapper';
export {
    screenSaverActions,
    screenSaverReducers,
    ScreenSaverSagas,
    ModalWrapper
};
export default ScreenSaver;
```

So, screensaver component have several dependencies:

    1) redux
    2) redux-saga

So, you should add a screenSaverReducer to combinedReducers and ScreenSaverSagas to the rootSaga.

```javascript
    npm i --save @adactive/arc-screensaver
```
OR
```javascript
    yarn add @adactive/arc-screensaver
```

```javascript
    import ScreenSaver, { screenSaverActions, ModalWrapper } from '@adactive/arc-screensaver';
     ...
    
    const ModalComponent = ({ modalTimer, closeModal, isHere }: ModalPropsType): Node => (
        <div>Hello, world! { modalTimer }</div>
    );
    
    const WrapperModal = ModalWrapper(ModalComponent);
    
    <ScreenSaver
        modalComponent={<WrapperModal />}
    >
        <img src="http://via.placeholder.com/1280x700" />
    </ScreenSaver>
```

### Props

**inactivityTimer** - time in ms, which should pass without any clicks inside the app for modal to appear

**initialModalCounter** - the counter in seconds, which will be passed to your modal component if it is wrapped with ModalWrapper

**overlayClassName** - a classname, which will be added to the screensaver component

**onOverlayClicked** - a custom function, which will be called, when user clicks on the screenSaver's overlay

**modalComponent** - any component you like, which can be wrapped with *ModalWrapper*
and thus, be passed 3 props: *modalTimer*, *closeModal*, *isHere*. *closeModal* and *isHere* are currently duplicates of each other,
but this will be changed at some point of time in the future. Call *closeModal* or *isHere*, if you want to close the screensaver.
Not providing the modal prop will result in skipping modal step and the user will be taken to the actual screensaver content

**children** - any content, which you want to display in the middle of the screen. 

 
```javascript
type OwnPropsType = {|
    inactivityTimer: number,
    initialModalCounter: number,
    overlayClassName?: string,
    onOverlayClicked?: () => void,
    modalComponent: ComponentType<ModalWrapperPropsType>,
    children: Element<any>
|};

static defaultProps = {
    initialModalCounter: 10,
    inactivityTimer: 10000
};
```

```javascript
type ModalWrapperPropsType = {
    modalTimer: number,
    closeModal: () => void,
    isHere: () => void
}
```


## Copy component inside your project src folder  

### Less only
    `npx @adactive/arc-screensaver copy --less-only`
    
### Full copy
    `npx @adactive/arc-screensaver copy`
