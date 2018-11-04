
export class MediawikiApi {
    getPageText(pageUrl, onSuccess, onError) {
        $.ajax({
            // TODO ability to specify URL
            url: mw.util.wikiScript(''),
            data: {
                title: pageUrl,
                action: 'raw',
            },
            cache: false
        }).done(function(data) {
            onSuccess(data);
        }).fail(function(jqXHR, textStatus, errorThrown) {
            onError(
                new Error(
                    'Ошибка при получении исходного вики-текста статьи: ' + textStatus + ' ' + errorThrown
                )
            );
        });
    }
}
