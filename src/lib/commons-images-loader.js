let CommonsApi = require('./commons-api');

let CommonsImagesLoader = {
    loadImagesFromWLMCategory: function(knid, onSuccess) {
        if (!knid) {
            onSuccess([]);
        } else {
            CommonsApi.getCategoryImages(
                'WLM/' + knid, 'max',
                (images) => this.loadImages(images, 'wlm', onSuccess)
            );
        }
    },

    loadImagesFromWLECategory: function(knid, onSuccess) {
        if (!knid) {
            onSuccess([]);
        } else {
            CommonsApi.getCategoryImages(
                'Protected_areas_of_Russia/' + knid, 'max',
                (images) => this.loadImages(images, 'wlm', onSuccess)
            );
        }
    },

    loadImagesFromCommonsCategory: function(commonsCat, onSuccess) {
        if (!commonsCat) {
            onSuccess([]);
        } else {
            CommonsApi.getCategoryImages(
                commonsCat, 'max',
                (images) => this.loadImages(images, 'commons', onSuccess)
            );
        }
    },

    loadImages: function (images, categoryType, onSuccess) {
        CommonsApi.getImagesInfo(images, onSuccess);
    }
};

module.exports = CommonsImagesLoader;
