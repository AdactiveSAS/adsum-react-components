import { DISPLAY_MODES } from '@adactive/adsum-web-map';

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
        this._keepSiteVisible = false;
    }

    /**
     * @package
     * @param {AdsumWebMap} awm
     */
    init(awm) {
        this.awm = awm;

        this.setVisibility(this.awm.objectManager.site, false, 1);
        this.awm.objectManager.floors.forEach((floor) => {
            if(floor !== this.awm.defaultFloor) {
                this.setVisibility(floor, false, 1);
            }
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
        if(this.show) {
            to.setDisplayMode(DISPLAY_MODES.VISIBLE);
        }

        return Promise.resolve();
    }

    /**
     * @package
     */
    stop() {
    }

    setVisibility(ground, visible, fading) {
        if (ground.isSite) {
            if (!this._keepSiteVisible) {
                ground.setFading(fading);
                ground.setDisplayMode(visible ? DISPLAY_MODES.VISIBLE : DISPLAY_MODES.TRANSPARENT);

                ground.decors.forEach(decor => decor.setDisplayMode(visible ? DISPLAY_MODES.VISIBLE : DISPLAY_MODES.TRANSPARENT));
                ground.buildings.forEach(building => building.setDisplayMode(visible ? DISPLAY_MODES.VISIBLE : DISPLAY_MODES.TRANSPARENT));
                ground.spaces.forEach(space => space.setDisplayMode(visible ? DISPLAY_MODES.VISIBLE : DISPLAY_MODES.TRANSPARENT));
                ground.labels.forEach(label => label.setDisplayMode(visible ? DISPLAY_MODES.VISIBLE : DISPLAY_MODES.TRANSPARENT));

                ground._mesh.traverse((child) => {
                    if(!child.adsumObject) {
                        this.setDisplayMode(child, visible ? DISPLAY_MODES.VISIBLE : DISPLAY_MODES.TRANSPARENT);
                    }
                });
            }
        } else {
            ground.setFading(fading);
            ground.setDisplayMode(visible ? DISPLAY_MODES.VISIBLE : DISPLAY_MODES.NONE);

            if (this._keepSiteVisible) {
                const fullyVisibleFloor = visible && fading === 1;

                const visibleBuilding = !fullyVisibleFloor && !this.isSameBuilding;
                ground.building.setDisplayMode(
                    visibleBuilding ? DISPLAY_MODES.VISIBLE : DISPLAY_MODES.TRANSPARENT,
                );
            }
        }
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