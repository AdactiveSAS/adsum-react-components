// @flow

import * as React from 'react';

import { Player } from 'video-react';

import './videoPlayer.css';

type PropsType = {|
    id: string | number,
    sources: Array<{
        src: string,
        type: string
    }>,
    onPlayerInit: (player: Player, selector: string | number) => void,
    onVideoEnded: () => void,
    shouldReplayVideo: boolean
|};
type VideoPlayerStateType = {|
    ended: boolean
|};

class VideoPlayer extends React.Component<PropsType> {
    constructor(props: PropsType) {
        super(props);

        this._selector = props.id;
        this._player = null;

        this.handleStateChange = this.handleStateChange.bind(this);
    }

    /**
     * Initialize Video Player
     */
    componentDidMount() {
        this.initPlayer();
    }

    /**
     * Loading the proper player for the different video formats
     */
    initPlayer() {
        const { onPlayerInit } = this.props;

        onPlayerInit(this._player, this._selector);

        this._player.subscribeToStateChange(this.handleStateChange);
        this._player.load();
    }

    handleStateChange(state: VideoPlayerStateType) {
        const { ended } = state;
        const { onVideoEnded, shouldReplayVideo } = this.props;

        if (!ended) return;
        if (shouldReplayVideo) {
            this._player.play();

            return;
        }

        this._player.pause();

        onVideoEnded();
    }

    /**
     * React render method
     */
    render() {
        const { sources } = this.props;

        return (
            <Player
                id={this._selector}
                ref={(player: Player) => {
                    this._player = player;
                }}
                fluid={false}
            >
                <source src={sources[0].src} />
            </Player>
        );
    }
}

export default VideoPlayer;
