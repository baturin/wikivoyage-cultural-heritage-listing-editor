
import MediaWikiPage from './mediawiki-page';
import ArrayUtils from './array-utils';

class ListingSection {
    constructor(headerElement, sectionIndex)
    {
        this._headerElement = headerElement;
        this._sectionIndex = sectionIndex;
    }

    getHeaderElement()
    {
        return this._headerElement;
    }

    getSectionIndex()
    {
        return this._sectionIndex;
    }
}

class ListingTable {
    constructor(tableElement, sectionIndex, listingIndex) {
        this._tableElement = tableElement;
        this._sectionIndex = sectionIndex;
        this._listingIndex = listingIndex;
    }

    getTableElement() {
        return this._tableElement;
    }

    getSectionIndex() {
        return this._sectionIndex;
    }

    getListingIndex() {
        return this._listingIndex;
    }
}

class ListingPageElements {
    constructor(sections, listingTables) {
        this._sections = sections;
        this._listingTables = listingTables;
    }

    /**
     * @returns {ListingSection[]}
     */
    getSections() {
        return this._sections;
    }

    getListingTables() {
        return this._listingTables;
    }
}

let ListingEditorUtils = {
    isEditablePage() {
        return (
            MediaWikiPage.isRegularNamespace() &&
            MediaWikiPage.isViewAction() &&
            MediaWikiPage.isLastRevision() &&
            !MediaWikiPage.isDiffMode() &&
            !MediaWikiPage.isViewSpecificRevisionMode() &&
            !MediaWikiPage.isViewSourceMode()
        );
    },

    /**
     * @returns {ListingPageElements}
     */
    getListingPageElements() {
        let pageBodyContentElement = $('#bodyContent');

        let currentSectionIndex = 0;
        let currentListingIndex = 0;

        let sections = [];
        let listingTables = [];

        function isTableOfContentsHeader(headerElement) {
            return headerElement.parents('.toc').length > 0;
        }

        // Here we add buttons to:
        // - add new listing - for each section header
        // - edit existing listing - for each existing listing
        //
        // It is required to know:
        // - section index, to which we are going to add new listing
        // - section index and listing index (within a section) for listing which we are going to edit
        // To calculate section index and listing index, we iterate over all section header and listing
        // table elements sequentially (in the same order as we have them in HTML).
        // When we meet header - we consider that new section is started and increase current section index,
        // and reset current listing index (listings are enumerated within section). All listings belong
        // to that section until we meet the next header.
        // When we meet listing table - we increase current listing index.
        pageBodyContentElement.find('h1, h2, h3, h4, h5, h6, table.monument').each(function() {
            if (ArrayUtils.inArray(this.tagName, ['H1', 'H2', 'H3', 'H4', 'H5', 'H6'])) {
                let headerElement = $(this);

                if (!isTableOfContentsHeader(headerElement)) {
                    currentSectionIndex++;
                    currentListingIndex = 0;
                    sections.push(new ListingSection(
                        headerElement, currentSectionIndex
                    ));
                }
            } else if (this.tagName === 'TABLE') {
                let listingTable = $(this);
                listingTables.push(
                    new ListingTable(listingTable, currentSectionIndex, currentListingIndex)
                );
                currentListingIndex++;
            }
        });

        return new ListingPageElements(sections, listingTables);
    }
};

module.exports = [ListingEditorUtils, ListingTable, ListingSection];