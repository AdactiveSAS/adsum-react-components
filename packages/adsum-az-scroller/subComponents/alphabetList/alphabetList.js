// @flow

import * as React from 'react';
import type { Node } from 'react';

import './alphabetList.css';

type PropsType = {|
    onLetterClicked: (index: number) => () => void,
    letterIndexesMapping: { [string]: number },
    alphabetListClassNames?: string,
    letterClassNames?: string
|};

/**
 * @class
 * @extends React.Component
 */
const AlphabeticList = (props: PropsType): Node => {
    const { alphabetListClassNames, letterClassNames, letterIndexesMapping, onLetterClicked } = props;
    let wrapperClassNames = 'alphabetList';

    if (alphabetListClassNames) {
        wrapperClassNames = `${wrapperClassNames} ${alphabetListClassNames}`;
    }

    return (
        <ul className={wrapperClassNames}>
            {
                Object.keys(letterIndexesMapping).map((letter: string): Node => (
                    <li
                        key={letter}
                        onClick={onLetterClicked(letterIndexesMapping[letter])}
                        className={letterClassNames}
                    >
                        {letter}
                    </li>
                ))
            }
        </ul>
    );
};

AlphabeticList.defaultProps = {
    alphabetListClassNames: '',
    letterClassNames: ''
};

export default AlphabeticList;
