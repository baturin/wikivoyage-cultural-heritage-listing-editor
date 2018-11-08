
import { ListingItemFormComposer } from "./listing-item-form-composer";
import { culturalMonumentTypes } from "../cultural-monument-types";
import { culturalMonumentStyles } from "../cultural-monument-styles";
import { culturalMonumentProtections } from "../cultural-monument-protections";

export class SearchBar {
    constructor(onUpdate, onUpdateItemsOnPage, onUpdateView, onUpdateSort) {
        this._onUpdate = onUpdate;
        this._onUpdateItemsOnPage = onUpdateItemsOnPage;
        this._onUpdateView = onUpdateView;
        this._onUpdateSort = onUpdateSort;

        this._initComponents();
    }

    render() {
        return this._searchBar;
    }

    _initComponents() {
        this._searchBar = $('<div style="padding: 10px; background-color: #f8f9fa; border: 1px solid #a2a9b1;">');

        this._inputSort = ListingItemFormComposer.createSelector([
            {
                title: 'По-умолчанию',
                value: SortConstants.DEFAULT,
            },
            {
                title: 'По названию',
                value: SortConstants.NAME,
            },
            {
                title: 'По адресу',
                value: SortConstants.ADDRESS,
            },
            {
                title: 'По типу',
                value: SortConstants.TYPE
            }
        ]);

        this._inputItemsOnPage = ListingItemFormComposer.createSelector([
            {
                title: '10',
                value: 10
            },
            {
                title: '50',
                value: 50
            },
            {
                title: '100',
                value: 100
            },
            {
                title: '250',
                value: 250
            },
            {
                title: '500',
                value: 500
            },
            {
                title: 'все',
                value: 0
            }
        ]).css('width', '50px');


        this._inputView = ListingItemFormComposer.createSelector([
            {
                title: 'полный',
                value: SearchConstants.VIEW_FULL
            },
            {
                title: 'компактный',
                value: SearchConstants.VIEW_COMPACT
            }
        ]).css('width', '120px');

        this._inputSearchDescription = ListingItemFormComposer.createTextInput();

        this._inputSearchAddress = ListingItemFormComposer.createTextInput();

        this._inputImage = ListingItemFormComposer.createSelector([
            {
                title: '',
                value: SearchConstants.PHOTO_ANY
            },
            {
                title: 'Отсутствует',
                value: SearchConstants.PHOTO_NO
            },
            {
                title: 'Присутствует',
                value: SearchConstants.PHOTO_YES
            }
        ]);

        this._inputCoordinates = ListingItemFormComposer.createSelector([
            {
                title: '',
                value: SearchConstants.COORDINATES_ANY
            },
            {
                title: 'Заданы, точные',
                value: SearchConstants.COORDINATES_PRECISE
            },
            {
                title: 'Заданы, неточные',
                value: SearchConstants.COORDINATES_NOT_PRECISE
            },
            {
                title: 'Заданы, любые',
                value: SearchConstants.COORDINATES_EXISTS
            },
            {
                title: 'Не заданы',
                value: SearchConstants.COORDINATES_NO
            }
        ]);

        let filterStyleVals = culturalMonumentStyles.map(
            (culturalMonumentStyle) => ({
                title: culturalMonumentStyle.getTitle(),
                value: culturalMonumentStyle.getValue()
            })
        );
        this._inputStyle = ListingItemFormComposer.createSelector(
            filterStyleVals
        );

        const filterTypeVals = culturalMonumentTypes.map(
            (culturalMonumentType) => ({
                title: culturalMonumentType.getTitle(),
                value: culturalMonumentType.getValue()
            })
        );
        this._inputType = ListingItemFormComposer.createSelector(
            filterTypeVals
        );

        const filterProtectionVals = culturalMonumentProtections.map(
            (culturalMonumentProtection) => ({
                title: culturalMonumentProtection.getTitle(),
                value: culturalMonumentProtection.getValue()
            })
        );
        this._inputProtection = ListingItemFormComposer.createSelector(filterProtectionVals);

        this._hideLink = $('<a href="javascript:;" style="display: none;">').text('[Скрыть]');
        this._showLink = $('<a href="javascript:;">').text('[Показать]');

        this._searchBar
            .append(
                $('<div style="display: flex; justify-content: space-between;">')
                .append(
                    $('<div>')
                        .append(
                            $('<b>').text('Фильтры')
                        )
                        .append('&nbsp;')
                        .append(this._hideLink)
                        .append(this._showLink)
                )
                .append(
                    $('<div style="display: flex;">')
                        .append($('<div>')
                            .append(
                                $('<b>').text('Упорядочить: ')
                            )
                            .append(this._inputSort)
                        )
                        .append($('<div style="padding-left: 10px;">')
                            .append(
                                $('<b>').text('Вид: ')
                            )
                            .append(this._inputView)
                        )
                        .append($('<div style="padding-left: 10px;">')
                            .append(
                                $('<b>').text('Элементов на странице: ')
                            )
                            .append(this._inputItemsOnPage)
                        )
                    )
            );

        this._filtersBar = $('<div style="display: none;">');

        this._hideLink.click(() => {
            this._hideLink.hide();
            this._showLink.show();
            this._filtersBar.hide();
        });

        this._showLink.click(() => {
            this._showLink.hide();
            this._hideLink.show();
            this._filtersBar.show();
        });

        this._searchBar.append(this._filtersBar);

        this._filtersBar.append(
            $('<div style="padding: 5px;">')
                .append('Название или описание: ')
                .append(this._inputSearchDescription)
        );

        this._filtersBar.append(
            $('<div style="padding: 5px;">')
                .append('Адрес: ')
                .append(this._inputSearchAddress)
        );

        this._filtersBar.append(
            $('<div style="padding: 5px;">')
                .append('Фотография: ')
                .append(this._inputImage)
        );

        this._filtersBar.append(
            $('<div style="padding: 5px;">')
                .append('Координаты: ')
                .append(this._inputCoordinates)
        );

        this._filtersBar.append(
            $('<div style="padding: 5px;">')
                .append('Стиль: ')
                .append(this._inputStyle)
        );

        this._filtersBar.append(
            $('<div style="padding: 5px;">')
                .append('Тип: ')
                .append(this._inputType)
        );

        this._filtersBar.append(
            $('<div style="padding: 5px;">')
                .append('Категория охраны: ')
                .append(this._inputProtection)
        );

        this._inputSearchDescription.keyup(() => this._onUpdateSearch());
        this._inputSearchAddress.keyup(() => this._onUpdateSearch());
        this._inputImage.change(() => this._onUpdateSearch());
        this._inputCoordinates.change(() => this._onUpdateSearch());
        this._inputType.change(() => this._onUpdateSearch());
        this._inputStyle.change(() => this._onUpdateSearch());
        this._inputProtection.change(() => this._onUpdateSearch());
        this._inputItemsOnPage.change(
            () => this._onUpdateItemsOnPage(parseInt(this._inputItemsOnPage.val()))
        );
        this._inputView.change(
            () => this._onUpdateView(this._inputView.val())
        );
        this._inputSort.change(
            () => this._onUpdateSort(this._inputSort.val())
        );
    }

    _onUpdateSearch() {
        this._onUpdate(this._getCurrentSearchFilter());
    }

    _getCurrentSearchFilter() {
        return new SearchFilter(
            this._inputSearchDescription.val(),
            this._inputSearchAddress.val(),
            this._inputImage.val(),
            this._inputCoordinates.val(),
            this._inputType.val(),
            this._inputStyle.val(),
            this._inputProtection.val()
        );
    }
}

export const SearchConstants = {
    PHOTO_ANY: '',
    PHOTO_YES: 'yes',
    PHOTO_NO: 'no',

    COORDINATES_ANY: '',
    COORDINATES_EXISTS: 'exists',
    COORDINATES_PRECISE: 'precise',
    COORDINATES_NOT_PRECISE: 'not-precise',
    COORDINATES_NO: 'no',

    VIEW_FULL: 'full',
    VIEW_COMPACT: 'compact',
};

export const SortConstants = {
    DEFAULT: 'default',
    NAME: 'name',
    ADDRESS: 'address',
    TYPE: 'type'
};

export class SearchFilter {
    constructor(searchText, searchAddress, photo, coordinates, type, style, protection) {
        this._searchDescription = searchText;
        this._searchAddress = searchAddress;
        this._photo = photo;
        this._coordinates = coordinates;
        this._type = type;
        this._style = style;
        this._protection = protection;
    }

    getSearchDescription() {
        return this._searchDescription;
    }

    getSearchAddress() {
        return this._searchAddress;
    }

    getPhoto() {
        return this._photo;
    }

    getCoordinates() {
        return this._coordinates;
    }

    getType() {
        return this._type;
    }

    getStyle() {
        return this._style;
    }

    getProtection() {
        return this._protection;
    }
}