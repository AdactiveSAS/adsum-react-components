// @flow

import * as React from 'react';
import type { Node } from 'react';

import './slideWrapper.css';

import type { ImageSlideType } from '../imageSlide';
import type { VideoSlideType } from '../videoSlide';

export type SlideType = ImageSlideType | VideoSlideType;

type PropsType = {
    parentStyle: {
        width?: number,
        height?: number
    }
};

const SlideWrapper = (Slide: SlideType): Node => (
    (props: PropsType): Node => {
        const { parentStyle } = props;
        let styleObject = null;

        if (parentStyle) {
            const { width, height } = parentStyle;

            styleObject = (width && height) ? { width, height } : null;
        }
        return (
            <div className="slideWrapperItem">
                <div
                    className="center"
                    style={styleObject}
                >
                    <Slide {...props} />
                </div>
            </div>
        );
    }
);

SlideWrapper.defaultProps = {
    parentStyle: {},
};

export default SlideWrapper;
