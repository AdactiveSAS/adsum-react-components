// @flow

import * as React from 'react';
import type { Node } from 'react';
import ReactList from 'react-list';

import { AlphabetList } from './subComponents/alphabetList';

import './azScroller.css';

export type ListItemType = Object;
export type SectionHeaderInfoType = { letter: string, type: 'SectionHeaderInfo' };
export type ListSectionType = {|
    sectionHeaderInfo: SectionHeaderInfoType,
    items: Array<ListItemType>
|};
export type ListType = Array<ListSectionType>;
export type LetterIndexesMappingType = { [string]: number };
export type ListEnumType = 'simple' | 'variable' | 'uniform';
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
type StateType = {|
    letterIndexesMapping: LetterIndexesMappingType
|};

/**
 * @class
 * @extends React.Component
 */
class AzScroller extends React.Component<PropsType, StateType> {
    static defaultProps = {
        shouldShowSectionHeaders: false,
    }

    onLetterClicked: (index: number) => () => void;

    renderListItem: (index: number, key: string) => Node;

    itemSizeGetter: (index: number) => ?number;

    reactListComponent: ?ReactList;

    alphabetListComponent: ?AlphabetList;

    listToRender: Array<SectionHeaderInfoType | ListItemType> = [];

    constructor(props: PropsType) {
        super(props);

        this.bindAll();
    }

    state = {
        letterIndexesMapping: this.mapLettersToIndexes(),
    }

    bindAll() {
        this.renderListItem = this.renderListItem.bind(this);
        this.onLetterClicked = this.onLetterClicked.bind(this);
        this.itemSizeGetter = this.itemSizeGetter.bind(this);
    }

    componentDidMount() {
        this.mapLettersToIndexes();
    }

    onLetterClicked(index: number): () => void {
        return () => {
            if (this.reactListComponent) {
                this.reactListComponent.scrollTo(index);
            }
        };
    }

    mapLettersToIndexes(): LetterIndexesMappingType {
        const { list, shouldShowSectionHeaders } = this.props;
        const letterIndexesMapping: LetterIndexesMappingType = {};
        let sectionIndex = 0;

        list.forEach((listSection: ListSectionType) => {
            letterIndexesMapping[listSection.sectionHeaderInfo.letter] = sectionIndex;

            sectionIndex += listSection.items.length;

            if (shouldShowSectionHeaders) {
                this.listToRender.push(listSection.sectionHeaderInfo);

                sectionIndex++;
            }

            const items = [...listSection.items];

            items.forEach((item: ListItemType) => {
                item.letter = listSection.sectionHeaderInfo.letter;
            });

            this.listToRender = [...this.listToRender, ...items];
        });

        return letterIndexesMapping;
    }

    getLetterFromIndex(index: number): string {
        return this.listToRender[index].letter;
    }

    renderListItem(index: number, key: number): Node {
        const { renderListItem, renderListSectionHeader, shouldShowSectionHeaders } = this.props;
        const itemToRender = this.listToRender[index];

        if (this.reactListComponent) {
            const topItemInVisibleRange = this.reactListComponent.getVisibleRange()[0];
            const currentLetter = this.getLetterFromIndex(topItemInVisibleRange);

            if (this.alphabetListComponent) {
                this.alphabetListComponent.setCurrentLetter(currentLetter);
            }
        }
        if (!shouldShowSectionHeaders) return renderListItem(itemToRender, key);
        if (itemToRender.type && itemToRender.type === 'SectionHeaderInfo' && renderListSectionHeader) {
            return renderListSectionHeader(itemToRender, itemToRender.letter);
        }

        return renderListItem(itemToRender, key);
    }

    itemSizeGetter(index: number): ?number {
        const { sectionHeaderHeight, listItemHeight } = this.props;
        const item = this.listToRender[index];

        if (item.type && item.type === 'SectionHeaderInfo') {
            return sectionHeaderHeight;
        }

        return listItemHeight;
    }

    render(): Node {
        const {
            maxHeight, listClassNames, alphabetListClassNames, letterClassNames, listItemHeight,
        } = this.props;
        const listType: ListEnumType = listItemHeight ? 'variable' : 'uniform';

        return (
            <div className="azScroller">
                <div className={listClassNames} style={{ overflow: 'auto', maxHeight }}>
                    <ReactList
                        ref={(list: ReactList) => {
                            this.reactListComponent = list;
                        }}
                        itemSizeGetter={listType === 'variable' ? this.itemSizeGetter : null}
                        itemRenderer={this.renderListItem}
                        length={this.listToRender.length}
                        useTranslate3d
                        type={listType}
                    />
                </div>
                <AlphabetList
                    ref={(alphabetList: ReactList) => {
                        this.alphabetListComponent = alphabetList;
                    }}
                    alphabetListClassNames={alphabetListClassNames}
                    letterClassNames={letterClassNames}
                    letterIndexesMapping={this.state.letterIndexesMapping}
                    onLetterClicked={this.onLetterClicked}
                    letterToHighlight={this.state.currentLetter}
                />
            </div>
        );
    }
}

export default AzScroller;
