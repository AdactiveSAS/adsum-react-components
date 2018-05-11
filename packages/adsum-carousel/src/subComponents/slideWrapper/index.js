import React from 'react';

import './slideWrapper.css';

export default Slide => (
    props => (
        <div className="slideWrapperItem">
            <div className="center">
                <Slide {...props} />
            </div>
        </div>
    )
);
