
let ArrayUtils = require('./array-utils');

class ListingSerializer {
    constructor(listingType, listingData) {
        this._listingType = listingType;
        this._listingData = listingData;
        this._serializedListing = '';
        this._serializedParameters = [];
    }

    writeListingStart(addNewline) {
        this._serializedListing += '{{' + this._listingType;
        if (addNewline) {
            this._serializedListing += "\n";
        } else {
            this._serializedListing += ' ';
        }
    }

    writeParameterLine(parameterName, optional) {
        let parameterValue = this._listingData[parameterName];
        if (optional && (parameterValue === '' || parameterValue === undefined)) {
            return;
        }
        if (parameterValue === undefined) {
            parameterValue = '';
        }
        this._serializedListing += '|' + parameterName + "=" + parameterValue + "\n";
        this._serializedParameters.push(parameterName);
    }

    writeParametersLine(parameterNames) {
        for (let i = 0; i < parameterNames.length; i++) {
            let parameterName = parameterNames[i];
            let parameterValue = this._listingData[parameterName];
            if (parameterValue === undefined) {
                parameterValue = '';
            }
            if (i > 0) {
                this._serializedListing += " ";
            }
            this._serializedListing += "|" + parameterName + "=" + parameterValue;
            this._serializedParameters.push(parameterName);
        }
        this._serializedListing += "\n";
    }

    writeOtherNonEmptyParameters() {
        for (let parameterName in this._listingData) {
            if (!this._listingData.hasOwnProperty(parameterName)) {
                continue;
            }

            if (!ArrayUtils.hasElement(this._serializedParameters, parameterName)) {
                let parameterValue = this._listingData[parameterName];
                if (parameterValue !== '' && parameterValue !== undefined) {
                    this._serializedListing += '|' + parameterName + "=" + parameterValue + "\n"
                }
            }
        }
    }

    writeListingEnd() {
        this._serializedListing += '}}';
    }

    getSerializedListing() {
        return this._serializedListing;
    }
}

module.exports = ListingSerializer;
