# Clock component


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