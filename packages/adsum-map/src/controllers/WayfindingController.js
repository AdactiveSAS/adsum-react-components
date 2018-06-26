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

        this._source = new CancellationTokenSource();
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
        if (this.current !== null) {
            // Remove previously drawn paths
            this.reset();
        }

        if (path === null) {
            return Promise.resolve();
        }

        if (!path.computed) {
            console.error('WayfindingController.goToPath > Path must be computed before ', path);
            return Promise.resolve();
        }

        this.current = path;

        const pathSections = this.current.getPathSections(false);
        // TODO labelController.reset();
        return floorsController.computeStack(pathSections, this._source.token)
            .then(() => {
                // TODO floorsController.explodeStack();
                // TODO labelController.hideLabelsInStack(floorsController.getStack());

                // TODO labelController.showLabelsOnPath(pathSections);

                // The path is computed, and we have now access to path.pathSections which represents all steps
                // We will chain our promises
                let promise = Promise.resolve();
                for (const pathSection of pathSections) {
                    // Do the floor change
                    const floor = pathSection.ground.isFloor ? pathSection.ground : null;

                    promise = promise.then(() => floorsController.setCurrentFloor(floor === null ? null : floor.id, this._source.token));

                    // TODO promise = promise.then(() => sceneController.setCurrentFloorCustom(floor === null ? null : floor.id));
                    // promise = promise.then(() => sceneController.setCurrentFloor(floor === null ? null : floor.id));

                    // promise = promise.then(() => this.awm.cameraManager.centerOnFloor(floor));

                    // Draw the step
                    if (!pathSection.isInterGround()) { // TODO
                        promise = promise.then(() => this.drawPathSection(pathSection, this._source.token));
                    }

                    // Scale label
                    promise = promise.then(() => labelController.animateLabel(pathSection, this._source.token));

                    // Add a delay of 1.5 seconds
                    let tokenTimeOut = null;
                    promise = promise.then(() =>
                        new Promise((resolve, reject) => {
                            const registration = this._source.token.register(() => {
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

                return promise.catch((e) => { if (e.message !== 'Not Locked') return Promise.reject(e); });
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
        this._source.cancel();
        if (this.current !== null) {
            this.awm.wayfindingManager.removePath(this.current);
            this.current = null;
        }
        this._source = new CancellationTokenSource();
        return Promise.resolve();
    }
}

const wayfindingController = new WayfindingController();
export default wayfindingController;
