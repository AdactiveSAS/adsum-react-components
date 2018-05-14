# Carousel component

## Getting started

```javascript
    npm i --save-dev @adactive/arc-carousel
```
OR
```javascript
    yarn add --dev @adactive/arc-carousel
```

```javascript
    import AdsumCarousel from "@adactive/arc-carousel"
     ...
    <AdsumCarousel 
        isOpen=true 
        medias=[]
        onTouchToNavigate={this.onTouchToNavigate}
    />
```

### Props
 
```javascript
AdsumCarousel.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    medias: PropTypes.arrayOf(PropTypes.object).isRequired,
    onTouchToNavigate: PropTypes.func.isRequired
};

AdsumCarousel.defaultProps = {
    isOpen: false,
    medias: [],
    onTouchToNavigate: null
};
```

```javascript
isOpen: true | false
medias: Data (Array of Objects)
onTouchToNavigate: callback function
```


## Copy component inside your project src folder  

### Less only
    `npx @adactive/arc-carousel copy --less-only`
    
### Full copy
    `npx @adactive/arc-carousel copy`