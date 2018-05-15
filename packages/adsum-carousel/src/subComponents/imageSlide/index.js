// @flow

import * as React from 'react';

import SlideWrapper from '../slideWrapper';

import './imageSlide.css';

import { MediaType } from '../../AdsumCarousel';

type PropsType = {|
    media: MediaType
|};

const ImageSlide = ({ media }: PropsType): HTMLImageElement => <img src={media.file.uri} alt="" />;

export { ImageSlide as ImageSlideType };
export default SlideWrapper(ImageSlide);
