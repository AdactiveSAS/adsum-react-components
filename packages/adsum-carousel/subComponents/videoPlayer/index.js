import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Player } from 'video-react';

require('./videoPlayer.less');

class VideoPlayer extends Component {
    constructor(props) {
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

    handleStateChange(state) {
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
                ref={(player) => {
                    this._player = player;
                }}
            >
                <source src={sources[0].src} />
            </Player>
        );
    }
}

VideoPlayer.propTypes = {
    id: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
    ]).isRequired,
    sources: PropTypes.arrayOf(PropTypes.shape({
        src: PropTypes.string.isRequired,
        type: PropTypes.string.isRequired
    })).isRequired,
    onPlayerInit: PropTypes.func.isRequired,
    onVideoEnded: PropTypes.func.isRequired,
    shouldReplayVideo: PropTypes.bool.isRequired
};

VideoPlayer.defaultProps = {

};

export default VideoPlayer;