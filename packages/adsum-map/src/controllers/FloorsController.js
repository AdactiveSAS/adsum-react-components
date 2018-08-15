import { CancellationToken } from 'prex-es5';
import _ from 'lodash';
import { Tween, Easing } from 'es6-tween';

import { DISPLAY_MODE, DISPLAY_MODES, CameraCenterOnOptions } from '@adactive/adsum-web-map';

import labelController from './LabelController';

class FloorsController {
    constructor() {
        this.awm = null;
        this.locked = false;
        this.currentFloor = null;
        this.stack = [];
        this.labelsOnFloor = [];
        window.floorsController = this;
    }

    init(awm) {
        this.awm = awm;
        _.each(Array.from(this.awm.objectManager.floors.values()), (floor) => {
            floor.xInitial = floor._mesh.position.x;
            floor.yInitial = floor._mesh.position.y;
            floor.zInitial = floor._mesh.position.z;
        });
        return this;
    }

    computeStack(pathSections, token = CancellationToken.none) {
        this.resetStack();

        return new Promise((resolve, reject) => {
            const registration = token.register(() => {
                this.resetStack();
                reject(new Error('Operation canceled.'));
            });

            const tmpStack = [];
            for (const pathSection of pathSections) {
                if (!pathSection.isInterGround()) {
                    const layer = {
                        floor: pathSection.ground,
                        zInitial: pathSection.ground.altitude,
                        isInterFloor: false
                    };

                    if (tmpStack.indexOf(layer.floor.id) === -1) {
                        tmpStack.push(layer.floor.id);
                        this.stack.push(layer);
                    }
                } else {
                    for (let i = 1; i < pathSection.grounds.length - 1; i++) {
                        const f = pathSection.grounds[i];
                        const layer = {
                            floor: f,
                            zInitial: f.altitude,
                            isInterFloor: true
                        };
                        if (tmpStack.indexOf(layer.floor.id) === -1) {
                            tmpStack.push(layer.floor.id);
                            this.stack.push(layer);
                        }
                    }
                    /* for (let i = 0; i < pathSection.grounds.length - 1; i++) {
                            const fromFloor = pathSection.grounds[i];
                            const toFloor = pathSection.grounds[i + 1];
                            const floorsInBetween = this.findFloorsInBetween(fromFloor, toFloor);
                            if (floorsInBetween.length > 0) {
                                this.stack = [...this.stack, ...floorsInBetween];
                            }
                        } */
                }
            }
            _.sortBy(this.stack, ['zInitial']);
            registration.unregister();
            resolve();
        });
    }

    findFloorsInBetween(fromFloor, toFloor) {
        const floorsInBetween = [];
        this.awm.objectManager.buildings.forEach((building) => {
            building.floors.forEach((f) => {
                if (f.altitude > toFloor.altitude && f.altitude < fromFloor.altitude) {
                    floorsInBetween.push({
                        floor: f,
                        zInitial: f.altitude,
                        isInterFloor: true
                    });
                }
            });
        });
        return floorsInBetween;
    }

    showAllFloor() {
        this.resetStack();
        this.awm.objectManager.buildings.forEach((building) => {
            building.floors.forEach((f) => {
                const layer = {
                    floor: f,
                    zInitial: f.altitude,
                    isInterFloor: false
                };
                this.stack.push(layer);
                f.setDisplayMode(DISPLAY_MODE.VISIBLE);
            });
        });
        _.sortBy(this.stack, ['zInitial']);
    }

    getStack() {
        return this.stack;
    }

    explodeStack(offsetBetweenFloor = 200) { // Mode 1
        if (this.stack.length > 1) {
            for (let i = 1; i < this.stack.length; i++) {
                const layer = this.stack[i];
                layer.floor.moveBy(0, 0, offsetBetweenFloor * i);
                layer.floor.updateMatrix();
            }
        }
    }

    explodeAndShiftStack(offsetX = 0, offsetY = 0, offsetBetweenFloor = 0, centerOnStackOptions) {
        this.showAllFloor();
        this.bounceDownAllFloors();
        this.shiftByXAxis(offsetX);
        this.shiftByYAxis(offsetY);
        this.explodeStack(offsetBetweenFloor);
        this.centerOnStack(centerOnStackOptions);
    }

    shiftByYAxis(offsetX = 0) {
        if (this.stack.length > 1) {
            for (let i = 1; i < this.stack.length; i++) {
                const layer = this.stack[i];
                layer.floor.moveBy(offsetX * i, 0, 0);
                layer.floor.updateMatrix();
            }
        }
    }

    shiftByXAxis(offsetY = 0) {
        if (this.stack.length > 1) {
            for (let i = 1; i < this.stack.length; i++) {
                const layer = this.stack[i];
                layer.floor.moveBy(0, offsetY * i, 0);
                layer.floor.updateMatrix();
            }
        }
    }

    showInterFloor() {
        if (this.stack.length > 1) {
            for (let i = 1; i < this.stack.length; i++) {
                const layer = this.stack[i];
                layer.floor.setDisplayMode(DISPLAY_MODE.VISIBLE);
                this._bounceDownSpaces(layer.floor);
                if (layer.isInterFloor) {
                    labelController.displayFloorLabels(layer.floor, DISPLAY_MODE.NONE);
                    layer.floor.spaces.forEach((space) => {
                        if (space.isSpace) {
                            space.setDisplayMode(DISPLAY_MODES.VISIBLE);
                        }
                    });
                    this.changeOpacity(layer.floor, 0.8);
                }
            }
        }
    }

    changeOpacity(floor, opacity) {
        floor._mesh.traverse((child) => {
            if (child.material) {
                this.forEachMaterial(child, (mat) => {
                    mat.transparent = true;
                    mat.opacity = opacity;
                });
            }
        });
    }

    hideFloor(floor) {
        floor.setDisplayMode(DISPLAY_MODES.TRANSPARENT);
        floor.spaces.forEach((space) => {
            if (space.isSpace) {
                space.setDisplayMode(DISPLAY_MODES.TRANSPARENT);
            }
        });
        labelController.displayFloorLabels(floor, DISPLAY_MODE.NONE);
        this.changeOpacity(floor, 0);
    }

    forEachMaterial(mesh, fn) {
        if (!mesh.material) {
            return;
        }

        if (mesh.material.isMaterial) {
            fn(mesh.material, null);
        } else {
            const l = mesh.material.length;
            for (let i = 0; i < l; i++) {
                fn(mesh.material[i], i);
            }
        }
    }

    centerOn(object, options, token = CancellationToken.none) {
        return new Promise((resolve, reject) => {
            try {
                token.throwIfCancellationRequested();
                const _cameraCenterOnOptions = new CameraCenterOnOptions(options);
                this.awm.cameraManager.centerOn(object, true, _cameraCenterOnOptions).then(() => resolve());
            } catch (e) {
                if (e.message === 'Operation was canceled') {
                    reject(new Error('centerOn canceled'));
                } else {
                    console.log(e);
                }
                resolve();
            }
        });
    }

    centerOnObjects(objects, options, token = CancellationToken.none) {
        return new Promise((resolve, reject) => {
            try {
                token.throwIfCancellationRequested();
                const _cameraCenterOnOptions = new CameraCenterOnOptions(options);
                this.awm.cameraManager.centerOnObjects(objects, true, _cameraCenterOnOptions).then(() => resolve());
            } catch (e) {
                if (e.message === 'Operation was canceled') {
                    reject(new Error('centerOn canceled'));
                } else {
                    console.log(e);
                }
                resolve();
            }
        });
    }

    centerOnStack(options, token = CancellationToken.none) {
        return this.centerOnObjects(_.map(this.stack, 'floor'), options, token);
    }

    isStackMode() { // TODO ADD MODE
        return true;
    }

    isDefaultMode() { // TODO ADD MODE
        return false;
    }

    setCurrentFloor(floorID, token = CancellationToken.none, show = true, bounceUp = true, animated = true) {
        const floorObject = floorID === null ? null : this.awm.objectManager.floors.get(floorID);
        return new Promise((resolve, reject) => {
            const registration = token.register(() => {
                // this.reset();
                reject(new Error('Operation canceled.'));
            });

            if (this.isDefaultMode()) {
                this.stackFromFloor(floorObject);
                registration.unregister();
                resolve();
            } else {
                this.setFloor(floorObject, show, bounceUp, animated).then(() => {
                    registration.unregister();
                    resolve();
                });
            }
        });
    }

    setFloor(floor, show = true, bounceUp = true, animated = true) { // Mode 2   // TODO CANCEL TOKEN
        this.awm.sceneManager.options.animation.show = show;
        if (!show) {
            this.hideFloor(floor);
        }
        return this.awm.sceneManager.setCurrentFloor(floor).then(() => (bounceUp ? this._bounceUpSpaces(floor, animated) : Promise.resolve()));
    }

    stackFromFloor(floor, animated = true) { // Mode 2
        if (floor === this.awm.sceneManager.getCurrentFloor()) {
            floor.setDisplayMode(DISPLAY_MODE.VISIBLE);
            return;
        }

        this.showFloorsUnder(floor, false);

        this.awm.sceneManager.options.animation.show = false;
        this.awm.sceneManager.setCurrentFloor(floor); // Might have some issue here, RETURN a Promise
    }

    showFloorsUnder(floor, showSite = true) {
        if (showSite) {
            this.awm.objectManager.site.setDisplayMode(DISPLAY_MODE.VISIBLE);
        }
        floor.setDisplayMode(DISPLAY_MODE.VISIBLE);
        this.awm.objectManager.buildings.forEach((building) => {
            building.floors.forEach((f) => {
                if (f.altitude < floor.altitude) {
                    f.setDisplayMode(DISPLAY_MODE.VISIBLE);
                } else if (f.altitude > floor.altitude) {
                    f.setDisplayMode(DISPLAY_MODE.NONE);
                }
            });
        });
    }

    createFloorsLabels(baseObject, offset = { x: 0, y: 0 }) { // createFloorsLabels(this.awm.objectManager.floors.get(1),{ x: 500, y: 600 })
        let promise = Promise.resolve();
        this.stack.forEach((layer) => {
            promise = promise.then(() => new Promise((resolve) => {
                labelController.createPopOverOnAdsumObject(
                    baseObject,
                    layer.floor.name,
                    null,
                    { x: offset.x, y: offset.y, z: layer.floor._mesh.position.z }
                ).then((label) => {
                    this.labelsOnFloor.push(label);
                    resolve();
                });
            }));
        });
        return promise;
    }

    removeFloorsLabels() {
        for (const label of this.labelsOnFloor) {
            labelController.removePopOver(label);
        }
        this.labelsOnFloor = [];
    }

    resetStack() {
        if (this.stack.length > 1) {
            for (let i = 0; i < this.stack.length; i++) {
                const layer = this.stack[i];
                layer.floor.moveTo(layer.floor.xInitial, layer.floor.yInitial, layer.zInitial);
                // layer.floor.updateMatrix();
                if (layer.isInterFloor) {
                    this.changeOpacity(layer.floor, 1);
                }
                layer.floor.setDisplayMode(DISPLAY_MODE.NONE);
            }
        }
        this.stack = [];
    }

    reset() {
        this.resetStack();
        this._bounceUpSpaces(this.awm.defaultFloor, false);
        return this.stackFromFloor(this.awm.defaultFloor);
    }

    bounceDownAllFloors(except = null) {
        this.awm.objectManager.buildings.forEach((building) => {
            building.floors.forEach((f) => {
                this._bounceDownSpaces(f, except);
            });
        });
    }

    _bounceUpSpaces(floor, animated = true) { // TODO CANCEL TOKEN
        return new Promise((resolve, reject) => {
            if (animated) {
                const holder = {
                    val: 0.001
                };
                this._tween = new Tween(holder)
                    .to(
                        {
                            val: 1
                        },
                        900,
                    )
                    .on('update', () => {
                        floor.spaces.forEach((space) => {
                            if (space.isSpace) {
                                space.bounceUp(holder.val);
                            }
                        });
                    })
                    .on('stop', () => {
                        reject();
                    })
                    .on('complete', () => {
                        resolve();
                    })
                    .easing(Easing.Quadratic.InOut)
                    .start();
            } else {
                floor.spaces.forEach((space) => {
                    if (space.isSpace) {
                        space.bounceUp(1);
                    }
                });
                resolve();
            }
        });
    }

    _bounceDownSpaces(floor, except = null) {
        const holder = {
            val: 0.001
        };
        floor.spaces.forEach((space) => {
            if (space.isSpace && space !== except) {
                space.bounceUp(holder.val);
            }
        });
    }
}

const floorsController = new FloorsController();
export default floorsController;
