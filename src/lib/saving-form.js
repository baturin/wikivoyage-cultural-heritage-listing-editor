
class SavingForm {
    constructor() {
        this._progress = $('<div id="progress-dialog">' + 'Сохранение...' + '</div>');
        this._progress.dialog({
            modal: true,
            height: 100,
            width: 300,
            title: ''
        });
        $(".ui-dialog-titlebar").hide();
    }

    destroy() {
        this._progress.dialog('destroy').remove();
    }
}

module.exports = SavingForm;