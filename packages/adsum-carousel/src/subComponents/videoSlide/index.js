import React from 'react';
import PropTypes from 'prop-types';

import VideoPlayer from '../videoPlayer';
import SlideWrapper from '../slideWrapper';

import './videoSlide.css';

const VideoSlide = ({ index, media, onPlayerInit, onVideoEnded, shouldReplayVideo }) => {
    const videoOptions = {
        sources: [{
            src: media.uri,
            type: media.type
        }]
    };

    return (
        <VideoPlayer
            className="screenVideo"
            id={index}
            onPlayerInit={onPlayerInit}
            onVideoEnded={onVideoEnded}
            shouldReplayVideo={shouldReplayVideo}
            {...videoOptions}
        />
    );
};

VideoSlide.propTypes = {
    media: PropTypes.object.isRequired,
    index: PropTypes.number.isRequired,
    onPlayerInit: PropTypes.func.isRequired,
    onVideoEnded: PropTypes.func.isRequired,
    shouldReplayVideo: PropTypes.bool.isRequired
};

export default SlideWrapper(VideoSlide);