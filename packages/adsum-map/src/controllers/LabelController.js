import { Vector3 } from 'three';
import { Tween, Easing } from 'es6-tween';
import { DISPLAY_MODE, LabelImageObject, LABEL_ORIENTATION_MODES } from '@adactive/adsum-web-map';
// import ACA from '../../../services/ClientAPI';
import ACA from '@adactive/adsum-utils/services/ClientAPI';

class LabelController {
    constructor() {
        this.awm = null;
        this.locked = false;
        this.currentFloor = null;
        this._PopOver = null;
        this.stack = null;

        this.labels = [];
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
            this.displayFloorLabels(layer.floor, true);
        }
        const lastLayer = this.stack[this.stack.length - 1];
        this.displayFloorLabels(lastLayer.floor, true);
    }

    displayFloorLabels(floor, hidden = false) {
        for (const label of floor.labels) {
            label.setDisplayMode(hidden ? DISPLAY_MODE.NONE : DISPLAY_MODE.VISIBLE);
        }
        for (const spaces of floor.spaces) {
            for (const label of spaces.labels) {
                label.setDisplayMode(hidden ? DISPLAY_MODE.NONE : DISPLAY_MODE.VISIBLE);
            }
        }
    }

    showLabelsOnPath(pathSections) {
        for (const pathSection of pathSections) {
            const toPlace = pathSection.to === null ? null : ACA.getPlace(pathSection.to.id);
            if (toPlace !== null) {
                const label = this.getAdsumObject3DFromPlace(toPlace);
                if (label !== null) {
                    label.setDisplayMode(DISPLAY_MODE.VISIBLE);
                }
            }
        }
    }

    animateLabel(pathSection) {
        const toPlace = pathSection.to === null ? null : ACA.getPlace(pathSection.to.id);
        if (toPlace !== null) {
            const label = this.getAdsumObject3DFromPlace(toPlace);
            if (label !== null) {
                const tweenMesh = (mesh, from, to, duration) => new Promise((resolve, reject) => {
                    new Tween(from)
                        .to(to, duration)
                        .easing(Easing.Elastic.Out)
                        .on('update', (scaleHandler) => {
                            mesh.geometry.computeBoundingBox();
                            const { max, min } = mesh.geometry.boundingBox;
                            const height = max.y - min.y;
                            mesh.scale.copy(scaleHandler);
                            mesh.position.z = scaleHandler.z * height / 2;

                            mesh.updateMatrix();
                        })
                        .on('complete', () => {
                            resolve(true);
                        })
                        .on('stop', () => {
                            reject(new Error('Scale was stopped'));
                        })
                        .start();
                });

                const initialScale = label._mesh.scale.clone();

                let promise = Promise.resolve();

                promise = promise.then(() => tweenMesh(
                    label._mesh,
                    initialScale.clone(),
                    new Vector3(1.8, 1.8, 1.8),
                    700
                ));

                // Add a delay
                promise = promise.then(() => new Promise((resolve) => {
                    setTimeout(resolve, 500);
                }));

                promise = promise.then(() => tweenMesh(
                    label._mesh,
                    new Vector3(1.8, 1.8, 1.8),
                    initialScale,
                    400
                ));

                return promise;
            }
        }

        return Promise.resolve();
    }

    getAdsumObject3DFromPlace(place) { // Just want the label
        if (place.custom_objects.size > 0) {
            return this.awm.objectManager.getLabel(place.custom_objects.at(0).value);
        }

        return null;
    }

    createPopOverOnAdsumObject(object) {
        if (!object) {
            return;
        }

        if ((object.isSite || object.isBuilding || object.isFloor || object.isSpace) && object.labels.size === 0) {
            const pois = ACA.getPoisFromPlace(object.placeId);
            let text = '';
            for (const poi of pois) {
                text += poi.name;
            }
            if (text !== '') {
                this.addPopOver(text, object);
            }
        }
    }

    addPopOver(text, object) {  // TODO
        const popOver = new this._PopOver(
            text,
            {
                size: 5,
                lineHeight: 1,
                font: 'StagLight',
                backgroundPadding: 7,
                quality: 5,
                fontHeightOffset: 0.5,
                pinHeight: 5
            }
        );

        const label = new LabelImageObject({
            image: popOver._canvas,
            width: popOver._canvas.width,
            height: popOver._canvas.height
        });
        this.awm.objectManager.addLabel(label, object);

        label._mesh.geometry.translate(label.width / 2, label.height / 2, 0);
        label.moveTo(0, 0, -label.height / 2);

        this.labels.push(label);
    }

    removePopOver() {
        for (const label of this.labels) {
            this.awm.objectManager.removeLabel(label);
        }
        this.labels = [];
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
    }
}

const labelController = new LabelController();
export default labelController;
