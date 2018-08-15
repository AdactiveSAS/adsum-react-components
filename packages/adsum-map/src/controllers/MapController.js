// @flow

import { AdsumWebMap, AdsumLoader, ArrowPathPatternOptions, DotPathBuilder, DotPathBuilderOptions, DecorObject } from '@adactive/adsum-web-map';
import * as three from 'three';
import { Tween, Easing } from 'es6-tween';
import ACA from '@adactive/adsum-utils/services/ClientAPI';

import selectionController from './SelectionController';
import wayfindingController from './WayfindingController';
import placesController from './PlacesController';

import floorsController from './FloorsController';
import FloorAnimation from '../floor/FloorAnimation';
import labelController from './LabelController';

import CustomUserObject from '../kioskIndicator/CustomUserObject';
//import customDotPathBuilder from '../path/CustomDotPathBuilder';

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
        this._resetLock = false;
        this._maxPolarAngle = null;
        this._minPolarAngle = null;
        this.device = -1;
        this._mode = "3D";
        this._userObject = null;
    }
    /**
     * Initializing of map
     */
    init(device: number, display: string, backgroundImage: string, PopOver: any, wireFraming: boolean, multiPlaceSelection: string) {
        this.adsumLoader = new AdsumLoader({
            entityManager: ACA.entityManager, // Give it in order to be used to consume REST API
            deviceId: device, // The device Id to use
        });
        this.device = device;

        three.Object3D.DefaultMatrixAutoUpdate = true;

        // Create the Map instance
        this._userObject = new CustomUserObject({ placeId: Symbol('UserPlace'), id: Symbol('UserPositionId') });
        return this._userObject.load().then(
            ()=> {

                this.awm = new AdsumWebMap({
                    loader: this.adsumLoader, // The loader to use
                    engine: {
                        container: document.getElementById('adsum-web-map-container'), // The div DOMElement to insert the canvas into
                    },
                    wayfinding: {
                        pathBuilder: new DotPathBuilder(new DotPathBuilderOptions(
                            {
                                patternSpace: 2.5,//4,
                                patternSize: 1,//2
                                pattern: new ArrowPathPatternOptions(
                                    {
                                        color: "#be272f"
                                    }
                                )
                            }
                        )),
                        userObject: this._userObject
                    },
                    scene: {
                        animation: new FloorAnimation()
                    }
                });


                window.awm = this.awm;
                window.three = three;
                window.THREE = three;
                window.mapController = this;

                // Init the Map
                return this.awm.init();

        }).then(() => {
                selectionController.init(this.awm, multiPlaceSelection);
                placesController.init(this.awm);
                floorsController.init(this.awm);
                labelController.init(this.awm, PopOver);
                wayfindingController.init(this.awm);
                return Promise.resolve();
        }).then(() => {
            console.log('AdsumWebMap is ready to start');

            // TODO SET MIN ZOOM
            this.awm.cameraManager.control.minDistance = this.awm.getProjector().meterToAdsumDistance(70);
            this._maxPolarAngle = this.awm.cameraManager.control.maxPolarAngle;
            this._minPolarAngle = this.awm.cameraManager.control.minPolarAngle;

            this.switchMode(display);

            /* ------------------------------------ PROJECT SPECIFIC  --------------------------------------------*/

            const backgroundTextureLoader = new three.TextureLoader();
            backgroundTextureLoader.crossOrigin = '';
            const backgroundTexture = backgroundTextureLoader.load(backgroundImage);
            backgroundTexture.wrapS = three.RepeatWrapping;
            backgroundTexture.wrapT = three.RepeatWrapping;
            backgroundTexture.repeat.set(1, 1);
            this.awm.sceneManager.scene.background = backgroundTexture;

            //TODO Mode1
            //const currentFloor = this.awm.sceneManager.getCurrentFloor();
            //floorsController.showFloorsUnder(currentFloor);
            //TODO Mode2
            //floorsController.showAllFloor();

            floorsController.bounceDownAllFloors(); // TODO

            if(wireFraming) {
                this.awm.objectManager.spaces.forEach((space) => {
                    if (space.isSpace) {
                        this._wireFrameAShape(space, 0, 0x5a5b5a);
                    }
                });
            }

            /* ------------------------------------ PROJECT SPECIFIC  --------------------------------------------*/

            // Start the rendering
            return Promise.resolve().then( () => this.awm.start() ).then(
                ()=> {
                    return floorsController._bounceUpSpaces(this.awm.defaultFloor);
                }
            );
        });
    }

    /* ------------------------------------ FUNCTIONS: MAP CONTROL  --------------------------------------------*/

    _wireFrameAShape(space, opacity: number = 0.7, matColor = null, needBoundingBox: boolean = false) {
        const geo = new three.EdgesGeometry(space._mesh.geometry); // or WireframeGeometry
        const mat = new three.LineBasicMaterial({ color: matColor, linewidth: 1 });
        const wireFrame = new three.LineSegments(geo, mat);

        const currentWireframe = new DecorObject({
            name: `${space.name}_wireFrame`,
            placeId: space.id
        });
        currentWireframe._setMesh(wireFrame);

        space.addDecor(currentWireframe);
        space.updateMatrix();
        currentWireframe.updateMatrix();
    }

    /**
     * View switch between 2D and 3D
     * @param mode {string} mode view
     * @param animated {boolean} animated
     */
    switchMode(mode, animated = true) { // Add cancel token
        if(this._mode !== mode) {
            this._mode = mode;
            let to = 0.001;
            if (mode === "2D") {
                to = 0.001;
                this.awm.cameraManager.control.enableRotate = false;
            } else if (mode === "3D") {
                to = this._maxPolarAngle;
                this.awm.cameraManager.control.enableRotate = true;
            }

            if (mode === "2D") {
                this.awm.cameraManager.control.minPolarAngle = 0.001;
            } else if (mode === "3D") {
                this.awm.cameraManager.control.maxPolarAngle = this._maxPolarAngle;
            }
            if(animated) {
                const holder = {
                    val: (mode === "2D")? this.awm.cameraManager.control.maxPolarAngle : this.awm.cameraManager.control.minPolarAngle
                };
                return new Promise(
                    (resolve, reject)=> {
                        this._tween = new Tween(holder)
                            .to(
                                {
                                    val:to
                                },
                                1400,
                            )
                            .on('update', () => {
                                if (mode === "2D") {
                                    this.awm.cameraManager.control.maxPolarAngle = holder.val;
                                } else if (mode === "3D") {
                                    this.awm.cameraManager.control.minPolarAngle = holder.val;
                                }
                            })
                            .on('stop', () => {
                                reject();
                            })
                            .on('complete', () => {
                                if (mode === "3D") {
                                    this.awm.cameraManager.control.minPolarAngle = 0.001;
                                }
                                resolve();
                            })
                            .easing(Easing.Quadratic.InOut)
                            .start();
                    }
                );

            } else {
                if (mode === "2D") {
                    this.awm.cameraManager.control.maxPolarAngle = to;
                } else if (mode === "3D") {
                    this.awm.cameraManager.control.minPolarAngle = to;
                    return new Promise(
                        (resolve, reject)=> {
                            setTimeout(
                                ()=> {
                                    this.awm.cameraManager.control.minPolarAngle = 0.001;
                                    resolve();
                                },
                                200
                            )
                        }
                    )

                }
            }
        }
        return Promise.resolve();
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
        if (this.awm.sceneManager.getCurrentFloor() !== floorObject) {
            promise = promise.then(() => floorsController.setCurrentFloor(floorID));
            if (centerOn) promise = promise.then(() => this.awm.cameraManager.centerOnFloor(floorObject));
        }
        return promise;
    }
}
const mapController = new MapController();
export default mapController;
