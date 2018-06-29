import { CancellationToken } from "prex-es5";

import { DISPLAY_MODE, SCENE_EVENTS } from '@adactive/adsum-web-map';

class FloorsController {
    constructor() {
        this.awm = null;
        this.locked = false;
        this.currentFloor = null;
        this.stack = [];
    }

    init(awm) {
        this.awm = awm;
        return this;
    }

    computeStack(pathSections, token = CancellationToken.none) {
        this.resetStack();

        return new Promise(
            (resolve,reject)=> {

                const registration = token.register(() => {
                    this.resetStack();
                    reject(new Error("Operation canceled."));
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
                        for (let i = 0; i < pathSection.grounds.length - 1; i++) {
                            const fromFloor = pathSection.grounds[i];
                            const toFloor = pathSection.grounds[i + 1];
                            const floorsInBetween = this.findFloorsInBetween(fromFloor, toFloor);
                            if (floorsInBetween.length > 0) {
                                this.stack = [...this.stack, ...floorsInBetween];
                            }
                        }
                    }
                }

                registration.unregister();
                resolve();
            }
        );
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
            });
        });
    }

    getStack() {
        return this.stack;
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

    explodeStack() { // Mode 1
        if (this.stack.length > 1) {
            for (let i = 0; i < this.stack.length - 1; i++) {
                const layer = this.stack[i];
                this.changeZPosition(layer.floor._mesh, layer.floor._mesh.position.z + (200));
                if (layer.isInterFloor) {
                    this.changeOpacity(layer.floor, true);
                }
            }
        }
    }

    changeZPosition(mesh, z) {
        mesh.position.z = z;
        mesh.updateMatrix();
    }

    changeOpacity(floor, transparent = false) {
        floor._mesh.traverse((child) => {
            if (child.material) {
                child.material.transparent = transparent;
                if (child.name === '') { // TODO Label
                    // child.material.opacity = transparent ? 0 : 1;
                } else {
                    child.material.opacity = transparent ? 0.5 : 1;
                }
            }
        });
    }

    setCurrentFloor(floorID, token = CancellationToken.none) {
        const floorObject = floorID === null ? null : this.awm.objectManager.floors.get(floorID);
        return new Promise(
            (resolve,reject)=> {

                const registration = token.register(() => {
                    //this.reset();
                    reject(new Error("Operation canceled."));
                });

                this.stackFromFloor(floorObject);

                registration.unregister();
                resolve();
            }
        );

    }

    stackFromFloor(floor, animated = true) { // Mode 2

        if (floor === this.awm.sceneManager.currentFloor) {
            return;
        }

        this.showFloorsUnder(floor);

        const previous = this.awm.sceneManager.currentFloor;
        this.awm.sceneManager.currentFloor = floor;

        this.awm.sceneManager.dispatchEvent({
            type: SCENE_EVENTS.floor.didChanged,
            previous,
            current: floor,
        });
    }

    showFloorsUnder(floor, showSite = true) {
        if(showSite) {
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

    resetStack() {
        if (this.stack.length > 1) {
            for (let i = 0; i < this.stack.length - 1; i++) {
                const layer = this.stack[i];
                this.changeZPosition(layer.floor._mesh, layer.zInitial);
                if (layer.isInterFloor) {
                    this.changeOpacity(layer.floor, false);
                }
            }
        }
        this.stack = [];
    }

    reset() {
        this.resetStack();
        return this.stackFromFloor(this.awm.defaultFloor);
    }
}

const floorsController = new FloorsController();
export default floorsController;
