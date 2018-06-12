// @flow

import * as three from 'three';
import OBJLoader from './OBJLoader';

/**
 * Usage
 *
     this.objectsLoader.createJSON3DObj('assets/3dModels/bench.json').then(
            (basketball) => {
                    const basketballClone = this.objectsLoader.add3DObjectOnFloor(null, new three.Vector3(0, 0, 60), basketball.clone());
                    basketballClone.scale.set(100, 100, 100);
            }
     );
 */

/**
 * @memberof module:Map
 * @class
 * ObjectsLoader
 */
class ObjectsLoader {
    constructor(awm) {
        this.awm = awm;
    }

    /**
     *
     * @param url
     * @return {Promise}
     */
    createJSON3DObj(url) {
        return new Promise((resolve, reject) => {
            const loader = new three.ObjectLoader();
            loader.setCrossOrigin('anonymous');
            loader.load(
                url,
                resolve,
                () => {},
                reject,
            );
        });
    }

    /**
     *
     * @param url
     * @return {Promise}
     */
    createOBJ3DObj(url) {
        return new Promise((resolve, reject) => {
            const loader = new OBJLoader();
            loader.load(
                url,
                resolve,
                () => {},
                reject,
            );
        });
    }

    /**
     *
     * @param floorId
     * @param position
     * @param obj
     * @return {*}
     */
    add3DObjectOnFloor(floorId, position, obj) {
        let floor = null;
        if (!floorId) {
            // Warning : accessing variables beginning _ means they are private and is not recommended
            // Retrieve the site THREE.Mesh
            floor = this.awm.objectManager.site._mesh;
        } else {
            // Warning : accessing variables beginning _ means they are private and is not recommended
            // Retrieve the floor THREE.Mesh
            floor = this.awm.objectManager.floors.get(floorId)._mesh;
        }

        // Get the click position in the floor coordinate system
        position = floor.worldToLocal(position.clone());
        if (obj) {
            obj.visible = true;
            obj.position.copy(position);
            floor.add(obj);
            return obj;
        }
    }
}
export default ObjectsLoader;
