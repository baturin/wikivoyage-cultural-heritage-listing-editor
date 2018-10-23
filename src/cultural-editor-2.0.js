
import { MediawikiApi } from "./lib/mediawiki-api";
import { WikitextSectionEditor } from './lib/wikitext-section-editor';
import { PaginationComponent } from "./lib/ui-components/pagination";
import { ListingItemComponent} from "./lib/ui-components/listing-item";
import {SearchBar, SearchConstants} from "./lib/ui-components/search-bar";

/**
 * TODO
 * 1. Integration with listing editor gadget.
 * 2. Integration with missing images gadget.
 * 3. Load commons images optimization.
 * 4. Load lists sequentially, show progress.
 * 5. Complete listing template implementation.
 * 6. Filtering: street, no coordinates, no images, type/category.
 * 7. Sort: by street, by name, by type/category.
 * 9. Object passport document.
 * 10. Advanced gallery.
 * 11. Compact/full view.
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
        }
    }

    class ListingItem {
        constructor(data, page) {
            this.data = data;
            this.page = page;
        }
    }

    class HeritageListGadget {
        constructor(rootElement) {
            this.rootElement = rootElement;
            this.state = new HeritageListGadgetState();
            this.searchBar = new SearchBar(
                (filter) => this.updateFilterListingItems(filter)
            );
            this.dataElement = $('<div>');
        }

        loadData(pages) {
            const api = new MediawikiApi();

            pages.forEach((page) => {
                api.getPageText(page).then((text) => {
                    const sectionEditor = new WikitextSectionEditor(text, 'monument');
                    let listingIndex = 0;
                    while (true) {
                        const listingData = sectionEditor.getListingData(listingIndex);

                        if (!listingData) {
                            break;
                        }

                        let listingItem = new ListingItem(listingData, page);
                        this.state.allListingItems.push(listingItem);
                        this.state.filterListingItems.push(listingItem);

                        listingIndex++;
                    }

                    this.updateCurrentListingItems();
                }).catch((reason) => {
                    window.console.error(reason);
                });
            });
        }

        updateCurrentListingItems() {
            this.state.currentListingItems = this.state.filterListingItems.slice(
                this.state.page * this.state.itemsPerPage,
                (this.state.page + 1) * this.state.itemsPerPage
            );
            this.renderData();
        }

        updateFilterListingItems(filter) {
            const searchDescription = filter.getSearchDescription().toLowerCase();
            const searchAddress = filter.getSearchAddress().toLowerCase();
            const photo = filter.getPhoto();
            const coordinates = filter.getCoordinates();

            this.state.filterListingItems = this.state.allListingItems.filter(
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
                    )
                )
            );

            this.state.page = 0;

            this.updateCurrentListingItems();
        }

        render() {
            this.rootElement.empty();

            this.rootElement.append(this.searchBar.render());
            this.rootElement.append(this.dataElement);

            this.renderData();
        }

        renderData() {
            this.dataElement.empty();

            const topPagination = this.createPagination(false);
            const bottomPagination = this.createPagination(true);

            this.dataElement.append(...topPagination.render());

            this.state.currentListingItems.forEach((listingItem) => {
                const listingComponent = new ListingItemComponent(listingItem);
                this.dataElement.append(...listingComponent.render());
            });

            this.dataElement.append(...bottomPagination.render());
        }

        createSearchBar() {
            const input = $('<input type="text">');
            const bar = $('<div>');
            input.keyup(() => {
                const filterValue = input.val();
                this.updateFilterListingItems(filterValue);
            });
            bar.append('Поиск: ');
            bar.append(input);
            return bar;
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
