import { Vector3 } from 'three';
import { Tween, Easing } from 'es6-tween';

import { CancellationToken } from 'prex-es5';


import { DISPLAY_MODES, LabelImageObject } from '@adactive/adsum-web-map';

import ACA from '@adactive/adsum-utils/services/ClientAPI';

class LabelController {
    constructor() {
        this.awm = null;
        this.locked = false;
        this.currentFloor = null;
        this._PopOver = null;
        this.stack = null;

        this._labels = [];

        window.LabelController = this;
    }

    init(awm, PopOver) {
        this.awm = awm;
        this._PopOver = PopOver;
        return this;
    }

    hideLabelsInStack(stack) {
        this.stack = stack;
        for (let i = 0; i < this.stack.length - 1; i++) {
            const layer = this.stack[i];
            this.displayFloorLabels(layer.floor, false);
        }
        const lastLayer = this.stack[this.stack.length - 1];
        this.displayFloorLabels(lastLayer.floor, false);
    }

    displayFloorLabels(floor, visible) {
        for (const label of floor.labels) {
            this.unsetPermanentDisplay(label);
            label.setDisplayMode(visible ? DISPLAY_MODES.VISIBLE : DISPLAY_MODES.NONE);
        }
        for (const space of floor.spaces) {
            for (const label of space.labels) {
                this.unsetPermanentDisplay(label);
                label.setDisplayMode(visible ? DISPLAY_MODES.VISIBLE : DISPLAY_MODES.NONE);
            }
        }
    }

    unsetPermanentDisplay(label) {
        if (label.isPermanentDisplay) {
            label.isPermanentDisplay = false;
            this._labels.push(label);
        }
    }

    setPermanentDisplay(label) {
        if (!label.isPermanentDisplay) {
            label.isPermanentDisplay = true;
        }
    }

    displayLabelsOnPath(pathSections, visible) {
        for (const pathSection of pathSections) {
            const toAdsumObject = pathSection.to.adsumObject;
            const fromAdsumObject = pathSection.from.adsumObject;
            if (toAdsumObject && toAdsumObject.isLabel) {
                this.setPermanentDisplay(toAdsumObject);
                toAdsumObject.setDisplayMode(visible ? DISPLAY_MODES.VISIBLE : DISPLAY_MODES.NONE);
            }
            if (fromAdsumObject && fromAdsumObject.isLabel) {
                this.setPermanentDisplay(fromAdsumObject);
                fromAdsumObject.setDisplayMode(visible ? DISPLAY_MODES.VISIBLE : DISPLAY_MODES.NONE);
            }
        }
    }

    animateLabel(label, token = CancellationToken.none) {
        if (label !== null) {
            const initialScale = label._mesh.scale.clone();
            const resetScale = () => {
                label._mesh.geometry.computeBoundingBox();
                const { max, min } = label._mesh.geometry.boundingBox;
                const height = max.y - min.y;
                label._mesh.scale.copy(initialScale);
                label._mesh.position.z = initialScale.z * height / 2;
                label._mesh.updateMatrix();
            };
            const tweenMesh = (mesh, from, to, duration) => new Promise((resolve, reject) => {
                let tween = null;
                const registration = token.register(() => {
                    if (tween) {
                        tween.stop();
                    }
                    resetScale();
                    reject(new Error('Scale was stopped'));
                });
                tween = new Tween(from)
                    .to(to, duration)
                    .easing(Easing.Elastic.Out)
                    .on('update', (scaleHandler) => {
                        try {
                            token.throwIfCancellationRequested();

                            mesh.geometry.computeBoundingBox();
                            const { max, min } = mesh.geometry.boundingBox;
                            const height = max.y - min.y;
                            mesh.scale.copy(scaleHandler);
                            mesh.position.z = scaleHandler.z * height / 2;

                            mesh.updateMatrix();
                        } catch (e) {
                            if (e.message === 'Operation was canceled') {
                                reject(new Error('Scale was stopped'));
                            } else {
                                console.log(e);
                            }
                        }
                    })
                    .on('complete', () => {
                        registration.unregister();
                        resolve(true);
                    })
                    .on('stop', () => {
                    })
                    .start();
            });

            let promise = Promise.resolve();
            const scaleValue = 2.3;
            promise = promise.then(() => tweenMesh(
                label._mesh,
                initialScale.clone(),
                new Vector3(scaleValue, scaleValue, scaleValue),
                700
            ));

            // Add a delay
            let tokenTimeOut = null;
            promise = promise.then(() =>
                new Promise((resolve, reject) => {
                    const registration = token.register(() => {
                        if (tokenTimeOut) {
                            clearTimeout(tokenTimeOut);
                            resetScale();
                            reject(new Error('Scale was stopped'));
                        }
                    });
                    tokenTimeOut = setTimeout(
                        () => {
                            registration.unregister();
                            resolve(true);
                        },
                        500
                    );
                }));


            promise = promise.then(() => tweenMesh(
                label._mesh,
                new Vector3(scaleValue, scaleValue, scaleValue),
                initialScale,
                400
            ));

            return promise;
        }

        return Promise.resolve();
    }

    getAdsumObject3DFromPlace(place) { // Just want the label
        if (place.custom_objects.size > 0) {
            return this.awm.objectManager.getLabel(place.custom_objects.at(0).value);
        }

        return null;
    }

    createPopOverOnAdsumObject(object, text = '', direction = null, offset = { x: 0, y: 0, z: 0 }) {
        if (!object || !this._PopOver) {
            return Promise.resolve();
        }

        if ((object.isSite || object.isBuilding || object.isFloor || object.isSpace)) { // && object.labels.size === 0) {
            if (text === '') {
                const pois = ACA.getPoisFromPlace(object.placeId);
                for (const poi of pois) {
                    text += poi.name;
                }
            }

            if (text !== '') {
                return this.addPopOver(text, object, direction, offset);
            }
        }
        return Promise.resolve(null);
    }

    addPopOver(text, object, direction = null, offset = { x: 0, y: 0, z: 0 }) { // TODO
        const popOver = new this._PopOver(
            text,
            {
                size: 8,
                lineHeight: 1,
                font: 'Biko',
                backgroundPadding: 7,
                quality: 5,
                fontHeightOffset: 0.5,
                pinHeight: 5,
                directionIcon: direction
            }
        );

        return popOver.build().then(() => {
            const label = new LabelImageObject({
                image: popOver._canvas,
                width: popOver._canvas.width,
                height: popOver._canvas.height,
                offset
            });
            this.awm.objectManager.addLabel(label, object);

            label._mesh.geometry.translate(0, label.height / 2, 0);
            label.moveBy(0, 0, -label.height / 2);

            return Promise.resolve(label);
        });
    }

    removePopOver(label) {
        if (label) {
            this.awm.objectManager.removeLabel(label);
        }
    }

    resetPermanentDisplay() {
        for (const label of this._labels) {
            label.isPermanentDisplay = true;
        }
        this._labels = [];
    }

    reset() {
        if (this.stack && this.stack.length > 0) {
            for (let i = 0; i < this.stack.length - 1; i++) {
                const layer = this.stack[i];
                this.displayFloorLabels(layer.floor, false);
            }
            const lastLayer = this.stack[this.stack.length - 1];
            this.displayFloorLabels(lastLayer.floor, false);
            this.stack = null;
        }
        this.resetPermanentDisplay();
    }
}

const labelController = new LabelController();
export default labelController;
