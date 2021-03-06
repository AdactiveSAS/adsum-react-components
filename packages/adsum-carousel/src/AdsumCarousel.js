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
    isOpen?: boolean,
    medias?: Array<MediaType>,
    onMediaTouch?: (MediaType) => void,
    carouselOptions?: Object,
    dynamicAutoPlayInterval?: boolean,
    style?: CSSStyleDeclaration,
    ButtonModalForImage?: ?HTMLButtonElement,
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
            wrapAround: true,
        },
        dynamicAutoPlayInterval: false,
        style: {},
        ButtonModalForImage: null,
    };

    constructor(props: PropsType) {
        super(props);

        this._videoPlayers = {};

        this.onPlayerInit = this.onPlayerInit.bind(this);
        this.slideDidChange = this.slideDidChange.bind(this);
        this.goToNextSlide = this.goToNextSlide.bind(this);
        this.playVideo = this.playVideo.bind(this);
        this.slideBeforeChange = this.slideBeforeChange.bind(this);

        this.state = {
            autoplay: !!(props.medias && props.medias.length > 1),
            autoPlayInterval: 10000,
        };
    }

    componentDidMount() {
        const {
            dynamicAutoPlayInterval, medias, carouselOptions, autoplayInterval,
        } = this.props;

        const { autoplay, autoPlayInterval } = this.state;

        if (this._videoPlayers[0]) {
            this.playVideo(0);
        } else if (dynamicAutoPlayInterval) {
            this.setState({
                autoplay,
                autoPlayInterval: medias.length > 0 && medias[0].autoPlayInterval ? medias[0].autoPlayInterval : autoPlayInterval,
            });
        } else if (autoplayInterval) {
            this.setState({
                autoplay,
                autoPlayInterval: carouselOptions && carouselOptions.autoPlayInterval ? carouselOptions.autoPlayInterval : autoPlayInterval,
            });
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
        const { autoPlayInterval } = this.state;

        this.setState(
            {
                autoplay: false,
                autoPlayInterval,
            },
            () => {
                this._videoPlayers[id].play();
            },
        );
    }


    /**
     * Wrapper for nuka-carousel to select next slide
     */
    goToNextSlide() {
        const { autoPlayInterval } = this.state;

        this.setState(
            {
                autoplay: true,
                autoPlayInterval,
            },
            () => {
                this.carousel.nextSlide();
            },
        );
    }

    /**
     * To play video immediately if the media is a video on slide change
     * @param id
     */
    slideDidChange(id: number | string) {
        const { isOpen } = this.props;

        if (!isOpen) return;

        if (this._videoPlayers[id]) {
            this.playVideo(id);
        }
    }

    slideBeforeChange(id: number | string) {
        const { dynamicAutoPlayInterval, medias } = this.props;
        const { autoplay, autoPlayInterval } = this.state;

        if (dynamicAutoPlayInterval && medias.length) {
            if (id + 1 === medias.length) {
                this.setState({
                    autoplay,
                    autoPlayInterval: medias[0].autoPlayInterval ? medias[0].autoPlayInterval : autoPlayInterval,
                });
            } else {
                this.setState({
                    autoplay,
                    autoPlayInterval: medias[id + 1].autoPlayInterval ? medias[id + 1].autoPlayInterval : autoPlayInterval,
                });
            }
        }
    }

    /**
     * Create carousel slides content images or videos
     *
     */
    generateSlides(): Array<Node> {
        const {
            medias, onMediaTouch, ButtonModalForImage, style,
        } = this.props;

        const parentStyle = style || null;
        const ret = [];

        medias.forEach((media: MediaType, index: number) => {
            if (media.file.file_type === 'video/mp4' || media.file.file_type === 'video/x-m4v') {
                const component = (
                    <div
                        role="complementary"
                        key={media.file.uri}
                        onClick={() => {
                            onMediaTouch(media);
                        }}
                        onTouchEndCapture={() => {
                            onMediaTouch(media);
                        }}
                    >
                        <VideoSlide
                            index={index}
                            media={media}
                            onPlayerInit={this.onPlayerInit}
                            onVideoEnded={this.goToNextSlide}
                            shouldReplayVideo={medias.length === 1 && (medias[0].file.file_type === 'video/mp4' || medias[0].file.file_type === 'video/x-m4v')}
                            parentStyle={parentStyle}
                        />
                    </div>
                );

                ret.push(component);
            } else {
                const component = (
                    <div
                        role="complementary"
                        key={media.file.uri}
                        onClick={() => {
                            onMediaTouch(media);
                        }}
                        onTouchEndCapture={() => {
                            onMediaTouch(media);
                        }}
                    >
                        <ImageSlide media={media} parentStyle={parentStyle} />
                        {
                            ButtonModalForImage
                                ? <ButtonModalForImage media={media} />
                                : null
                        }
                    </div>
                );

                ret.push(component);
            }
        });

        return ret;
    }

    render(): Node {
        const {
            isOpen, carouselOptions, style,
        } = this.props;

        const { autoplay, autoPlayInterval } = this.state;

        if (!isOpen) return null;

        return (
            <div style={style}>
                <Carousel
                    {...carouselOptions}
                    autoplay={autoplay}
                    afterSlide={this.slideDidChange}
                    beforeSlide={this.slideBeforeChange}
                    autoplayInterval={autoPlayInterval}
                    className="adsumCarousel"
                    ref={(carousel: Carousel) => {
                        this.carousel = carousel;
                    }}
                >
                    {this.generateSlides()}
                </Carousel>
            </div>
        );
    }
}

export default AdsumCarousel;
