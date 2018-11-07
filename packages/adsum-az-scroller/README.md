![react-badge](https://img.shields.io/badge/react-js-53c1de.svg?style=flat)
![touch-badge](https://img.shields.io/badge/for-touch--screen-ff69b4.svg?style=flat)

# A to Z scrolling list

Made with <3 for easier touch experience.

![Screenshot of AzScroller component](img/readMeImage.png)

[//]: # ([Live examples here](https://adactivesas.github.io/adsum-react-components/packages/adsum-az-scroller/examples/index.html)

## Getting started

    npm i --save-dev @adactive/az-scroller

OR

    yarn add --dev @adactive/az-scroller


## How to use

The only non-optional prop is the **list** you want to display. It has to be properly formatted, with
the list divided in *Sections*, and each Section having a *Header* object and an *Items* array.

See the example below:

```javascript
    import AzScroller from "@adactive/az-scroller";
    
    // ...

    const listExample = [
         {
             header: {
                 type: 'SectionHeader',
                 letter: 'A',
             },
             items: [
                 { text: 'ABEL' },
                 { text: 'ABRAHAM' },
                 { text: 'ACHILLE' },
                 { text: 'ADAM' },
                 { text: 'ADÈLE' },
                 { text: 'ADELINE' },
                 { text: 'ADOLPHE' },
                 { text: 'ANTOINE' },
             ],
         },
         {
             header: {
                 type: 'SectionHeader',
                 letter: 'B',
             },
             items: [
                 { text: 'BAPTISTE' },
                 { text: 'BARBARA' },
                 { text: 'BARNABÉ' },
                 { text: 'BARTHÉLÉMY' },
                 { text: 'BASILE' },
             ],
         },
         {
             header: {
                 type: 'SectionHeader',
                 letter: 'C',
             },
             items: [
                 { text: 'CERISE' },
                 { text: 'CÉSAIRE' },
                 { text: 'CHARLES' },
                 { text: 'CHARLOT' },
                 { text: 'CHRISTIAN' },
             ],
         },
         {
             header: {
                 type: 'SectionHeader',
                 letter: 'E',
             },
             items: [
                 { text: 'ESTELLE' },
                 { text: 'ETHAN' },
                 { text: 'ÉTIENNE' },
                 { text: 'EUGÈNE' },
             ],
         },
         {
             header: {
                 type: 'SectionHeader',
                 letter: 'M',
             },
             items: [
                 { text: 'MICHÈLE' },
                 { text: 'MOROINE' },
                 { text: 'MURIELLE' },
                 { text: 'MYLÈNE' },
             ],
         },
         {
             header: {
                 type: 'SectionHeader',
                 letter: 'S',
             },
             items: [
                 { text: 'SEBASTIAN' },
                 { text: 'SEREN' },
                 { text: 'STANLEY' },
                 { text: 'STÉPHANE' },
                 { text: 'SYBILLE' },
                 { text: 'SYLVAIN' },
             ],
         },
         {
             header: {
                 type: 'SectionHeader',
                 letter: 'W',
             },
             items: [
                 { text: 'WANDY' },
                 { text: 'WAN' },
                 { text: 'WREN' },
                 { text: 'WILGELM' },
                 { text: 'WADE' },
                 { text: 'WILLIAM' },
                 { text: 'WINOC' },
             ],
         },
     ];
    
    <AzScroller list={listExample} />
```


**The *Header* object must have a `type: 'SectionHeader'` and a `letter: 'anyString'` field, those
are mandatory. Plus, you must NOT use a `letter` field in any *Items*.**

Else, in the *Header* and the *Items* you can tweak the other fields and name them as you want, add fields, etc.
You will be able to retrieve those fields in the `renderListItem` & `renderListSectionHeader` render
methods.


## Optional props

```javascript
type PropsType = {|
  list: ListType,
  renderSectionItem?: ?(item: SectionItemType, key: string | number) => React.Node,
  renderSectionHeader?: ?(header: SectionHeaderType, key: string | number) => React.Node,
  shouldShowSectionHeaders?: boolean,
  sectionItemHeight?: ?number,
  sectionHeaderHeight?: ?number,
  wrapperClassNames?: Array<string>,
  wrapperStyle?: ?CSSStyleDeclaration,
  listClassNames?: Array<string>,
  listStyle?: ?CSSStyleDeclaration,
  alphabetListClassNames?: Array<string>,
  alphabetListStyle?: ?CSSStyleDeclaration,
  letterClassNames?: Array<string>,
  letterStyle?: ?CSSStyleDeclaration,
  letterHighlightedClassNames?: Array<string>,
  letterHighlightedStyle?: ?CSSStyleDeclaration,
|};
```

#### list
The list of items to scroll through.

#### renderSectionItem
A function, which you should provide and which will be called for each listItem.
Should return a JSX component.

#### renderSectionHeader
Same as renderSectionItem, but the purpose is to render list section headers.

#### shouldShowSectionHeaders
Shows if you need to display each section height, or you need just a list without any headers.

#### sectionItemHeight & sectionHeaderHeight
Should be provided to assure a smooth scrolling experience. The easiest way to do that is to set a fixed
height in the 2 render methods and pass them as props here as well (see Default Props section for 
an example). **If you pass render methods, don't forget to pass the corresponding height, else default
height from default props will be used, which can lead to UI issues.** For more indormations on the topic,
take a look at *react-list* package which is used here: https://www.npmjs.com/package/react-list

#### listClassNames & listStyle
Modify the style of *list wrapper element* either with CSS classnames or inline style object, or both.

#### alphabetListClassNames & alphabetListStyle
Modify the style of *wrapper of alphabetList* either with CSS classnames or inline style object, or both.

#### letterClassNames & letterStyle
Modify the style of *each letter in alphabetList* either with CSS classnames or inline style object, or both.

#### letterHighlightedClassNames & letterHighlightedStyle
Modify the style of *the highlighted letter in alphabetList* either with CSS classnames or inline style object, or both.


> Note that classnames props are **an array of strings** (one string for each classname you want to pass)
and **not a single string with spaces**. So if you want to pass only one classname *'letter-class-name'* to letter
for example, you must pass
```javascript
<AzScroller
    list={listExample}
    letterClassNames={["letter-class-name"]}
/>
```


## Exported Types

```javascript
export type SectionItemType = Object;
export type SectionHeaderType = {
  type: 'SectionHeader',
  letter: string,
};
export type ListSectionType = {|
    header: SectionHeaderType,
    items: Array<SectionItemType>,
|};
export type ListType = Array<ListSectionType>;
```


## Default props

```javascript
static defaultProps = {
    renderSectionItem: (item: SectionItemType, key: string | number) => (
        <div
            key={key}
            style={{
                boxSizing: 'border-box',
                height: '30px',
                padding: '10px 20px',
            }}
        >
            {item.text}
        </div>
    ),
    renderSectionHeader: (header: SectionHeaderType, key: string | number) => (
        <div
            key={key}
            style={{
                boxSizing: 'border-box',
                height: '50px',
                padding: '20px 20px',
                fontWeight: 'bold',
                backgroundColor: 'lightgrey',
            }}
        >
            {header.letter}
        </div>
    ),
    shouldShowSectionHeaders: false,
    sectionItemHeight: null,
    sectionHeaderHeight: null,
    wrapperClassNames: [],
    wrapperStyle: null,
    listClassNames: [],
    listStyle: null,
    alphabetListClassNames: [],
    alphabetListStyle: null,
    letterClassNames: [],
    letterStyle: null,
    letterHighlightedClassNames: [],
    letterHighlightedStyle: null,
};

static defaultStyleProps = {
    listStyle: {
        overflow: 'auto',
        maxHeight: '80%',
    },
    alphabetListStyle: {
        boxSizing: 'border-box',
        width: '100%',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '20px 10px',
    },
    wrapperStyle: {
        boxSizing: 'border-box',
        width: '500px',
        height: '500px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
    },
    letterStyle: {
        outline: 'none',
    },
    letterHighlightedStyle: {
        color: 'red',
        fontWeight: 'bold',
    },
};
```


*Default style props* will apply if:
- of course *the corresponding style prop is not passed*
- AND *the corresponding classnames prop is not passed*


**This means that passing a classname or a inline style object will desactivate the corresponding
default style**

## Copy component inside your project src folder  

It will copy the component inside your project, in src/adsum-az-scroller.

    npx @adactive/az-scroller copy
