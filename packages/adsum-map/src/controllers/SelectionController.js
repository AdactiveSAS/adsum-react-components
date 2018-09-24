// @flow

import { CancellationTokenSource } from 'prex-es5';
import { AdsumWebMap } from '@adactive/adsum-web-map';
import ACA from '@adactive/adsum-utils/services/ClientAPI';
import { Poi, Place } from '@adactive/adsum-client-api';
import placesController from './PlacesController';
import type {WillInitActionType} from "../actions/MainActions";

import { didResetSelectionAction } from '../actions/SelectionActions';

class SelectionController {
    constructor() {
        this.awm = null;
        this.selection = new Set();
        this.cancelSource = new CancellationTokenSource();
    }

    init(action: WillInitActionType): SelectionController {
        this.awm = action.awm;
        this.dispatch = action.store.dispatch;

        return this;
    }

    async selectPoi(poi: Poi, reset: boolean = true, centerOn: boolean = true): Promise<void> {
        if (reset) {
            this.reset();
        }
        const places = ACA.getPlaces(poi.places);

        await Promise.all(places.map((place: Place): Promise<void> => this.selectPlace(place, false, centerOn)));
    }

    async selectPlace(place: Place, reset: boolean = true, centerOn: boolean = true): Promise<void> {
        if (reset) {
            this.reset();
        }

        const path = placesController.getPath(place.id);
        await this.select(path.to.adsumObject, false, centerOn, false);
    }

    async select(adsumObject: ?AdsumObject3D, reset: boolean = true, centerOn: boolean = true, onlyIfPoi: boolean = true) {
        if (reset) {
            this.reset();
        }

        if (!adsumObject) {
            return;
        }

        // if no poi link to the place do not select
        if (onlyIfPoi) {
            const place = ACA.getPlace(adsumObject.placeId);
            if (place === null || place.pois.size === 0) {
                return;
            }
        }

        this.selection.add(adsumObject);

        await this.highlight(adsumObject, centerOn);
    }

    getSelection(): Array {
        return Array.from(this.selection);
    }

    async highlight(adsumObject: ?AdsumObject3D, centerOn: boolean = false) {
        let ground = null;
        if (adsumObject.isBuilding) {
            adsumObject.setColor(0x78e08f);
            adsumObject.labels.forEach((label) => {
                // label.setScale(3, 3, 3);
                label.select();
            });
        } else if (adsumObject.isSpace) {
            adsumObject.setColor(0x78e08f);
            adsumObject.bounceUp(2);
            adsumObject.labels.forEach((label) => {
                // label.setScale(3, 3, 3);
                label.select();
            });
            ground = adsumObject.parent;
        } else if (adsumObject.isLabel) {
            // adsumObject.setScale(3, 3, 3);
            adsumObject.select();

            const { parent } = adsumObject;
            if (parent.isSpace) {
                ground = parent.parent;
            } else if (parent.isFloor) {
                ground = parent;
            }
        } else {
            return;
        }

        if (centerOn) {
            const registration = this.cancelSource.token.register(() => {
                this.awm.cameraManager.reset();
                this.awm.sceneManager.reset();
            });
            await this.awm.sceneManager.setCurrentFloor(ground, true);
            await this.awm.cameraManager.centerOn(adsumObject, true);
            registration.unregister();
        }
    }

    // eslint-disable-next-line class-methods-use-this
    unlight(adsumObject: ?AdsumObject3D): void {
        if (adsumObject.isBuilding) {
            adsumObject.resetColor();
        } else if (adsumObject.isSpace) {
            adsumObject.resetColor();
            adsumObject.bounceDown();
            adsumObject.labels.forEach((label) => {
                // label.setScale(1, 1, 1);
                label.unselect();
            });
        } else if (adsumObject.isLabel) {
            // adsumObject.setScale(1, 1, 1);
            adsumObject.unselect();
        }
    }

    unselect(adsumObject: AdsumObject3D) {
        this.unlight(adsumObject);
        this.selection.delete(adsumObject);
    }

    reset() {
        this.cancelSource.cancel();

        this.selection.forEach((adsumObject) => { this.unselect(adsumObject); });

        this.dispatch(didResetSelectionAction());

        this.cancelSource = new CancellationTokenSource();
    }
}

const selectionController = new SelectionController();
export default selectionController;
