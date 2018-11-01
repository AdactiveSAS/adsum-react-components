![react-badge](https://img.shields.io/badge/react-js-53c1de.svg?style=flat)
![touch-badge](https://img.shields.io/badge/for-touch--screen-ff69b4.svg?style=flat)

# A to Z scrolling list

Made with <3 for easier touch experience.

![2018-05-11 0 17 34](https://user-images.githubusercontent.com/5297278/39992222-c13dfc3e-577a-11e8-9d6e-d6cbdd8f40e1.png)

[Live examples here](https://adactivesas.github.io/adsum-react-components/packages/adsum-az-scroller/examples/index.html)

## Getting started

```shell
    npm i --save-dev @adactive/az-scroller
```
OR
```shell
    yarn add --dev @adactive/az-scroller
```

## How to use

```javascript
    import AzScroller from "@adactive/az-scroller";
     ...
     <AzScroller
        maxHeight={220}
        list={[
            {
                sectionHeaderInfo: {
                    type: 'SectionHeaderInfo',
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
                sectionHeaderInfo: {
                    type: 'SectionHeaderInfo',
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
                sectionHeaderInfo: {
                    type: 'SectionHeaderInfo',
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
                sectionHeaderInfo: {
                    type: 'SectionHeaderInfo',
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
                sectionHeaderInfo: {
                    type: 'SectionHeaderInfo',
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
                sectionHeaderInfo: {
                    type: 'SectionHeaderInfo',
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
                sectionHeaderInfo: {
                    type: 'SectionHeaderInfo',
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
        shouldShowSectionHeaders={true}
        renderListItem={(listItem: ListItem, key: string | number): Node => (
            <div key={key}>
                {listItem.text}
            </div>
        )}
        renderListSectionHeader={(headerInfo: SectionHeaderInfo, key: string | number): Node => (
            <li key={key}>
                {`Section header of letter ${key}`}
            </li>
        )}
        sectionHeaderHeight={18}
        listItemHeight={18}
      />
```

### Props

```javascript
type PropsType = {|
  list: ListType,
  renderListItem?: (ListItemType, key: string | number) => React.Node,
  renderListSectionHeader?: ?(headerInfo: SectionHeaderInfoType, key: string | number) => React.Node,
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
        renderListSectionHeader: (headerInfo, key) => (
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
                {headerInfo.letter}
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
export type SectionHeaderInfoType = {
  letter: string,
  type: 'SectionHeaderInfo',
};
export type ListSectionType = {|
    sectionHeaderInfo: SectionHeaderInfoType,
    items: Array<ListItemType>,
|};
export type ListType = Array<ListSectionType>;
```

**listClassNames** -> classNames, which will be added to list wrapper element

**alphabetListClassNames** -> classNames, which will be added to wrapper of alphabetList

**letterClassNames** -> classNames, which will be added to each letter in alphabetList

**maxHeight** -> the maximum height of the items list, at which the scrolling starts

**list** -> the list of items to scroll through

**shouldShowSectionHeader** -> shows if you need to display each section height, or you need just a list without any headers

**renderListItem** -> a function, which you should provide and which will be called for each listItem. Should return a JSX component

**renderListSectionHeader** -> same as renderListItem, but the purpose is to render list section headers

**sectionHeaderHeight** and **listItemHeight** -> should be provided, if their heights are not equal. If not provided -> considered same height both.

## Copy component inside your project src folder  

### Less only
    `npx @adactive/@adactive/az-scroller copy --less-only`

### Full copy
    `npx @adactive/@adactive/az-scroller copy`
