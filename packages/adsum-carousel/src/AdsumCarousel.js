// @flow

import * as React from 'react';
import type { Node } from 'react';
import Carousel from 'nuka-carousel';

import ImageSlide from './subComponents/imageSlide';
import VideoSlide from './subComponents/videoSlide';

import './adsumCarousel.css';

export type MediaType = {|
    file: {|
        uri: string,
        file_type: string
    |}
|};

type PropsType = {|
    +isOpen: boolean,
    +medias: Array<MediaType>,
    +onMediaTouch: (MediaType) => void,
    +carouselOptions?: Object,
    +style?: CSSStyleDeclaration
|};

class AdsumCarousel extends React.Component<PropsType> {
    static defaultProps = {
        isOpen: false,
        medias: [],
        onMediaTouch: null,
        carouselOptions: {
            dragging: false,
            swiping: false,
            autoplayInterval: 10000,
            speed: 1000,
            renderCenterLeftControls: null,
            renderCenterRightControls: null,
            renderCenterBottomControls: null,
            renderBottomCenterControls: null,
            arrows: false,
            pauseOnHover: false,
            slidesToShow: 1,
            slidesToScroll: 1,
            adaptiveHeight: true,
            wrapAround: true
        }
    };

    constructor(props: PropsType) {
        super(props);

        this._videoPlayers = {};

        this.onPlayerInit = this.onPlayerInit.bind(this);
        this.slideDidChange = this.slideDidChange.bind(this);
        this.goToNextSlide = this.goToNextSlide.bind(this);
        this.playVideo = this.playVideo.bind(this);

        this.state = { autoplay: props.medias && props.medias.length > 1 ? true : false };
    }

    componentDidMount() {
        if (this._videoPlayers[0]) {
            this.playVideo(0);
        }
    }

    /**
     * Bind video players if need it
     *
     */
    onPlayerInit(videoPlayer: Player, id: number) {
        this._videoPlayers[id] = videoPlayer;
    }

    /**
     * To play the video in the slide
     * @param id
     */
    playVideo(id: number) {
        this.setState(
            { autoplay: false },
            () => { this._videoPlayers[id].play(); }
        );
    }


    /**
     * Wrapper for nuka-carousel to select next slide
     */
    goToNextSlide() {
        this.setState(
            { autoplay: true },
            () => { this.carousel.nextSlide(); }
        );
    }

    /**
     * To play video immediately if the media is a video on slide change
     * @param id
     */
    slideDidChange(id: number | string) {
        if (!this.props.isOpen) return;
        if (this._videoPlayers[id]) {
            this.playVideo(id);
        }
    }

    /**
     * Create carousel slides content images or videos
     *
     */
    generateSlides(): Array<Node> {
        const { medias, onMediaTouch } = this.props;
        const parentStyle = this.props.style || null;
        const ret = [];

        medias.forEach((media: MediaType, index: number) => {
            if (media.file.file_type === 'video/mp4') {
                const component = (
                    <div key={media.file.uri} onClick={() => { onMediaTouch(media); }} onTouchEndCapture={() => { onMediaTouch(media); }} >
                        <VideoSlide
                            index={index}
                            media={media}
                            onPlayerInit={this.onPlayerInit}
                            onVideoEnded={this.goToNextSlide}
                            shouldReplayVideo={medias.length === 1 && medias[0].file.file_type === 'video/mp4'}
                            parentStyle={parentStyle}
                        />
                    </div>
                );

                ret.push(component);
            } else {
                const component = (
                    <div key={media.file.uri} onClick={() => { onMediaTouch(media); }} onTouchEndCapture={() => { onMediaTouch(media); }} >
                        <ImageSlide media={media} parentStyle={parentStyle} />
                    </div>
                );

                ret.push(component);
            }
        });

        return ret;
    }

    render(): Node {
        const {
            isOpen, carouselOptions
        } = this.props;

        if (!isOpen) return null;

        return (
            <div style={style} >
                <Carousel
                    {...carouselOptions}
                    autoplay={this.state.autoplay}
                    afterSlide={this.slideDidChange}
                    className="adsumCarousel"
                    ref={(carousel: Carousel) => {
                        this.carousel = carousel;
                    }}
                >
                    { this.generateSlides() }
                </Carousel>
            </div>
        );
    }
}

export default AdsumCarousel;
