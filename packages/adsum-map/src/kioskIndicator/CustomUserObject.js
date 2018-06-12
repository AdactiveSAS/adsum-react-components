// @flow

import { Tween } from 'es6-tween';
import { UserObject } from '@adactive/adsum-web-map';
import ObjectsLoader from '../objectsLoader/ObjectsLoader';

/**
 * @public
 */
class CustomUserObject extends UserObject {
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
            this.objectsLoader.createJSON3DObj('assets/3dModels/youarehere.json').then((object) => {
                object.visible = true;

                object.scale.set(7, 7, 7);
                object.rotateX(Math.PI / 2);

                const scaleRatio = 2;// MapConfig.positionIndicatorOptions.scaleRatio;
                object.scale.multiplyScalar(scaleRatio);

                resolve(this._setMesh(object));
            });
        });
    }

    animate() {
        if (this._mesh) { // TODO
            if (!this._rotateAnimation) {
                this._rotateAnimation = new Tween(this._mesh.rotation)
                    .to(
                        {
                            y: Math.PI * 2,
                        },
                        2000
                    )
                    .repeat(Infinity)
                    .on('update', () => { this._mesh.updateMatrixWorld(); })
                    .on('stop', () => console.log("userObject animation stopped"))
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

    constructor(awm, parameters = {}) {
        super(parameters);

        this.awm = awm;
        this.objectsLoader = new ObjectsLoader(this.awm);
    }
}

export default CustomUserObject;
