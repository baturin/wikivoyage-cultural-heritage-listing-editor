import commonMessages from './messages';

class CaptchaDialog {
    constructor(captchaImgSrc, onCaptchaSubmit) {
        this._captcha = $('<div id="captcha-dialog">');
        $('<img class="fancycaptcha-image">').attr('src', captchaImgSrc).appendTo(this._captcha);
        $('<input id="input-captcha" type="text">').appendTo(this._captcha);

        this._captcha.dialog({
            modal: true,
            title: commonMessages.enterCaptcha,
            buttons: [
                {
                    text: commonMessages.captchaSubmit,
                    click: () => {
                        onCaptchaSubmit($('#input-captcha').val());
                        this.destroy()
                    }
                },
                {
                    text: commonMessages.captchaCancel,
                    click: () => this.destroy()
                }
            ]
        });
    }


    destroy() {
        this._captcha.dialog('destroy').remove();
    }
}

module.exports = CaptchaDialog;
