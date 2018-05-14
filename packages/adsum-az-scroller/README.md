# Scrolling list with letters for easier navigation

## Getting started

```javascript
    npm i --save-dev @adactive/az-scroller
```
OR
```javascript
    yarn add --dev @adactive/az-scroller
```

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
    +listClassNames?: string,
    +alphabetListClassNames?: string,
    +letterClassNames?: string,
    +maxHeight: number,
    +list: ListType,
    +shouldShowSectionHeaders: boolean,
    +renderListItem: (ListItemType, key: string | number) => Node,
    +renderListSectionHeader: ?(headerInfo: SectionHeaderInfoType, key: string | number) => Node,
    +sectionHeaderHeight?: number,
    +listItemHeight?: number
|};


static defaultProps = {
    shouldShowSectionHeaders: false
}
```

```javascript
type ListItemType = Object;
type SectionHeaderInfoType = { letter: string, type: 'SectionHeaderInfo' };
type ListSectionType = {|
    sectionHeaderInfo: SectionHeaderInfoType,
    items: Array<ListItemType>
|};
type ListType = Array<ListSectionType>;
type LetterIndexesMappingType = { [string]: number };
type ListEnumType = 'simple' | 'variable' | 'uniform';
```

listClassNames -> classNames, which will be added to list wrapper element
alphabetListClassNames -> classNames, which will be added to wrapper of alphabetList
letterClassNames -> classNames, which will be added to each letter in alphabetList
maxHeight -> the maximum height of the items list, at which the scrolling starts
list -> the list of items to scroll through
shouldShowSectionHeader -> shows if you need to display each section height, or you need just a list without any headers
renderListItem -> a function, which you should provide and which will be called for each listItem. Should return a JSX component
renderListSectionHeader -> same as renderListItem, but the purpose is to render list section headers
sectionHeaderHeight and listItemHeight -> should be provided, if their heights are not equal. If not provided -> considered same height both.

## Copy component inside your project src folder  

### Less only
    `npx @adactive/@adactive/az-scroller copy --less-only`
    
### Full copy
    `npx @adactive/@adactive/az-scroller copy`
        
