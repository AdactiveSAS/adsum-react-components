# Item Carousel component

![image](https://user-images.githubusercontent.com/8574893/40462128-371b5d20-5f41-11e8-8202-575b7ffd6012.png)

![image](https://user-images.githubusercontent.com/8574893/40467947-58d8f748-5f5e-11e8-9fd3-e070f768cd8b.png)

![image](https://user-images.githubusercontent.com/8574893/40474107-b5d27b88-5f70-11e8-9748-fbafb9679ef0.png)

[Live examples here](https://adactivesas.github.io/adsum-react-components/packages/adsum-itemCarousel/examples/)

## Getting started

```javascript
    npm i --save @adactive/arc-itemcarousel
```
OR
```javascript
    yarn add @adactive/arc-itemcarousel
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
    +listWrapperCSS?: CSSStyleDeclaration,
    +thumbNailWrapperCSS?: CSSStyleDeclaration,
    +logoWrapperCSS?: CSSStyleDeclaration,
    +logoCSS?: CSSStyleDeclaration,
    +titleWrapperCSS?: CSSStyleDeclaration,
    +titleCSS?: CSSStyleDeclaration,
    +dashCSS?: CSSStyleDeclaration,
    +carouselOptions?: Object,
    +defaultLogo?: string
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

**listWrapperCSS** -> To customise CSS for the overall list

**thumbNailWrapperCSS** -> To customise CSS for the overall thumbnail css

**logoWrapperCSS** -> To customise CSS for the div wrapping around the logo

**logoCSS** -> To customise CSS for logo div 

**titleWrapperCSS** -> To customise CSS for the wrapper around title and dash div

**titleCSS** -> To customise CSS for the title div 

**dashCSS** -> To customise CSS for the dash div

**carouselOptions** -> Refer to [nuka-carousel](http://kenwheeler.github.io/nuka-carousel/#/) for more information 

**defaultLogo** -> To add a default logo for items in the carousel without logo

![image](https://user-images.githubusercontent.com/8574893/40474237-12f20d92-5f71-11e8-9140-16e7c353d0d6.png)


## Copy component inside your project src folder  

### Less only
    `npx @adactive/arc-itemcarousel copy --less-only`
    
### Full copy
    `npx @adactive/arc-itemcarousel copy`
