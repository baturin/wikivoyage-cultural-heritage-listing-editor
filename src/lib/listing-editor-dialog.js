
const MAX_DIALOG_WIDTH = 1200;
const LICENSE_TEXT = 'Нажимая кнопку «Сохранить», вы соглашаетесь с <a class="external" target="_blank" href="https://wikimediafoundation.org/wiki/Terms_of_Use/ru">условиями использования</a>, а также соглашаетесь на неотзывную публикацию по лицензии <a class="external" target="_blank" href="https://en.wikipedia.org/wiki/ru:Википедия:Текст_Лицензии_Creative_Commons_Attribution-ShareAlike_3.0_Unported">CC-BY-SA 3.0</a>.';

let ListingEditorDialog = {
    showDialog(formElement, dialogTitle, onSubmit, onCancel, onHelp) {
        let windowWidth = $(window).width();
        let dialogWidth = (windowWidth > MAX_DIALOG_WIDTH) ? MAX_DIALOG_WIDTH : 'auto';

        mw.loader.using(['jquery.ui.dialog'], function () {
            formElement.dialog({
                modal: true,
                height: 'auto',
                width: dialogWidth,
                title: dialogTitle,
                dialogClass: 'listing-editor-dialog',
                buttons: [
                    {
                        text: '?',
                        id: 'listing-help',
                        click: function() {
                            onHelp();
                        }
                    },
                    {
                        text: "Сохранить",
                        click: function() {
                            onSubmit();
                        }
                    },
                    {
                        text: "Отмена",
                        click: function() {
                            onCancel();
                        }
                    }
                ],
                create: function() {
                    $('.ui-dialog-buttonpane').append('<div class="listing-license">' + LICENSE_TEXT + '</div>');
                }
            });
        });
    }
};

module.exports = ListingEditorDialog;