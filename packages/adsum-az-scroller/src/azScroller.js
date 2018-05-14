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
type PropsType = {|
    +listClassNames?: string,
    +alphabetListClassNames?: string,
    +letterClassNames?: string,
    +maxHeight: number,
    +list: ListType,
    +shouldShowSectionHeaders: boolean,
    +renderListItem: (ListItemType, key: string) => Node,
    +renderListSectionHeader: ?(headerInfo: SectionHeaderInfoType, key: string) => Node
|};
type StateType = {
    letterIndexesMapping: LetterIndexesMappingType
};

/**
 * @class
 * @extends React.Component
 */
class AzScroller extends React.Component<PropsType, StateType> {
    static defaultProps = {
        shouldShowSectionHeaders: false
    }

    onLetterClicked: (index: number) => () => void
    renderListItem: (index: number, key: string) => Node
    reactListComponent: ?ReactList
    listToRender: Array<SectionHeaderInfoType | ListItemType> = []

    constructor(props: PropsType) {
        super(props);

        this.bindAll();
    }

    state = {
        letterIndexesMapping: this.mapLettersToIndexes()
    }

    bindAll() {
        this.renderListItem = this.renderListItem.bind(this);
        this.onLetterClicked = this.onLetterClicked.bind(this);
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

            this.listToRender = [...this.listToRender, ...listSection.items];
        });

        return letterIndexesMapping;
    }

    renderListItem(index: number, key: string): Node {
        const { renderListItem, renderListSectionHeader, shouldShowSectionHeaders } = this.props;
        const itemToRender = this.listToRender[index];

        if (!shouldShowSectionHeaders) return renderListItem(itemToRender, key);
        if (itemToRender.type && itemToRender.type === 'SectionHeaderInfo' && renderListSectionHeader) {
            return renderListSectionHeader(itemToRender, itemToRender.letter);
        }

        return renderListItem(itemToRender, key);
    }

    render(): Node {
        const {
            maxHeight, listClassNames, alphabetListClassNames, letterClassNames
        } = this.props;

        return (
            <div className="azScroller">
                <div className={listClassNames} style={{ overflow: 'auto', maxHeight }}>
                    <ReactList
                        ref={(list: ReactList) => {
                            this.reactListComponent = list;
                        }}
                        itemRenderer={this.renderListItem}
                        length={this.listToRender.length}
                        useTranslate3d
                        type="uniform"
                    />
                </div>
                <AlphabetList
                    alphabetListClassNames={alphabetListClassNames}
                    letterClassNames={letterClassNames}
                    letterIndexesMapping={this.state.letterIndexesMapping}
                    onLetterClicked={this.onLetterClicked}
                />
            </div>
        );
    }
}

export default AzScroller;
