// @flow

import * as React from 'react';
import type { ComponentType } from 'react';

import translate from './adsumClock.lang.json';

type LangType = 'en' | 'zh' | 'fr';
type TimeFormatType = '24hrs' | '12hrs';
type AdsumClockPropsType = {
    lang: LangType,
    timeFormat: TimeFormatType
};
type StateType = {
    +year: string,
    +month: string,
    +day: string,
    +hours: string,
    +minutes: string,
    +dateStr: string,
    +timeStr: string
};
type ClockUIPropsType = AdsumClockPropsType & StateType;

function ClockCreator<T: ComponentType<ClockUIPropsType>>(ClockUI: T): Element<typeof AdsumClock> {
    return class AdsumClock extends React.Component<AdsumClockPropsType, StateType> {
        static defaultProps = {
            lang: 'en',
            timeFormat: '24hrs',
        };

        timerID: IntervalId = null;

        state = {
            year: '',
            month: '',
            day: '',
            hours: '',
            minutes: '',
            dateStr: '',
            timeStr: '',
        };

        /**
         * Clock calls for update every sec
         */
        componentDidMount() {
            this.timerID = setInterval(
                (): void => this.getTime(),
                1000,
            );
        }

        /**
         * Removing interval
         */
        componentWillUnmount() {
            clearInterval(this.timerID);
        }

        getTime = () => {
            const { timeFormat } = this.props;
            let { lang } = this.props;

            if (Object.keys(translate)
                .indexOf(lang) === -1) {
                console.warn(`AdsumClock does not support language: ${lang}, goes to default ${AdsumClock.defaultProps.lang}`);
                // eslint-disable-next-line prefer-destructuring
                lang = AdsumClock.defaultProps.lang;
            }

            const time = new Date();
            const day = translate[lang].days[time.getDay()];

            const dateStr = (time.getDate()
                .toString().length === 1) ? `0${time.getDate()}${translate[lang].date}` : `${time.getDate()}${translate[lang].date}`;
            const month = (lang === 'zh') ? `${time.getMonth() + 1}${translate[lang].month}` : translate[lang].month[time.getMonth()];
            const year = `${time.getFullYear()}${translate[lang].year}`;

            let hours = '';
            let minutes = '';
            let timeStr = '';

            if (timeFormat === '12hrs') {
                if (time.getHours() === 12) {
                    hours = `${time.getHours()}`;
                    minutes = (time.getMinutes()
                        .toString().length === 1) ? `0${time.getMinutes()}` : `${time.getMinutes()}`;
                    timeStr = `${hours}:${minutes} ${translate[lang].pm}`;
                } else if (time.getHours() > 12) {
                    hours = `${time.getHours() - 12}`;
                    minutes = (time.getMinutes()
                        .toString().length === 1) ? `0${time.getMinutes()}` : `${time.getMinutes()}`;
                    timeStr = `${hours}:${minutes} ${translate[lang].pm}`;
                } else {
                    hours = `${time.getHours()}`;
                    minutes = (time.getMinutes()
                        .toString().length === 1) ? `0${time.getMinutes()}` : `${time.getMinutes()}`;
                    timeStr = `${hours}:${minutes} ${translate[lang].am}`;
                }
            } else {
                hours = (time.getHours()
                    .toString().length === 1) ? `0${time.getHours()}` : `${time.getHours()}`;
                minutes = (time.getMinutes()
                    .toString().length === 1) ? `0${time.getMinutes()}` : `${time.getMinutes()}`;
                timeStr = `${hours}:${minutes}`;
            }

            const newState = {
                year,
                month,
                day,
                hours,
                minutes,
                timeStr,
            };

            if (lang === 'zh') {
                newState.dateStr = `${day}, ${year} ${month} ${dateStr}`;
            } else {
                newState.dateStr = `${day}, ${dateStr} ${month} ${year}`;
            }

            this.setState(newState);
        };

        render(): T {
            return <ClockUI {...this.props} {...this.state} />;
        }
    };
}

export default ClockCreator;
