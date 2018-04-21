import naturalMonumentStatuses from "./monument-statuses";
import regions from "../regions";
import ListingEditorFormComposer from "../listing-editor-form-composer";
import naturalMonumentTypes from "./monument-types";
import naturalMonumentCategories from "./monument-categories";
import CommonsImagesSelectDialog from '../commons-images-select-dialog';
import ValidationUtils from '../validation-utils';

class NaturalHeritageEditorForm {
    constructor() {
        this._form = ListingEditorFormComposer.createForm();

        this._inputObjectName = ListingEditorFormComposer.createInputFormRowText(
            'input-name', 'Название', 'название объекта', false, true
        );

        this._inputStatus = ListingEditorFormComposer.createInputFormRowSelect(
            'input-status', 'Статус',
            naturalMonumentStatuses.map(
                (status) => ({title: status.getTitle(), value: status.getId()})
            )
        );
        this._inputType = ListingEditorFormComposer.createInputFormRowSelect(
            'input-type', 'Тип',
            naturalMonumentTypes.map(
                (type) => ({title: type.getTitle(), value: type.getId()})
            )
        );
        this._inputCategory = ListingEditorFormComposer.createInputFormRowSelect(
            'input-category', 'Категория',
            naturalMonumentCategories.map(
                (category) => ({title: category.getTitle(), value: category.getId()})
            )
        );

        this._inputRegion = ListingEditorFormComposer.createInputFormRowSelect(
            'input-region', 'Регион',
            regions.map(
                (region) => ({title: region.getTitle(), value: region.getId()})
            )
        );
        this._inputDistrict = ListingEditorFormComposer.createInputFormRowText(
            'input-district', 'Район'
        );
        this._inputMunicipality = ListingEditorFormComposer.createInputFormRowText(
            'input-municipality', 'Населённый пункт'
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

        this._inputArea = ListingEditorFormComposer.createInputFormRowText(
            'input-area', 'Площадь'
        );

        this._inputKnid = ListingEditorFormComposer.createInputFormRowText(
            'input-knid', '№ объекта', 'dddddddddd', true
        );
        this._inputComplex = ListingEditorFormComposer.createInputFormRowText(
            'input-complex', '№ комплекса', 'dddddddddd', true
        );
        this._inputUid = ListingEditorFormComposer.createInputFormRowText(
            'input-uid', '№ объекта (UA)', 'dddddddddd', true
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

        this._inputLink = ListingEditorFormComposer.createInputFormRowText(
            'input-link', 'Ссылка №1', 'внешняя ссылка с дополнительной информацией об объекте'
        );
        this._inputLinkExtra = ListingEditorFormComposer.createInputFormRowText(
            'input-linkextra', 'Ссылка №2', 'внешняя ссылка с дополнительной информацией об объекте'
        );
        this._inputOopt = ListingEditorFormComposer.createInputFormRowText(
            'input-oopt', 'На сайте ООПТ России'
        );
        this._inputDocument = ListingEditorFormComposer.createInputFormRowText(
            'input-document', 'Документ', '', true
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

        tableObjectProperties.leftTableElement.append(this._inputType.rowElement);
        tableObjectProperties.leftTableElement.append(this._inputStatus.rowElement);
        tableObjectProperties.leftTableElement.append(this._inputCategory.rowElement);
        tableObjectProperties.leftTableElement.append(ListingEditorFormComposer.createRowDivider());
        tableObjectProperties.leftTableElement.append(this._inputRegion.rowElement);
        tableObjectProperties.leftTableElement.append(this._inputDistrict.rowElement);
        tableObjectProperties.leftTableElement.append(this._inputMunicipality.rowElement);
        tableObjectProperties.leftTableElement.append(this._inputAddress.rowElement);
        tableObjectProperties.leftTableElement.append(ListingEditorFormComposer.createRowDivider());
        tableObjectProperties.leftTableElement.append(this._inputLat.rowElement);
        tableObjectProperties.leftTableElement.append(this._inputLong.rowElement);
        tableObjectProperties.leftTableElement.append(this._inputPrecise.rowElement);
        tableObjectProperties.leftTableElement.append(ListingEditorFormComposer.createRowDivider());
        tableObjectProperties.leftTableElement.append(this._inputArea.rowElement);

        tableObjectProperties.rightTableElement.append(this._inputKnid.rowElement);
        tableObjectProperties.rightTableElement.append(this._inputComplex.rowElement);
        tableObjectProperties.rightTableElement.append(this._inputUid.rowElement);
        tableObjectProperties.rightTableElement.append(ListingEditorFormComposer.createRowDivider());
        tableObjectProperties.rightTableElement.append(this._inputImage.rowElement);
        tableObjectProperties.rightTableElement.append(selectImageLinkRow.rowElement);
        tableObjectProperties.rightTableElement.append(this._inputWiki.rowElement);
        tableObjectProperties.rightTableElement.append(this._inputWdid.rowElement);
        tableObjectProperties.rightTableElement.append(this._inputCommonscat.rowElement);
        tableObjectProperties.rightTableElement.append(this._inputMunid.rowElement);
        tableObjectProperties.rightTableElement.append(ListingEditorFormComposer.createRowDivider());
        tableObjectProperties.rightTableElement.append(this._inputLink.rowElement);
        tableObjectProperties.rightTableElement.append(this._inputLinkExtra.rowElement);
        tableObjectProperties.rightTableElement.append(this._inputOopt.rowElement);
        tableObjectProperties.rightTableElement.append(this._inputDocument.rowElement);

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
            status: this._inputStatus.inputElement,
            type: this._inputType.inputElement,
            category: this._inputCategory.inputElement,
            region: this._inputRegion.inputElement,
            district: this._inputDistrict.inputElement,
            municipality: this._inputMunicipality.inputElement,
            address: this._inputAddress.inputElement,
            lat: this._inputLat.inputElement,
            long: this._inputLong.inputElement,
            description: this._inputDescription,
            area: this._inputArea.inputElement,
            knid: this._inputKnid.inputElement,
            complex: this._inputComplex.inputElement,
            uid: this._inputUid.inputElement,
            image: this._inputImage.inputElement,
            wiki: this._inputWiki.inputElement,
            wdid: this._inputWdid.inputElement,
            commonscat: this._inputCommonscat.inputElement,
            munid: this._inputMunid.inputElement,
            link: this._inputLink.inputElement,
            linkextra: this._inputLinkExtra.inputElement,
            document: this._inputDocument.inputElement,
            oopt: this._inputOopt.inputElement
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
        this._inputPrecise.inputElement.attr('checked', listingData['precise'] === 'yes');
    }

    getData() {
        let data = {};
        Object.keys(this._directMappingInputs).forEach((key) => {
            data[key] = this._directMappingInputs[key].val();
        });
        if (this._inputPrecise.inputElement.is(':checked')) {
            data['precise'] = 'yes';
        } else {
            data['precise'] = 'no';
        }
        data['link'] = ValidationUtils.normalizeUrl(data['link']);
        data['linkextra'] = ValidationUtils.normalizeUrl(data['linkextra']);
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

module.exports = NaturalHeritageEditorForm;