import React from 'react';
import { shallow, render, mount } from 'enzyme';
import sinon from 'sinon';

import AzScroller from './AzScroller';

// List Example
const listExample = [
    {
        header: {
            type: 'SectionHeader',
            letter: 'A',
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
        ],
    },
    {
        header: {
            type: 'SectionHeader',
            letter: 'B',
        },
        items: [
            { text: 'BAPTISTE' },
            { text: 'BARBARA' },
            { text: 'BARNABÉ' },
            { text: 'BARTHÉLÉMY' },
            { text: 'BASILE' },
        ],
    },
    {
        header: {
            type: 'SectionHeader',
            letter: 'C',
        },
        items: [
            { text: 'CERISE' },
            { text: 'CÉSAIRE' },
            { text: 'CHARLES' },
            { text: 'CHARLOT' },
            { text: 'CHRISTIAN' },
        ],
    },
    {
        header: {
            type: 'SectionHeader',
            letter: 'E',
        },
        items: [
            { text: 'ESTELLE' },
            { text: 'ETHAN' },
            { text: 'ÉTIENNE' },
            { text: 'EUGÈNE' },
        ],
    },
    {
        header: {
            type: 'SectionHeader',
            letter: 'M',
        },
        items: [
            { text: 'MICHÈLE' },
            { text: 'MOROINE' },
            { text: 'MURIELLE' },
            { text: 'MYLÈNE' },
        ],
    },
    {
        header: {
            type: 'SectionHeader',
            letter: 'S',
        },
        items: [
            { text: 'SEBASTIAN' },
            { text: 'SEREN' },
            { text: 'STANLEY' },
            { text: 'STÉPHANE' },
            { text: 'SYBILLE' },
            { text: 'SYLVAIN' },
        ],
    },
    {
        header: {
            type: 'SectionHeader',
            letter: 'W',
        },
        items: [
            { text: 'WANDY' },
            { text: 'WAN' },
            { text: 'WREN' },
            { text: 'WILGELM' },
            { text: 'WADE' },
            { text: 'WILLIAM' },
            { text: 'WINOC' },
        ],
    },
];

// Optional props
const optionalProps = {
    renderSectionItem: (item, key) => (
        <div
            key={key}
            style={{
                boxSizing: 'border-box',
                height: '60px',
                padding: '7px 5px',
            }}
        >
            {item.text}
        </div>
    ),
    renderSectionHeader: (header, key) => (
        <div
            key={key}
            style={{
                boxSizing: 'border-box',
                height: '100px',
                padding: '30px 10px',
                backgroundColor: 'red',
            }}
        >
            {header.letter}
        </div>
    ),
    shouldShowSectionHeaders: true,
    sectionItemHeight: 60,
    sectionHeaderHeight: 100,
    // wrapperClassNames: [], ---------------------------------------------- TODO: test classNames
    wrapperStyle: {
        boxSizing: 'border-box',
        width: '200px',
        height: '900px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
    },
    // listClassNames: [], ------------------------------------------------- TODO: test classNames
    listStyle: {
        overflow: 'auto',
        maxHeight: '60%',
    },
    // alphabetListClassNames: [], ----------------------------------------- TODO: test classNames
    alphabetListStyle: {
        boxSizing: 'border-box',
        width: '100%',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '20px 10px',
    },
    // letterClassNames: [], ----------------------------------------------- TODO: test classNames
    letterStyle: {
        outline: 'none',
    },
    // letterHighlightedClassNames: [], ------------------------------------ TODO: test classNames
    letterHighlightedStyle: {
        color: 'blue',
    },
};

// Test Suite Template
const testSuiteTemplate = (props) => {
    it('is shallow rendering according to snapshot', () => {
        const wrapper = shallow(
            <AzScroller {...props} />,
        );

        expect(wrapper).toMatchSnapshot();
    });

    it('is rendering according to snapshot', () => {
        const wrapper = render(
            <AzScroller {...props} />,
        );

        expect(wrapper).toMatchSnapshot();
    });

    it('calls componentDidMount and only once', () => {
        // Mocking unsupported JSDOM method window.scrollTo
        window.scrollTo = jest.fn().mockImplementation(() => {});

        // Isolating the spy in a sandbox
        const sandbox = sinon.createSandbox();

        // Creating the spy for componentDiDMount method
        sandbox.spy(AzScroller.prototype, 'componentDidMount');

        // Mounting component into the DOM tree
        mount(
            <AzScroller {...props} />,
        );

        // Check that componentDidMount was called and only once
        expect(AzScroller.prototype.componentDidMount).toHaveProperty('callCount', 1);

        // Cleaning the sandbox
        sandbox.restore();
    });
};
const runTestSuiteWithProps = props => () => testSuiteTemplate(props);

// with empty list and no optional props
describe('AzScroller with empty list', runTestSuiteWithProps(
    {
        list: [],
    }
));

// with example list and no optional props
describe('AzScroller with example list', runTestSuiteWithProps(
    {
        list: listExample,
    }
));

// with example list and all optional props TODO: test classNames in props
describe('AzScroller with all optional props except classNames', runTestSuiteWithProps(
    {
        list: listExample,
        ...optionalProps,
    }
));
