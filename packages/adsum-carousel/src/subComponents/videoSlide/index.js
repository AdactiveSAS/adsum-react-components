// @flow

import * as React from 'react';
import type { Node } from 'react';

import VideoPlayer from '../videoPlayer';
import SlideWrapper from '../slideWrapper';

import './videoSlide.css';

import { MediaType } from '../../AdsumCarousel';

type PropsType = {|
    index: number,
    media: MediaType,
    onPlayerInit: () => void,
    onVideoEnded: () => void,
    shouldReplayVideo: boolean
|};

const VideoSlide = ({
    index,
    media,
    onPlayerInit,
    onVideoEnded,
    shouldReplayVideo,
}: PropsType): Node => {
    const videoOptions = {
        sources: [{
            src: media.file.uri,
            type: media.file.file_type,
        }],
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

export { VideoSlide as VideoSlideType };
export default SlideWrapper(VideoSlide);
