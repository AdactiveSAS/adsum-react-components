// @flow

import CustomUserObject from '../kioskIndicator/CustomUserObject';

import PathSectionDrawer from '../path/PathSectionDrawer';
import customDotPathBuilder from '../path/CustomDotPathBuilder';

import floorsController from './FloorsController';
import labelController from './LabelController';
import placesController from './PlacesController';


import { CancellationTokenSource, CancellationToken } from 'prex-es5';

class WayfindingController {
    constructor() {
        this.awm = null;
        this.current = null;
        this.device = -1;

        window.wayfindingController = this;

        this._sources = [];
    }

    init(awm, device) {
        this.awm = awm;
        this.device = device;
        return customDotPathBuilder.initer(awm).then(() => this.loadUserObject());
    }

    loadUserObject() {
        const customUserObject = new CustomUserObject(this.awm, { placeId: Symbol('UserPlace'), id: Symbol('UserPositionId') });
        this.awm.objectManager.user._dispose();
        return customUserObject.createDefault(this.awm.projector.meterToAdsumDistance(3), ).then((customUserObj) => {
            this.awm.objectManager.user = customUserObj;
            this.awm.objectManager.user.animate();
            return this.awm.setDeviceId(this.device, false);
        });
    }

    getPath(object) {
        if (object === null) {
            return null;
        }

        return placesController.getPath(object.placeId);
    }

    goToPath(path) {
        if (path === null) {
            return Promise.resolve();
        }

        if (!path.computed) {
            console.error('WayfindingController.goToPath > Path must be computed before ', path);
            return Promise.resolve();
        }

        let promise = Promise.resolve();
        let source = null;
        let pathSections = null;
        if (this.current !== null) {
            promise = promise.then(() => {
                return this.reset();
            }).then(() => {
                source = new CancellationTokenSource();
                this._sources.push(source);
                this.current = path;
                pathSections = this.current.getPathSections(false);
            });
        } else {
            source = new CancellationTokenSource();
            this._sources.push(source);
            this.current = path;
            pathSections = this.current.getPathSections(false);
        }

        // TODO labelController.reset();
        return promise
            .then(() => floorsController.computeStack(pathSections, source.token))
            .then(() => {
                // TODO floorsController.explodeStack();
                // TODO labelController.hideLabelsInStack(floorsController.getStack());

                // TODO labelController.showLabelsOnPath(pathSections);

                // The path is computed, and we have now access to path.pathSections which represents all steps
                // We will chain our promises
                let promise = Promise.resolve();
                for (const pathSection of pathSections) {
                   source.token.throwIfCancellationRequested();
                    // Do the floor change
                    const floor = pathSection.ground.isFloor ? pathSection.ground : null;

                    promise = promise.then(() => floorsController.setCurrentFloor(floor === null ? null : floor.id, source.token));

                    // TODO promise = promise.then(() => sceneController.setCurrentFloorCustom(floor === null ? null : floor.id));
                    // promise = promise.then(() => sceneController.setCurrentFloor(floor === null ? null : floor.id));

                    // promise = promise.then(() => this.awm.cameraManager.centerOnFloor(floor));

                    // Draw the step
                    if (!pathSection.isInterGround()) { // TODO
                        promise = promise.then(() => this.drawPathSection(pathSection, source.token));
                    }

                    // Scale label
                    promise = promise.then(() => labelController.animateLabel(pathSection, source.token));

                    // Add a delay of 1.5 seconds
                    let tokenTimeOut = null;
                    promise = promise.then(() =>
                        new Promise((resolve, reject) => {
                            const registration = source.token.register(() => {
                                if (tokenTimeOut) {
                                    clearTimeout(tokenTimeOut);
                                    reject(new Error('Path was stopped'));
                                }
                            });
                            tokenTimeOut = setTimeout(
                                () => {
                                    registration.unregister();
                                    resolve(true);
                                },
                                200
                            );
                        })
                    );
                }

                return promise.catch((e) => {
                    floorsController.reset();
                    if (e.message !== 'Not Locked'
                        && e.message !== 'Scale was stopped'
                        && e.message !== 'Path was stopped'
                        && e.message !== 'Operation canceled.')  return Promise.reject(e);
                });
            });
    }

    drawPathSection(pathSection, token = CancellationToken.none) {
        this.awm.wayfindingManager.removePathSection(pathSection);

        const pathSectionObject = customDotPathBuilder.build(pathSection);

        const drawer = new PathSectionDrawer(
            pathSectionObject,
            this.awm.cameraManager,
            this.awm.wayfindingManager.projector,
        );

        return drawer.draw(token).catch((e) => { if (e.message !== 'Path was stopped') return Promise.reject(e); });
    }

    goToKioskLocation() {
        let promise = Promise.resolve();
        promise = promise.then(() => floorsController.reset());
        promise = promise.then(() => this.awm.cameraManager.centerOnFloor(this.awm.defaultFloor));
        return promise;
    }

    reset() {
        if(this._sources.length) {
            for(let i=0; i< this._sources.length-1; i++) {
                if(this._sources[i] && !this._sources[i]._registrations) {
                    delete this._sources[i];
                }
            }
            this._sources[this._sources.length-1].cancel();
        }
        if (this.current !== null) {
            // Remove previously drawn paths
            this.awm.wayfindingManager.removePath(this.current);
            this.current = null;
        }
        return Promise.resolve();
    }
}

const wayfindingController = new WayfindingController();
export default wayfindingController;
