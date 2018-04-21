
class ListingTableHtml {
    constructor(listingTableElement) {
        this._listingTableElement = listingTableElement;
    }

    hasListingPhoto() {
        let hasPhoto = true;

        this._listingTableElement.find('a').each(function() {
            let aElement = $(this);
            if (aElement.text() === 'Нет фото' || aElement.attr('title') === 'Нет фото') {
                hasPhoto = false;
                return false;
            }
        });

        return hasPhoto;
    }

    addWarning(warningText) {
        let nameElement = this._listingTableElement.find('span.monument-name').first();
        if (!nameElement) {
            return;
        }
        let warningElement = $('<span>', {html: '&nbsp;[' + warningText + ']', style: 'color: red;'});
        warningElement.insertAfter(nameElement);
    }

    findCommonsCategory(parentCategory) {
        let commonsCategory = null;

        this._listingTableElement.find('a.extiw').each(function() {
            let linkElem = $(this);
            let href = linkElem.attr('href');
            let parentCategoryHtmlName = parentCategory.replace(/ /g, '_');
            if (!href) {
                return;
            }

            if (href.indexOf('https://commons.wikimedia.org/wiki/Category:' + parentCategoryHtmlName + '/' === 0)) {
                commonsCategory = href.replace(/https:\/\/commons\.wikimedia\.org\/wiki\//, '');
                return false;
            }
        });

        return commonsCategory.replace(/_/g, ' ');
    }
}

module.exports = ListingTableHtml;