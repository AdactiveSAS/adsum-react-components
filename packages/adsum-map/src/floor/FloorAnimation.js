import { DISPLAY_MODES } from '@adactive/adsum-web-map';
import { Tween, Easing } from 'es6-tween';

import labelController from '../controllers/LabelController';
/**
 * @package
 */
class FloorAnimation {
    constructor() {
        this.isFloorAnimation = true;
        this.show = true;
        /**
         * @type {AdsumWebMap}
         */
        this.awm = null;

        //this._siteLabelsPermanent = [];
    }

    /**
     * @package
     * @param {AdsumWebMap} awm
     */
    init(awm) {
        this.awm = awm;

        this.setSiteVisibility(true, 1, false);
        this.awm.objectManager.floors.forEach((floor) => {
            this.setVisibility(floor, false, 0, false);
        });
    }

    /**
     * @package
     *
     * @param {SiteObject|FloorObject} from
     * @param {SiteObject|FloorObject} to
     * @param {boolean} animated
     * @return {Promise<void, Error>}
     */
    start(from, to, animated) {
        let visible = true, fading = 1;
        if(this.show) {
            visible = true;
            fading = 1;
        } else {
            labelController.displayFloorLabels(to, DISPLAY_MODES.NONE);
            visible = false;
            fading = 0;
        }
        return this.setVisibility(to, visible, fading, animated);
    }

    /**
     * @package
     */
    stop() {
    }

    setVisibility(ground, visible, fading, animated = true) {
        if (ground.isSite) {
            return this.setSiteVisibility(visible, fading, animated);
        } else {
            let promise = Promise.resolve();
            if(visible) {
                promise = promise.then(() => this.setSiteVisibility(false, 0, false));
            }
            return promise.then(()=>{
                ground.setDisplayMode(visible ? DISPLAY_MODES.VISIBLE : DISPLAY_MODES.NONE);
                if(animated) {
                    return this._animatedFading(ground,visible? 0 : 1, fading);
                }
                this.setFading(ground, fading);
                return Promise.resolve();
            });
        }
    }

    setSiteVisibility(visible, fading, animated = true) {
        const site = this.awm.objectManager.site;

        if((site.getDisplayMode() === DISPLAY_MODES.VISIBLE && visible) ||
            (site.getDisplayMode() === DISPLAY_MODES.TRANSPARENT && !visible)) {
            return Promise.resolve();
        }

        site.setDisplayMode(visible ? DISPLAY_MODES.VISIBLE : DISPLAY_MODES.TRANSPARENT);
        site.decors.forEach(decor => decor.setDisplayMode(visible ? DISPLAY_MODES.VISIBLE : DISPLAY_MODES.NONE));
        let promises = [];
        site.buildings.forEach(building => {
            if(visible) {
                 building.floors.forEach(floor => {
                    floor.setDisplayMode(DISPLAY_MODES.TRANSPARENT);
                     if(animated) {
                         promises.push(
                              new Promise((resolve)=>{
                                return this._animatedFading(floor, 1, 0)
                                .then(()=>{
                                    floor.setDisplayMode(DISPLAY_MODES.NONE);
                                    resolve();
                                });
                              })
                          );
                     } else {
                         this.setFading(floor, 0);
                     }
                 });
             }
            building.setDisplayMode(visible ? DISPLAY_MODES.VISIBLE : DISPLAY_MODES.TRANSPARENT);
        });
        site.spaces.forEach(space => space.setDisplayMode(visible ? DISPLAY_MODES.VISIBLE : DISPLAY_MODES.TRANSPARENT));
        site.labels.forEach(label => {
            this.setPermanentDisplay(label, visible);
            label.setDisplayMode(visible ? DISPLAY_MODES.VISIBLE : DISPLAY_MODES.TRANSPARENT);
        });

        if(animated) {
            //return Promise.all(promises).then(()=> this._animatedFading(site, site.getFading(), fading));
            return Promise.all([this._animatedFading(site, site.getFading(), fading), ...promises]);
        } else {
            this.setFading(site, fading);
            return Promise.resolve();
        }
    }

    setPermanentDisplay(label, visible) {
        label.isPermanentDisplay = visible;
        //this._siteLabelsPermanent.push(label);
    }

    setFading(object, fading) {
        object.setFading(fading);
    }

    _animatedFading(object, from, to) { // TODO CANCEL TOKEN
        return new Promise(
            (resolve,reject)=> {
                const holder = {
                    val: from
                };
                const tween = new Tween(holder)
                .to(
                    {
                        val: to
                    },
                    900,
                )
                .on('update', () => {
                    this.setFading(object,holder.val);
                })
                .on('stop', () => {
                    reject();
                })
                .on('complete', () => {
                    resolve();
                })
                .easing(Easing.Quadratic.InOut)
                .start();
            }
        );

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

    setDisplayMode(mesh, displayMode) {
        switch (displayMode) {
            case DISPLAY_MODES.NONE:
                mesh.visible = false;
                break;
            case DISPLAY_MODES.VISIBLE:
                mesh.visible = true;
                this.forEachMaterial(mesh, (material) => {
                    material.visible = true;
                });
                break;
            case DISPLAY_MODES.TRANSPARENT:
                mesh.visible = true;
                this.forEachMaterial(mesh, (material) => {
                    material.visible = false;
                });
                break;
            default:
                throw new Error('Unexpected');
        }
    }
}

export default FloorAnimation;