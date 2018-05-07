import React from 'react';
import PropTypes from 'prop-types';

import SlideWrapper from '../slideWrapper';

require('./imageSlide.less');

const ImageSlide = ({ media }) => <img src={media.uri} />;

ImageSlide.propTypes = {
    media: PropTypes.object.isRequired
};

export default SlideWrapper(ImageSlide);
