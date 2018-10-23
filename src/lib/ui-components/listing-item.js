import { WikivoyageApi } from "../wikivoyage-api";

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

        const inputName = $('<input type="text">');
        inputName.val(listingData.name);

        const nameRow = $('<div>')
            .append($('<div>').text('Название'))
            .append($('<div>').append(inputName));
        dataCell.append(nameRow);

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
            this.listingItem.data.name = inputName.val();

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

        if (listingData.image) {
            WikivoyageApi.getImageInfo('File:' + listingData.image, (result) => image.attr('src', result.thumb));
        }

        return image;
    }

    renderImageCell() {
        const imageCell = $('<td width="160px;">');
        imageCell.append(this.renderImage());
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
            dataCell.append(Icons.MonumentType.createArchitectureIcon());
        } else if (this.listingItem.data.type === 'history') {
            dataCell.append(Icons.MonumentType.createHistoryIcon());
        } else if (this.listingItem.data.type === 'archeology') {
            dataCell.append(Icons.MonumentType.createArcheologyIcon());
        } else if (this.listingItem.data.type === 'monument') {
            dataCell.append(Icons.MonumentType.createMonumentIcon());
        }
        dataCell.append('&nbsp;');

        if (isMainComplexElement) {
            dataCell.append(Icons.createComplexMainElementIcon());
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
                    .append(Icons.createMunidIcon())
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
                    .append(Icons.createMapIcon())
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
                    .append(Icons.createWikipediaIcon())
            );
        }

        if (listingData.commonscat) {
            dataCell.append(
                $('<a>')
                    .attr('alt', 'Категория на Викискладе')
                    // TODO urlencode
                    .attr('href', 'http://commons.wikimedia.org/wiki/Category:' + listingData.commonscat)
                    .append(Icons.createCommonsIcon())
            );
            dataCell.append('&thinsp;&thinsp;');
        }

        if (listingData.wdid) {
            dataCell.append(
                $('<a>')
                    .attr('alt', 'Элемент в Викиданных')
                    // TODO urlencode
                    .attr('href', 'http://www.wikidata.org/wiki/' + listingData.wdid)
                    .append(Icons.createWikidataIcon())
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

const Icons = {
    THUMBS_URL: 'https://upload.wikimedia.org/wikipedia/commons/thumb/',

    createComplexMainElementIcon() {
        return $('<img>').attr({
            'src': Icons.THUMBS_URL + '8/8c/Location_dot_darkslategray.svg/10px-Location_dot_darkslategray.svg.png',
            'alt': 'главный элемент комплекса',
            'width': '10px',
            'height': '10px',
        });
    },

    createMunidIcon() {
        return $('<img>').attr({
            'src': Icons.THUMBS_URL + 'f/ff/Wikidata-logo.svg/18px-Wikidata-logo.svg.png',
            'alt': 'район на Викиданных',
            'width': '18px',
            'height': '10px'
        });
    },

    createMapIcon() {
        return $('<img>').attr({
            'src': Icons.THUMBS_URL + 'c/ce/Map_mag.png/17px-Map_mag.png',
            'alt': 'Расположение на карте',
            'width': '17px',
            'height': '17px'
        });
    },

    createWikipediaIcon() {
        return $('<img>').attr({
            'src': Icons.THUMBS_URL + '8/80/Wikipedia-logo-v2.svg/19px-Wikipedia-logo-v2.svg.png',
            'alt': 'Расположение на карте',
            'width': '19px',
            'height': '17px'
        });
    },

    createCommonsIcon() {
        return $('<img>').attr({
            'src': Icons.THUMBS_URL + '4/4a/Commons-logo.svg/17px-Commons-logo.svg.png',
            'alt': 'Расположение на карте',
            'width': '17px',
            'height': '23px'
        });
    },

    createWikidataIcon() {
        return $('<img>').attr({
            'src': Icons.THUMBS_URL + 'f/ff/Wikidata-logo.svg/24px-Wikidata-logo.svg.png',
            'alt': 'Расположение на карте',
            'width': '24px',
            'height': '13px'
        });
    },

    MonumentType: {
        createArchitectureIcon() {
            return $('<img>').attr({
                'src': Icons.THUMBS_URL + 'c/cc/PorticoIcon.svg/20px-PorticoIcon.svg.png',
                'alt': 'памятник архитектуры',
                'width': '20px',
                'height': '20px'
            });
        },

        createHistoryIcon() {
            return $('<img>').attr({
                'src': Icons.THUMBS_URL + 'c/c8/HistoryIcon.svg/18px-HistoryIcon.svg.png',
                'alt': 'памятник истории',
                'width': '18px',
                'height': '18px',
            });
        },

        createArcheologyIcon() {
            return $('<img>').attr({
                'src': Icons.THUMBS_URL + 'c/ce/ArcheologyIcon.svg/22px-ArcheologyIcon.svg.png',
                'alt': 'памятник археологии',
                'width': '22px',
                'height': '22px',
            });
        },

        createMonumentIcon() {
            return $('<img>').attr({
                'src': Icons.THUMBS_URL + 'c/c2/MonumentIcon.svg/20px-MonumentIcon.svg.png',
                'alt': 'памятник монументального искусства',
                'width': '20px',
                'height': '20px'
            })
        }
    }
};