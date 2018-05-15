# Carousel component

![image](https://user-images.githubusercontent.com/6003532/39986925-bebf3d72-5795-11e8-91bb-ae8235ac5896.png)

[Live examples here](https://adactivesas.github.io/adsum-react-components/packages/adsum-carousel/examples/index.html)

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