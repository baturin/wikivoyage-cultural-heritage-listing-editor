
export class SearchBar {
    constructor(onUpdate) {
        this._onUpdate = onUpdate;

        this._initComponents();
    }

    render() {
        return this._searchBar;
    }

    _initComponents() {
        this._searchBar = $('<div style="padding: 10px; background-color: #f8f9fa; border: 1px solid #a2a9b1">');

        this._inputSearchDescription = $('<input type="text">');

        this._inputSearchAddress = $('<input type="text">');

        this._inputImage = $('<select>');
        this._inputImage.append($('<option>').attr('value', SearchConstants.PHOTO_ANY).text(''));
        this._inputImage.append($('<option>').attr('value', SearchConstants.PHOTO_NO).text('Отсутствует'));
        this._inputImage.append($('<option>').attr('value', SearchConstants.PHOTO_YES).text('Присутствует'));

        this._inputCoordinates = $('<select>');
        this._inputCoordinates.append($('<option>').attr('value', SearchConstants.COORDINATES_ANY).text(''));
        this._inputCoordinates.append($('<option>').attr('value', SearchConstants.COORDINATES_PRECISE).text('Заданы, точные'));
        this._inputCoordinates.append($('<option>').attr('value', SearchConstants.COORDINATES_NOT_PRECISE).text('Заданы, неточные'));
        this._inputCoordinates.append($('<option>').attr('value', SearchConstants.COORDINATES_EXISTS).text('Заданы, любые'));
        this._inputCoordinates.append($('<option>').attr('value', SearchConstants.COORDINATES_NO).text('Не заданы'));

        this._searchBar.append($('<div>').append($('<b>').text('Фильтры')));

        const filtersBar = $('<div>');

        filtersBar.append('Название или описание: ');
        this._searchBar.append(filtersBar);
        filtersBar.append(this._inputSearchDescription);

        filtersBar.append(' Адрес: ');
        filtersBar.append(this._inputSearchAddress);

        filtersBar.append(' Фотография: ');
        filtersBar.append(this._inputImage);

        filtersBar.append(' Координаты: ');
        filtersBar.append(this._inputCoordinates);

        this._inputSearchDescription.keyup(() => this._onUpdateSearch());
        this._inputSearchAddress.keyup(() => this._onUpdateSearch());
        this._inputImage.change(() => this._onUpdateSearch());
        this._inputCoordinates.change(() => this._onUpdateSearch());
    }

    _onUpdateSearch() {
        this._onUpdate(this._getCurrentSearchFilter());
    }

    _getCurrentSearchFilter() {
        return new SearchFilter(
            this._inputSearchDescription.val(),
            this._inputSearchAddress.val(),
            this._inputImage.val(),
            this._inputCoordinates.val()
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
    COORDINATES_NO: 'no'
}

export class SearchFilter {
    constructor(searchText, searchAddress, photo, coordinates) {
        this._searchDescription = searchText;
        this._searchAddress = searchAddress;
        this._photo = photo;
        this._coordinates = coordinates;
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
}