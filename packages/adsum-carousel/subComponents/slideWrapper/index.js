import React from 'react';

require('./slideWrapper.less');

export default Slide => (
    props => (
        <div className="slideWrapperItem">
            <div className="center">
                <Slide {...props} />
            </div>
        </div>
    )
);
