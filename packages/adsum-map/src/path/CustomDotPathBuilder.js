// @flow

import { Scene, Group, Vector3, Box3} from 'three';
import { DotPathBuilder } from '@adactive/adsum-web-map';

import ObjectsLoader from '../objectsLoader/ObjectsLoader';

class CustomDotPathBuilder extends DotPathBuilder {

    initer(awm) {
        this.awm = awm;
        this.objectsLoader = new ObjectsLoader(this.awm);
        this.options = {
            patternSpace: 4,
            patternSize: 2,
            patternMesh: null
        };
        return this.loadPathPattern();
    }

    loadPathPattern() { // TODO params
        return new Promise(
            (resolve,reject)=>{
                this.objectsLoader.createJSON3DObj('assets/3dModels/path_default.json').then((pathPattern) => {
                //this.objectsLoader.createJSON3DObj('assets/3dModels/SpherePath.json').then((pathPattern) => {
                    if (pathPattern instanceof Scene && pathPattern.children.length === 1) {
                        const group = new Group();
                        group.add(pathPattern.children[0]);
                        pathPattern = group;
                    }

                    const box = new Box3();
                    box.setFromObject(pathPattern);
                    const size = new Vector3();
                    box.getSize(size);

                    const maxSize = Math.max(size.x, size.y);

                    const targetPatternSize = this.projector.meterToAdsumDistance(1.5); //this.options.patternSize
                    pathPattern.scale.multiplyScalar(targetPatternSize / maxSize); // TODO


                    pathPattern.position.setZ(this.projector.meterToAdsumDistance(0.8));

                    this.options.patternMesh = pathPattern;
                    resolve();
                });
            }
        );

    }
}

const customDotPathBuilder = new CustomDotPathBuilder();
export default customDotPathBuilder;
