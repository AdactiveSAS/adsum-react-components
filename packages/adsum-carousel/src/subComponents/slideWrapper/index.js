import React from 'react';

import './slideWrapper.css';

export default Slide => (
    props => (
        <div className="slideWrapperItem">
            <div className="center" style={props.parentStyle? props.parentStyle.width && props.parentStyle.height ? {width: props.parentStyle.width, height: props.parentStyle.height} : null : null} >
                <Slide {...props} />
            </div>
        </div>
    )
);
