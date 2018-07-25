// @flow

import { DistCacheManager, EntityManager } from '@adactive/adsum-client-api';
import _ from 'lodash';

class ClientAPI {
    constructor() {
        this.entityManager = null;
        this._allCategories = null;
        this._allPois = null;
    }

    async init(config, fallbackOnlineApi=false) {
        const {
            endpoint, key, site, username
        } = config;

        const entityManagerOptions = {
            endpoint,
            site,
            username,
            key
        };
        if (!fallbackOnlineApi) {
            entityManagerOptions.cacheManager = new DistCacheManager('//localhost:9001/local');
        }
        this.entityManager = new EntityManager(entityManagerOptions);
    }

    getPoi(id) {
        let poi = this.entityManager.getRepository('Poi').get(id);

        if (poi.logos && poi.logos.values) {
            for (const logo in poi.logos.values) {
                if (poi.logos.values[logo] && poi.logos.values[logo].value && !isNaN(poi.logos.values[logo].value)) {
                    poi.logos.values[logo] = this.getFile(poi.logos.values[logo].value);
                }
            }
        }
        return poi;
    }

    getPois(ids) {
        let pois = this.entityManager.getRepository('Poi').getList(ids);

        pois = pois.map((poi: Object): Object => {
            if (poi.logos && poi.logos.values) {
                for (const logo in poi.logos.values) {
                    if (poi.logos.values[logo] && poi.logos.values[logo].value && !isNaN(poi.logos.values[logo].value)) {
                        poi.logos.values[logo] = this.getFile(poi.logos.values[logo].value);
                    }
                }
            }
            return poi;
        });

        return pois;
    }

    getPoisBy(filter) {
        let pois = this.entityManager.getRepository('Poi').findBy(filter);

        pois = pois.map((poi: Object): Object => {
            if (poi.logos && poi.logos.values) {
                for (const logo in poi.logos.values) {
                    if (poi.logos.values[logo] && poi.logos.values[logo].value && !isNaN(poi.logos.values[logo].value)) {
                        poi.logos.values[logo] = this.getFile(poi.logos.values[logo].value);
                    }
                }
            }
            return poi;
        });
    }

    getPoisFromPlace(id) {
        return this.getPois(this.getPlace(id).pois.toJSON());
    }

    getPoisByTag(tagName) {
        const tag = this.getTagBy({ name: tagName });
        let pois = [];

        if (tag.length) {
            pois = this.getPoisBy({
                tags(tags) {
                    return tags.has(tag[0]);
                }
            });
        }

        return pois.map((poi: Object): Object => {
            if (!poi.logo) poi.logo = (poi.logos && poi.logos.values && poi.logos.values[0] && poi.logos.values[0].value) ? this.getFile(poi.logos.values[0].value) : null;
            return poi;
        });
    }

    getPlace(id) {
        return this.entityManager.getRepository('Place').get(id);
    }

    /**
     * Retrieve pois objects with given ids from data
     * @param ids {array} - array of ids (int or string)
     * @alias module:categoryView.getPoi
     */
    getPlaces(ids) {
        return this.entityManager.getRepository('Place').getList(ids);
    }

    getCustomObject(id) {
        return this.entityManager.getRepository('CustomObject').get(id);
    }

    getCategory(id) {
        return this.entityManager.getRepository('Category').get(id);
    }

    getCategories(ids) {
        return this.entityManager.getRepository('Category').getList(ids);
    }

    getCategoriesBy(filter) {
        return this.entityManager.getRepository('Category').findBy(filter);
    }

    getCategoriesByTag(tagName) {
        let result = [];
        const tags = this.getTagBy({name: tagName});

        for (let tag of tags) {
            result.push(... this.getCategories(tag.categories));
        }
        return result;
    }

    getPoisByCategoryId(id) {
        const category = this.getCategory(id);

        return _.map([...category.pois.values.values()], poiInfo => {
            return this.getPoi(poiInfo.value);
        });
    }

    getTagBy(filter) {
        return this.entityManager.getRepository('Tag').findBy(filter);
    }

    getPlaylistBy(filter) {
        return this.entityManager.getRepository('Playlist').findBy(filter);
    }

    getPlaylists(ids) {
        return this.entityManager.getRepository('Playlist').getList(ids);
    }

    getFile(id) {
        return this.entityManager.getRepository('File').get(id);
    }

    getPlacesFromPoi(id) {
        return this.getPlaces(this.getPoi(id).places);
    }

    getPlaylistByTag(tagName) {
        const tag = this.getTagBy({ name: tagName })
        let playlist = []
        if (tag.length) {
            playlist = this.getPlaylistBy({
                tags(tags) {
                    return tags.has(tag[0]);
                }
            });
        }
        return playlist;
    }

    getMedias(ids) {
        const medias = this.entityManager.getRepository('Media').getList(ids);

        for (const i in medias) {
            medias[i] = this.getMediaFile(medias[i]);
        }

        return medias;
    }

    getMediasByPlaylistTag(tagName: string): Array<Object> {
        let medias = [];

        const playlist = this.getPlaylistByTag(tagName);
        if (playlist.length) {
            medias = this.entityManager.getRepository('Media').getList(playlist[0].medias.toJSON());

            for (const i in medias) {
                medias[i] = this.getMediaFile(medias[i]);
            }
        }

        return medias;
    }

    getMediaFile(media) {
        if (media.file && media.file.value) {
            media.file = this.getFile(media.file.value);
        }
        return media;
    }

    getAllCategories(): Array<Object> {
        if (this._allCategories === null) {
            const categories = this.entityManager.getRepository('Category').getAll();

            this._allCategories = categories.map((category) => {
                if (category.logo && category.logo.value && !isNaN(category.logo.value)) {
                    category.logo = this.getFile(category.logo.value);
                }
                return category;
            });
        }
        return this._allCategories;
    }

    getAllPois(): Array<Object> {
        if (this._allPois === null) {
            const pois = this.entityManager.getRepository('Poi').getAll();

            this._allPois = pois.map((poi: Object): Object => {
                if (poi.logos && poi.logos.values) {
                    for (const logo in poi.logos.values) {
                        if (poi.logos.values[logo] && poi.logos.values[logo].value && !isNaN(poi.logos.values[logo].value)) {
                            poi.logos.values[logo] = this.getFile(poi.logos.values[logo].value);
                        }
                    }
                }
                return poi;
            });
        }
        return this._allPois;
    }
}

const clientApi = new ClientAPI();
export default clientApi;
