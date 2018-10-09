import CommonsApi from './lib/commons-api';
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

    let listingCommonsCategory = [];

    listingTables.forEach(function(listingTable) {
        let listingTableElement = $(listingTable.getTableElement());
        let listingTableHtml = new ListingTableHtml(listingTableElement);

        let commonsCategory = listingTableHtml.findCommonsCategory(pageType.parentCategoryName);
        if (!commonsCategory) {
            return;
        }
        listingCommonsCategory.push({
            listingTableHtml: listingTableHtml,
            category: commonsCategory
        });
    });

    CommonsApi.countCategoriesFiles(
        listingCommonsCategory.map((item) => item.category.replace(/_/g, ' ')),
        (categoriesWithImages) => {
            let filesCountByCategory = {};
            categoriesWithImages.forEach((item) => { filesCountByCategory[item.category] = item.files });

            listingCommonsCategory.forEach(
                (listingItem) => {
                    const filesCount = filesCountByCategory[listingItem.category.replace(/_'/g, ' ')];
                    if (filesCount !== undefined) {
                        listingItem.listingTableHtml.addGalleryFilesCount(filesCount);
                    }
                }
            );
        }
    )
});
