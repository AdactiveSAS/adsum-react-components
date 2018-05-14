import React from 'react';
import PropTypes from 'prop-types';

import SlideWrapper from '../slideWrapper';

import './imageSlide.css';

const ImageSlide = ({ media }) => <img src={media.file.uri} />;

ImageSlide.propTypes = {
    media: PropTypes.object.isRequired
};

export default SlideWrapper(ImageSlide);
