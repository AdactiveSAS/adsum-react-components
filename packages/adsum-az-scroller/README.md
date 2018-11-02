![react-badge](https://img.shields.io/badge/react-js-53c1de.svg?style=flat)
![touch-badge](https://img.shields.io/badge/for-touch--screen-ff69b4.svg?style=flat)

# A to Z scrolling list

Made with <3 for easier touch experience.

![2018-05-11 0 17 34](https://user-images.githubusercontent.com/5297278/39992222-c13dfc3e-577a-11e8-9d6e-d6cbdd8f40e1.png)

[Live examples here](https://adactivesas.github.io/adsum-react-components/packages/adsum-az-scroller/examples/index.html)

## Getting started

    npm i --save-dev @adactive/az-scroller

OR

    yarn add --dev @adactive/az-scroller


## How to use

The only non-optional prop is the **list** you want to display. It has to be formated according to the
example below :

```javascript
    import AzScroller from "@adactive/az-scroller";
     ...
     <AzScroller
        list={[
            {
                sectionHeader: {
                    type: 'SectionHeader',
                    letter: 'A'
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
                ]
            },
            {
                sectionHeader: {
                    type: 'SectionHeader',
                    letter: 'B'
                },
                items: [
                    { text: 'BAPTISTE' },
                    { text: 'BARBARA' },
                    { text: 'BARNABÉ' },
                    { text: 'BARTHÉLÉMY' },
                    { text: 'BASILE' },
                ]
            },
            {
                sectionHeader: {
                    type: 'SectionHeader',
                    letter: 'C'
                },
                items: [
                    { text: 'CERISE' },
                    { text: 'CÉSAIRE' },
                    { text: 'CHARLES' },
                    { text: 'CHARLOT' },
                    { text: 'CHRISTIAN' },
                ]
            },
            {
                sectionHeader: {
                    type: 'SectionHeader',
                    letter: 'E'
                },
                items: [
                    { text: 'ESTELLE' },
                    { text: 'ETHAN' },
                    { text: 'ÉTIENNE' },
                    { text: 'EUGÈNE' },
                ]
            },
            {
                sectionHeader: {
                    type: 'SectionHeader',
                    letter: 'M'
                },
                items: [
                    { text: 'MICHÈLE' },
                    { text: 'MOROINE' },
                    { text: 'MURIELLE' },
                    { text: 'MYLÈNE' },
                ]
            },
            {
                sectionHeader: {
                    type: 'SectionHeader',
                    letter: 'S'
                },
                items: [
                    { text: 'SEBASTIAN' },
                    { text: 'SEREN' },
                    { text: 'STANLEY' },
                    { text: 'STÉPHANE' },
                    { text: 'SYBILLE' },
                    { text: 'SYLVAIN' },
                ]
            },
            {
                sectionHeader: {
                    type: 'SectionHeader',
                    letter: 'W'
                },
                items: [
                    { text: 'WANDY' },
                    { text: 'WAN' },
                    { text: 'WREN' },
                    { text: 'WILGELM' },
                    { text: 'WADE' },
                    { text: 'WILLIAM' },
                    { text: 'WINOC' }
                ]
            }
        ]}
      />
```



### Props

```javascript
type PropsType = {|
  list: ListType,
  renderListItem?: (ListItemType, key: string | number) => React.Node,
  renderListSectionHeader?: ?(sectionHeader: SectionHeaderType, key: string | number) => React.Node,
  shouldShowSectionHeaders?: boolean,
  listItemHeight?: ?number,
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

static defaultProps = {
        renderListItem: (listItem, key) => (
            <div
                key={key}
                style={{
                    boxSizing: 'border-box',
                    height: '30px',
                    padding: '10px 20px',
                }}
            >
                {listItem.text}
            </div>
        ),
        renderListSectionHeader: (sectionHeader, key) => (
            <div
                key={key}
                style={{
                    boxSizing: 'border-box',
                    height: '50px',
                    padding: '20px 20px',
                    border: 'solid 1px grey',
                    fontWeight: 'bold',
                }}
            >
                {sectionHeader.letter}
            </div>
        ),
        shouldShowSectionHeaders: false,
        listItemHeight: null,
        sectionHeaderHeight: null,
        wrapperClassNames: [],
        wrapperStyle: {
            boxSizing: 'border-box',
            width: '500px',
            height: '500px',
            border: 'solid 2px black',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
        },
        listClassNames: [],
        listStyle: {
            overflow: 'auto',
            maxHeight: '80%',
        },
        alphabetListClassNames: [],
        alphabetListStyle: {
            boxSizing: 'border-box',
            width: '100%',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '20px 10px',
        },
        letterClassNames: [],
        letterStyle: null,
        letterHighlightedClassNames: [],
        letterHighlightedStyle: {
            color: 'red',
            fontWeight: 'bold',
        },
    };
```

```javascript
export type ListItemType = Object;
export type SectionHeaderType = {
  letter: string,
  type: 'SectionHeader',
};
export type ListSectionType = {|
    sectionHeader: SectionHeaderType,
    items: Array<ListItemType>,
|};
export type ListType = Array<ListSectionType>;
```

**listClassNames** &rightarrow; classNames, which will be added to list wrapper element

**alphabetListClassNames** &rightarrow; classNames, which will be added to wrapper of alphabetList

**letterClassNames** &rightarrow; classNames, which will be added to each letter in alphabetList

**maxHeight** &rightarrow; the maximum height of the items list, at which the scrolling starts

**list** &rightarrow; the list of items to scroll through

**shouldShowSectionHeader** &rightarrow; shows if you need to display each section height, or you need just a list without any headers

**renderListItem** &rightarrow; a function, which you should provide and which will be called for each listItem. Should return a JSX component

**renderListSectionHeader** &rightarrow; same as renderListItem, but the purpose is to render list section headers

**sectionHeaderHeight** and **listItemHeight** &rightarrow; should be provided, if their heights are not equal. If not provided -> considered same height both.

## Copy component inside your project src folder  

It will copy the component inside your project, in src/adsum-az-scroller.

    npx @adactive/az-scroller copy
