// @flow

import * as React from 'react';
import ReactList from 'react-list';
import classNames from 'classnames';

import AlphabetList from './subComponents/AlphabetList';

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

type LetterIndexesMappingType = { [string]: number };
type ListEnumType = 'simple' | 'variable' | 'uniform';
type mapLettersToIndexesOutputType = {
    listToRender: Array<SectionHeaderType | SectionItemType>,
    letterIndexesMapping: LetterIndexesMappingType,
};
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
type StateType = {|
    listToRender: Array<SectionHeaderType | SectionItemType>,
    letterIndexesMapping: LetterIndexesMappingType,
    currentLetter: ?string,
|};

/**
 * @class
 * @extends React.Component
 */
class AzScroller extends React.Component<PropsType, StateType> {
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
        wrapperStyle: {
            boxSizing: 'border-box',
            width: '500px',
            height: '500px',
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
        letterStyle: {
            outline: 'none',
        },
        letterHighlightedClassNames: [],
        letterHighlightedStyle: {
            color: 'red',
            fontWeight: 'bold',
        },
    };

    reactListComponent: ?ReactList = React.createRef();

    state = {
        listToRender: [],
        letterIndexesMapping: {},
        currentLetter: null,
    };

    componentDidMount() {
        this.setInitialState();
    }

    componentDidUpdate(prevProps: PropsType) {
        const { list } = this.props;

        if (prevProps.list !== list) {
            this.setInitialState();
        }
    }

    getCurrentLetter(): ?string {
        if (this.reactListComponent && this.reactListComponent.current) {
            const reactListRef = this.reactListComponent.current;
            const visibleItems = reactListRef.getVisibleRange();
            const topItemInVisibleRange = visibleItems[0];

            return this.getLetterFromIndex(topItemInVisibleRange);
        }

        return null;
    }

    onLetterClicked = (index: number) => {
        if (this.reactListComponent && this.reactListComponent.current) {
            this.reactListComponent.current.scrollTo(index);
            /*
            * We have to set a timeout here, it is a workaround.
            *
            * The method scrollTo triggers a scroll event,
            * but the correct index is not set yet.
            * So we need to manually update the current letter
            * with the correct index.catch
            *
            * The purpose of the timeout is to be sure to
            * manually set AFTER the automatic set triggered by the scroll event
            *
            * 30 milliseconds seem to be enough
            */
            setTimeout(() => this.updateCurrentLetter(index), 30);
        }
    };

    getLetterFromIndex = (index: number): ?string => {
        const { listToRender } = this.state;
        const item = listToRender ? listToRender[index] : null;
        return item ? item.letter : null;
    };

    getListType(): ListEnumType {
        const {
            sectionItemHeight, sectionHeaderHeight, shouldShowSectionHeaders
        } = this.props;

        // heights are given
        if (sectionItemHeight && sectionHeaderHeight) return 'variable';

        // all items will be the same size
        if (!shouldShowSectionHeaders) return 'uniform';

        // default type
        return 'simple';
    }

    goToTheTop = () => {
        if (this.reactListComponent && this.reactListComponent.current) {
            this.reactListComponent.current.scrollTo(0);
            /*
                * We have to set a timeout here, it is a workaround
                * The method scrollTo triggers a scroll event, but the correct index (0 here) is not set yet
                * So we need to manually update the current letter with the correct index (0 here)
                * The purpose of the timeout is to be sure to manually set AFTER the automatic set
                * triggered by the scroll event
                * 30 milliseconds seem to be enough
             */
            setTimeout(() => this.updateCurrentLetter(0), 30);
        }
    };

    mapLettersToIndexes = (): mapLettersToIndexesOutputType => {
        const { list, shouldShowSectionHeaders } = this.props;

        const letterIndexesMapping: LetterIndexesMappingType = {};
        let sectionIndex: number = 0;
        let listToRender: Array<SectionHeaderType | SectionItemType> = [];

        list.forEach((listSection: ListSectionType) => {
            const { letter } = listSection.header;

            // Add letter to the indexes mapping with corresponding section index
            letterIndexesMapping[letter] = sectionIndex;

            // Increase the section index with the number of items in the current section
            sectionIndex += listSection.items.length;

            if (shouldShowSectionHeaders) {
                listToRender.push(listSection.header);
                sectionIndex++;
            }

            const items = listSection.items.map((item: SectionItemType) => ({
                ...item,
                letter
            }));

            listToRender = [...listToRender, ...items];
        });

        return {
            listToRender,
            letterIndexesMapping
        };
    };

    renderListItem = (index: number, key: number): React.Node => {
        const {
            renderSectionItem, renderSectionHeader, shouldShowSectionHeaders
        } = this.props;
        const { listToRender } = this.state;

        const itemToRender = listToRender[index];

        if (!shouldShowSectionHeaders) return renderSectionItem(itemToRender, key);

        if (
            itemToRender.type
          && itemToRender.type === 'SectionHeader'
          && renderSectionHeader
        ) {
            return renderSectionHeader(itemToRender, key);
        }

        return renderSectionItem(itemToRender, key);
    };

    itemSizeGetter = (index: number): ?number => {
        const { sectionHeaderHeight, sectionItemHeight } = this.props;
        const { listToRender } = this.state;

        const item = listToRender[index];

        if (item.type && item.type === 'SectionHeader') {
            return sectionHeaderHeight;
        }

        return sectionItemHeight;
    };

    updateCurrentLetter = (index: ?number = null) => {
        let currentLetter = null;

        if (index) { // index of letter to update is specified
            currentLetter = this.getLetterFromIndex(index);
        } else { // index is not, we retrieve it automatically
            currentLetter = this.getCurrentLetter();
        }

        // eslint-disable-next-line react/destructuring-assignment
        if (currentLetter && this.state.currentLetter !== currentLetter) {
            this.setState({ currentLetter });
        }
    };

    handleScroll = () => {
        this.updateCurrentLetter();
    };

    setInitialState() {
        const {
            listToRender, letterIndexesMapping
        } = this.mapLettersToIndexes();

        this.setState({
            listToRender,
            letterIndexesMapping
        });

        this.goToTheTop();
    }

    renderReactList(): Node {
        const { listClassNames, listStyle } = this.props;
        const { listToRender } = this.state;

        const listType: ListEnumType = this.getListType();

        return (
            <div
                className={classNames(listClassNames)}
                style={listStyle}
                onScroll={this.handleScroll}
            >
                <ReactList
                    ref={this.reactListComponent}
                    itemSizeGetter={
                        listType === 'variable' ? this.itemSizeGetter : null
                    }
                    itemRenderer={this.renderListItem}
                    length={listToRender.length}
                    useTranslate3d
                    type={listType}
                />
            </div>
        );
    }

    renderAlphabetList(): Node {
        const {
            alphabetListClassNames, alphabetListStyle,
            letterClassNames, letterStyle,
            letterHighlightedClassNames, letterHighlightedStyle
        } = this.props;
        const { currentLetter, letterIndexesMapping } = this.state;

        return (
            <AlphabetList
                letterToHighlight={currentLetter}
                onLetterClicked={this.onLetterClicked}
                letterIndexesMapping={letterIndexesMapping}
                alphabetListClassNames={alphabetListClassNames}
                alphabetListStyle={alphabetListStyle}
                letterClassNames={letterClassNames}
                letterStyle={letterStyle}
                letterHighlightedClassNames={letterHighlightedClassNames}
                letterHighlightedStyle={letterHighlightedStyle}
            />
        );
    }

    render(): Node {
        const { wrapperClassNames, wrapperStyle } = this.props;

        return (
            <div
                className={classNames(wrapperClassNames)}
                style={wrapperStyle}
            >
                {this.renderReactList()}
                {this.renderAlphabetList()}
            </div>
        );
    }
}

export default AzScroller;
