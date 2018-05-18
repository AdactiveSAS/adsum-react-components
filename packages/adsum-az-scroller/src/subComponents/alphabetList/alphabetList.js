// @flow

import * as React from 'react';
import type { Node } from 'react';

import './alphabetList.css';

type PropsType = {|
    onLetterClicked: (index: number) => () => void,
    letterIndexesMapping: { [string]: number },
    letterToHighlight: string,
    alphabetListClassNames?: string,
    letterClassNames?: string
|};

type StateType = {|
    letterToHighlight: ?string
|};

/**
 * @class
 * @extends React.Component
 */
class AlphabeticList extends React.Component<PropsType, StateType> {
    static defaultProps = {
        alphabetListClassNames: '',
        letterClassNames: ''
    };

    state: StateType = {
        letterToHighlight: null
    };

    setCurrentLetter(letterToHighlight: string): void {
        this.setState({ letterToHighlight });
    }

    render(): Node {
        const {
            alphabetListClassNames, letterClassNames, letterIndexesMapping, onLetterClicked
        } = this.props;

        const { letterToHighlight } = this.state;
        let mixedAlphabetListClassNames = 'alphabetList';
        let mixedLetterClassNames = 'letter';

        if (alphabetListClassNames) {
            mixedAlphabetListClassNames = `${mixedAlphabetListClassNames} ${alphabetListClassNames}`;
        }
        if (letterClassNames) {
            mixedLetterClassNames = `${mixedLetterClassNames} ${letterClassNames}`;
        }

        return (
            <ul className={mixedAlphabetListClassNames}>
                {
                    Object.keys(letterIndexesMapping).map((letter: string): Node => (
                        <li
                            key={letter}
                            onClick={onLetterClicked(letterIndexesMapping[letter])}
                            className={letterToHighlight === letter ? `${mixedLetterClassNames} highlight` : mixedLetterClassNames}
                        >
                            {letter}
                        </li>
                    ))
                }
            </ul>
        );
    }
}

export default AlphabeticList;
