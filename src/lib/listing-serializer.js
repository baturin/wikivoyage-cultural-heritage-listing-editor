
import { ArrayUtils } from './array-utils';
import { StringUtils } from "./string-utils";

export class ListingSerializer {
    constructor(listingType, listingData) {
        this._listingType = listingType;
        this._listingData = listingData;
        this._serializedListing = '';
        this._serializedParameters = [];
    }

    writeListingStart(addNewline) {
        this._serializedListing += '{{' + this._listingType;
        if (addNewline) {
            this._serializedListing += '\n';
        } else {
            this._serializedListing += ' ';
        }
    }

    writeParameterLine(parameterName, isOptional) {
        const parameterValue = this._getParameterValue(parameterName);
        if (isOptional && parameterValue === '') {
            return;
        }
        this._serializedListing += ListingSerializer._parameterString(parameterName, parameterValue, true);
        this._serializedParameters.push(parameterName);
    }

    writeParametersLine(parameterNames, optionalParameters) {
        let isFirst = true;

        parameterNames.forEach((parameterName) => {
            const parameterValue = this._getParameterValue(parameterName);

            const isOptional = optionalParameters && ArrayUtils.inArray(parameterName, optionalParameters);
            if (isOptional && parameterValue === '') {
                return;
            }

            if (!isFirst) {
                this._serializedListing += ' ';
            }

            this._serializedListing += ListingSerializer._parameterString(parameterName, parameterValue, false);
            this._serializedParameters.push(parameterName);

            isFirst = false;
        });

        if (!isFirst) {
            this._serializedListing += '\n';
        }
    }

    writeOtherNonEmptyParameters() {
        const allParameterNames = Object.keys(this._listingData);
        const otherParameterNames = ArrayUtils.diff(allParameterNames, this._serializedParameters);
        otherParameterNames.forEach((parameterName) => {
            const parameterValue = this._getParameterValue(parameterName);
            if (parameterValue !== '') {
                this._serializedListing += ListingSerializer._parameterString(parameterName, parameterValue, true)
            }
        });
    }

    writeListingEnd() {
        this._serializedListing += '}}';
    }

    getSerializedListing() {
        return this._serializedListing;
    }

    _getParameterValue(parameterName) {
        return StringUtils.emptyToString(this._listingData[parameterName]);
    }

    static _parameterString(parameterName, parameterValue, addNewline) {
        let result = '|' + parameterName + '= ' + parameterValue;
        if (addNewline) {
            result += '\n';
        }
        return result;
    }
}
