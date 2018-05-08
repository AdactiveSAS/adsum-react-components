import React, { Component } from 'react';
import PropTypes from 'prop-types';
import translate from './adsumClock.lang.json';
import './adsumClock.css';

class AdsumClock extends Component {
    constructor(props) {
        super(props);

        this.state = {
            date: '',
            time: ''
        };

        this.getTime = this.getTime.bind(this);
    }

    /**
     * Clock calls for update every sec
     */
    componentDidMount() {
        this.timerID = setInterval(
            () => this.getTime(),
            1000
        );
    }

    /**
     * Removing interval
     */
    componentWillUnmount() {
        clearInterval(this.timerID);
    }

    getTime() {
        const { timeFormat } = this.props;
        let { lang } = this.props;

        if(Object.keys(translate).indexOf(lang) === -1) {
            console.warn(`AdsumClock does not support language: ${lang}, goes to default ${this.defaultProps.lang}`);
            lang = this.defaultProps.lang;
        }

        const time = new Date();
        const day = translate[lang].days[time.getDay()];

        const date = (time.getDate().toString().length === 1) ? `0${time.getDate()}${translate[lang].date}` : `${time.getDate()}${translate[lang].date}`;
        const month = (lang === 'zh') ? `${time.getMonth() + 1}${translate[lang].month}` : translate[lang].month[time.getMonth()];
        const year = `${time.getFullYear()}${translate[lang].year}`;

        let hours = '';
        let minutes = '';
        let timeStr = '';

        if (timeFormat === '12hrs') {
            if (time.getHours() === 12) {
                hours = `${time.getHours()}`;
                minutes = (time.getMinutes().toString().length === 1) ? `0${time.getMinutes()}` : `${time.getMinutes()}`;
                timeStr = `${hours}:${minutes} ${translate[lang].pm}`;
            } else if (time.getHours() > 12) {
                hours = `${time.getHours() - 12}`;
                minutes = (time.getMinutes().toString().length === 1) ? `0${time.getMinutes()}` : `${time.getMinutes()}`;
                timeStr = `${hours}:${minutes} ${translate[lang].pm}`;
            } else {
                hours = `${time.getHours()}`;
                minutes = (time.getMinutes().toString().length === 1) ? `0${time.getMinutes()}` : `${time.getMinutes()}`;
                timeStr = `${hours}:${minutes} ${translate[lang].am}`;
            }
        } else {
            hours = (time.getHours().toString().length === 1) ? `0${time.getHours()}` : `${time.getHours()}`;
            minutes = (time.getMinutes().toString().length === 1) ? `0${time.getMinutes()}` : `${time.getMinutes()}`;
            timeStr = `${hours}:${minutes}`;
        }

        if (lang === 'zh') {
            this.setState({
                date: `${day}, ${year} ${month} ${date}`,
                time: timeStr
            });
        } else {
            this.setState({
                date: `${day}, ${date} ${month} ${year}`,
                time: timeStr
            });
        }
    }

    render() {
        return (
            <div role="presentation" className="adsum-clock-wrapper" style={this.props.style ? this.props.style : null}>
                <div className="adsum-clock">
                    <div className="day-date">{this.state.date}</div>
                    <div className="time">{this.state.time}</div>
                </div>
            </div>
        );
    }
}

AdsumClock.propTypes = {
    lang: PropTypes.string.isRequired,
    timeFormat: PropTypes.string.isRequired,
    style: PropTypes.objectOf(PropTypes.string)
};

AdsumClock.defaultProps = {
    lang: 'en',
    timeFormat: '24hrs',
    style: null
};

export default AdsumClock;
