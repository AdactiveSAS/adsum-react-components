// @flow
import _ from 'lodash';
import { Path } from '@adactive/adsum-web-map';
import { Place } from '@adactive/adsum-client-api';
import ACA from '@adactive/adsum-utils/services/ClientAPI';
import type { WillInitActionType } from '../actions/MainActions';

class PlacesController {
    constructor() {
        this.awm = null;
        this.sortedPaths = new Map();
        this.sortedPathsPMR = new Map();
    }

    init(action: WillInitActionType) {
        this.awm = action.awm;
        return this;
    }

    async sortAllAdsumPlaces() {
        await this.sortAllPlaces();

        return this.sortAllPlacesWithPMR();
    }

    /**
     * Sort by nearest to furtherest places from current location
     */
    async sortAllPlaces(): Map<number | symbol, Path> {
        const places = ACA.entityManager.getRepository('Place').getAll();
        const result = await this.sortPlaces(places);
        const sortedPaths = _.sortBy(result, ['_distance']);

        for (let i = 0; i < sortedPaths.length; i++) {
            const path = sortedPaths[i];
            this.sortedPaths.set(path.to.id, path);
        }
        console.log('PlacesController > All places have been sorted by distance');

        return this.sortedPaths;
    }

    async sortAllPlacesWithPMR(): Map<number | symbol, Path> {
        const places = ACA.entityManager.getRepository('Place').getAll();
        const result = await this.sortPlaces(places, true);
        const sortedPaths = _.sortBy(result, ['_distance']);

        for (let i = 0; i < sortedPaths.length; i++) {
            const path = sortedPaths[i];
            this.sortedPathsPMR.set(path.to.id, path);
        }
        console.log('PlacesController > All places with PMR have been sorted by distance');

        return this.sortedPathsPMR;
    }

    getSortedPaths(pmr: boolean = false): Map<number | symbol, Path> {
        if (pmr) {
            return this.sortedPathsPMR;
        }

        return this.sortedPaths;
    }

    getPath(id: number | symbol, pmr: boolean = false): ?Path {
        const pathMap = this.getSortedPaths(pmr);

        return pathMap.has(id) ? pathMap.get(id) : null;
    }

    /**
     * Get closest place for a poiId
      * @param poiId {number} poi id
      * @param pmr
     */
    getClosestPathFromPoiId(poiId: number | symbol, pmr: boolean = false): ?Path {
        const poi = ACA.getPoi(poiId);
        const places = ACA.getPlaces(poi.places);

        return this.getClosestPath(places, pmr);
    }

    getClosestPath(places: Place[], pmr: boolean): ?Path {
        if (!places.length) return null;

        const filteredPlaces = places.filter((place: Place) => this.getPath(place.id, pmr).getDistance());

        if (!filteredPlaces.length) return null;

        let path = this.getPath(places[0].id, pmr);

        for (let i = 1; i < filteredPlaces.length; i++) {
            const currentPath = this.getPath(filteredPlaces[i].id, pmr);

            if (path.getDistance() === null && i === 1) {
                path = currentPath;
            }
            if (currentPath.getDistance() < path.getDistance()) {
                path = currentPath;
            }
        }

        return path.getDistance() !== null ? path : null;
    }

    /**
     * Sort by nearest to furtherest places from places list
     * @param places {array} list of places
     */
    async sortPlaces(places, pmr = false) {
        const results = [];
        for (const place of places) {
            results.push(this.createAndComputePathFromUserLocationToPlace(place, pmr));
        }

        return Promise.all(results);
    }

    async createAndComputePathFromUserLocationToPlace(place, pmr) {
    // Get the object location
        const location = this.awm.wayfindingManager.locationRepository.get(place.id);

        // Create path from user location and object location
        const path = new Path(this.awm.wayfindingManager.locationRepository.userLocation, location, pmr);

        try {
            await this.awm.wayfindingManager.computePath(path);

            return path;
        } catch (e) {
            if (e.message !== 'AdsumWebMap.PathNetwork: No path found to destination') {
                throw e;
            } else {
                return path;
            }
        }
    }

    reset() {
        this.sortedPaths = new Map();
    }
}

const placesController = new PlacesController();
export default placesController;
