# Search component

## Getting started

```javascript
    npm i --save-dev @adactive/arc-Search
```
OR
```javascript
    yarn add --dev @adactive/arc-Search
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
        fuseOptions={{}}
        queryValue={''}
        ref={this.searchResultRef}
    />
```

### Props
 
```javascript
type PropTypes = {|
    +isOpen: boolean,
    +lang: 'en' | 'fr',
    +queryValue: string,
    +data: Array<Object>,
    +fuseOptions: Object
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
**fuseOptions** -> Refer to http://fusejs.io/ for more information

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

## Copy component inside your project src folder  

### Less only
    `npx @adactive/arc-Search copy --less-only`
    
### Full copy
    `npx @adactive/arc-Search copy`