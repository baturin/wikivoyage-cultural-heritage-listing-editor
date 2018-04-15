
import commonMessages from './messages';

let api = new mw.Api();

let MediaWikiPageWikitext = {
    loadSectionWikitext(sectionIndex, onSuccess) {
        $.ajax({
            url: mw.util.wikiScript(''),
            data: {
                title: mw.config.get('wgPageName'),
                action: 'raw',
                section: sectionIndex
            },
            cache: false
        }).done(function(data) {
            onSuccess(data);
        }).fail(function(jqXHR, textStatus, errorThrown) {
            alert('Ошибка при получении исходного вики-текста статьи: ' + textStatus + ' ' + errorThrown);
        });
    },

    saveSectionWikitext(
        sectionIndex, sectionWikitext,
        changesSummary, changesIsMinor,
        captchaId, captchaAnswer,
        onSuccess, onFailure, onCaptcha
    ) {
        let editPayload = {
            action: "edit",
            title: mw.config.get( "wgPageName" ),
            section: sectionIndex,
            text: sectionWikitext,
            summary: changesSummary,
            captchaid: captchaId,
            captchaword: captchaAnswer
        };
        if (changesIsMinor) {
            $.extend(editPayload, { minor: 'true' });
        }

        api.postWithToken(
            "csrf",
            editPayload
        ).done(function(data) {
            if (data && data.edit && data.edit.result === 'Success') {
                onSuccess();
            } else if (data && data.error) {
                onFailure(commonMessages.submitApiError + ' "' + data.error.code + '": ' + data.error.info);
            } else if (data && data.edit.spamblacklist) {
                onFailure(commonMessages.submitBlacklistError + ': ' + data.edit.spamblacklist);
            } else if (data && data.edit.captcha) {
                onCaptcha(data.edit.captcha.url, data.edit.captcha.id);
            } else {
                onFailure(commonMessages.submitUnknownError);
            }
        }).fail(function(code, result) {
            if (code === "http") {
                onFailure(commonMessages.submitHttpError + ': ' + result.textStatus );
            } else if (code === "ok-but-empty") {
                onFailure(commonMessages.submitEmptyError);
            } else {
                onFailure(commonMessages.submitUnknownError + ': ' + code );
            }
        });
    },

    getSectionName(sectionWikitext) {
        let HEADING_REGEX = /^=+\s*([^=]+)\s*=+\s*\n/;
        let result = HEADING_REGEX.exec(sectionWikitext);
        return (result !== null) ? result[1].trim() : "";
    }
};

module.exports = MediaWikiPageWikitext;