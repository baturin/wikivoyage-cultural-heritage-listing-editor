import ListingEditorFormComposer from "../listing-editor-form-composer";
import CommonsImagesSelectDialog from '../commons-images-select-dialog';
import ValidationUtils from '../validation-utils';
import culturalMonumentTypes from '../cultural-monument-types';
import culturalMonumentStyles from '../cultural-monument-styles';
import protections from 'protection';
import regionsKz from '../regions-kz';

class CulturalHeritageKZEditorForm {
    constructor() {
        this._form = ListingEditorFormComposer.createForm();

        this._inputObjectName = ListingEditorFormComposer.createInputFormRowText(
            'input-name', 'Название', 'название объекта', false, true
        );
        this._inputType = ListingEditorFormComposer.createInputFormRowSelect(
            'input-type', 'Тип', culturalMonumentTypes.map(
                (culturalMonumentType) => ({
                    title: culturalMonumentType.getTitle(),
                    value: culturalMonumentType.getValue()
                })
            )
        );
        this._inputProtection = ListingEditorFormComposer.createInputFormRowSelect(
            'input-protection', 'Категория охраны', protections.map(
                (protection) => ({
                    title: protection.getTitle(),
                    value: protection.getValue()
                })
            )
        );
        this._inputDestroyed = ListingEditorFormComposer.createInputFormRowCheckbox(
            'input-destroyed', 'Утрачен'
        );
        this._inputRegion = ListingEditorFormComposer.createInputFormRowSelect(
            'input-region', 'Регион', regionsKz.map(
                (regionKz) => ({
                    title: regionKz.getTitle(),
                    value: regionKz.getId()
                })
            )
        );
        this._inputDistrict = ListingEditorFormComposer.createInputFormRowText(
            'input-district', 'Район'
        );
        this._inputMunicipality = ListingEditorFormComposer.createInputFormRowText(
            'input-municipality', 'Населённый пункт'
        );
        this._inputBlock = ListingEditorFormComposer.createInputFormRowText(
            'input-block', 'Квартал'
        );
        this._inputAddress = ListingEditorFormComposer.createInputFormRowText(
            'input-address', 'Адрес', 'улица название, номер дома'
        );
        this._inputLat = ListingEditorFormComposer.createInputFormRowText(
            'input-lat', 'Широта', '11.11111', true
        );
        this._inputLong = ListingEditorFormComposer.createInputFormRowText(
            'input-long', 'Долгота', '111.11111', true
        );
        this._inputPrecise = ListingEditorFormComposer.createInputFormRowCheckbox(
            'input-precise', 'Точные координаты'
        );
        this._inputYear = ListingEditorFormComposer.createInputFormRowText(
            'input-year', 'Год постройки', 'yyyy', true
        );
        this._inputAuthor = ListingEditorFormComposer.createInputFormRowText(
            'input-author', 'Автор объекта', 'архитектор, скульптор, инженер и т.д.'
        );
        this._inputStyle = ListingEditorFormComposer.createInputFormRowSelect(
            'input-style', 'Стиль', culturalMonumentStyles.map(
                (culturalMonumentStyle) => ({
                    title: culturalMonumentStyle.getTitle(),
                    value: culturalMonumentStyle.getValue()
                })
            )
        );
        this._inputKnid = ListingEditorFormComposer.createInputFormRowText(
            'input-knid', '№ объекта', 'dddddddddd', true
        );
        this._inputComplex = ListingEditorFormComposer.createInputFormRowText(
            'input-complex', '№ комплекса', 'dddddddddd', true
        );
        this._inputImage = ListingEditorFormComposer.createInputFormRowText(
            'input-image', 'Изображение', 'изображение на Викискладе'
        );
        this._inputWiki = ListingEditorFormComposer.createInputFormRowText(
            'input-wiki', 'Википедия', 'статья в русской Википедии'
        );
        this._inputWdid = ListingEditorFormComposer.createInputFormRowText(
            'input-wdid', 'Викиданные', 'идентификатор Викиданных', true
        );
        this._inputCommonscat = ListingEditorFormComposer.createInputFormRowText(
            'input-commonscat', 'Викисклад', 'категория Викисклада'
        );
        this._inputMunid = ListingEditorFormComposer.createInputFormRowText(
            'input-munid', 'Викиданные нас. пункта', 'идентификатор Викиданных', true
        );
        this._inputDocument = ListingEditorFormComposer.createInputFormRowText(
            'input-document', 'Документ', '', true
        );
        this._inputLink = ListingEditorFormComposer.createInputFormRowText(
            'input-link', 'Ссылка №1', 'внешняя ссылка с дополнительной информацией об объекте'
        );
        this._inputLinkExtra = ListingEditorFormComposer.createInputFormRowText(
            'input-linkextra', 'Ссылка №2', 'внешняя ссылка с дополнительной информацией об объекте'
        );

        let selectImageLinkRow = ListingEditorFormComposer.createRowLink('выбрать изображение из галереи');
        selectImageLinkRow.linkElement.click(() => {
            CommonsImagesSelectDialog.showDialog(
                /*knidWLM=*/null,
                this._inputKnid.inputElement.val(),
                this._inputCommonscat.inputElement.val(),
                (selectedImage) => {
                    this._inputImage.inputElement.val(selectedImage);
                }
            )
        });

        let tableObjectName = ListingEditorFormComposer.createTableFullWidth();
        tableObjectName.tableElement.append(this._inputObjectName.rowElement);
        tableObjectName.tableElement.append(ListingEditorFormComposer.createRowDivider());
        this._form.formElement.append(tableObjectName.wrapperElement);

        let tableObjectProperties = ListingEditorFormComposer.createTableTwoColumns();

        tableObjectProperties.leftTableElement.append(ListingEditorFormComposer.createRowDivider());
        tableObjectProperties.leftTableElement.append(this._inputType.rowElement);
        tableObjectProperties.leftTableElement.append(this._inputProtection.rowElement);
        tableObjectProperties.leftTableElement.append(this._inputDestroyed.rowElement);
        tableObjectProperties.leftTableElement.append(ListingEditorFormComposer.createRowDivider());
        tableObjectProperties.leftTableElement.append(this._inputRegion.rowElement);
        tableObjectProperties.leftTableElement.append(this._inputDistrict.rowElement);
        tableObjectProperties.leftTableElement.append(this._inputMunicipality.rowElement);
        tableObjectProperties.leftTableElement.append(this._inputBlock.rowElement);
        tableObjectProperties.leftTableElement.append(this._inputAddress.rowElement);
        tableObjectProperties.leftTableElement.append(ListingEditorFormComposer.createRowDivider());
        tableObjectProperties.leftTableElement.append(this._inputLat.rowElement);
        tableObjectProperties.leftTableElement.append(this._inputLong.rowElement);
        tableObjectProperties.leftTableElement.append(this._inputPrecise.rowElement);
        tableObjectProperties.leftTableElement.append(ListingEditorFormComposer.createRowDivider());
        tableObjectProperties.leftTableElement.append(this._inputYear.rowElement);
        tableObjectProperties.leftTableElement.append(this._inputAuthor.rowElement);
        tableObjectProperties.leftTableElement.append(this._inputStyle.rowElement);

        tableObjectProperties.rightTableElement.append(this._inputKnid.rowElement);
        tableObjectProperties.rightTableElement.append(this._inputComplex.rowElement);
        tableObjectProperties.rightTableElement.append(ListingEditorFormComposer.createRowDivider());
        tableObjectProperties.rightTableElement.append(this._inputImage.rowElement);
        tableObjectProperties.rightTableElement.append(selectImageLinkRow.rowElement);
        tableObjectProperties.rightTableElement.append(this._inputWiki.rowElement);
        tableObjectProperties.rightTableElement.append(this._inputWdid.rowElement);
        tableObjectProperties.rightTableElement.append(this._inputCommonscat.rowElement);
        tableObjectProperties.rightTableElement.append(this._inputMunid.rowElement);
        tableObjectProperties.rightTableElement.append(this._inputDocument.rowElement);
        tableObjectProperties.rightTableElement.append(ListingEditorFormComposer.createRowDivider());
        tableObjectProperties.rightTableElement.append(this._inputLink.rowElement);
        tableObjectProperties.rightTableElement.append(this._inputLinkExtra.rowElement);

        this._form.formElement.append(tableObjectProperties.wrapperElement);

        let tableObjectDescription = ListingEditorFormComposer.createTableFullWidth();
        let objectDescriptionRow = ListingEditorFormComposer.createObjectDescriptionRow();
        this._inputDescription = objectDescriptionRow.inputDescription;
        tableObjectDescription.tableElement.append(objectDescriptionRow.row);
        tableObjectDescription.tableElement.append(ListingEditorFormComposer.createRowDivider());
        this._form.formElement.append(tableObjectDescription.wrapperElement);

        let tableChanges = ListingEditorFormComposer.createTableFullWidth();
        let changesDescriptionRow = ListingEditorFormComposer.createChangesDescriptionRow();
        this._inputChangesSummary = changesDescriptionRow.inputChangesSummary;
        this._inputIsMinorChanges = changesDescriptionRow.inputIsMinorChanges;
        tableChanges.tableElement.append(ListingEditorFormComposer.createRowDivider());
        tableChanges.tableElement.append(changesDescriptionRow.row);
        this._form.formElement.append(tableChanges.wrapperElement);

        this._directMappingInputs = {
            name: this._inputObjectName.inputElement,
            type: this._inputType.inputElement,
            protection: this._inputProtection.inputElement,
            region: this._inputRegion.inputElement,
            district: this._inputDistrict.inputElement,
            municipality: this._inputMunicipality.inputElement,
            block: this._inputBlock.inputElement,
            address: this._inputAddress.inputElement,
            lat: this._inputLat.inputElement,
            long: this._inputLong.inputElement,
            year: this._inputYear.inputElement,
            author: this._inputAuthor.inputElement,
            knid: this._inputKnid.inputElement,
            complex: this._inputComplex.inputElement,
            image: this._inputImage.inputElement,
            wiki: this._inputWiki.inputElement,
            wdid: this._inputWdid.inputElement,
            commonscat: this._inputCommonscat.inputElement,
            munid: this._inputMunid.inputElement,
            document: this._inputDocument.inputElement,
            link: this._inputLink.inputElement,
            linkextra: this._inputLinkExtra.inputElement,
            description: this._inputDescription,
        };
    }

    getForm() {
        return this._form;
    }

    setData(listingData) {
        Object.keys(this._directMappingInputs).forEach((key) => {
            if (listingData[key]) {
                this._directMappingInputs[key].val(listingData[key]);
            }
        });

        if (listingData['style']) {
            this._inputStyle.inputElement.val(listingData['style'].toLowerCase());
        }
        this._inputDestroyed.inputElement.attr('checked', listingData['status'] === 'destroyed');
        this._inputPrecise.inputElement.attr('checked', listingData['precise'] === 'yes');
    }

    getData() {
        let data = {};
        Object.keys(this._directMappingInputs).forEach((key) => {
            data[key] = this._directMappingInputs[key].val();
        });
        if (this._inputDestroyed.inputElement.is(':checked')) {
            data['status'] = 'destroyed';
        } else {
            data['status'] = '';
        }
        if (this._inputPrecise.inputElement.is(':checked')) {
            data['precise'] = 'yes';
        } else {
            data['precise'] = 'no';
        }
        data['link'] = ValidationUtils.normalizeUrl(data['link']);
        data['linkextra'] = ValidationUtils.normalizeUrl(data['linkextra']);
        data['style'] = this._inputStyle.inputElement.val();
        return data;
    }

    getObjectName() {
        return this._inputObjectName.inputElement.val();
    }

    getChangesSummary() {
        return this._inputChangesSummary.val();
    }

    getChangesIsMinor() {
        return this._inputIsMinorChanges.is(':checked');
    }
}

module.exports = CulturalHeritageKZEditorForm;