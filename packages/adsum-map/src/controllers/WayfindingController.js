// @flow

// import deviceConfig from '../../../services/Config';
import deviceConfig from '../../../../../src/services/Config';

import CustomUserObject from '../kioskIndicator/CustomUserObject';

import PathSectionDrawer from '../path/PathSectionDrawer';
import customDotPathBuilder from '../path/CustomDotPathBuilder';

import floorsController from './FloorsController';
import labelController from './LabelController';
import placesController from './PlacesController';

class WayfindingController {
    constructor() {
        this.awm = null;
        this.current = null;
        this.locked = false;
    }

    init(awm) {
        this.awm = awm;
        return customDotPathBuilder.initer(awm).then(
            ()=>{
                return this.loadUserObject();
            }
        )
    }

    loadUserObject() {
        const customUserObject = new CustomUserObject(this.awm, { placeId: Symbol('UserPlace'), id: Symbol('UserPositionId') });
        this.awm.objectManager.user._dispose();
        return customUserObject.createDefault(
            this.awm.projector.meterToAdsumDistance(3),
        ).then((customUserObj) => {
            const { device } = deviceConfig.config;
            this.awm.objectManager.user = customUserObj;
            this.awm.objectManager.user.animate();
            return this.awm.setDeviceId(device, false);
        });
    }

    getPath(object) {
        if(object === null) {
            return null;
        }

        return placesController.getPath(object.placeId);
    }

    goToPath(path) {
        if (this.current !== null) {
            // Remove previously drawn paths
            this.reset();
        }

        if(path === null) {
            return Promise.resolve();
        }

        if(!path.computed) {
            console.error("WayfindingController.goToPath > Path must be computed before ", path);
            return Promise.resolve();
        }

        this.current = path;

        return Promise.resolve()
            .then(() => {

                this.locked = true;

                const pathSections = this.current.getPathSections(true);
                // TODO labelController.reset();
                floorsController.computeStack(pathSections);
                // TODO floorsController.explodeStack();
                // TODO labelController.hideLabelsInStack(floorsController.getStack());

                // TODO labelController.showLabelsOnPath(pathSections);

                // The path is computed, and we have now access to path.pathSections which represents all steps
                // We will chain our promises
                let promise = Promise.resolve();
                for (const pathSection of pathSections) {

                    // Do the floor change
                    const floor = pathSection.ground.isFloor ? pathSection.ground : null;

                    promise = promise.then(() => floorsController.setCurrentFloor(floor === null ? null : floor.id));
                    promise = promise.then( previousResult => this.assertNotLock(previousResult));
                    // TODO promise = promise.then(() => sceneController.setCurrentFloorCustom(floor === null ? null : floor.id));
                    // promise = promise.then(() => sceneController.setCurrentFloor(floor === null ? null : floor.id));

                    //promise = promise.then(() => this.awm.cameraManager.centerOnFloor(floor));
                    //promise = promise.then( previousResult => this.assertNotLock(previousResult));

                    // Draw the step
                    if(! pathSection.isInterGround()) { // TODO
                        promise = promise.then(() => this.drawPathSection(pathSection));
                        promise = promise.then( previousResult => this.assertNotLock(previousResult));
                    }

                    // Scale label
                    promise = promise.then(() => labelController.animateLabel(pathSection));

                    // Add a delay of 1.5 seconds
                    promise = promise.then(() => (this.locked) ? new Promise((resolve) => {
                        setTimeout(resolve, 200);
                    }) : Promise.resolve() );
                }

                return promise.catch((e)=>{ if(e.message !== "Not Locked") return Promise.reject(e); });
            });
    }

    drawPathSection(pathSection) {
        this.awm.wayfindingManager.removePathSection(pathSection);

        if(!this.locked) {
            return Promise.resolve();
        }

        const pathSectionObject = customDotPathBuilder.build(pathSection);

        const drawer = new PathSectionDrawer(
            pathSectionObject,
            this.awm.cameraManager,
            this.awm.wayfindingManager.projector,
        );

        return drawer.draw().catch((e)=>{ if(e.message !== "Path was stopped") return Promise.reject(e); });
    }

    assertNotLock(previousResult) {
        return !this.locked ? Promise.reject(new Error('Not Locked')) : Promise.resolve(previousResult);
    }

    goToKioskLocation() {
        let promise = Promise.resolve();
        promise = promise.then(() => floorsController.reset());
        promise = promise.then(() => this.awm.cameraManager.centerOnFloor(this.awm.defaultFloor));
        return promise;
    }

    reset() {
        if(this.current !== null) {
            this.awm.wayfindingManager.removePath(this.current);
            this.current = null;
        }
        this.locked = false;
        return Promise.resolve();
    }
}

const wayfindingController = new WayfindingController();
export default wayfindingController;
