
export class ChangesDescription {
    constructor(description, isMinor) {
        this._description = description;
        this._isMinor = isMinor;
    }

    getDescription() {
        return this._description;
    }

    getIsMinor() {
        return this._isMinor;
    }
}