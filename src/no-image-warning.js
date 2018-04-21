import CommonsApi from './lib/commons-api';
import ArrayUtils from './lib/array-utils';
import ListingEditorUtils from "./lib/listing-editor-utils";
import ListingTableHtml from './lib/listing-table-html';
import MediaWikiPage from "./lib/mediawiki-page";
import StringUtils from "./lib/string-utils";

let pageTypes = [
    {
        galleryTitle: "WLE",
        parentCategoryName: "Protected areas of Russia",
        pageNamespace: "Природные_памятники_России"
    },
    {
        galleryTitle: "WLM",
        parentCategoryName: "WLM",
        pageNamespace: "Культурное_наследие"
    }
];

pageTypes.forEach(function(pageType) {
    if (
        !ListingEditorUtils.isEditablePage() ||
        !StringUtils.contains(MediaWikiPage.getPageName(), pageType.pageNamespace)
    ) {
        return;
    }

    let listingPageElements = ListingEditorUtils.getListingPageElements();
    let listingTables = listingPageElements.getListingTables();

    let listingWithoutImageButWithCommonsCategory = [];

    listingTables.forEach(function(listingTable) {
        let listingTableElement = $(listingTable.getTableElement());
        let listingTableHtml = new ListingTableHtml(listingTableElement);

        if (listingTableHtml.hasListingPhoto(listingTableElement)) {
            return;
        }

        let commonsCategory = listingTableHtml.findCommonsCategory(pageType.parentCategoryName);
        if (!commonsCategory) {
            return;
        }
        listingWithoutImageButWithCommonsCategory.push({
            listingTableHtml: listingTableHtml,
            category: commonsCategory
        });
    });

    CommonsApi.hasCategoriesFiles(
        listingWithoutImageButWithCommonsCategory.map((item) => item.category.replace(/_/g, ' ')),
        (categoriesWithImages) => {
            listingWithoutImageButWithCommonsCategory.forEach(
                (listingItem) => {
                    if (ArrayUtils.hasElement(categoriesWithImages, listingItem.category.replace(/_'/g, ' '))) {
                        listingItem.listingTableHtml.addWarning(
                            "в галерее " + pageType.galleryTitle + " есть изображения"
                        );
                    }
                }
            );
        }
    )
});
