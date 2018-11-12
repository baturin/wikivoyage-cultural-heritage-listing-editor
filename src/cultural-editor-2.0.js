
import { MediawikiApi } from "./lib/mediawiki-api";
import { WikitextSectionEditor } from './lib/wikitext-section-editor';
import { PaginationComponent } from "./lib/ui-components/pagination";
import { ListingItemComponent} from "./lib/ui-components/listing-item";
import { SearchBar, SearchConstants, SearchFilter, SortConstants } from "./lib/ui-components/search-bar";
import { AsyncUtils } from "./lib/async-utils";
import { WikivoyageApi } from "./lib/wikivoyage-api";
import { CulturalEditorListingSerializer} from "./lib/cultural-editor-serializer";
import { MediaWikiPageWikitext } from "./lib/mediawiki-page-wikitext";
import { downloadContent } from "./lib/download-content";
import { ExportPanel } from "./lib/ui-components/export-panel";
import { ArrayUtils } from "./lib/array-utils";
import {CommonsApi} from "./lib/commons-api";
import {StringUtils} from "./lib/string-utils";
import {CommonsImagesLoader} from "./lib/commons-images-loader";
import {CulturalGalleryImages} from "./lib/cultural-gallery-images";

/**
 * TODO
 *
 * 1. Integration with missing images gadget.
 * 2. Show loading/saving progress.
 * 3. Complete listing template implementation.
 * 4. Object passport document.
 * 5. Advanced gallery.
 * 6. Better compact view.
 * 7. Captcha handling.
 * 8. XSS.
 * 9. Edit then go to another page.
 * 10. Save all.
 * 11. Leave warning.
 * 12. Complete GPX, JSON, CSV export.
 * 13. Map.
 */

$(document).ready(() => {
    const reportFatalError = (errorText, gadgetElement = null) => {
        window.console.error(errorText);
        if (gadgetElement) {
            const errorElement = $('<div style="color: red;">').text(errorText);
            gadgetElement.append(errorElement);
        }
    };

    const initGadget = (gadgetElement) => {
        const settingsElement = gadgetElement.children('.gadget-heritage-list-settings');
        if (settingsElement.length === 0) {
            reportFatalError(
                "Heritage gadget error: settings are not specified.",
                gadgetElement
            );
            return;
        }

        if (settingsElement.length > 1) {
            reportFatalError(
                "Heritage gadget error: multiple settings elements are specified.",
                gadgetElement
            );
            return;
        }

        let gadgetSettings = {};
        try {
            gadgetSettings = JSON.parse(settingsElement.text());
        } catch (e) {
            reportFatalError(
                "Heritage gadget error: settings element contains invalid JSON.",
                gadgetElement
            );
            return;
        }

        const gadgetContentElement = $('<div class="gadget-heritage-list-content">');
        gadgetElement.append(gadgetContentElement);
        showGadget(gadgetContentElement, gadgetSettings);

        const fallbackElements = gadgetElement.find('.gadget-heritage-list-disabled');
        fallbackElements.hide();
    };

    class HeritageListGadgetState {
        constructor() {
            this.allListingItems = [];
            this.currentListingItems = [];
            this.filterListingItems = [];
            this.page = 0;
            this.itemsPerPage = 10;
            this.view = SearchConstants.VIEW_FULL;

            this.sortBy = SortConstants.DEFAULT;
            this.filter = new SearchFilter('', '', SearchConstants.PHOTO_ANY, SearchConstants.COORDINATES_ANY, '', '', '');
        }
    }

    class ListingItem {
        constructor(data, page, index) {
            this.data = data;
            this.page = page;
            this.index = index;
        }
    }

    class HeritageListGadget {
        constructor(rootElement) {
            this.rootElement = rootElement;
            this.state = new HeritageListGadgetState();
            this.searchBar = new SearchBar(
                (filter) => this.updateFilterListingItems(filter),
                (itemsOnPage) => this.updateItemsOnPage(itemsOnPage),
                (view) => this.updateView(view),
                (sortBy) => this.updateSort(sortBy)
            );
            this.dataElement = $('<div>');
        }

        loadData(pages) {
            const api = new MediawikiApi();

            const loadPageListings = (page, onSuccess) => {
                api.getPageText(
                    page,
                    (text) => {
                        const listings = [];

                        const sectionEditor = new WikitextSectionEditor(text, 'monument');
                        let listingIndex = 0;
                        while (true) {
                            const listingData = sectionEditor.getListingData(listingIndex);

                            if (!listingData) {
                                break;
                            }

                            let listingItem = new ListingItem(listingData, page, listingIndex);
                            listings.push(listingItem);

                            listingIndex++;
                        }

                        onSuccess(listings);
                    },
                    (reason) => {
                        window.console.error(reason);
                        onSuccess([]);
                    }
                );
            };

            AsyncUtils.runSequence(
                pages.map(
                    (page) => (
                        (onSuccess) => loadPageListings(page, onSuccess)
                    )
                ),
                (pagesListingItems) => {
                    const allListingItems = pagesListingItems.reduce(
                        (pageListingItems, acc) => pageListingItems.concat(acc),
                        []
                    );

                    this.state.allListingItems = allListingItems;
                    this.state.filterListingItems = allListingItems;
                    this.updateCurrentListingItems();
                }
            );
        }

        updateCurrentListingItems() {
            if (this.state.itemsPerPage !== 0) {
                this.state.currentListingItems = this.state.filterListingItems.slice(
                    this.state.page * this.state.itemsPerPage,
                    (this.state.page + 1) * this.state.itemsPerPage
                );
            } else {
                this.state.currentListingItems = this.state.filterListingItems;
            }
            this.renderData();
        }

        updateView(view) {
            this.state.view = view;
            this.updateCurrentListingItems();
        }

        updateItemsOnPage(itemsOnPage) {
            this.state.itemsPerPage = itemsOnPage;
            this.state.page = 0;
            this.updateCurrentListingItems();
        }

        updateSort(sortBy) {
            this.state.sortBy = sortBy;

            this.updateFilteredSortedListingItems();
            this.updateCurrentListingItems();
        }


        updateFilterListingItems(filter) {
            this.state.filter = filter;

            this.state.page = 0;

            this.updateFilteredSortedListingItems();
            this.updateCurrentListingItems();
        }

        updateFilteredSortedListingItems() {
            this.state.filterListingItems =
                this.applySort(
                    this.applyFilter(
                        this.state.allListingItems,
                        this.state.filter
                    ),
                    this.state.sortBy
                );
        }

        applySort(items, sortBy) {
            const sortedItems = items.concat();

            if (ArrayUtils.inArray(sortBy, [SortConstants.NAME, SortConstants.ADDRESS, SortConstants.TYPE])) {
                sortedItems.sort(
                    (item1, item2) => {
                        if (sortBy === SortConstants.NAME) {
                            return item1.data.name.localeCompare(item2.data.name);
                        } else if (sortBy === SortConstants.ADDRESS) {
                            return item1.data.address.localeCompare(item2.data.address);
                        } else if (sortBy === SortConstants.TYPE) {
                            return item1.data.type.localeCompare(item2.data.type);
                        }
                    }
                );
            }

            return sortedItems;
        }

        applyFilter(items, filter) {
            const searchDescription = filter.getSearchDescription().toLowerCase();
            const searchAddress = filter.getSearchAddress().toLowerCase();
            const photo = filter.getPhoto();
            const coordinates = filter.getCoordinates();
            const type = filter.getType();
            const style = filter.getStyle();
            const protection = filter.getProtection();

            return items.filter(
                (item) => (
                    (
                        searchDescription === '' ||
                        item.data.name.toLowerCase().indexOf(searchDescription) !== -1
                    ) &&
                    (
                        searchAddress === '' || item.data.address.toLowerCase().indexOf(searchAddress) !== -1
                    ) &&
                    (
                        (
                            photo === SearchConstants.PHOTO_ANY
                        ) ||
                        (
                            photo === SearchConstants.PHOTO_YES &&
                            item.data.image
                        ) ||
                        (
                            photo === SearchConstants.PHOTO_NO &&
                            !item.data.image
                        )
                    ) &&
                    (
                        (
                            coordinates === SearchConstants.COORDINATES_ANY
                        ) ||
                        (
                            coordinates === SearchConstants.COORDINATES_PRECISE &&
                            (item.data.lat && item.data.long && item.data.precise === 'yes')
                        ) ||
                        (
                            coordinates === SearchConstants.COORDINATES_NOT_PRECISE &&
                            (item.data.lat && item.data.long && item.data.precise !== 'yes')
                        ) ||
                        (
                            coordinates === SearchConstants.COORDINATES_EXISTS &&
                            (item.data.lat && item.data.long)
                        ) ||
                        (
                            coordinates === SearchConstants.COORDINATES_NO &&
                            (!item.data.lat || !item.data.long)
                        )
                    ) && (
                        !type || (item.data.type === type)
                    ) && (
                        !style || (item.data.style === style)
                    ) && (
                        !protection || (item.data.protection === protection)
                    )
                )
            );
        }

        render() {
            this.rootElement.empty();

            this.rootElement.append(this.searchBar.render());
            this.rootElement.append(this.dataElement);

            this.renderData();
        }

        exportJson() {
            const items = this.state.filterListingItems.map(item => item.data);
            downloadContent('listings.json', JSON.stringify(items, null, 2));
        }

        exportGpx() {
            const items = this.state.filterListingItems.map(item => item.data);

            const header = (
                '<?xml version="1.0" encoding="UTF-8" standalone="yes" ?>\n' +
                '<gpx version="1.1" creator="Wikivoyage"\n' +
                    '  xmlns="http://www.topografix.com/GPX/1/1"\n' +
                    '  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"\n' +
                    '  xsi:schemaLocation="http://www.topografix.com/GPX/1/1 '+
                        'http://www.topografix.com/GPX/1/1/gpx.xsd">\n'
            );
            const footer = (
                '\n</gpx>'
            );
            // TODO proper escaping
            const data = items.filter(item => item.lat && item.long).map(
                (item) => {
                    return (
                        '  <wpt lat="' + item.lat + '" lon="' + item.long + '">\n' +
                        '    <name>' + item.name + '</name>\n' +
                        '    <desc>' + item.address + '</desc>\n' +
                        '  </wpt>'
                    );
                }
            ).join("\n");

            downloadContent('listings.gpx', header + data + footer);
        }

        onSaveListing(page, listingIndex, data, changesDescription, onSuccess) {
            const newListingText = CulturalEditorListingSerializer.serializeListingData(data);

            const api = new MediawikiApi();
            api.getPageText(
                page,
                (text) => {
                    const sectionEditor = new WikitextSectionEditor(text, 'monument');
                    const newPageText = sectionEditor.getSectionTextWithReplacedListing(
                        listingIndex, newListingText
                    );

                    let changesDescriptionText = 'Обновлен объект "' + data.name + '"';
                    if (changesDescription.getDescription()) {
                        changesDescriptionText += ' - ' + changesDescription.getDescription();
                    }

                    MediaWikiPageWikitext.saveSectionWikitext(
                        null, newPageText,
                        changesDescriptionText, changesDescription.getIsMinor(),
                        null, null,
                        () => {
                            onSuccess();
                        },
                        () => {
                            alert('Failed to save listing');
                        },
                        () => {
                            alert('Captcha request');
                        },
                        page
                    );
                }
            );
        }

        onLoadGallery(listingItem, onSuccess) {
            CommonsImagesLoader.loadImagesFromWLMCategory(
                listingItem.data.knid,
                (wlmImages) => {
                    CommonsImagesLoader.loadImagesFromCommonsCategory(
                        listingItem.data.commonscat,
                        (commonsImages) => {
                            listingItem.galleryImages = new CulturalGalleryImages(
                                wlmImages, commonsImages
                            );
                            onSuccess();
                        }
                    )
                }
            );
        }

        renderData() {
            this.dataElement.empty();

            const exportPanel = new ExportPanel(
                () => this.exportJson(),
                () => this.exportGpx()
            );
            this.dataElement.append(exportPanel.render());

            const topPagination = this.createPagination(false);
            const bottomPagination = this.createPagination(true);

            this.dataElement.append(...topPagination.render());

            const listingComponents = [];

            this.state.currentListingItems.forEach((listingItem) => {
                const listingComponent = new ListingItemComponent(
                    listingItem,
                    this.state.view,
                    this.onSaveListing,
                    this.onLoadGallery,
                );
                this.dataElement.append(...listingComponent.render());
                listingComponents.push(listingComponent);
            });


            AsyncUtils.runSequence(
                listingComponents.map(
                    (listingComponent) => (onSuccess) => {
                        if (listingComponent.listingItem.data.image && !listingComponent.listingItem.imageThumb) {
                            WikivoyageApi.getImageInfo(
                                'File:' + listingComponent.listingItem.data.image,
                                (result) => {
                                    listingComponent.listingItem.imageThumb = result.thumb;
                                    listingComponent.onImageThumbUpdated();
                                    onSuccess();
                                },
                                () => {
                                    onSuccess();
                                }
                            )
                        } else {
                            onSuccess();
                        }
                    }
                )
            );

            let categories = [];
            categories = categories.concat(
                this.state.currentListingItems.map((item) => 'Category:WLM/' + item.data.knid)
            );
            categories = categories.concat(
                this.state.currentListingItems
                    .map((item) => item.data.commonscat)
                    .filter((commonscatValue) => StringUtils.emptyToString(commonscatValue) !== '')
                    .map((commonscatValue) => 'Category:' + commonscatValue)
            );

            CommonsApi.countCategoriesFiles(
                categories,
                (categoriesWithImages) => {
                    let filesCountByCategory = {};
                    categoriesWithImages.forEach((item) => { filesCountByCategory[item.category] = item.files });

                    const getCategoryFilesCount = (category) => {
                        if (StringUtils.emptyToString(category) === '') {
                            return 0;
                        }

                        const filesCount = filesCountByCategory[category];
                        return filesCount !== undefined ? filesCount : 0;
                    };

                    listingComponents.forEach((listingComponent) => {
                        listingComponent.listingItem.imagesCount = (
                            getCategoryFilesCount(
                                'Category:WLM/' + listingComponent.listingItem.data.knid
                            ) +
                            getCategoryFilesCount(
                                'Category:' +
                                StringUtils.emptyToString(listingComponent.listingItem.data.commonscat).replace(/_'/g, ' '))
                        );
                        listingComponent.onUpdateImageCount();
                    });
                }
            );

            this.dataElement.append(...bottomPagination.render());
        }

        createPagination(scrollToTop) {
            return new PaginationComponent(
                this.state.filterListingItems.length,
                this.state.itemsPerPage,
                this.state.page,
                (pageNumber) => {
                    this.state.page = pageNumber;
                    this.updateCurrentListingItems();
                    this.renderData();
                    if (scrollToTop) {
                        $("html, body").animate({scrollTop: 0}, "slow");
                    }
                }
            );
        }
    }

    const showGadget = (gadgetContentElement, gadgetSettings) => {
        const gadget = new HeritageListGadget(gadgetContentElement);
        gadget.render();
        gadget.loadData(gadgetSettings.pages);
    };

   $('.gadget-heritage-list').each((index, gadgetElement) => initGadget($(gadgetElement)));
});
