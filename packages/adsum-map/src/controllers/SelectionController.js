// @flow

import { CancellationTokenSource } from 'prex-es5';
import ACA from '@adactive/adsum-utils/services/ClientAPI';
import { Poi, Place } from '@adactive/adsum-client-api';
import type { AdsumObject3D, CameraCenterOnOptions } from '@adactive/adsum-web-map';
import placesController from './PlacesController';
import type { WillInitActionType } from '../actions/MainActions';

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

    async selectPoi(
        poi: Poi,
        reset: boolean = true,
        centerOn: boolean = true,
        centerOnOptions: ?CameraCenterOnOptions = null,
        stayOnCurrentFloor: boolean = true,
        ground: ?AdsumObject3D = null,
        animated: boolean = true,
        highlightColor: string = '#78e08f',
    ): Promise<void> {
        if (reset) {
            this.reset();
        }
        const places = ACA.getPlaces(poi.places);

        await Promise.all(places.map((place: Place): Promise<void> => this.selectPlace(place, false, false, highlightColor)));

        if (centerOn) {
            const adsumObjectsFromPlaces = places.map((place: Place): AdsumObject3D => placesController.getPath(place.id).to.adsumObject);

            await this.handleCenterOn(adsumObjectsFromPlaces, centerOnOptions, stayOnCurrentFloor, ground, animated);
        }
    }

    async selectPlace(
        place: Place,
        reset: boolean = true,
        centerOn: boolean = true,
        highlightColor: string = '#78e08f',
    ): Promise<void> {
        if (reset) {
            this.reset();
        }

        const path = placesController.getPath(place.id);
        await this.select(path.to.adsumObject, false, centerOn, false, highlightColor);
    }

    async select(
        adsumObject: ?AdsumObject3D,
        reset: boolean = true,
        centerOn: boolean = true,
        onlyIfPoi: boolean = true,
        highlightColor: string = '#78e08f',
    ) {
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

        await this.highlight(adsumObject, centerOn, highlightColor);
    }

    getSelection(): Array {
        return Array.from(this.selection);
    }

    async highlight(adsumObject: ?AdsumObject3D, centerOn: boolean = false, highlightColor: string = '#78e08f') {
        let ground = null;
        if (adsumObject.isBuilding) {
            adsumObject.setColor(highlightColor);
            adsumObject.labels.forEach((label) => {
                // label.setScale(3, 3, 3);
                label.select();
            });
        } else if (adsumObject.isSpace) {
            adsumObject.setColor(highlightColor);
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
            await this.handleCenterOn(
                [adsumObject],
                null, // TODO: pass centerOnOptions in the parameters
                false,
                ground,
                true, // TODO: pass animated in the parameters
            );
        }
    }

    async handleCenterOn(
        adsumObjects: Array<?AdsumObject3D>,
        centerOnOptions: CameraCenterOnOptions = null,
        stayOnCurrentFloor: boolean = true,
        ground: AdsumObject3D = null,
        animated: boolean = true,
    ) {
        const registration = this.cancelSource.token.register(() => {
            this.awm.cameraManager.reset();
            this.awm.sceneManager.reset();
        });

        if (stayOnCurrentFloor) {
            ground = this.awm.sceneManager.getCurrentFloor();
        }

        await this.awm.sceneManager.setCurrentFloor(ground, animated);

        if (adsumObjects.length === 1) {
            await this.awm.cameraManager.centerOn(adsumObjects[0], animated, centerOnOptions);
        } else if (adsumObjects.length > 1) {
            await this.awm.cameraManager.centerOnObjects(adsumObjects, animated, centerOnOptions);
        }

        registration.unregister();
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
