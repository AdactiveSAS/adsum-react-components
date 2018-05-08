
        <AzScroller
            maxHeight={50}
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
                        { text: 'WILLIAM' },
                        { text: 'WINOC' }
                    ]
                }
            ]}
            shouldShowSectionHeaders={false}
            renderListItem={(listItem: ListItem, key: string) => (
                <div key={key}>
                    {JSON.stringify(listItem)}
                </div>
            )}
            renderListSectionHeader={(headerInfo: SectionHeaderInfo, key: string) => (
                <li key={key}>
                    {`Section header of letter ${key}`}
                </li>
            )}
        />
