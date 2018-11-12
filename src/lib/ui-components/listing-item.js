import { culturalMonumentTypes } from "../cultural-monument-types";
import { culturalMonumentStyles } from "../cultural-monument-styles";
import { culturalMonumentProtections } from "../cultural-monument-protections";
import { regions } from "../regions";
import { ValidationUtils } from "../validation-utils";
import { ListingItemIcons } from "./listing-item-icons";
import { ListingItemFormComposer } from "./listing-item-form-composer";
import { SearchConstants } from "./search-bar";
import { ChangesDescription } from "../changes-description";
import { StringUtils } from "../string-utils";
import { ArrayUtils } from "../array-utils";

export class ListingItemComponent {
    constructor(listingItem, view, onSaveListing, onLoadGallery) {
        this.view = view;
        this.listingItem = listingItem;
        this.listingItemContainer = $('<div>');
        this.onSaveListing = onSaveListing;
        this.onLoadGallery = onLoadGallery;
        this._mode = MODES.VIEW;
    }

    render() {
        this.listingItemContainer.append(this.renderView());

        return [
            this.listingItemContainer,
            $('<hr/>')
        ];
    }

    renderView() {
        if (this.view === SearchConstants.VIEW_COMPACT) {
            return this.renderViewCompact();
        } else {
            return this.renderViewFull();
        }
    }

    renderViewFull() {
        const listingData = this.listingItem.data;

        this.imageCellComponent = new ImageCellComponent(
            listingData,
            this.listingItem.imageThumb,
            this.listingItem.imagesCount,
            () => this.onToggleGallery()
        );
        const imageCell = this.imageCellComponent.render();

        this.dataCell = $('<td style="padding-left:10px;" valign="middle">');
        this.renderDataCellView();

        const uploadCellComponent = new UploadCellComponent(listingData);
        const uploadCell = uploadCellComponent.render();

        const listingRow = $('<tr valign="top">');
        if (listingData.status === 'destroyed') {
            listingRow.attr('style', 'color:#808080;')
        }
        listingRow.append(imageCell);
        listingRow.append(this.dataCell);
        listingRow.append(uploadCell);

        this.galleryRowComponent = new GalleryRowComponent((image) => this.onSelectImage(image));
        const galleryRow = this.galleryRowComponent.render();
        this.galleryRowComponent.updateMode(this._mode);

        const listingTable = $('<table class="monument" border="0" style="font-size:97%; width:100%;">');
        listingTable.append(listingRow);
        listingTable.append(galleryRow);

        return listingTable;
    }

    renderDataCellView() {
        this._mode = MODES.VIEW;
        this.updateMode();

        const listingData = this.listingItem.data;
        this.dataCell.empty();
        const viewComponent = new ViewComponent(
            this.dataCell,
            listingData,
            () => this.renderDataCellEdit()
        );
        viewComponent.render();
    }

    renderDataCellEdit() {
        this._mode = MODES.EDIT;
        this.updateMode();

        const listingData = this.listingItem.data;
        this.dataCell.empty();
        this._editComponent = new EditorComponent(
            this.dataCell,
            listingData,
            () => this.onEditDiscard(),
            (values, changes) => this.onEditSave(values, changes)
        );
        this._editComponent.render();
    }

    updateMode() {
        if (this.galleryRowComponent) {
            this.galleryRowComponent.onModeUpdate(this._mode);
        }
    }

    onImageThumbUpdated() {
        this.imageCellComponent.onImageThumbUpdated(this.listingItem.imageThumb);
    }

    onUpdateImageCount() {
        this.imageCellComponent.onUpdateImageCount(this.listingItem.imagesCount);
    }


    onEditDiscard() {
        this.renderDataCellView();
    }

    onEditSave(values, changesDescription) {
        const onSaveSuccessful = () => {
            this.listingItem.data = values;
            this.renderDataCellView();
        };

        if (this.onSaveListing) {
            this.onSaveListing(
                this.listingItem.page, this.listingItem.index,
                values, changesDescription,
                onSaveSuccessful
            );
        } else {
            onSaveSuccessful();
        }
    }

    onToggleGallery() {
        if (!this.listingItem.galleryImages) {
            this.onLoadGallery(this.listingItem, () => {
                this.onGalleryUpdated();
            });
        }

        this.galleryRowComponent.toggle();
    }

    onGalleryUpdated() {
        this.galleryRowComponent.setGalleryImages(this.listingItem.galleryImages);
    }

    onSelectImage(image) {
        if (this._editComponent) {
            this._editComponent.setImage(image);
        }
    }

    renderViewCompact() {
        const listingData = this.listingItem.data;
        return $('<div>')
            .append($('<b>').text(listingData.name))
            .append($('<br/>'))
            .append(listingData.address)
    }
}

class ImageCellComponent {
    constructor(listingData, imageThumb, galleryImagesCount, onToggleGallery) {
        this._listingData = listingData;
        this._imageThumb = imageThumb;
        this._galleryImagesCount = galleryImagesCount;
        this._onToggleGallery = onToggleGallery;
    }

    render() {
        const imageCell = $('<td width="160px;">');
        this.image = this.renderImage();
        imageCell.append(this.image);

        this.galleryLink = $('<a style="display: none;">');
        this.galleryLink.click(() => this._onToggleGallery());

        imageCell.append(
            $('<div style="text-align: center;">').append(
                this.galleryLink
            )
        );
        return imageCell;
    }

    onImageThumbUpdated(imageThumb) {
        this._imageThumb = imageThumb;
        this.renderImageThumb();
    }

    onUpdateImageCount(galleryImagesCount) {
        this._galleryImagesCount = galleryImagesCount;

        if (!this.galleryLink) {
            return;
        }

        if (this._galleryImagesCount > 0) {
            this.galleryLink.show();
            this.galleryLink.text('смотреть фото (' + this._galleryImagesCount + ')');
        } else {
            this.galleryLink.hide();
        }
    }

    renderImageThumb() {
        if (this.image && this._listingData.image && this._imageThumb) {
            this.image.attr('src', this._imageThumb);
        }
    }

    renderImage() {
        const image = $('<img>');

        image.attr(
            'src',
            'https://upload.wikimedia.org/' +
            'wikipedia/commons/thumb/c/ca/Village_without_photo.svg/150px-Village_without_photo.svg.png'
        );
        if (this._listingData.image) {
            image.attr('alt', this._listingData.name);
        } else {
            image.attr('alt', 'Нет фото');
            image.attr('class', 'thumbborder');
        }

        this.renderImageThumb();

        return image;
    }
}

class UploadCellComponent {
    constructor(listingData) {
        this._listingData = listingData;
    }

    render() {
        return (
            $('<td>')
                .attr(
                    'style',
                    (
                        'width:10%; ' +
                        'text-align: center; ' +
                        'vertical-align: middle; ' +
                        'font-size: 120%; ' +
                        'background-color: #FFFACD'
                    )
                )
                .append(
                    $('<a>')
                        .attr('href', this.composeUploadUrl())
                        .attr('class', 'external text')
                        .text('Загрузить фото')
                )
        );
    }

    composeUploadUrl() {
        const params = {
            title: 'Special:UploadWizard',
            campaign: this._listingData.campaign,
            id: this._listingData.knid,
            id2: this._listingData.uid,
            // TODO full description
            description: this._listingData.description,
            categories: this._listingData.commonscat,
            userlang: 'ru'
        };
        // TODO check how URL encoding works with spaces
        return 'http://commons.wikimedia.org/w/index.php?' + $.param(params);
    }
}

class ViewComponent {
    constructor(container, listingData, onEdit) {
        this._container = container;
        this._listingData = listingData;
        this._onEdit = onEdit;
    }

    render() {
        const isMainComplexElement = (
            this._listingData.complex && this._listingData.complex === this._listingData.knid
        );

        if (this._listingData.complex) {
            if (isMainComplexElement) {
                // main complex element
                this._container.css({'background-color': '#BAFFC1'});
            } else {
                this._container.css({'background-color': '#E1FFE4'});
            }
        } else {
            this._container.css({'background-color': '#F8F8F8'});
        }

        if (this._listingData.type === 'architecture') {
            this._container.append(ListingItemIcons.MonumentType.createArchitectureIcon());
        } else if (this._listingData.type === 'history') {
            this._container.append(ListingItemIcons.MonumentType.createHistoryIcon());
        } else if (this._listingData.type === 'archeology') {
            this._container.append(ListingItemIcons.MonumentType.createArcheologyIcon());
        } else if (this._listingData.type === 'monument') {
            this._container.append(ListingItemIcons.MonumentType.createMonumentIcon());
        }
        this._container.append('&nbsp;');

        if (isMainComplexElement) {
            this._container.append(ListingItemIcons.createComplexMainElementIcon());
            this._container.append('&nbsp;');
        }

        const itemNameElement = $('<span class="monument-name" style="font-size:115%; font-weight:bold">');
        itemNameElement.text(this._listingData.name);
        this._container.append(itemNameElement);

        const editButton = this.renderEditButton();
        // TODO handle only click on image
        editButton.click(() => {
            this._onEdit();
        });

        this._container.append(editButton);

        this._container.append($('<br/>'));

        this._container.append($('<i>').text('Адрес: '));
        if (this._listingData.municipality) {
            this._container.append($('<i>').text(this._listingData.municipality));
        }
        if (this._listingData.munid) {
            this._container.append('&nbsp;');
            // TODO urlencode
            this._container.append(
                $('<a>')
                    .attr('href', 'http://wikidata.org/wiki/' + this._listingData.munid)
                    .append(ListingItemIcons.createMunidIcon())
            );
        }
        if (this._listingData.block) {
            this._container.append(', квартал ' + this._listingData.block);
        }

        if (this._listingData.address) {
            if (this._listingData.municipality) {
                this._container.append(',&nbsp;');
            }
            this._container.append(this._listingData.address);
        }

        this._container.append($('<br/>'));
        this._container.append($('<i>').text('Номер объекта: '));
        const knidSpan = $('<span>')
            .attr('id', this._listingData.knid)
            .text(this._listingData.knid);
        if (this._listingData['knid-new']) {
            knidSpan.append('&nbsp;&nbsp;/&nbsp;&nbsp;').append(
                $('<abbr>')
                    .attr('title', '15-значный номер в Едином государственном реестре')
                    .append(
                        $('<a>')
                            .attr('href', 'https://tools.wmflabs.org/ru_monuments/get_info.php?id=' + this._listingData['knid-new'])
                            .text(this._listingData['knid-new']))
            );
        }
        // TODO: listing data UID
        this._container.append(
            $('<span style="font-size:93%">').append(knidSpan)
        );

        this._container.append('&nbsp;&nbsp;&nbsp;');
        this._container.append($('<i>').text('Ссылки:'));
        this._container.append('&nbsp;');

        if (this._listingData.lat && this._listingData.long) {
            this._container.append(
                $('<a>')
                // TODO correct link & escaping
                    .attr('href', 'https://tools.wmflabs.org/wikivoyage/w/monmap1.php?lat=' + this._listingData.lat + '&lon=' + this._listingData.long + '&zoom=13&layer=OX&lang=ru')
                    .append(ListingItemIcons.createMapIcon())
            );
            if (this._listingData.precise !== 'yes') {
                this._container.append($('<span style="color:#FF0000">!</span>'));
            }
            this._container.append('&nbsp;');
        }

        if (this._listingData.wiki) {
            this._container.append(
                $('<a>')
                    .attr('alt', 'Статья в Википедии')
                    // TODO urlencode
                    .attr('href', 'http://ru.wikipedia.org/wiki/' + this._listingData.wiki)
                    .append(ListingItemIcons.createWikipediaIcon())
            );
        }

        if (this._listingData.commonscat) {
            this._container.append(
                $('<a>')
                    .attr('alt', 'Категория на Викискладе')
                    // TODO urlencode
                    .attr('href', 'http://commons.wikimedia.org/wiki/Category:' + this._listingData.commonscat)
                    .append(ListingItemIcons.createCommonsIcon())
            );
            this._container.append('&thinsp;&thinsp;');
        }

        if (this._listingData.wdid) {
            this._container.append(
                $('<a>')
                    .attr('alt', 'Элемент в Викиданных')
                    // TODO urlencode
                    .attr('href', 'http://www.wikidata.org/wiki/' + this._listingData.wdid)
                    .append(ListingItemIcons.createWikidataIcon())
            );
        }

        // TODO external links

        this._container.append(
            $('<a>')
                .attr('href', 'https://commons.wikimedia.org/wiki/Category:WLM/' + this._listingData.knid)
                .text('галерея')
        );

        this._container.append('<br>');

        this._container.append($('<i>').text('Описание:'));

        const descriptionComponents = [];
        if (this._listingData.year) {
            descriptionComponents.push(this._listingData.year)
        }
        if (this._listingData.author) {
            descriptionComponents.push(this._listingData.author);
        }
        if (descriptionComponents.length > 0) {
            this._container.append(descriptionComponents.join(', ') + '.');
        }

        let typeText = '';
        if (this._listingData.type === 'architecture') {
            typeText = 'Памятник архитектуры';
        } else if (this._listingData.type === 'history') {
            typeText = 'Памятник истории';
        } else if (this._listingData.type === 'archeology') {
            typeText = 'Памятник археологии';
        } else if (this._listingData.type === 'monument') {
            typeText = 'Памятник монументального искусства';
        }
        this._container.append(' ' + typeText);

        let protectionText = '';
        if (this._listingData.protection === 'Ф') {
            protectionText = '&nbsp;федерального значения';
        } else if (this._listingData.protection === 'Р') {
            protectionText = '&nbsp;регионального значения';
        } else if (this._listingData.protection === 'М') {
            protectionText = '&nbsp;местного значения';
        } else if (this._listingData.protection === 'В') {
            protectionText = ', выявленный';
        }
        if (protectionText) {
            this._container.append(protectionText);
        }

        // TODO documents
    }

    renderEditButton() {
        const editListingButton = $('<span>').attr({
            'class': 'vcard-edit-button noprint',
            'style': 'padding-left: 5px;',
        });
        const editListingLink = (
            $('<a>')
                .attr({
                    'class': 'icon-pencil',
                    'title': 'Редактировать',
                })
                .text('Редактировать')
        );
        editListingButton.append(editListingLink);
        return editListingButton;
    }
}

class EditorComponent {
    constructor(container, listingData, onDiscard, onSave) {
        this._container = container;
        this._listingData = listingData;
        this._onDiscard = onDiscard;
        this._onSave = onSave;
    }

    setImage(image) {
        this._inputImage.val(image);
    }

    render() {
        this._container.css({'background-color': '#FFFFFF'});

        const inputName = ListingItemFormComposer.createTextInputLarge();
        const inputRegion = ListingItemFormComposer.createSelector(
            regions.map(
                (region) => ({
                    title: region.getTitle(),
                    value: region.getId()
                })
            )
        );
        const inputDistrict = ListingItemFormComposer.createTextInput();
        const inputMunicipality = ListingItemFormComposer.createTextInput();
        const inputBlock = ListingItemFormComposer.createTextInput();
        const inputAddress = ListingItemFormComposer.createTextInput();

        const inputLat = ListingItemFormComposer.createTextInputSmall();
        const inputLong = ListingItemFormComposer.createTextInputSmall();
        const inputPrecise= ListingItemFormComposer.createCheckboxInput();

        const inputStyle = ListingItemFormComposer.createSelector(
            culturalMonumentStyles.map(
                (culturalMonumentStyle) => ({
                    title: culturalMonumentStyle.getTitle(),
                    value: culturalMonumentStyle.getValue()
                })
            )
        );
        const inputType = ListingItemFormComposer.createSelector(
            culturalMonumentTypes.map(
                (culturalMonumentType) => ({
                    title: culturalMonumentType.getTitle(),
                    value: culturalMonumentType.getValue()
                })
            )
        );
        const inputProtection = ListingItemFormComposer.createSelector(
            culturalMonumentProtections.map(
                (culturalMonumentProtection) => ({
                    title: culturalMonumentProtection.getTitle(),
                    value: culturalMonumentProtection.getValue()
                })
            )
        );
        const inputYear = ListingItemFormComposer.createTextInputSmall();
        const inputAuthor = ListingItemFormComposer.createTextInput();
        const inputDestroyed = ListingItemFormComposer.createCheckboxInput();

        this._inputImage = ListingItemFormComposer.createTextInput();
        const inputWikipedia = ListingItemFormComposer.createTextInput();
        const inputWikidata = ListingItemFormComposer.createTextInputSmall();
        const inputCommons = ListingItemFormComposer.createTextInput();
        const inputMunid = ListingItemFormComposer.createTextInputSmall();
        const inputDocument = ListingItemFormComposer.createTextInput();
        const inputLink = ListingItemFormComposer.createTextInput();
        const inputLinkExtra = ListingItemFormComposer.createTextInput();

        const inputKnid = ListingItemFormComposer.createTextInput(10);
        const inputComplex = ListingItemFormComposer.createTextInput(10);
        const inputKnidNew = ListingItemFormComposer.createTextInput(15);

        const inputDescription = ListingItemFormComposer.createTextarea();

        const allInputs = [
            inputName,
            inputType,
            inputRegion,
            inputDistrict,
            inputMunicipality,
            inputBlock,
            inputAddress,
            inputLat,
            inputLong,
            inputYear,
            inputAuthor,
            inputKnid,
            inputComplex,
            inputKnidNew,
            this._inputImage,
            inputWikipedia,
            inputWikidata,
            inputCommons,
            inputMunid,
            inputDocument,
            inputLink,
            inputLinkExtra,
            inputDescription,
            inputProtection,
            inputStyle,
            inputDestroyed,
            inputPrecise
        ];

        const directMappingInputs = {
            name: inputName,
            type: inputType,
            region: inputRegion,
            district: inputDistrict,
            municipality: inputMunicipality,
            block: inputBlock,
            address: inputAddress,
            lat: inputLat,
            long: inputLong,
            year: inputYear,
            author: inputAuthor,
            knid: inputKnid,
            complex: inputComplex,
            'knid-new': inputKnidNew,
            image: this._inputImage,
            wiki: inputWikipedia,
            wdid: inputWikidata,
            commonscat: inputCommons,
            munid: inputMunid,
            document: inputDocument,
            link: inputLink,
            linkextra: inputLinkExtra,
            description: inputDescription,
            protection: inputProtection,
        };

        const setValues = (listing) => {
            Object.keys(directMappingInputs).forEach(function(key) {
                if (listing[key]) {
                    directMappingInputs[key].val(listing[key]);
                }
            });
            if (listing['style']) {
                inputStyle.val(listing['style'].toLowerCase());
            }
            inputDestroyed.attr('checked', listing['status'] === 'destroyed');
            inputPrecise.attr('checked', listing['precise'] === 'yes');
        };

        const getValues = () => {
            const listingData = {};
            Object.keys(directMappingInputs).forEach(function(key) {
                listingData[key] = directMappingInputs[key].val();
            });
            if (inputDestroyed.is(':checked')) {
                listingData['status'] = 'destroyed';
            } else {
                listingData['status'] = '';
            }
            if (inputPrecise.is(':checked')) {
                listingData['precise'] = 'yes';
            } else {
                listingData['precise'] = 'no';
            }

            listingData['link'] = ValidationUtils.normalizeUrl(listingData['link']);
            listingData['linkextra'] = ValidationUtils.normalizeUrl(listingData['linkextra']);
            listingData['style'] = inputStyle.val();
            return listingData;
        };

        setValues(this._listingData);

        const nameRow = (
            ListingItemFormComposer.createFormRow('Название:')
                .append(ListingItemFormComposer.createFormElement(null, inputName))
        );

        this._container.append(nameRow);

        const addressRow = (
            ListingItemFormComposer.createFormRow('Адрес:')
                .append(ListingItemFormComposer.createFormElement('Регион', inputRegion))
                .append(ListingItemFormComposer.createFormElement('Район', inputDistrict))
                .append(ListingItemFormComposer.createFormElement('Населенный пункт', inputMunicipality))
                .append(ListingItemFormComposer.createFormElement('Квартал', inputBlock))
                .append(ListingItemFormComposer.createFormElement('Улица, дом', inputAddress))
        );

        this._container.append(addressRow);

        const coordRow = (
            ListingItemFormComposer.createFormRow('Координаты: ')
                .append(ListingItemFormComposer.createFormElement('Широта', inputLat))
                .append(ListingItemFormComposer.createFormElement('Долгота', inputLong))
                .append(ListingItemFormComposer.createFormElement('Заданы точно?', inputPrecise))
        );

        this._container.append(coordRow);

        const propsRow = (
            ListingItemFormComposer.createFormRow('Свойства: ')
                .append(ListingItemFormComposer.createFormElement('Тип', inputType))
                .append(ListingItemFormComposer.createFormElement('Стиль', inputStyle))
                .append(ListingItemFormComposer.createFormElement('Категория охраны', inputProtection))
                .append(ListingItemFormComposer.createFormElement('Год', inputYear))
                .append(ListingItemFormComposer.createFormElement('Автор', inputAuthor))
                .append(ListingItemFormComposer.createFormElement('Утрачен', inputDestroyed))
        );

        this._container.append(propsRow);

        const linksRow = (
            ListingItemFormComposer.createFormRow('Ссылки: ')
                .append(ListingItemFormComposer.createFormElement('Изображение', this._inputImage))
                .append(ListingItemFormComposer.createFormElement('Википедия', inputWikipedia))
                .append(ListingItemFormComposer.createFormElement('Викиданные', inputWikidata))
                .append(ListingItemFormComposer.createFormElement('Викисклад', inputCommons))
                .append(ListingItemFormComposer.createFormElement('Викиданные нас. пункта', inputMunid))
                .append(ListingItemFormComposer.createFormElement('Код документа', inputDocument))
                .append(ListingItemFormComposer.createFormElement('Ссылка №1', inputLink))
                .append(ListingItemFormComposer.createFormElement('Ссылка №2', inputLinkExtra))
        );

        this._container.append(linksRow);

        const numbersRow = (
            ListingItemFormComposer.createFormRow('Номера: ')
                .append(ListingItemFormComposer.createFormElement('10-значный № объекта', inputKnid))
                .append(ListingItemFormComposer.createFormElement('10-значный № комплекса', inputComplex))
                .append(ListingItemFormComposer.createFormElement('15-значный № объекта', inputKnidNew))
        );

        this._container.append(numbersRow);

        const descriptionRow = (
            ListingItemFormComposer.createFormRow('Описание:')
                .append(ListingItemFormComposer.createFormElement(null, inputDescription))
        );

        this._container.append(descriptionRow);

        const inputChanges = ListingItemFormComposer.createTextInputLarge();
        const inputIsMinor = ListingItemFormComposer.createCheckboxInput();

        const changesDescriptionRow = (
            ListingItemFormComposer.createFormRow('Описание изменений: ')
                .append(ListingItemFormComposer.createFormElement(null, inputChanges))
                .append(ListingItemFormComposer.createFormElement('незначительные?', inputIsMinor))
        );
        changesDescriptionRow.css('border-top', '1px dotted gray');
        changesDescriptionRow.css('border-bottom', '1px dotted gray');
        changesDescriptionRow.css('margin-top', '3px');

        let changesChanged = false;
        inputChanges.change(() => {
            changesChanged = true;
        });

        const onValueChange = () => {
            if (!changesChanged) {
                const values = getValues();
                const originalData = this._listingData;
                const changedItems = [];
                Object.keys(values).forEach(key => {
                    if (StringUtils.emptyToString(originalData[key]) !== StringUtils.emptyToString(values[key])) {
                        changedItems.push(key);
                    }
                });

                if (ArrayUtils.consistsOnlyOf(changedItems, ['name'])) {
                    inputChanges.val('название');
                } else if (ArrayUtils.consistsOnlyOf(changedItems, ['address'])) {
                    inputChanges.val('адрес');
                } else if (ArrayUtils.consistsOnlyOf(changedItems, ['lat', 'long', 'precise'])) {
                    inputChanges.val('координаты');
                } else {
                    inputChanges.val('');
                }
            }
        };
        allInputs.forEach((input) => input.change(onValueChange));

        this._container.append(changesDescriptionRow);

        const buttonsBlock = $('<div>').attr('class', 'ui-dialog-buttonset');
        const buttonDiscard = this.renderButton('Отменить');
        const buttonSave = this.renderButton('Сохранить');
        buttonsBlock.append(buttonDiscard);
        buttonsBlock.append(buttonSave);

        buttonDiscard.click(() => {
            this._onDiscard();
        });
        buttonSave.click(() => {
            const values = getValues();
            const changesDescription = new ChangesDescription(
                inputChanges.val(),
                inputIsMinor.is(':checked')
            );

            this._onSave(values, changesDescription);
        });

        this._container.append(buttonsBlock);
    }

    renderButton(buttonText) {
        return (
            $('<button>')
                .attr('class', 'ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only')
                .append(
                    $('<span>')
                        .attr('class', 'ui-button-text')
                        .text(buttonText)
                )
        );
    }
}

class GalleryRowComponent {
    constructor(onSelectImage) {
        this._onSelectImage = onSelectImage;
    }

    render() {
        this._galleryContents = $('<td colspan="2">');
        this._galleryComponent = new GalleryComponent(this._galleryContents, this._onSelectImage);
        this._galleryComponent.render();
        this._galleryRow = $('<tr style="display: none;">').append(this._galleryContents);

        return this._galleryRow;
    }

    onModeUpdate(mode) {
        this._mode = mode;
        this.updateMode();
    }

    updateMode() {
        this._galleryComponent.onModeUpdate(this._mode);
    }

    toggle() {
        this._galleryRow.toggle();
    }

    setGalleryImages(galleryImages) {
        this._galleryComponent.setGalleryImages(galleryImages);
    }
}

class GalleryComponent {
    constructor(container, onSelectImage) {
        this._galleryImages = null;
        this._container = container;
        this._imageComponents = [];
        this._onSelectImage = onSelectImage;
    }

    onModeUpdate(mode) {
        this._mode = mode;
        this.updateMode();
    }

    updateMode() {
        this._imageComponents.forEach((imageComponent) => {
            imageComponent.onModeUpdate(this._mode);
        });
    }

    setGalleryImages(galleryImages) {
        this._galleryImages = galleryImages;
        this.render();
    }

    render() {
        if (!this._container) {
            return;
        }

        this._container.empty();
        this._renderGallery();
    }

    _renderGallery() {
        if (!this._galleryImages) {
            this._container.text('загрузка...');
        } else {
            if (this._galleryImages.hasWlmImages()) {
                this._container.append(
                    this._renderGallerySection(
                        'Фотографии Wiki Loves Monuments',
                        this._galleryImages.getWlmImages()
                    )
                );
            }
            if (this._galleryImages.hasCommonsImages()) {
                this._container.append(
                    this._renderGallerySection(
                        'Фотографии из категории Commons',
                        this._galleryImages.getCommonsImages()
                    )
                )
            }
        }
    }

    _renderGallerySection(title, images) {
        const headerDiv = $('<div style="width: 100%; text-align: center; font-weight: bold;">').text(title);

        const imagesDiv = $('<div style="display: flex; flex-direction: row; flex-wrap: wrap; align-items: center">');
        images.forEach((image) => {
            const imageComponent = new GalleryImageComponent(imagesDiv, image, this._onSelectImage);
            imageComponent.render();
            this._imageComponents.push(imageComponent);
        });

        return $('<div>')
            .append(headerDiv)
            .append(imagesDiv);
    }
}

class GalleryImageComponent {
    constructor(container, image, onSelect) {
        this._container = container;
        this._image = image;
        this._onSelect = onSelect;
    }

    onModeUpdate(mode) {
        this.mode = mode;
        this.updateMode();
    }

    updateMode() {
        if (this.mode === MODES.EDIT) {
            this._selectLink.show();
        } else {
            this._selectLink.hide();
        }
    }

    render() {
        const imageElement = $('<img>').attr('src', this._image.thumb);

        const commonsUrl = 'https://commons.wikimedia.org/wiki/' + this._image.image;
        const fullSizeUrl = this._image.url;

        const imageLink = (
            $('<a>')
                .attr('href', fullSizeUrl)
                .attr('target', '_blank')
                .append(imageElement)
        );

        const viewCommonsLink = (
            $('<a>')
                .text('[Смотрeть на Commons]')
                .attr('href', commonsUrl)
                .attr('target', '_blank')
        );

        const viewFullLink = (
            $('<a>')
                .text('[Смотреть в полном размере]')
                .attr('href', fullSizeUrl)
                .attr('target', '_blank')
        );

        this._selectLink = (
            $('<a style="display: none;">')
                .text('[Выбрать]')
                .click(() => this._onSelect(this._image.image.replace(/^File:/, '').replace(' ', '_')))
        );

        this._container.append(
            $('<div style="padding: 10px; display: flex; flex-direction: column; justify-content: center">')
                .append($('<div>').append(imageLink))
                .append($('<div style="text-align: center">').append(viewCommonsLink))
                .append($('<div style="text-align: center">').append(viewFullLink))
                .append($('<div style="text-align: center">').append(this._selectLink))
        );

        this.updateMode();
    }
}

const MODES = {
    VIEW: 'view',
    EDIT: 'edit',
};