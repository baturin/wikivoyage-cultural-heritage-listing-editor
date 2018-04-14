
InputInsertSymbols = {
    addQuotesInsertHandler(insertButton, insertToInput) {
        insertButton.click(function() {
            let selectionStart = insertToInput[0].selectionStart;
            let selectionEnd = insertToInput[0].selectionEnd;
            let oldValue = insertToInput.val();
            let newValue = (
                oldValue.substring(0, selectionStart) +
                "«" + oldValue.substring(selectionStart, selectionEnd) + "»" +
                oldValue.substring(selectionEnd)
            );
            insertToInput.val(newValue);
            InputInsertSymbols._selectRange(insertToInput[0], selectionStart + 1, selectionEnd + 1);
        });
    },

    addDashInsertHandler(insertButton, insertToInput) {
        insertButton.click(function() {
            let caretPos = insertToInput[0].selectionStart;
            let oldValue = insertToInput.val();
            let newValue = oldValue.substring(0, caretPos) + "—" + oldValue.substring(caretPos);
            insertToInput.val(newValue);
            InputInsertSymbols._selectRange(insertToInput[0], caretPos + 1);
        });
    },

    _selectRange(element, start, end) {
        if(end === undefined) {
            end = start;
        }
        element.focus();
        if('selectionStart' in element) {
            element.selectionStart = start;
            element.selectionEnd = end;
        } else if(element.setSelectionRange) {
            element.setSelectionRange(start, end);
        } else if(element.createTextRange) {
            let range = element.createTextRange();
            range.collapse(true);
            range.moveEnd('character', end);
            range.moveStart('character', start);
            range.select();
        }
    }
};

module.exports = InputInsertSymbols;