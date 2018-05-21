# Keyboard component

![image](https://user-images.githubusercontent.com/8574893/40049349-257a9756-5867-11e8-92f1-fc8b811ca5ab.png)

[Live examples here](https://adactivesas.github.io/adsum-react-components/packages/adsum-keyboard/examples/index.html)

## Getting started

```javascript
    npm i --save-dev @adactive/arc-keyboard
```
OR
```javascript
    yarn add --dev @adactive/arc-keyboard
```

```javascript
    import AdsumKeyboard from "@adactive/arc-keyboard"
     ...
    <AdsumKeyboard 
        isOpen=true 
        lang="en"
        currentValue="" 
        onKeyClicked={this.onKeyClicked}
         
    />
```

### Props
 
```javascript
type PropsType = {|
    +isOpen: boolean,
    +lang: 'en' | 'fr',
    +currentValue: string,
    +onKeyClicked: (string) => void
|};


static defaultProps = {
    isOpen: false,
    lang: 'en',
    currentValue: '',
    onKeyClicked: null
}
```

**isOpen** -> To show or hide keyboard
**lang** -> Language of keyboard
**currentValue** -> To pass current query value from application for keyboard to process result
**onKeyClicked** -> A callback function to result back to the application

## Copy component inside your project src folder  

### Less only
    `npx @adactive/arc-keyboard copy --less-only`
    
### Full copy
    `npx @adactive/arc-keyboard copy`