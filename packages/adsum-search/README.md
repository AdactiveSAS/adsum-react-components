# Search component

![search 1](https://user-images.githubusercontent.com/8574893/40287867-f3ca6440-5ce2-11e8-8237-22165597d769.png)

![search 2](https://user-images.githubusercontent.com/8574893/40287868-f3f527a2-5ce2-11e8-8dc8-8a322017268e.png)

[Live examples here](https://adactivesas.github.io/adsum-react-components/packages/adsum-search/examples/)

## Getting started

```javascript
    npm i --save @adactive/arc-search
```
OR
```javascript
    yarn add @adactive/arc-search
```

```javascript
    import AdsumSearch from "@adactive/arc-Search"
     ...
    constructor(props) {    
        this.searchResultRef = React.createRef();
    }
    
    <AdsumSearch 
        isOpen={true}
        lang={"en"}
        data={[]}
        fuseOptions={fuseOptions}
        queryValue={''}
        ref={this.searchResultRef}
    />
```

### Functions
- search(searchInput: string)
    - expects a string as parameter 
    - returns an array of results

### Props
 
```javascript
type PropTypes = {|
    +isOpen: boolean,
    +lang: 'en' | 'fr',
    +data: Array<Object>,
    +queryValue: string,
    +fuseOptions: Object,
    +searchWrapperCSS?: CSSStyleDeclaration,
    +inputCSS?: CSSStyleDeclaration,
    +placeHolder?: string
|};

static defaultProps = {
    isOpen: false,
    lang: 'en',
    queryValue: '',
    data: [],
    fuseOptions: {} 
};
```
**isOpen** -> To show or hide search bar

**lang** -> Language for displaying placeholder

**data** -> An array of data to be injected into fusejs to perform the search

**queryValue** -> String to be displayed on the search bar and to be searched

**fuseOptions** -> Refer to [fusejs.io](http://fusejs.io/) for more information

**searchWrapperCSS** -> To customise the overall CSS for the entire component

**inputCSS** -> To customise the CSS for the search bar

**placeHolder** -> To customise placeholder message

```javascript
const fuseOptions = {
  id: string,
  caseSensitive: boolean,
  shouldSort: boolean,
  tokenize: boolean,
  matchAllTokens: boolean,
  findAllMatches: boolean,
  includeScore: boolean,
  includeMatches: boolean,
  threshold: number,
  location: number,
  distance: number,
  maxPatternLength: number,
  minMatchCharLength: number,
  keys: Array<Object>
};
```

## Additional Information
- AdsumSearch component should be used together with [AdsumKeyboard component](https://github.com/AdactiveSAS/adsum-react-components/tree/master/packages/adsum-keyboard) to perform search.


## Copy component inside your project src folder  

### Less only
    `npx @adactive/arc-search copy --less-only`
    
### Full copy
    `npx @adactive/arc-search copy`
