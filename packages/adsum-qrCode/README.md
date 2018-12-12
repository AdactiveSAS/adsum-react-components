# QrCode component

## Getting started

```javascript
    npm i --save @adactive/arc-qrcode
```
OR
```javascript
    yarn add @adactive/arc-qrcode
```

### Usage
```javascript
    import AdsumQrCode, { modes, ecLevel } from '@adactive/arc-qrcode';
    ...
    state = {
        openModal: false
    }
    
    onOpenModal = () => {
        this.setState({ openModal: true });
    };
    
    onCloseModal = () => {
        this.setState({ openModal: false });
    };
    
    const qrCodeOptions = {
        size: 400,
        ecLevel: ecLevel.QUARTILE,
        minVersion: 8,
        background: '#fff',
        mode: modes.DRAW_WITH_IMAGE_BOX,
        radius: 0.5,
        image: 'https://raw.githubusercontent.com/AdactiveSAS/adsum-react-components/master/logo.jpg',
        mSize: 0.15,
    };
    
    <button onClick={this.onOpenModal}>Open QrCode Modal</button>
    
    <AdsumQrCode
        isOpen={this.state.openModal}
        onClose={this.onCloseModal}
        qrCodeOptions={qrCodeOptions}
        text="https://adactive.com"
    />
```
### Props

```javascript
type PropsType = {|
    +isOpen: boolean,
    +onClose: () => null,
    +text: string,
    +qrCodeOptions: Object,
    +ModalProps?: Object,
    +qrCodeCSS?: CSSStyleDeclaration
|};

static defaultProps = {
    isOpen: false,
    onClose: () => null,
    text: '',
    qrCodeOptions: {},
    ModalProps: {},
};
```

**isOpen** -> To show or hide qrCode component

**onClose** -> A callback function to close the qrCode component

**text** -> Url value to be embedded into qrcode

**qrCodeOptions** -> Refer to [qrcode.es](https://github.com/AdactiveSAS/qrcode.js) for more information

**ModalProps** -> Refer to [react-responsive-modal](https://github.com/pradel/react-responsive-modal) for more information

**qrCodeCSS** ->  To customise CSS for the qrCode canvas

## Copy component inside your project src folder  

### Less only
    `npx @adactive/arc-qrCode copy --less-only`
    
### Full copy
    `npx @adactive/arc-qrCode copy`
