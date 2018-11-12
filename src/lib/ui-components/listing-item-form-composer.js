import {InputInsertSymbols} from "../input-insert-symbols";

export const ListingItemFormComposer = {
    createTextInput(size) {
        const input = $('<input>').attr({
            'type': 'text',
            'style': 'font-size: 97%; border: 1px solid grey;'
        });
        if (size) {
            input.attr('size', size);
        }
        return input;
    },

    createTextInputLarge() {
        return $('<input>').attr({
            'type': 'text',
            'style': 'font-size: 97%; border: 1px solid grey; width: 600px;'
        });
    },

    createTextInputSmall() {
        return $('<input>').attr({
            'type': 'text',
            'style': 'font-size: 97%; border: 1px solid grey; width: 100px;'
        });
    },

    createTextarea() {
        return $('<textarea>').attr({
            'type': 'text',
            'style': 'font-size: 97%; border: 1px solid grey; width: 600px;',
            'rows': '3'
        });
    },

    createCheckboxInput() {
        return $('<input>').attr({
            'type': 'checkbox',
            'style': 'border: 1px solid grey;'
        });
    },

    createSelector(options) {
        const inputElement = (
            $('<select>')
                .attr({
                    'style': 'font-size: 97%; border: 1px solid grey; width: 200px;',
                })
        );
        options.forEach(function(option) {
            const optionElement = $('<option>', {
                'value': option.value,
                'html': option.title
            });
            inputElement.append(optionElement);
        });
        return inputElement;
    },

    createFormRow(rowTitle) {
        return $('<div>')
            .attr('style', 'display: flex; flex-wrap: wrap;')
            .append(
                $('<div>')
                    .attr('style', 'font-weight: bold; padding-top: 5px;')
                    .text(rowTitle)
            );
    },

    createFormElement(title, input) {
        const formElement = (
            $('<div>')
                .attr('style', 'padding-left: 5px; display: flex; padding-top: 5px;')
        );
        if (title) {
            formElement.append(
                $('<div>')
                    .attr('style', 'padding-left: 5px;')
                    .text(title)
            );
        }
        formElement.append(
            $('<div>')
                .attr('style', 'padding-left: 5px;')
                .append(input)
        );

        return formElement;
    },

    createInsertSymbols(input) {
        const buttonInsertQuotes = $('<a>', {
            'class': 'name-quotes-template',
            href: 'javascript:;',
            html: '«»'
        });
        const buttonInsertDash = $('<a>', {
            'class': 'name-dash-template',
            href: 'javascript:;',
            html: '—'
        });
        InputInsertSymbols.addDashInsertHandler(buttonInsertDash, input);
        InputInsertSymbols.addQuotesInsertHandler(buttonInsertQuotes, input);

        return $('<span>')
            .append('&nbsp;')
            .append(buttonInsertQuotes)
            .append('&nbsp;')
            .append(buttonInsertDash);
    }
};
