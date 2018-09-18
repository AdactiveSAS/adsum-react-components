// @flow

import { CancellationTokenSource, CancelError } from 'prex-es5';
import { Path, PathSection } from '@adactive/adsum-web-map';
import selectionController from './SelectionController';
import type { WillInitActionType } from '../actions/MainActions';

import {
    didDrawPathSectionEvent,
    resetPathEvent,
    setCurrentPathAction,
    willDrawPathSectionEvent
} from '../actions/WayfindingActions';

class WayfindingController {
    constructor() {
        this.awm = null;
        this.current = null;
        this.currentIndex = -1;

        this.userObjectLabel = null;

        this.cancelSource = new CancellationTokenSource();
    }

    init(action: WillInitActionType) {
        this.awm = action.awm;
        this.dispatch = action.store.dispatch;
        this.userObjectLabel = action.userObjectLabel;
        this.userObjectLabelOffset = this.userObjectLabel === null
            ? null
            : Object.assign({}, this.userObjectLabel.offset);

        this.updateUserObjectLabelPosition();
    }

    updateUserObjectLabelPosition() {
        if (this.userObjectLabel === null) {
            return;
        }

        const { user } = this.awm.objectManager;

        if (user === null || user.parent === null) {
            if (this.userObjectLabel.parent !== null) {
                this.awm.objectManager.removeLabel(this.userObjectLabel);
            }

            return;
        }

        if (this.userObjectLabel.parent !== user.parent) {
            this.awm.objectManager.addLabel(this.userObjectLabel, user.parent);
        }
        const { x, y, z } = user.getPosition();
        this.userObjectLabel.moveTo(x, y, z);
        this.userObjectLabel.moveBy(
            this.userObjectLabelOffset.x,
            this.userObjectLabelOffset.y,
            this.userObjectLabelOffset.z,
        );
    }

    setPath(path) {
        if (path === null) {
            throw new Error('Path not valid to be draw');
        }

        if (!path.computed) {
            console.error('WayfindingController.goToPath > Path must be computed before ', path);
            throw new Error('Path not computed');
        }

        if (path === this.current) {
            this.reset(true);
            return;
        }

        this.reset();

        this.current = path;
        this.currentIndex = -1;

        this.dispatch(setCurrentPathAction(this.current));
    }

    /**
    * @public
    * @param path
    * @param pathSectionIndex
    * @return {Promise<void>}
    */
    async drawPath(path: Path, pathSectionIndex: ?PathSection = null) {
        try {
            this.setPath(path);

            const pathSections = path.getPathSections(true);
            const length = pathSectionIndex === null ? pathSections.length : pathSectionIndex + 1;

            if (pathSectionIndex !== null) {
                if (pathSectionIndex <= this.currentIndex) {
                    for (let i = pathSectionIndex; i <= this.currentIndex; i++) {
                        this.awm.wayfindingManager.removePathSection(pathSections[i]);
                    }
                } else {
                    let current = null;
                    let previous = null;
                    for (let i = this.currentIndex + 1; i < pathSectionIndex; i++) {
                        current = pathSections[i];
                        // eslint-disable-next-line no-await-in-loop
                        await this.drawPathSection(current, previous, false);
                        previous = current;
                    }
                }

                this.currentIndex = pathSectionIndex - 1;
            }

            let current = null;
            let previous = null;
            for (let i = this.currentIndex + 1; i < length; i++) {
                current = pathSections[i];
                this.currentIndex = i;

                this.dispatch(willDrawPathSectionEvent(current, previous, i));

                // eslint-disable-next-line no-await-in-loop
                await this.drawPathSection(current, previous);

                this.dispatch(didDrawPathSectionEvent(current, previous, i));

                previous = current;
            }
        } catch (e) {
            if (e.message === 'Path was stopped' || e instanceof CancelError) {
                console.warn(e.message);
            } else {
                throw e;
            }
        }
    }

    async drawPathSection(pathSection: PathSection, previousPathSection: ?PathSection = null, animated: boolean = true): Promise<void> {
        const isVertical = pathSection.isInterGround() && Math.abs(pathSection.getInclination()) > 30;

        const opts = {
            keepSiteVisible: false,
            bounce: true,
            center: true,
            centerOnOptions: {
                zoom: true,
                altitude: isVertical ? 10 : 80,
                time: 1500,
                minDistance: 50,
                maxDistance: 800,
            },
        };

        if (previousPathSection === null || previousPathSection.isInterGround()) {
            const registration = this.cancelSource.token.register(() => {
                this.awm.sceneManager.reset();
                this.awm.cameraManager.reset();
            });

            await this.awm.sceneManager.setCurrentFloor(pathSection.ground, animated, opts);

            this.cancelSource.token.throwIfCancellationRequested();

            registration.unregister();
        }

        const drawOptions = {
            center: true,
            oriented: false,
            speed: isVertical ? 50 : 30,
            // Delay the pattern show to display them after the camera animation
            showDelay: 1800,
            // Custom Camera Center on options for that call
            centerOnOptions: {
                zoom: true,
                altitude: isVertical ? 10 : 80,
                time: 1500,
                fitRatio: 1.2,
                minDistance: 100,
                maxDistance: 1500,
            },
        };

        const registration2 = this.cancelSource.token.register(() => {
            this.awm.wayfindingManager.removePathSection(pathSection);
        });

        await this.awm.wayfindingManager.drawPathSection(pathSection, drawOptions, animated);

        if (!isVertical && pathSection.to && pathSection.to.adsumObject) {
            await selectionController.select(pathSection.to.adsumObject, true, false, true);

            if (animated) {
                let timeout = null;

                const reg = this.cancelSource.token.register(() => { clearTimeout(timeout); });
                await new Promise((resolve) => {
                    timeout = setTimeout(resolve, 500);
                });
                reg.unregister();
            }
        }

        registration2.unregister();

        this.cancelSource.token.throwIfCancellationRequested();
    }

    async goToKioskLocation() {
        const registration = this.cancelSource.token.register(() => {
            this.awm.sceneManager.reset();
            this.awm.cameraManager.reset();
        });

        await this.awm.cameraManager.setCurrentFloor(this.awm.objectManager.user.parent);
        await this.awm.cameraManager.centerOnFloor(this.awm.objectManager.user.parent);

        registration.unregister();
    }

    reset(keepCurrent: boolean = false) {
        this.cancelSource.cancel();

        selectionController.reset();

        if (!keepCurrent && this.current !== null) {
            // Remove previously drawn paths
            this.awm.wayfindingManager.removePath(this.current);
            this.current = null;
            this.dispatch(resetPathEvent());
        }

        this.cancelSource = new CancellationTokenSource();
    }
}

const wayfindingController = new WayfindingController();
export default wayfindingController;
