// @flow

import { EventDispatcher } from 'three';
import { CancellationTokenSource, CancellationToken } from 'prex-es5';
import ACA from '@adactive/adsum-utils/services/ClientAPI';

import PathSectionDrawer from '../path/PathSectionDrawer';
import floorsController from './FloorsController';
import labelController from './LabelController';
import placesController from './PlacesController';
import selectionController from './SelectionController';

/*const mode = {
    DEFAULT: 'default',
    STACK: 'stack',
};*/

class WayfindingController extends EventDispatcher {
    constructor() {
        super();
        this.awm = null;
        this.current = null;
        this._currentPathSections = null;

        window.wayfindingController = this;
        this.labelsOnWayfinding = [];
        this._sources = [];
    }

    init(awm) {
        this.awm = awm;
    }

    getPath(object) {
        if (object === null) {
            return null;
        }

        return placesController.getPath(object.placeId);
    }

    isStackMode() { // TODO ADD MODE
        return true;
    }

    isDefaultMode() { // TODO ADD MODE
        return false;
    }

    setPath(path) {
        if (path === null) {
            return Promise.reject(new Error("Path not valid to be draw"));
        }

        if (!path.computed) {
            console.error('WayfindingController.goToPath > Path must be computed before ', path);
            return Promise.reject(new Error("Path not computed"));
        }

        let promise = Promise.resolve();
        let source = null;
        if (this.current !== null) {
            promise = promise.then(() => {
                return this.reset();
            }).then(() => {
                source = new CancellationTokenSource();
                this._sources.push(source);
                this.current = path;
                this._currentPathSections = this.current.getPathSections(this.isStackMode());
            });
        } else {
            source = new CancellationTokenSource();
            this._sources.push(source);
            this.current = path;
            this._currentPathSections = this.current.getPathSections(this.isStackMode());
        }

        return promise;
    }

    drawPath(path, pathSectionIndex = null) {
        return this.setPath(path)
            .then(() => floorsController.computeStack(this._currentPathSections, this._sources[this._sources.length-1].token))
            .then(() => {
                if(this.isStackMode()) {
                    floorsController.explodeStack(150);
                }

                labelController.hideLabelsInStack(floorsController.getStack()); // TODO

                labelController.displayLabelsOnPath(this._currentPathSections, true);

                let promise = Promise.resolve();
                for (let i = 0; i < this._currentPathSections.length; i++){
                    if(i <= pathSectionIndex || pathSectionIndex === null) {
                        this._sources[this._sources.length - 1].token.throwIfCancellationRequested();

                        if((i === pathSectionIndex && pathSectionIndex !== null)) {
                            promise = promise.then(() => this.addDelay(1000, this._sources[this._sources.length - 1], 'Path was stopped'));
                        }

                        promise = promise.then(() => this._handlePathSection(i, this._sources[this._sources.length - 1], pathSectionIndex));
                    }
                }

                return promise.catch((e) => {
                    this.reset();
                    if (e.message !== 'Not Locked'
                        && e.message !== 'Scale was stopped'
                        && e.message !== 'Path was stopped'
                        && e.message !== 'Operation canceled.')  return Promise.reject(e);
                });
            })
            .then(()=> this.addDelay(1500, this._sources[this._sources.length - 1], 'Path was stopped'))
            .then(()=> this._finalView(path, pathSectionIndex, this._sources[this._sources.length - 1].token))
            .catch((e) => {
                if (e.message !== 'Path not valid to be draw'
                    && e.message !== 'Path not computed'
                    && e.message !== 'centerOn canceled'
                    && e.message !== 'delay was stopped') {
                    return Promise.reject(e);
                } else {
                    this.reset();
                    return Promise.resolve();
                }
            });
    }

    _finalView(path, pathSectionIndex = null, token = CancellationToken.none ) {
        const isTargetOnSameFloor = (path.from.adsumObject.parent === path.to.adsumObject.parent);
        return new Promise(
            (resolve, reject)=> {
                if(pathSectionIndex !== null || isTargetOnSameFloor) {
                    return resolve();
                }

                floorsController.centerOnStack(
                    {
                        fitRatio: 1.2,
                        zoom: true,
                        altitude: 0,
                        time: 1300
                    },
                    token
                ).then(
                    ()=>{
                        if(pathSectionIndex === null) {
                            floorsController.bounceDownAllFloors(path.to.adsumObject);
                        }
                        resolve();
                    }
                ).catch((e) => {
                    reject(e);
                });
            }
        );
    }

    _handlePathSection(currentPathSectionIndex, source, pathSectionIndex = null) {

        let skipStep = false;
        let stepBefore = false;
        if(pathSectionIndex !== null) {
            skipStep = (currentPathSectionIndex !== pathSectionIndex);
            stepBefore = (currentPathSectionIndex === pathSectionIndex -1);
        }

        const pathSection = this._currentPathSections[currentPathSectionIndex];
        const previousPathSection = currentPathSectionIndex === 0 ? null : this._currentPathSections[currentPathSectionIndex-1];
        const nextPathSection = currentPathSectionIndex === this._currentPathSections.length -1 ? null : this._currentPathSections[currentPathSectionIndex + 1];

        let promise = Promise.resolve();
        const floor = pathSection.ground.isFloor ? pathSection.ground : null;

        if(this.isStackMode() && previousPathSection && previousPathSection.isInterGround()) {

            if(previousPathSection.grounds.length === 2) {
                promise = promise.then(
                    () => {
                        return floorsController.setCurrentFloor( previousPathSection.grounds[Math.floor(previousPathSection.grounds.length /2)].id , source.token, true, false);
                    }
                );
            }

            promise = promise.then(() => {
                return floorsController.centerOn(
                    floor,
                    {
                        fitRatio: 1.3,
                        zoom: true,
                        altitude: 0,
                        time: skipStep ? 0 : 1300
                    },
                    source.token
                )
            });
        }

        if(!pathSection.isInterGround()) {
            promise = promise.then(
                () => {
                    return floorsController.setCurrentFloor(floor === null ? null : floor.id, source.token, true, true, !skipStep)
                }
            );
        } else {
            if(pathSection.grounds.length > 2) {
                promise = promise.then(
                    () => {
                        return floorsController.setCurrentFloor(pathSection.grounds[Math.floor(pathSection.grounds.length / 2)].id, source.token, false, false);
                    }
                );
            }

            promise = promise.then(() => {
                return floorsController.centerOnObjects(
                    pathSection.grounds,
                    {
                        fitRatio: 1.3,
                        zoom: true,
                        altitude: 0,
                        azimuth: pathSection.getAzimuthOrientation(),
                        time: skipStep ? 0 : 1500
                    },
                    source.token
                )
            } );

            promise = promise.then(() => floorsController.showInterFloor());

            promise = promise.then(() => {
                return floorsController.createFloorsLabels(this.awm.objectManager.floors.get(1),{ x: 400, y: 550 });
            });

        }

        // Scale label
        if(this.isStackMode() && !pathSection.isInterGround() && previousPathSection && previousPathSection.isInterGround()) {
            promise = promise.then(() => {
                const toPlace = pathSection.from === null ? null : ACA.getPlace(pathSection.from.id);
                const label = (toPlace !== null) ? labelController.getAdsumObject3DFromPlace(toPlace) : null;
                return labelController.animateLabel(label, source.token);
            });
        }

        // Draw the step
        if (!(this.isDefaultMode() && pathSection.isInterGround())) { // TODO
            promise = promise.then(() => {
                return this._drawPathSection(pathSection, source.token, skipStep);
            });
        }

        // Scale label
        if(this.isStackMode() && !pathSection.isInterGround() && (!skipStep || stepBefore)) {

            if(nextPathSection) {
                promise = promise.then(()=> this.createWayfindingLabel(pathSection,nextPathSection));
                promise = promise.then((textLabel) => {
                    const toPlace = pathSection.to === null ? null : ACA.getPlace(pathSection.to.id);
                    const label = (toPlace !== null) ? labelController.getAdsumObject3DFromPlace(toPlace) : null;
                    return Promise.all([
                        labelController.animateLabel(label, source.token),
                        labelController.animateLabel(textLabel, source.token)
                    ]);
                });
            } else {
                promise = promise.then(() => {
                    const toPlace = pathSection.to === null ? null : ACA.getPlace(pathSection.to.id);
                    const label = (toPlace !== null) ? labelController.getAdsumObject3DFromPlace(toPlace) : null;
                    return labelController.animateLabel(label, source.token);
                });
            }
        }

         if (currentPathSectionIndex === this._currentPathSections.length - 1) {
            promise = promise.then(() => selectionController.updateSelection(pathSection.to.adsumObject));
         }

        if(!skipStep) {
            promise = promise.then(() => this.addDelay(pathSection.isInterGround() ? 2300 : 1000, source, 'Path was stopped'));
        }

        promise = promise.then(() => {
            return new Promise(
                (resolve)=> {
                    this.dispatchEvent(
                        {
                            type: "pathSection.did.draw",
                            previous: previousPathSection,
                            current: pathSection,
                            currentIndex: currentPathSectionIndex,
                        },
                    );
                    resolve();
                }
            );
        });

        return promise;
    }

    addDelay(delay, source, errMessage) {
        let tokenTimeOut = null;
        return new Promise((resolve, reject) => {
            try {
                source.token.throwIfCancellationRequested();
            } catch (e) {
                if(e.message === "Operation was canceled") {
                    reject(new Error('delay was stopped'));
                } else {
                    reject(e);
                }
            }
            const registration = source.token.register(() => {
                if (tokenTimeOut) {
                    clearTimeout(tokenTimeOut);
                    reject(new Error(errMessage));
                }
            });
            tokenTimeOut = setTimeout(
                () => {
                    registration.unregister();
                    resolve(true);
                },
                delay
            );
        })
    }

    createWayfindingLabel(pathSection, nextPathSection) {
        const currentFloor = pathSection.ground;
        const nextFloor = nextPathSection.to.adsumObject.parent;
        const toPois = pathSection.to === null ? null : ACA.getPoisFromPlace(pathSection.to.id);
        const toPoi = toPois && toPois.length > 0 ? toPois[0] : null;

        return new Promise(
            (resolve)=> {
                labelController.createPopOverOnAdsumObject(
                    pathSection.to.adsumObject.parent,
                    `${toPoi.name} to ${nextFloor.name}`,
                    currentFloor.altitude < nextFloor.altitude ? "up": "down",
                    pathSection.to.adsumObject.offset
                ).then((label)=>{
                    this.labelsOnWayfinding.push(label);
                    resolve(label);
                });
            }
        );
    }

    removeWayfindingLabels() {
        for (const label of this.labelsOnWayfinding) {
            labelController.removePopOver(label);
        }
        this.labelsOnWayfinding = [];
    }

    _drawPathSection(pathSection, token = CancellationToken.none, skipStep = false) {
        this.awm.wayfindingManager.removePathSection(pathSection);

        const pathSectionObject = this.awm.wayfindingManager.options.pathBuilder.build(pathSection);

        const drawer = new PathSectionDrawer(
            pathSectionObject,
            this.awm.cameraManager,
            this.awm.wayfindingManager.projector,
        );

        return drawer.draw(token, skipStep).catch((e) => { if (e.message !== 'Path was stopped') return Promise.reject(e); });
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
            this._currentPathSections = null;
        }

        this.removeWayfindingLabels();
        labelController.reset(); // TODO
        floorsController.removeFloorsLabels();
        floorsController.reset();

        return Promise.resolve();
    }
}

const wayfindingController = new WayfindingController();
export default wayfindingController;
