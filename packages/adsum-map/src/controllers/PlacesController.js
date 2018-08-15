// @flow
import _ from 'lodash';
import { Path } from '@adactive/adsum-web-map';
import ACA from '@adactive/adsum-utils/services/ClientAPI';

class PlacesController {
    constructor() {
        this.awm = null;
        this.sortedPaths = new Map();
    }

    init(awm) {
        this.awm = awm;
        return this;
    }

    /**
     * Sort by nearest to furtherest places from current location
     */
    sortAllPlaces() {
        const places = ACA.entityManager.getRepository('Place').getAll();
        return this.sortPlaces(places).then(result => _.sortBy(result, ['_distance'])).then((sortedPaths) => {
            for (let i = 0; i < sortedPaths.length; i++) {
                const path = sortedPaths[i];
                this.sortedPaths.set(path.to.id, path);
            }
            console.log('PlacesController > All places have been sorted by distance');
            return Promise.resolve(this.sortedPaths);
        });
    }

    getSortedPaths() {
        return this.sortedPaths;
    }

    getPath(id) {
        return this.sortedPaths.get(id);
    }

    /**
     * Get closest place for a poiId
     * @param poiId {number} poi id
     */
    getClosestPathFromPoiId(poiId) {
        const poi = ACA.getPoi(poiId);
        const places = ACA.getPlaces(poi.places);
        return this.getClosestPath(places);
    }

    getClosestPath(places) {
        if (!places.length) return null;

        const filteredPlaces = places.filter(place => this.getPath(place.id)._distance);

        if (!filteredPlaces.length) return null;

        let path = this.getPath(places[0].id);

        for (let i = 1; i < filteredPlaces.length; i++) {
            const currentPath = this.getPath(filteredPlaces[i].id);

            if (path._distance === null && i === 1) {
                path = currentPath;
            }
            if (currentPath._distance < path._distance) {
                path = currentPath;
            }
        }
        return path._distance !== null ? path : null;
    }

    /**
     * Sort by nearest to furtherest places from places list
     * @param places {array} list of places
     */
    sortPlaces(places) {
        const results = [];
        let promise = Promise.resolve();
        for (const place of places) {
            promise = promise.then(() => this.createAndComputePathFromUserLocationToPlace(place));
            promise = promise.then(path => results.push(path));
        }
        return promise.then(() => results);
    }

    createAndComputePathFromUserLocationToPlace(place) {
        // Get the object location
        const location = this.awm.wayfindingManager.locationRepository.get(place.id);

        // Create path from user location and object location
        const path = new Path(this.awm.wayfindingManager.locationRepository.userLocation, location);

        return new Promise((resolve, reject) => {
            this.awm.wayfindingManager.computePath(path)
                .then(() => {
                    path.getDistance(); // To compute the distance
                    resolve(path);
                })
                .catch((e) => {
                    if (e.message !== 'AdsumWebMap.PathNetwork: No path found to destination') {
                        reject(e);
                    } else {
                        resolve(path);
                    }
                });
        });
    }

    reset() {
        this.sortedPaths = new Map();
    }
}

const placesController = new PlacesController();
export default placesController;
