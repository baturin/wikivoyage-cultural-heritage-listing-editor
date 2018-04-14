
let InputInsertSymbols = require('./input-insert-symbols');

let ListingEditorFormComposer = {
    createInputFormRow: function(inputElementId, labelText)
    {
        let rowElement = $('<tr>');
        let label = $('<label>', {
            'for': inputElementId,
            'html': labelText
        });
        let labelColumn = $('<td>', {
            'class': "editor-label-col",
            'style': "width: 200px"
        }).append(label);
        let inputColumnElement = $('<td>');
        rowElement.append(labelColumn).append(inputColumnElement);
        return {
            'rowElement': rowElement,
            'inputColumnElement': inputColumnElement
        };
    },
    createInputFormRowCheckbox: function(inputElementId, labelText) {
        let row = this.createInputFormRow(inputElementId, labelText);
        let inputElement = $('<input>', {
            'type': 'checkbox',
            'id': inputElementId
        });
        row.inputColumnElement.append(inputElement);
        return {
            'rowElement': row.rowElement,
            'inputElement': inputElement
        }
    },
    createInputFormRowSelect: function(inputElementId, labelText, options)
    {
        let row = this.createInputFormRow(inputElementId, labelText);
        let inputElement = $('<select>', {
            'id': inputElementId
        });
        options.forEach(function(option) {
            let optionElement = $('<option>', {
                'value': option.value,
                'html': option.title
            });
            inputElement.append(optionElement);
        });
        row.inputColumnElement.append(inputElement);
        return {
            'rowElement': row.rowElement,
            'inputElement': inputElement
        }
    },
    createInputFormRowText: function(inputElementId, labelText, placeholderText, partialWidth, insertSymbols)
    {
        if (!placeholderText) {
            placeholderText = '';
        }
        let row = this.createInputFormRow(inputElementId, labelText);
        let inputElement = $('<input>', {
            'type': 'text',
            'class': partialWidth ? 'editor-partialwidth' : 'editor-fullwidth',
            'style': insertSymbols ? 'width: 90%': '',
            'placeholder': placeholderText,
            'id': inputElementId
        });
        row.inputColumnElement.append(inputElement);

        if (insertSymbols) {
            let buttonInsertQuotes = $('<a>', {
                'class': 'name-quotes-template',
                href: 'javascript:;',
                html: '«»'
            });
            let buttonInsertDash = $('<a>', {
                'class': 'name-dash-template',
                href: 'javascript:;',
                html: '—'
            });
            InputInsertSymbols.addDashInsertHandler(buttonInsertDash, inputElement);
            InputInsertSymbols.addQuotesInsertHandler(buttonInsertQuotes, inputElement);

            row.inputColumnElement.append('&nbsp;');
            row.inputColumnElement.append(buttonInsertQuotes);
            row.inputColumnElement.append('&nbsp;');
            row.inputColumnElement.append(buttonInsertDash);
        }

        return {
            'rowElement': row.rowElement,
            'inputElement': inputElement
        }
    },
    createRowDivider: function() {
        return $('<tr>').append(
            $('<td>', {'colspan': "2"}).append(
                $('<div>', {
                    'class': "listing-divider",
                    'style': "margin: 3px 0"
                })
            )
        );
    },
    createRowLink: function(linkText) {
        let linkElement = $("<a>", {
            'href': 'javascript:;',
            'html': linkText
        });
        let rowElement = $('<tr>').append($('<td>')).append($('<td>').append(linkElement));
        return {
            'rowElement': rowElement,
            'linkElement': linkElement
        }
    },
    createChangesDescriptionRow: function () {
        let inputChangesSummary = $('<input>', {
            'type': "text",
            'class': "editor-partialwidth",
            'placeholder': "что именно было изменено",
            'id': "input-summary"
        });
        let inputIsMinorChanges = $('<input>', {
            'type': "checkbox",
            'id': "input-minor"
        });
        let labelChangesSummary = $('<label>', {
            'for': "input-summary",
            'html': 'Описание изменений'
        });
        let labelIsMinorChanges = $('<label>', {
            'for': "input-minor",
            'class': "listing-tooltip",
            'title': "Установите галочку, если изменение незначительное, например, исправление опечатки",
            'html': 'незначительное изменение?'
        });
        let spanIsMinorChanges = $('<span>', {id: "span-minor"});
        spanIsMinorChanges.append(inputIsMinorChanges).append(labelIsMinorChanges);
        let row = $('<tr>');
        row.append($('<td>', {'class': "editor-label-col", style: "width: 200px"}).append(labelChangesSummary));
        row.append($('<td>').append(inputChangesSummary).append(spanIsMinorChanges));
        return {
            'row': row,
            'inputChangesSummary': inputChangesSummary,
            'inputIsMinorChanges': inputIsMinorChanges
        };
    },
    createObjectDescriptionRow: function() {
        let inputDescription = $('<textarea>', {
            'rows': "4",
            'class': "editor-fullwidth",
            'placeholder': "описание объекта",
            'id': "input-description"
        });
        let labelDescription = $('<label>', {
            'for': "input-description",
            'html': "Описание"
        });
        let row = $('<tr>');
        row.append($('<td>', {'class': "editor-label-col", 'style': "width: 200px"}).append(labelDescription));
        row.append($('<td>').append(inputDescription));
        return {
            'row': row,
            'inputDescription': inputDescription
        }
    },
    createTableFullWidth: function()
    {
        let tableElement = $('<table>', {
            'class': 'editor-fullwidth'
        });
        let wrapperElement = $('<div>');
        wrapperElement.append(tableElement);
        return {
            'wrapperElement': wrapperElement,
            'tableElement': tableElement
        };
    },
    createTableTwoColumns: function()
    {
        let leftTableElement = $('<table>', {
            'class': "editor-fullwidth"
        });
        let rightTableElement = $('<table>', {
            'class': "editor-fullwidth"
        });
        let wrapperElement = $('<div>');
        wrapperElement.append(
            $('<div>', {
                'class': 'listing-col listing-span_1_of_2'
            }).append(leftTableElement)
        );
        wrapperElement.append(
            $('<div>', {
                'class': 'listing-col listing-span_1_of_2'
            }).append(rightTableElement)
        );
        return {
            'wrapperElement': wrapperElement,
            'leftTableElement': leftTableElement,
            'rightTableElement': rightTableElement
        };
    },
    createForm: function() {
        let formElement = $('<form id="listing-editor">');
        formElement.append($('<br>'));
        return {
            'formElement': formElement
        }
    }
};

module.exports = ListingEditorFormComposer;