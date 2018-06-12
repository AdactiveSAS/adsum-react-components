// @flow

import { CameraCenterOnOptions } from '@adactive/adsum-web-map';
import labelController from './LabelController';
// import ACA from '../../../services/ClientAPI';
import ACA from '@adactive/adsum-utils/services/ClientAPI';

class SelectionController {
    constructor() {
        this.awm = null;
        this.current = null;
        this.locked = false;

        this._cameraCenterOnOptions = new CameraCenterOnOptions({
            fitRatio: 6,
            zoom: false
        });
    }

    init(awm) {
        this.awm = awm;
        return this;
    }

    updateSelection(object, centerOn = false) {
        if (this.locked || object === this.current) {
            return Promise.resolve();
        }
        // if no poi link to the place do not select
        if (object && ACA.getPoisFromPlace(object.placeId).length === 0) {
            return Promise.resolve();
        }

        // Make sure to unselect previously selected
        this.reset();

        this.current = object;

        if (this.current !== null && this.current.isBuilding) {
            this.locked = true;
            return this.highlightBuilding(this.current, centerOn)
                .then(() => {
                    this.locked = false;
                });
        } else if (this.current !== null && this.current.isSpace) {
            this.locked = true;
            return this.highlightSpace(this.current, centerOn)
                .then(() => {
                    this.locked = false;
                });
        } else if (this.current !== null && this.current.isLabel) {
            this.locked = true;
            return this.highlightLabel(this.current)
                .then(() => {
                    this.locked = false;
                });
        }

        return Promise.resolve();
    }

    getCurrent() {
        return this.current;
    }

    highlightBuilding(building, centerOn = false) {
        let promise = Promise.resolve();
        if (centerOn) promise = promise.then(() => this.awm.cameraManager.centerOn(building, true, this._cameraCenterOnOptions));
        return promise
            .then(() => {
                building.setColor(0x78e08f);
            });
    }

    resetBuilding(building) {
        building.resetColor();
    }

    highlightSpace(space, centerOn = false) {
        let promise = Promise.resolve();
        if (centerOn) promise = promise.then(() => this.awm.cameraManager.centerOn(space, true, this._cameraCenterOnOptions));
        promise = promise.then(() => labelController.createPopOverOnAdsumObject(space));
        return promise
            .then(() => {
                space.setColor(0x78e08f);
                space.bounceUp(3);
            });
    }

    highlightLabel(label) {
        return this.awm.cameraManager.centerOn(label, true, this._cameraCenterOnOptions);
    }

    resetSpace(space) {
        space.resetColor();
        space.bounceDown();
    }

    reset() {
        // Make sure to unselect previously selected
        if (this.current !== null && this.current.isBuilding) {
            this.resetBuilding(this.current);
        } else if (this.current !== null && this.current.isSpace) {
            this.resetSpace(this.current);
        }
        labelController.removePopOver();
        this.current = null;
    }
}

const selectionController = new SelectionController();
export default selectionController;
