// @flow

import * as React from 'react';
import classNames from 'classnames';

type PropsType = {|
    letterToHighlight: ?string,
    onLetterClicked: (index: number) => () => any,
    letterIndexesMapping: { [string]: number },
    alphabetListClassNames?: Array<string>,
    alphabetListStyle?: ?CSSStyleDeclaration,
    letterClassNames?: Array<string>,
    letterStyle?: ?CSSStyleDeclaration,
    letterHighlightedClassNames?: Array<string>,
    letterHighlightedStyle?: ?CSSStyleDeclaration,
|};

/**
 * @class
 * @extends React.Component
 */

class AlphabeticList extends React.Component<PropsType> {
    static defaultProps = {
        alphabetListClassNames: [],
        letterClassNames: [],
        letterHighlightedClassNames: [],
        alphabetListStyle: null,
        letterStyle: null,
        letterHighlightedStyle: null,
    };

    getLetterStyle(letter: string): CSSStyleDeclaration {
        const {
            letterToHighlight, letterStyle, letterHighlightedStyle
        } = this.props;

        if (letterToHighlight === letter) {
            return Object.assign({}, letterStyle, letterHighlightedStyle);
        }

        return letterStyle;
    }

    renderLetter = (letter: string): React.Element<'div'> => {
        const {
            onLetterClicked, letterToHighlight, letterIndexesMapping,
            letterClassNames, letterHighlightedClassNames
        } = this.props;

        const classnames = classNames(
            letterClassNames,
            letterHighlightedClassNames.filter(
                () => letterToHighlight === letter
            ),
        );

        return (
            <div
                key={letter}
                className={classnames}
                style={this.getLetterStyle(letter)}
                onClick={() => onLetterClicked(letterIndexesMapping[letter])}
                role="button"
                onKeyDown={() => {}}
                tabIndex={0}
            >
                {letter}
            </div>
        );
    };

    render(): React.Element<'div'> {
        const {
            letterIndexesMapping, alphabetListClassNames, alphabetListStyle
        } = this.props;

        return (
            <div
                className={classNames(alphabetListClassNames)}
                style={alphabetListStyle}
            >
                { Object.keys(letterIndexesMapping).map(this.renderLetter) }
            </div>
        );
    }
}

export default AlphabeticList;
