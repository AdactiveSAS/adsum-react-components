// @flow

import * as React from 'react';
import type { Node } from 'react';

import Modal from 'react-responsive-modal';
import { qrcode } from 'qrcode.es';

import './adsumQrCode.css';

type PropsType = {|
    +isOpen: boolean,
    +onClose: () => null,
    +text: string,
    +qrCodeOptions: Object,
    +ModalProps?: Object,
    +qrCodeCSS?: CSSStyleDeclaration
|};

class AdsumQrCode extends React.Component<PropsType> {
    static defaultProps = {
        isOpen: false,
        onClose: () => null,
        text: '',
        qrCodeOptions: {},
        ModalProps: {},
    };

    state = {
        showModal: false,
    };

    componentDidUpdate(prevProps: PropsType) {
        if (!prevProps.isOpen && this.props.isOpen) {
            const element = document.getElementById('qrCode');
            this.qrCode = new qrcode(element);

            this.qrCode.generate(this.props.text, this.props.qrCodeOptions).then(() => {
                this.setState({
                    showModal: true,
                });
            });
        } else if (prevProps.isOpen && !this.props.isOpen) {
            this.qrCode = null;
            this.setState({
                showModal: false,
            });
        }
    }

    qrCode = null;

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
