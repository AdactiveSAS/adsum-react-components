// @flow
import _ from 'lodash';
import { Path } from '@adactive/adsum-web-map';
import ACA from '@adactive/adsum-utils/services/ClientAPI';

class PlacesController {
    constructor() {
        this.awm = null;
        this.pmr = false;
        this.sortedPaths = new Map();
        this.sortedPathsPMR = new Map();
    }

    init(awm, pmr) {
        this.awm = awm;
        this.pmr = pmr || false;
        return this;
    }

    sortAllAdsumPlaces(pmr = false) {
        if (!pmr) {
            return this.sortAllPlaces();
        }
        return this.sortAllPlaces().then(() => this.sortAllPlacesWithPMR());
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

    sortAllPlacesWithPMR() {
        const places = ACA.entityManager.getRepository('Place').getAll();
        return this.sortPlaces(places, true).then(result => _.sortBy(result, ['_distance'])).then((sortedPaths) => {
            for (let i = 0; i < sortedPaths.length; i++) {
                const path = sortedPaths[i];
                this.sortedPathsPMR.set(path.to.id, path);
            }
            console.log('PlacesController > All places with PMR have been sorted by distance');
            return Promise.resolve(this.sortedPathsPMR);
        });
    }

    getSortedPaths(pmr = false) {
        if (pmr) {
            return this.sortedPathsPMR;
        }
        return this.sortedPaths;
    }

    getPath(id, pmr = false) {
        if (pmr) {
            return this.sortedPathsPMR.get(id);
        }
        return this.sortedPaths.get(id);
    }

    /**
     * Get closest place for a poiId
     * @param poiId {number} poi id
     */
    getClosestPathFromPoiId(poiId, pmr = false) {
        const poi = ACA.getPoi(poiId);
        const places = ACA.getPlaces(poi.places);
        return this.getClosestPath(places, pmr);
    }

    getClosestPath(places, pmr) {
        if (!places.length) return null;

        const filteredPlaces = places.filter(place => this.getPath(place.id, pmr)._distance);

        if (!filteredPlaces.length) return null;

        let path = this.getPath(places[0].id, pmr);

        for (let i = 1; i < filteredPlaces.length; i++) {
            const currentPath = this.getPath(filteredPlaces[i].id, pmr);

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
    sortPlaces(places, pmr = false) {
        const results = [];
        let promise = Promise.resolve();
        for (const place of places) {
            promise = promise.then(() => this.createAndComputePathFromUserLocationToPlace(place, pmr));
            promise = promise.then(path => results.push(path));
        }
        return promise.then(() => results);
    }

    createAndComputePathFromUserLocationToPlace(place, pmr) {
        // Get the object location
        const location = this.awm.wayfindingManager.locationRepository.get(place.id);

        // Create path from user location and object location
        const path = new Path(this.awm.wayfindingManager.locationRepository.userLocation, location, pmr);

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
