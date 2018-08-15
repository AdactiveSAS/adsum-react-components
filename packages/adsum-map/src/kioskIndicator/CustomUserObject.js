// @flow

import { Tween } from 'es6-tween';
import { UserObject } from '@adactive/adsum-web-map';
import { Group } from 'three';
import ObjectsLoader from '../objectsLoader/ObjectsLoader';

/**
 * @public
 */
class CustomUserObject extends UserObject {
    constructor(options = {}) {
        super(options);

        this.objectsLoader = new ObjectsLoader();
    }

    load() {
        return this.createDefault(1);
    }

    _rotateAnimation = null;
    /**
   *
   * @param {number} size
   * @param {object} parameters
   * @param {int|symbol|null} [id=Symbol()]
   * @return {UserObject}
   */
    createDefault(size) { // TODO
        return new Promise((resolve, reject) => {
            this.objectsLoader.createJSON3DObj('/assets/3dModels/youarehere.json').then((object) => {
                object.visible = true;

                object.scale.set(0.5, 0.5, 0.5);

                const scaleRatio = 2;// MapConfig.positionIndicatorOptions.scaleRatio;
                object.scale.multiplyScalar(scaleRatio);
                object.rotateX(Math.PI / 2);
                object.updateMatrix();

                const caps = new Group();
                caps.add(object);
                this._setMesh(caps);

                this.animate();

                resolve(this._mesh);
            });
        });
    }

    animate() {
        if (this._mesh) { // TODO
            if (!this._rotateAnimation) {
                this._rotateAnimation = new Tween(this._mesh.rotation)
                    .to(
                        {
                            z: Math.PI * 2,
                        },
                        2000
                    )
                    .repeat(Infinity)
                    .on('update', () => { this._mesh.updateMatrixWorld(); })
                    .on('stop', () => console.log('userObject animation stopped'))
                    .start();
                window._rotateAnimation = this._rotateAnimation;
            } else {
                this._rotateAnimation.restart();
            }
        }
    }

    stopAnimate() {
        if (this._rotateAnimation) {
            this._rotateAnimation.stop();
        }
    }
}

export default CustomUserObject;
