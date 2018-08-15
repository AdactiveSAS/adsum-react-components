// @flow

import { CameraCenterOnOptions } from '@adactive/adsum-web-map';
import labelController from './LabelController';
import _ from 'lodash';
// import ACA from '../../../services/ClientAPI';
import ACA from '@adactive/adsum-utils/services/ClientAPI';
import placesController from './PlacesController';
import floorsController from './FloorsController';

class SelectionController {
    constructor() {
        this.awm = null;
        this.current = [];
        this.locked = false;
        this.multiPlaceSelection = null;

        this._cameraCenterOnOptions = new CameraCenterOnOptions({
            fitRatio: 6,
            zoom: false
        });

        this.labelsPopOver = [];
    }

    init(awm, multiPlaceSelection) {
        this.awm = awm;
        this.multiPlaceSelection = multiPlaceSelection === 'multipleLevel' ? 'multipleLevel' : 'singleLevel';
        return this;
    }

    selectMultiplePlaces(poi) {
        const places = ACA.getPlacesFromPoi(poi.id);

        if (!places) return;

        this.reset();

        let promise = Promise.resolve();
        this.locked = true;

        if (this.multiPlaceSelection === 'multipleLevel') {
            const centerOnStackOptions = {
                fitRatio: 1.2,
                altitude: 30,
                time: 1300
            };

            floorsController.explodeAndShiftStack(-300, -300, 150, centerOnStackOptions);
        }

        let havePoiOnTheFloor = false;
        _.each(places, (place) => {
            const path = placesController.getPath(place.id);
            const to = path.to.adsumObject;
            this.current.push(to);
            if (this.multiPlaceSelection === 'singleLevel') {
                if (to && to.parent) {
                    if(!havePoiOnTheFloor && to.parent.id === this.awm.defaultFloor.id) {
                        havePoiOnTheFloor = true;
                    }
                    if (to.isBuilding) {
                        promise = promise.then(() => this.highlightBuilding(to));
                    } else if (to.isSpace) {
                        promise = promise.then(() => this.highlightSpace(to));
                    } else if (to.isLabel) {
                        promise = promise.then(() => this.highlightLabel(to));
                    }
                }
            } else if (to.isBuilding) {
                promise = promise.then(() => this.highlightBuilding(to));
            } else if (to.isSpace) {
                promise = promise.then(() => this.highlightSpace(to));
            } else if (to.isLabel) {
                promise = promise.then(() => this.highlightLabel(to));
            }
        });

        promise = promise.then(() => {
            this.locked = false;
        });

        if(!havePoiOnTheFloor) {
            return new Promise((resolve,reject) => {
                if(this.current.length > 0) {
                    const to = this.current[0];
                    if (to && to.parent) {
                        return floorsController.stackFromFloor(to.parent.id).then(
                            ()=>{
                                resolve();
                            }
                        );
                    }
                }
                return promise.then(()=>resolve());
            });
        }


        promise = promise.then(() => {
            return floorsController.stackFromFloor(this.awm.defaultFloor.id)
        });

        return promise;
    }

    updateSelection(object, centerOn = false) {
        if (this.locked || (this.current.length > 0 && this.current[0] === object)) {
            return Promise.resolve();
        }
        // if no poi link to the place do not select
        if (object && ACA.getPoisFromPlace(object.placeId).length === 0) {
            return Promise.resolve();
        }

        // Make sure to unselect previously selected
        this.reset();

        this.current.push(object);

        if (this.current.length > 0 && this.current[0] !== null && this.current[0].isBuilding) {
            this.locked = true;
            return this.highlightBuilding(this.current[0], centerOn)
                .then(() => {
                    this.locked = false;
                });
        } else if (this.current.length > 0 && this.current[0] !== null && this.current[0].isSpace) {
            this.locked = true;
            return this.highlightSpace(this.current[0], centerOn)
                .then(() => {
                    this.locked = false;
                });
        } else if (this.current.length > 0 && this.current[0] !== null && this.current[0].isLabel) {
            this.locked = true;
            return this.highlightLabel(this.current[0])
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
            .then((label) => {
                this.labelsPopOver.push(label);
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

    removePopOvers() {
        for (const label of this.labelsPopOver) {
            labelController.removePopOver(label);
        }
        this.labelsPopOver = [];
    }

    reset() {
        // Make sure to unselect previously selected
        if (this.current.length > 0) {
            _.each(this.current, (adsumObject: Object) => {
                if(adsumObject) {
                    if (adsumObject.isBuilding) {
                        this.resetBuilding(adsumObject);
                    } else if (adsumObject.isSpace) {
                        this.resetSpace(adsumObject);
                    }
                }
            });
        }

        this.removePopOvers();
        this.current = [];
    }
}

const selectionController = new SelectionController();
export default selectionController;
