
import StringUtils from './lib/string-utils';
import MediaWikiPage from './lib/mediawiki-page';
import ListingEditorUtils from './lib/listing-editor-utils';
import ListingEditorButtons from './lib/listing-editor-buttons';
import ListingEditorDialog from './lib/listing-editor-dialog';
import ListingEditorFormComposer from './lib/listing-editor-form-composer';

function isNaturalHeritagePage() {
    return StringUtils.contains(MediaWikiPage.getPageName(), 'Природные_памятники_России');
}

class NaturalHeritageEditorForm {
    constructor() {
        this._form = ListingEditorFormComposer.createForm();


        this._inputObjectName = ListingEditorFormComposer.createInputFormRowText(
            'input-name', 'Название', 'название объекта', false, true
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

        let tableObjectProperties = ListingEditorFormComposer.createTableTwoColumns();

        tableObjectProperties.leftTableElement.append(this._inputObjectName.rowElement);
        tableObjectProperties.leftTableElement.append(this._inputAddress.rowElement);
        tableObjectProperties.rightTableElement.append(this._inputLat.rowElement);
        tableObjectProperties.rightTableElement.append(this._inputLong.rowElement);

        this._form.formElement.append(tableObjectProperties.wrapperElement);
    }

    getForm() {
        return this._form;
    }
}


function naturalHeritageEditorMain() {
    if (!ListingEditorUtils.isEditablePage() || !isNaturalHeritagePage()) {
        return;
    }

    let listingPageElements = ListingEditorUtils.getListingPageElements();

    let sections = listingPageElements.getSections();
    for (let i = 0; i < sections.length; i++) {
        let addButton = ListingEditorButtons.createListingAddButton(sections[i]);
        addButton.click(function(section) {
            let form = new NaturalHeritageEditorForm();
            ListingEditorDialog.showDialog(form.getForm().formElement, "Add", () => alert(1), () => alert(2), () => alert(3));
            window.console.log(section.getSectionIndex());
            window.console.log(section.getHeaderElement());
        });
    }

    let listings = listingPageElements.getListingTables();
    for (let i = 0; i < listings.length; i++) {
        let editButton = ListingEditorButtons.createListingEditButton(listings[i]);
        editButton.click(function(listingTable) {
            window.console.log(listingTable.getSectionIndex());
            window.console.log(listingTable.getListingIndex());
            window.console.log(listingTable.getTableElement());
        });
    }
}

naturalHeritageEditorMain();

