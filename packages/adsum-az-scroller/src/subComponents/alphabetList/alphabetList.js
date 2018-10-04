// @flow

import type { Node } from 'react';
import * as React from 'react';

import './alphabetList.css';

type PropsType = {|
    onLetterClicked: (index: number) => () => void,
    letterIndexesMapping: { [string]: number },
    letterToHighlight: ?string,
    alphabetListClassNames?: string,
    letterClassNames?: string
|};

function AlphabeticList(props: PropsType): Node {
    const {
        alphabetListClassNames, letterClassNames, letterIndexesMapping, onLetterClicked, letterToHighlight
    } = props;

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
                Object.keys(letterIndexesMapping)
                    .map((letter: string): Node => (
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


AlphabeticList.defaultProps = {
    alphabetListClassNames: '',
    letterClassNames: '',
};

export default AlphabeticList;
