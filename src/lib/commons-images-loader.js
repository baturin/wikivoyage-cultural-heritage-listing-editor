import { CommonsApi } from "./commons-api";

export const CommonsImagesLoader = {
    loadImagesFromWLMCategory(knid, onSuccess) {
        if (!knid) {
            onSuccess([]);
        } else {
            CommonsApi.getCategoryImages(
                'WLM/' + knid, 'max',
                (images) => this.loadImages(images, onSuccess)
            );
        }
    },

    loadImagesFromWLECategory(knid, onSuccess) {
        if (!knid) {
            onSuccess([]);
        } else {
            CommonsApi.getCategoryImages(
                'Protected_areas_of_Russia/' + knid, 'max',
                (images) => this.loadImages(images, onSuccess)
            );
        }
    },

    loadImagesFromCommonsCategory(commonsCat, onSuccess) {
        if (!commonsCat) {
            onSuccess([]);
        } else {
            CommonsApi.getCategoryImages(
                commonsCat, 'max',
                (images) => this.loadImages(images, onSuccess)
            );
        }
    },

    loadImages(images, onSuccess) {
        CommonsApi.getImagesInfo(images, onSuccess);
    }
};
