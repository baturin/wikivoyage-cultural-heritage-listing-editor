
let WikitextParser = require('./wikitext-parser');

class WikitextSectionEditor {
    constructor(sectionText, listingName) {
        this._sectionText = sectionText;
        this._listingName = listingName;
        this._commentReplacements = {};
        this._stripComments();
    }

    getListingData(listingIndex) {
        let listingText = WikitextParser.getListingWikitextBraces(
            this._sectionText, this._listingName, listingIndex
        );
        let listingData = WikitextParser.wikiTextToListing(listingText);
        for (let key in listingData) {
            if (!listingData.hasOwnProperty(key)) {
                continue;
            }
            listingData[key] = this._restoreComments(listingData[key]);
        }
        return listingData;
    }

    getSectionTextWithReplacedListing(listingIndex, newListingText) {
        let oldListingText = WikitextParser.getListingWikitextBraces(
            this._sectionText, this._listingName, listingIndex
        );
        let result = this._sectionText;
        result = result.replace(oldListingText, newListingText);
        result = this._restoreComments(result);
        return result;
    }

    getSectionTextWithAddedListing(newListingText) {
        let result = this._sectionText;

        let index = result.indexOf('{{footer');

        if (index > 0) {
            result = (
                result.substr(0, index) + '\n' +
                newListingText + '\n' +
                result.substr(index)
            );
        } else {
            result += '\n' + newListingText;
        }

        result = this._restoreComments(result);

        return result;
    }

    /**
     * Commented-out listings can result in the wrong listing being edited, so
     * strip out any comments and replace them with placeholders that can be
     * restored prior to saving changes.
     */
    _stripComments() {
        let comments = this._sectionText.match(/<!--[\s\S]*?-->/mig);
        if (comments !== null ) {
            for (let i = 0; i < comments.length; i++) {
                let comment = comments[i];
                let rep = '<<<COMMENT' + i + '>>>';
                this._sectionText = this._sectionText.replace(comment, rep);
                this._commentReplacements[rep] = comment;
            }
        }
    }

    /**
     * Search the text provided, and if it contains any text that was
     * previously stripped out for replacement purposes, restore it.
     */
    _restoreComments(sectionText) {
        for (let key in this._commentReplacements) {
            let val = this._commentReplacements[key];
            sectionText = sectionText.replace(key, val);
        }
        return sectionText;
    };
}

module.exports = WikitextSectionEditor;