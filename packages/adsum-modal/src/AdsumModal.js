import React, { Component } from 'react';
import PropTypes from 'prop-types';

import './AdsumModal.css';

const AdsumModal = ({ isOpen, onCloseClicked, effect, children }) => (
    <div className={`adsumModal ${isOpen ? 'open' : ''}`}>
        <div className="adsumModal-overlay" onClickCapture={onCloseClicked}/>
        <div className={`adsumModal-wrapper ${effect} show`}>
            {children}
        </div>
    </div>
);

AdsumModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onCloseClicked: PropTypes.func.isRequired,
    effect: PropTypes.string
};

AdsumModal.defaultProps = {
    effect: 'fadeIn'
}

export default AdsumModal;