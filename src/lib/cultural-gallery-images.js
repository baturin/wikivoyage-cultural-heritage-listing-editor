
export class CulturalGalleryImages {
    constructor(wlmImages, commonsImages) {
        this._wlmImages = wlmImages;
        this._commonsImages = commonsImages;
    }

    getWlmImages() {
        return this._wlmImages;
    }

    hasWlmImages() {
        return CulturalGalleryImages._hasImages(this.getWlmImages());
    }

    getCommonsImages() {
        return this._commonsImages;
    }

    hasCommonsImages() {
        return CulturalGalleryImages._hasImages(this.getCommonsImages());
    }

    static _hasImages(images) {
        return images !== undefined && images !== null && images.length > 0;
    }
}