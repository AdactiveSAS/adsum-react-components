# Clock component


## Demo

[Example here](https://adactivesas.github.io/adsum-react-components/packages/adsum-clock/examples/index.html)

## Getting started

```javascript
    npm i --save-dev @adactive/arc-clock
```
OR
```javascript
    yarn add --dev @adactive/arc-clock
```

```javascript
    import AdsumClock from "@adactive/arc-clock"
     ...
    <AdsumClock lang="en" timeFormat="12hrs" />
```

### Props
 
```javascript
AdsumClock.propTypes = {
    lang: PropTypes.string.isRequired,
    timeFormat: PropTypes.string.isRequired,
    style: PropTypes.objectOf(PropTypes.string)
};

AdsumClock.defaultProps = {
    lang: 'en',
    timeFormat: '24hrs',
    style: null
};
```

```javascript
lang : "en" | "fr" | "zh"
timeFormat : "24hrs" | "12hrs"
style : Css react object
```


## Copy component inside your project src folder  

### Less only
    `npx @adactive/arc-clock copy --less-only`
    
### Full copy
    `npx @adactive/arc-clock copy`