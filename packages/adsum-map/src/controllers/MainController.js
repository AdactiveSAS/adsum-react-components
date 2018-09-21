// @flow

import {
    AdsumWebMap,
    FloorObject,
    SiteObject,
} from '@adactive/adsum-web-map';
import { Tween } from 'es6-tween';

import selectionController from './SelectionController';
import wayfindingController from './WayfindingController';
import placesController from './PlacesController';
import type { WillInitActionType } from '../actions/MainActions';

/**
 * @memberof module:Map
 * @class
 * Map controller
 */
class MainController {
    awm: AdsumWebMap = null;
    device: number = null;
    mode: '3D' | '2D' = '3D';
    userAnimation: Tween = null;

    /**
     * Initializing of map
     */
    async init(action: WillInitActionType) {
        this.awm = action.awm;
        this.dispatch = action.store.dispatch;

        // Init the Map
        await this.awm.init();
        selectionController.init(action);
        placesController.init(action);
        wayfindingController.init(action);

        this.userAnimation = new Tween({ rotation: 0 })
            .to({ rotation: Math.PI * 2 }, 2000)
            .repeat(Infinity)
            .on('update', ({ rotation }) => {
                this.awm.objectManager.user.setRotation(rotation);
            });

        this.start();
    }

    start() {
        this.awm.start();
        this.userAnimation.restart();
    }

    async stop(reset: boolean = true) {
        if (reset) {
            await this.reset();
        }
        this.userAnimation.stop();
        this.awm.stop();
    }

    async reset(stop: boolean = false, resetFloor: boolean = true) {
        selectionController.reset();
        wayfindingController.reset();

        if (resetFloor) {
            await this.awm.sceneManager.setCurrentFloor(this.awm.defaultFloor, false);
            await this.awm.cameraManager.centerOnFloor(this.awm.defaultFloor, false);
        }

        if (stop) {
            await this.stop(false);
        }
    }

    getCurrentFloor(): ?FloorObject {
        return this.awm.sceneManager.getCurrentFloor();
    }

    async setCurrentFloor(floor: number | ?FloorObject | ?SiteObject, centerOn: boolean = true, animated: boolean = true): Promise<void> {
        const floorObject = typeof floor === 'number' ? this.awm.objectManager.floors.get(floor) : floor;

        await this.awm.sceneManager.setCurrentFloor(floorObject, animated);

        if (centerOn) {
            await this.awm.cameraManager.centerOnFloor(floorObject, animated);
        }
    }

    async zoom(value: number): Promise<void> {
        await this.awm.cameraManager.zoom(value);
    }
}

const mainController = new MainController();
export default mainController;
