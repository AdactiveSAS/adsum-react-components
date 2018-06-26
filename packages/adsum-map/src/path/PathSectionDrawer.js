// @flow

import { Vector3 } from 'three';
import { Tween, Easing } from 'es6-tween';

import { CancellationToken } from 'prex-es5';

import { CameraCenterOnOptions } from '@adactive/adsum-web-map';

const yAxis = new Vector3(-1, 0, 0);
const direction = new Vector3();

class PathSectionDrawer {
    constructor(pathSectionObject, cameraManager, projector) {
        /**
         * @package
         * @type {PathSectionObject}
         */
        this.pathSectionObject = pathSectionObject;

        /**
         * @package
         * @type {CameraManager}
         */
        this.cameraManager = cameraManager;

        /**
         * @package
         * @type {AdsumProjector}
         */
        this.projector = projector;

        /**
         * @package
         * @type {number}
         * @default 30
         */
        this.speed = 10; // m/s

        /**
         * @package
         * @default true
         * @type {boolean}
         */
        this.center = true; // TODO
        this.tweens = [];

        this._tweenAnimate = null;

        this._cameraCenterOnOptions = new CameraCenterOnOptions({
            fitRatio: 1.5,
            zoom: true
        });
    }

    /**
     *
     * @async
     *
     * @return {Promise<void, Error>}
     */
    draw(token = CancellationToken.none) {
        const tasks = [];
        const patterns = this.pathSectionObject._mesh.children;
        for (let i = 0; i < patterns.length; i++) {
            if (i < patterns.length - 1) this._lookat(patterns[i], patterns[i + 1].position);
            const delay = this.pathSectionObject.patternSpace / (this.speed * 4) * i * 1000;
            tasks.push(this._showPattern(i, delay, token));
        }

        this._prepareAnimation(token);

        this.pathSectionObject._mesh.visible = true;

        if (this.center) {
            tasks.push(this.cameraManager.centerOn(this.pathSectionObject, true, this._cameraCenterOnOptions));
        }

        this.pathSectionObject.animations.push(this);

        return Promise.all(tasks).then(() => this._animate());
        //return Promise.all(tasks);
    }

    /**
     * @public
     */
    stop() {
        this.tweens.forEach((tween) => {
            tween.stop();
        });
    }

    /**
     * @private
     *
     * @param {int} index
     * @param {number} delay
     * @return {Promise<boolean, Error>}
     */
    _showPattern(index, delay, token = CancellationToken.none) {
        if (this.pathSectionObject.pathSection.isInterGround()) {
            let tokenTimeOut = null;
            return new Promise((resolve, reject) => {
                const registration = token.register(() => {
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
            });
        }

        /* ------------------------------------ INIT --------------------------------------------*/
        const pattern = this.pathSectionObject._mesh.children[index];

        const opacityHandler = {
            opacity: 0,
        };
        const positionHandler = {
            z: 50,
        };
        pattern.traverse((obj) => {
            if (obj.material) {
                obj.material = obj.material.clone();
                obj.material.opacity = opacityHandler.opacity;
                obj.material.transparent = true;
            }
        });
        pattern.position.setZ(positionHandler.z);

        const promiseOpacity = new Promise((resolve, reject) => {
            let tweenOpacity = null;
            const registration = token.register(() => {
                tweenOpacity.stop();
                reject(new Error('Path was stopped'));
            });
            /* ------------------------------------ OPACITY ANIMATION  --------------------------------------------*/
            tweenOpacity = new Tween(opacityHandler)
                .to({
                    opacity: 1,
                }, 500)
                .delay(delay)
                .easing(Easing.Exponential.In)
                .on('update', () => {
                    pattern.traverse((obj) => {
                        if (obj.material) {
                            obj.material.opacity = opacityHandler.opacity;
                        }
                    });
                })
                .on('complete', () => {
                    registration.unregister();
                    resolve(true);
                })
                .on('stop', () => {
                    // reject(new Error('Path was stopped'));
                })
                .start();

            this.tweens.push(tweenOpacity);
        });
        const promisePosition = new Promise((resolve, reject) => {
            let tweenPosition = null;
            const registration = token.register(() => {
                tweenPosition.stop();
                reject(new Error('Path was stopped'));
            });
            /* ------------------------------------ POSITION ANIMATION  --------------------------------------------*/
            tweenPosition = new Tween(positionHandler)
                .to({
                    z: 0.025,
                }, 1000)
                .delay(delay)
                .easing(Easing.Bounce.Out)
                .on('update', () => {
                    pattern.position.setZ(positionHandler.z);
                    pattern.updateMatrixWorld();
                })
                .on('complete', () => {
                    registration.unregister();
                    resolve(true);
                })
                .on('stop', () => {
                    // reject(new Error('Path was stopped'));
                })
                .start();

            this.tweens.push(tweenPosition);
        });

        return Promise.all([promiseOpacity, promisePosition]);
    }

    _prepareAnimation(token = CancellationToken.none) {
        const pathSectionObject = this.pathSectionObject;
        const realInterval = pathSectionObject.pathSection.getRealInterval(pathSectionObject.patternSpace);
        const distance = pathSectionObject.pathSection.getDistance();
        const loopDuration = distance / this.speed * 1000;
        const patterns = pathSectionObject._mesh.children;

        const registration = token.register(() => {
            this._tweenAnimate.stop();
        });

        this._tweenAnimate = new Tween({ distance: 0 })
            .to({ distance }, loopDuration)
            .on('update', (distanceTracking) => {
                let previous = {
                    pattern: null,
                    d: 0
                };
                for (let i = 0; i < patterns.length; ++i) {
                    const d = (i * realInterval + distanceTracking.distance) % distance;
                    pathSectionObject.pathSection.at(d, patterns[i].position);

                    if (!pathSectionObject.pathSection.isInterGround()) {
                        patterns[i].position.setZ(this.projector.meterToAdsumDistance(0.025));
                    }

                    patterns[i].updateMatrixWorld();
                    if (previous.pattern && previous.d < d) {
                        this._lookat(previous.pattern, patterns[i].position);
                        previous.pattern.updateMatrixWorld();
                    }
                    previous = {
                        pattern: patterns[i],
                        d
                    };
                }
                const d = (distanceTracking.distance) % distance;
                if (previous.pattern && previous.d < d) {
                    this._lookat(previous.pattern, patterns[0].position);
                    previous.pattern.updateMatrixWorld();
                }
            })
            .on('stop', () => {
                registration.unregister();
                console.log('Path was stopped, animate stopped');
            })
            .repeat(Infinity);

        this.tweens.push(this._tweenAnimate);
    }

    _lookat(pattern, nextPoint) {
        direction.subVectors(nextPoint, pattern.position).normalize();
        pattern.quaternion.setFromUnitVectors(yAxis, direction);
    }

    _animate() {
        this._tweenAnimate.start();
        return Promise.resolve();
    }
}

export default PathSectionDrawer;
