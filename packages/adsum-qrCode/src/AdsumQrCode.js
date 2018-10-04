// @flow

import * as React from 'react';
import type { Node } from 'react';

import Modal from 'react-responsive-modal';
import { qrcode } from 'qrcode.es'; // eslint-disable-line import/no-unresolved

import './adsumQrCode.css';

type PropsType = {|
    isOpen: boolean,
    onClose?: () => null,
    text?: string,
    qrCodeOptions?: Object,
    ModalProps?: Object,
    qrCodeCSS?: CSSStyleDeclaration
|};

class AdsumQrCode extends React.Component<PropsType> {
    static defaultProps = {
        onClose: () => null,
        text: '',
        qrCodeOptions: {},
        ModalProps: {},
        qrCodeCSS: {},
    };

    state = {
        showModal: false,
    };

    qrCode = null;

    componentDidUpdate(prevProps: PropsType) {
        const { isOpen, text, qrCodeOptions } = this.props;

        if (!prevProps.isOpen && isOpen) {
            const element = document.getElementById('qrCode');
            // eslint-disable-next-line new-cap
            this.qrCode = new qrcode(element);

            this.qrCode.generate(text, qrCodeOptions)
                .then(() => {
                    this.setState({
                        showModal: true,
                    });
                });
        } else if (prevProps.isOpen && !isOpen) {
            this.qrCode = null;
            // eslint-disable-next-line react/no-did-update-set-state
            this.setState({
                showModal: false,
            });
        }
    }

    render(): Node {
        const {
            isOpen, onClose, ModalProps, qrCodeCSS,
        } = this.props;

        const { showModal } = this.state;

        const hideModalCSS = {
            overlay: 'hide',
        };

        let { classNames, showCloseIcon } = ModalProps;
        if (!showModal) {
            classNames = hideModalCSS;
        }

        if (!showCloseIcon) {
            showCloseIcon = false;
        }

        return (
            <div className="qrCodeWrapper">
                <Modal
                    {...ModalProps}
                    open={isOpen}
                    onClose={onClose}
                    showCloseIcon={showCloseIcon}
                    classNames={classNames}
                >
                    <canvas id="qrCode" style={qrCodeCSS} />
                </Modal>
            </div>
        );
    }
}

export default AdsumQrCode;
