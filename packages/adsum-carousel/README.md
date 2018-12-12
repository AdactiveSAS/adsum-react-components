# Carousel component

![image](https://user-images.githubusercontent.com/6003532/39986925-bebf3d72-5795-11e8-91bb-ae8235ac5896.png)

[Live examples here](https://adactivesas.github.io/adsum-react-components/packages/adsum-carousel/examples/index.html)

## Getting started

```javascript
    npm i --save @adactive/arc-carousel
```
OR
```javascript
    yarn add @adactive/arc-carousel
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
type PropsType = {|
    +isOpen: boolean,
    +medias: Array<MediaType>,
    +onMediaTouch: (MediaType) => void,
    +carouselOptions?: Object,
    +style?: CSSStyleDeclaration
|};

static defaultProps = {
    isOpen: false,
    medias: [],
    onMediaTouch: null,
    carouselOptions: {
        dragging: false,
        swiping: false,
        autoplayInterval: 10000,
        speed: 1000,
        renderCenterLeftControls: null,
        renderCenterRightControls: null,
        renderCenterBottomControls: null,
        renderBottomCenterControls: null,
        arrows: false,
        pauseOnHover: false,
        slidesToShow: 1,
        slidesToScroll: 1,
        adaptiveHeight: true,
        wrapAround: true
    }
};
```

**isOpen** -> To show or hide carousel

**medias** -> Array of medias to be displayed in the carousel

**onMediaTouch** -> A callback function to capture clicking of the media

**carouselOptions** -> Refer to [nuka-carousel](http://kenwheeler.github.io/nuka-carousel/#/) for more information. However, 2 of the following options in nuka carousel have been predefined in Adsum Carousel Component.

- autoPlay: This option will be set to true if there is only 1 media in the carousel and false if there are multiple media.
- afterSlide: This option will be a predefined callback function that plays a video immediately if the next media in the carousel is a video.

**style** -> To customise the CSS of the overall component


## Copy component inside your project src folder  

### Less only
    `npx @adactive/arc-carousel copy --less-only`
    
### Full copy
    `npx @adactive/arc-carousel copy`
