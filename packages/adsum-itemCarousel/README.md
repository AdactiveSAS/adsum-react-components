# Item Carousel component

![image](https://user-images.githubusercontent.com/8574893/40462128-371b5d20-5f41-11e8-8202-575b7ffd6012.png)

![image](https://user-images.githubusercontent.com/8574893/40462162-4ef20dea-5f41-11e8-8f7f-ee13cbec9dd2.png)

[Live examples here](https://adactivesas.github.io/adsum-react-components/packages/adsum-itemCarousel/examples/)

## Getting started

```javascript
    npm i --save-dev @adactive/arc-itemcarousel
```
OR
```javascript
    yarn add --dev @adactive/arc-itemcarousel
```

```javascript
    import AdsumItemCarousel from "@adactive/arc-itemcarousel";
    ...
    
    onItemClicked(item) {
        console.log("[ITEM CLICKED] :: ", item);
    }
    
    const itemsWithoutLogo = [
        {
            name: 'Food'
        },
        ...
        {
            name: 'Carpark'
        }
    ];
    
    <AdsumItemCarousel
        isOpen={true}
        items={itemsWithoutLogo}
        itemsPerPage={9}
        onItemClicked={this.onItemClicked}
    />
```

### Props

```javascript
export type LogoObject = {
    +uri: string
};

export type ItemObject = {
    +name: string,
    +logo?: LogoObject
};

type PropTypes = {|
    +isOpen: boolean,
    +items: Array<ItemObject>,
    +itemsPerPage: number,
    +onItemClicked: () => null,
    +thumbNailWrapperCSS?: CSSStyleDeclaration,
    +logoWrapperCSS?: CSSStyleDeclaration,
    +logoCSS?: CSSStyleDeclaration,
    +titleWrapperCSS?: CSSStyleDeclaration,
    +titleCSS?: CSSStyleDeclaration,
    +dashCSS?: CSSStyleDeclaration,
    +carouselDecorators?: Array<Object>,
    +carouselOptions?: Object
|};

static defaultProps = {
    isOpen: false,
    items: [],
    itemsPerPage: 0,
    onItemClicked: null
};
```
**isOpen** -> To show or hide itemCarousel

**items** -> Array of itemsObjects to be displayed in the carousel

**itemsPerPage** -> To set the number of thumbnail in each carousel page

**onItemClicked** -> A callback function to capture clicking of thumbnail

**thumbNailWrapperCSS** -> To customise CSS for the overall thumbnail css

**logoWrapperCSS** -> To customise CSS for the div wrapping around the logo

**logoCSS** -> To customise CSS for logo div 

**titleWrapperCSS** -> To customise CSS for the wrapper around title and dash div

**titleCSS** -> To customise CSS for the title div 

**dashCSS** -> To customise CSS for the dash div

**carouselDecorators** -> To add in customised control for the carousel

**carouselOptions** -> Refer to [nuka-carousel](http://kenwheeler.github.io/nuka-carousel/#/) for more information 

![image](https://user-images.githubusercontent.com/8574893/40462559-089edeac-5f43-11e8-8a6a-05a48ca9f2a3.png)

## Copy component inside your project src folder  

### Less only
    `npx @adactive/arc-itemcarousel copy --less-only`
    
### Full copy
    `npx @adactive/arc-itemcarousel copy`