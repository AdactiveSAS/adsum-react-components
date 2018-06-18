// @flow

import { AdsumWebMap, AdsumLoader } from '@adactive/adsum-web-map';
import * as three from 'three';
// import ACA from '../../../services/ClientAPI';
import ACA from '@adactive/adsum-utils/services/ClientAPI';

import selectionController from './SelectionController';
import wayfindingController from './WayfindingController';
import placesController from './PlacesController';

import floorsController from './FloorsController';
import labelController from './LabelController';

import ObjectsLoader from '../objectsLoader/ObjectsLoader';

import customDotPathBuilder from '../path/CustomDotPathBuilder';

/**
 * @memberof module:Map
 * @class
 * Map controller
 */
class MapController {
    /**
     * Initial settings for map
     */
    constructor() {
        this.awm = null;
        this.objectsLoader = null;
        this._resetLock = false;
        this._maxPolarAngle = null;
        this.device = -1;
    }
    /**
     * Initializing of map
     */
    init(device: number, display: string, backgroundImage: string, PopOver: any) {
        this.adsumLoader = new AdsumLoader({
            entityManager: ACA.entityManager, // Give it in order to be used to consume REST API
            deviceId: device, // The device Id to use
        });
        this.device = device;

        // Create the Map instance
        this.awm = new AdsumWebMap({
            loader: this.adsumLoader, // The loader to use
            engine: {
                container: document.getElementById('adsum-web-map-container'), // The div DOMElement to insert the canvas into
            },
            wayfinding: {
                pathBuilder: customDotPathBuilder
            }
        });


        window.awm = this.awm;
        window.three = three;
        window.THREE = three;
        window.mapController = this;

        // Init the Map
        return this.awm.init().then(() => {
            selectionController.init(this.awm);
            placesController.init(this.awm);
            floorsController.init(this.awm);
            labelController.init(this.awm, PopOver);
            this.objectsLoader = new ObjectsLoader(this.awm);
            return wayfindingController.init(this.awm, device);
        }).then(() => {
            console.log('AdsumWebMap is ready to start');

            // TODO SET MIN ZOOM
            this.awm.cameraManager.control.minDistance = this.awm.getProjector().meterToAdsumDistance(140);


            this.switchMode(display);

            /* ------------------------------------ PROJECT SPECIFIC  --------------------------------------------*/

            const backgroundTextureLoader = new three.TextureLoader();
            backgroundTextureLoader.crossOrigin = '';
            const backgroundTexture = backgroundTextureLoader.load(backgroundImage);
            backgroundTexture.wrapS = three.RepeatWrapping;
            backgroundTexture.wrapT = three.RepeatWrapping;
            backgroundTexture.repeat.set(1, 1);
            this.awm.sceneManager.scene.background = backgroundTexture;

            const currentFloor = this.awm.sceneManager.getCurrentFloor();
            floorsController.showFloorsUnder(currentFloor);

            /* ------------------------------------ PROJECT SPECIFIC  --------------------------------------------*/

            // Start the rendering
            return this.awm.start();
        });
    }

    /* ------------------------------------ FUNCTIONS: MAP CONTROL  --------------------------------------------*/

    /**
     * View switch between 2D and 3D
     * @param mode {string} mode view
     */
    switchMode(mode) {
        if (mode === "3D" && this._maxPolarAngle !== null) {
            this.awm.cameraManager.control.maxPolarAngle = this._maxPolarAngle;
            this.awm.cameraManager.control.enableRotate = true;
        } else if (mode === "2D") {
            this._maxPolarAngle = this.awm.cameraManager.control.maxPolarAngle;
            this.awm.cameraManager.control.maxPolarAngle = 0;
            this.awm.cameraManager.control.enableRotate = false;
        }
    }

    start() {
        let promise = Promise.resolve();
        if (!this._resetLock) {
            promise = promise.then(() => this.awm.start());
            promise = promise.then(() => this.awm.objectManager.user.animate());
        }
        return promise;
    }

    stop() {
        let promise = Promise.resolve();
        promise = promise.then(() => this.awm.objectManager.user.stopAnimate());
        promise = promise.then(() => this.awm.stop());
        return promise;
    }

    reset(stopMap = false) {
        this._resetLock = true;
        selectionController.reset();
        let promise = Promise.resolve();
        promise = promise.then(() => wayfindingController.reset());
        promise = promise.then(() => floorsController.reset());
        promise = promise.then(() => this.awm.cameraManager.centerOnFloor(this.awm.defaultFloor));
        if (stopMap) promise = promise.then(() => this.stop());
        promise = promise.then(() => { this._resetLock = false; });
        return promise;
    }

    getAllFloors() {
        return this.awm.objectManager.floors;
    }

    getAllBuildings() {
        return this.awm.objectManager.buildings;
    }

    getCurrentFloor() {
        return this.awm.sceneManager.getCurrentFloor();
    }

    setCurrentFloor(floorID: number, centerOn: boolean = true) {
        const floorObject = floorID === null ? null : this.awm.objectManager.floors.get(floorID);
        let promise = Promise.resolve();
        if (this.awm.sceneManager.currentFloor !== floorObject) {
            promise = promise.then(() => floorsController.setCurrentFloor(floorID));
            if (centerOn) promise = promise.then(() => this.awm.cameraManager.centerOnFloor(floorObject));
        }
        return promise;
    }
}
const mapController = new MapController();
export default mapController;
