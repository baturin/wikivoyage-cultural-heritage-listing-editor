import { culturalMonumentTypes } from "../cultural-monument-types";
import { culturalMonumentStyles } from "../cultural-monument-styles";
import { culturalMonumentProtections } from "../cultural-monument-protections";
import { regions } from "../regions";
import { ValidationUtils } from "../validation-utils";
import { ListingItemIcons } from "./listing-item-icons";
import { ListingItemFormComposer } from "./listing-item-form-composer";

export class ListingItemComponent {
    constructor(listingItem) {
        this.listingItem = listingItem;
        this.listingItemContainer = $('<div>');
    }

    render() {
        this.listingItemContainer.append(this.renderView());

        return [
            this.listingItemContainer,
            $('<hr/>')
        ];
    }

    renderUpload() {
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

    renderEdit() {
        const listingTable = $('<table border="0" style="font-size:97%; width:100%;">');

        const listingRow = $('<tr valign="top">');
        listingTable.append(listingRow);

        const imageCell = this.renderImageCell();
        listingRow.append(imageCell);

        const dataCell = $('<td style="padding-left:10px;" valign="middle">');
        listingRow.append(dataCell);

        const listingData = this.listingItem.data;

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

        const inputImage = ListingItemFormComposer.createTextInput();
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
            image: inputImage,
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

        setValues(this.listingItem.data);

        inputName.val(listingData.name);

        const nameRow = (
            ListingItemFormComposer.createFormRow('Название:')
                .append(ListingItemFormComposer.createFormElement(null, inputName))
        );

        dataCell.append(nameRow);

        const addressRow = (
            ListingItemFormComposer.createFormRow('Адрес:')
                .append(ListingItemFormComposer.createFormElement('Регион', inputRegion))
                .append(ListingItemFormComposer.createFormElement('Район', inputDistrict))
                .append(ListingItemFormComposer.createFormElement('Населенный пункт', inputMunicipality))
                .append(ListingItemFormComposer.createFormElement('Квартал', inputBlock))
                .append(ListingItemFormComposer.createFormElement('Улица, дом', inputAddress))
        );

        dataCell.append(addressRow);

        const coordRow = (
            ListingItemFormComposer.createFormRow('Координаты: ')
                .append(ListingItemFormComposer.createFormElement('Широта', inputLat))
                .append(ListingItemFormComposer.createFormElement('Долгота', inputLong))
                .append(ListingItemFormComposer.createFormElement('Заданы точно?', inputPrecise))
        );

        dataCell.append(coordRow);

        const propsRow = (
            ListingItemFormComposer.createFormRow('Свойства: ')
                .append(ListingItemFormComposer.createFormElement('Тип', inputType))
                .append(ListingItemFormComposer.createFormElement('Стиль', inputStyle))
                .append(ListingItemFormComposer.createFormElement('Категория охраны', inputProtection))
                .append(ListingItemFormComposer.createFormElement('Год', inputYear))
                .append(ListingItemFormComposer.createFormElement('Автор', inputAuthor))
                .append(ListingItemFormComposer.createFormElement('Утрачен', inputDestroyed))
        );

        dataCell.append(propsRow);

        const linksRow = (
            ListingItemFormComposer.createFormRow('Ссылки: ')
                .append(ListingItemFormComposer.createFormElement('Изображение', inputImage))
                .append(ListingItemFormComposer.createFormElement('Википедия', inputWikipedia))
                .append(ListingItemFormComposer.createFormElement('Викиданные', inputWikidata))
                .append(ListingItemFormComposer.createFormElement('Викисклад', inputCommons))
                .append(ListingItemFormComposer.createFormElement('Викиданные нас. пункта', inputMunid))
                .append(ListingItemFormComposer.createFormElement('Код документа', inputDocument))
                .append(ListingItemFormComposer.createFormElement('Ссылка №1', inputLink))
                .append(ListingItemFormComposer.createFormElement('Ссылка №2', inputLinkExtra))
        );

        dataCell.append(linksRow);

        const numbersRow = (
            ListingItemFormComposer.createFormRow('Номера: ')
                .append(ListingItemFormComposer.createFormElement('10-значный № объекта', inputKnid))
                .append(ListingItemFormComposer.createFormElement('10-значный № комплекса', inputComplex))
                .append(ListingItemFormComposer.createFormElement('15-значный № объекта', inputKnidNew))
        );

        dataCell.append(numbersRow);

        const descriptionRow = (
            ListingItemFormComposer.createFormRow('Описание:')
                .append(ListingItemFormComposer.createFormElement(null, inputDescription))
        );

        dataCell.append(descriptionRow);

        const buttonsBlock = $('<div>').attr('class', 'ui-dialog-buttonset');
        const buttonDiscard = this.renderButton('Отменить');
        const buttonSave = this.renderButton('Сохранить');
        buttonsBlock.append(buttonDiscard);
        buttonsBlock.append(buttonSave);

        buttonDiscard.click(() => {
            this.listingItemContainer.empty();
            this.listingItemContainer.append(this.renderView());
        });
        buttonSave.click(() => {
            this.listingItem.data = getValues();

            this.listingItemContainer.empty();
            this.listingItemContainer.append(this.renderView());
        });

        dataCell.append(buttonsBlock);

        listingRow.append(this.renderUpload());

        return listingTable;
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

    renderImage() {
        const listingData = this.listingItem.data;
        const imageThumb = this.listingItem.imageThumb;

        const image = $('<img src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/Village_without_photo.svg/150px-Village_without_photo.svg.png">');

        image.attr(
            'src',
            'https://upload.wikimedia.org/' +
            'wikipedia/commons/thumb/c/ca/Village_without_photo.svg/150px-Village_without_photo.svg.png'
        );
        if (listingData.image) {
            image.attr('alt', listingData.name);
        } else {
            image.attr('alt', 'Нет фото');
            image.attr('class', 'thumbborder');
        }

        if (listingData.image && imageThumb) {
            image.attr('src', imageThumb);
        }

        return image;
    }

    onImageThumbUpdated() {
        if (this.image) {
            this.image.attr('src', this.listingItem.imageThumb);
        }
    }

    renderImageCell() {
        const imageCell = $('<td width="160px;">');
        this.image = this.renderImage();
        imageCell.append(this.image);
        return imageCell;
    }

    renderView() {
        const listingData = this.listingItem.data;

        const listingTable = $('<table class="monument" border="0" style="font-size:97%; width:100%;">');

        const listingRow = $('<tr valign="top">');
        if (listingData.status === 'destroyed') {
            listingRow.attr('style', 'color:#808080;')
        }

        listingTable.append(listingRow);

        const imageCell = this.renderImageCell();
        listingRow.append(imageCell);

        const dataCell = $('<td style="padding-left:10px;" valign="middle">');

        const isMainComplexElement = (
            listingData.complex && listingData.complex === listingData.knid
        );

        if (listingData.complex) {
            if (isMainComplexElement) {
                // main complex element
                dataCell.css({'background-color': '#BAFFC1'});
            } else {
                dataCell.css({'background-color': '#E1FFE4'});
            }
        } else {
            dataCell.css({'background-color': '#F8F8F8'});
        }
        listingRow.append(dataCell);

        if (this.listingItem.data.type === 'architecture') {
            dataCell.append(ListingItemIcons.MonumentType.createArchitectureIcon());
        } else if (this.listingItem.data.type === 'history') {
            dataCell.append(ListingItemIcons.MonumentType.createHistoryIcon());
        } else if (this.listingItem.data.type === 'archeology') {
            dataCell.append(ListingItemIcons.MonumentType.createArcheologyIcon());
        } else if (this.listingItem.data.type === 'monument') {
            dataCell.append(ListingItemIcons.MonumentType.createMonumentIcon());
        }
        dataCell.append('&nbsp;');

        if (isMainComplexElement) {
            dataCell.append(ListingItemIcons.createComplexMainElementIcon());
            dataCell.append('&nbsp;');
        }

        const itemNameElement = $('<span class="monument-name" style="font-size:115%; font-weight:bold">');
        itemNameElement.text(listingData.name);
        dataCell.append(itemNameElement);

        const editButton = this.renderEditButton();
        // TODO handle only click on image
        editButton.click(() => {
            this.listingItemContainer.empty();
            this.listingItemContainer.append(this.renderEdit());
        });

        dataCell.append(editButton);

        dataCell.append($('<br/>'));

        dataCell.append($('<i>').text('Адрес: '));
        if (listingData.municipality) {
            dataCell.append($('<i>').text(listingData.municipality));
        }
        if (listingData.munid) {
            dataCell.append('&nbsp;');
            // TODO urlencode
            dataCell.append(
                $('<a>')
                    .attr('href', 'http://wikidata.org/wiki/' + listingData.munid)
                    .append(ListingItemIcons.createMunidIcon())
            );
        }
        if (listingData.block) {
            dataCell.append(', квартал ' + listingData.block);
        }

        if (listingData.address) {
            if (listingData.municipality) {
                dataCell.append(',&nbsp;');
            }
            dataCell.append(listingData.address);
        }

        dataCell.append($('<br/>'));
        dataCell.append($('<i>').text('Номер объекта: '));
        const knidSpan = $('<span>')
            .attr('id', listingData.knid)
            .text(listingData.knid);
        if (listingData['knid-new']) {
            knidSpan.append('&nbsp;&nbsp;/&nbsp;&nbsp;').append(
                $('<abbr>')
                    .attr('title', '15-значный номер в Едином государственном реестре')
                    .append(
                        $('<a>')
                            .attr('href', 'https://tools.wmflabs.org/ru_monuments/get_info.php?id=' + listingData['knid-new'])
                            .text(listingData['knid-new']))
            );
        }
        // TODO: listing data UID
        dataCell.append(
            $('<span style="font-size:93%">').append(knidSpan)
        );

        dataCell.append('&nbsp;&nbsp;&nbsp;');
        dataCell.append($('<i>').text('Ссылки:'));
        dataCell.append('&nbsp;');

        if (listingData.lat && listingData.long) {
            dataCell.append(
                $('<a>')
                // TODO correct link & escaping
                    .attr('href', 'https://tools.wmflabs.org/wikivoyage/w/monmap1.php?lat=' + listingData.lat + '&lon=' + listingData.long + '&zoom=13&layer=OX&lang=ru')
                    .append(ListingItemIcons.createMapIcon())
            );
            if (listingData.precise !== 'yes') {
                dataCell.append($('<span style="color:#FF0000">!</span>'));
            }
            dataCell.append('&nbsp;');
        }

        if (listingData.wiki) {
            dataCell.append(
                $('<a>')
                    .attr('alt', 'Статья в Википедии')
                    // TODO urlencode
                    .attr('href', 'http://ru.wikipedia.org/wiki/' + listingData.wiki)
                    .append(ListingItemIcons.createWikipediaIcon())
            );
        }

        if (listingData.commonscat) {
            dataCell.append(
                $('<a>')
                    .attr('alt', 'Категория на Викискладе')
                    // TODO urlencode
                    .attr('href', 'http://commons.wikimedia.org/wiki/Category:' + listingData.commonscat)
                    .append(ListingItemIcons.createCommonsIcon())
            );
            dataCell.append('&thinsp;&thinsp;');
        }

        if (listingData.wdid) {
            dataCell.append(
                $('<a>')
                    .attr('alt', 'Элемент в Викиданных')
                    // TODO urlencode
                    .attr('href', 'http://www.wikidata.org/wiki/' + listingData.wdid)
                    .append(ListingItemIcons.createWikidataIcon())
            );
        }

        // TODO external links

        dataCell.append(
            $('<a>')
                .attr('href', 'https://commons.wikimedia.org/wiki/Category:WLM/' + listingData.knid)
                .text('галерея')
        );

        dataCell.append('<br>');

        dataCell.append($('<i>').text('Описание:'));

        const descriptionComponents = [];
        if (listingData.year) {
            descriptionComponents.push(listingData.year)
        }
        if (listingData.author) {
            descriptionComponents.push(listingData.author);
        }
        if (descriptionComponents.length > 0) {
            dataCell.append(descriptionComponents.join(', ') + '.');
        }

        let typeText = '';
        if (listingData.type === 'architecture') {
            typeText = 'Памятник архитектуры';
        } else if (listingData.type === 'history') {
            typeText = 'Памятник истории';
        } else if (listingData.type === 'archeology') {
            typeText = 'Памятник археологии';
        } else if (listingData.type === 'monument') {
            typeText = 'Памятник монументального искусства';
        }
        dataCell.append(' ' + typeText);

        let protectionText = '';
        if (listingData.protection === 'Ф') {
            protectionText = '&nbsp;федерального значения';
        } else if (listingData.protection === 'Р') {
            protectionText = '&nbsp;регионального значения';
        } else if (listingData.protection === 'М') {
            protectionText = '&nbsp;местного значения';
        } else if (listingData.protection === 'В') {
            protectionText = ', выявленный';
        }
        if (protectionText) {
            dataCell.append(protectionText);
        }

        // TODO documents

        listingRow.append(this.renderUpload());

        return listingTable;
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

    composeUploadUrl() {
        const params = {
            title: 'Special:UploadWizard',
            campaign: this.listingItem.data.campaign,
            id: this.listingItem.data.knid,
            id2: this.listingItem.data.uid,
            // TODO full description
            description: this.listingItem.data.description,
            categories: this.listingItem.data.commonscat,
            userlang: 'ru'
        };
        // TODO check how URL encoding works with spaces
        return 'http://commons.wikimedia.org/w/index.php?' + $.param(params);
    }
}
