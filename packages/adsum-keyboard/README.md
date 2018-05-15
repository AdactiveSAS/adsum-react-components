#Keyboard component

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
        onKeyClicked={this.onKeyClicked} 
    />
```

### Props
 
```javascript
AdsumKeyboard.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    lang: PropTypes.string.isRequired,
    onKeyClicked: PropTypes.func.isRequired
};

AdsumKeyboard.defaultProps = {
    isOpen: false,
    lang: 'en'
};
```

```javascript
isOpen : true | false
lang: 'en' | 'fr'
onKeyClicked: callback function
```

## Copy component inside your project src folder  

### Less only
    `npx @adactive/arc-keyboard copy --less-only`
    
### Full copy
    `npx @adactive/arc-keyboard copy`