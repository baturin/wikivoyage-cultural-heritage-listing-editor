
export class MediawikiApi {
    getPageText(pageUrl) {
        return new Promise((resolve, reject) => {
                $.ajax({
                    // TODO ability to specify URL
                    url: mw.util.wikiScript(''),
                    data: {
                        title: pageUrl,
                        action: 'raw',
                    },
                    cache: false
                }).done(function(data) {
                    resolve(data);
                }).fail(function(jqXHR, textStatus, errorThrown) {
                    reject(
                        new Error(
                            'Ошибка при получении исходного вики-текста статьи: ' + textStatus + ' ' + errorThrown
                        )
                    );
                });
            }
        );
    }
}
