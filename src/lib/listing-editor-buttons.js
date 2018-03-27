
class ListingEditorButtonEdit {
    constructor(button, listingTable) {
        this._button = button;
        this._listingTable = listingTable;
    }

    click(handler) {
        this._button.click(
            () => handler(this._listingTable)
        );
    }
}

class ListingEditorButtonAdd {
    constructor(button, section) {
        this._button = button;
        this._section = section;
    }

    click(handler) {
        this._button.click(
            () => handler(this._section)
        );
    }
}


let ListingEditorButtons = {
    /**
     *
     * @param listingTable ListingTable
     */
    createListingEditButton(listingTable) {
        let editListingButton = $('<span class="vcard-edit-button noprint" style="padding-left: 5px;">');
        editListingButton.html('<a href="javascript:" class="icon-pencil" title="Редактировать">Редактировать</a>');

        let nameElement = listingTable.getTableElement().find('span.monument-name').first();
        if (nameElement) {
            nameElement.append(editListingButton);
        }

        return new ListingEditorButtonEdit(editListingButton, listingTable);
    },

    createListingAddButton(section) {
        let sectionAddButton = $('<a href="javascript:">добавить</a>');
        let bracketStart = $('<span class="mw-editsection-bracket">[</span>');
        let bracketEnd = $('<span class="mw-editsection-bracket">]</span>');
        section.getHeaderElement().append(
            $('<span class="mw-editsection"/>').append(bracketStart).append(sectionAddButton).append(bracketEnd)
        );

        return new ListingEditorButtonAdd(sectionAddButton, section);
    }
};

module.exports = ListingEditorButtons;