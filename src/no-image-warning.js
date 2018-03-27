//<nowiki>
mw.loader.using(['mediawiki.api'], function() {
    'use strict';

    var CommonsApi = {
        baseUrl: 'https://commons.wikimedia.org/w/api.php',

        executeRequest: function (parameters, onSuccess) {
            $.post({
                url: this.baseUrl,
                data: parameters,
                crossDomain: true,
                dataType: 'jsonp'
            }).done(function (data) {
                onSuccess(data);
            });
        },

        hasCategoriesFiles: function(categories, onSuccess) {
            var maxChunkSize = 30;
            for (var catNumStart = 0; catNumStart < categories.length; catNumStart += maxChunkSize) {
                var categoriesChunk = categories.slice(catNumStart, catNumStart + maxChunkSize);
                this.executeRequest(
                    {
                        action: 'query',
                        titles: categoriesChunk.join("|"),
                        prop: 'categoryinfo',
                        format: 'json'
                    },
                    function (data) {
                        var result = {};

                        if (!data || !data.query || !data.query.pages) {
                            return;
                        }
                        Object.keys(data.query.pages).forEach(function (key) {
                            var pageInfo = data.query.pages[key];
                            if (
                                pageInfo.title &&
                                pageInfo.categoryinfo &&
                                pageInfo.categoryinfo.files &&
                                pageInfo.categoryinfo.files > 0
                            ) {
                                result[pageInfo.title] = true;
                            }
                        });

                        onSuccess(result);
                    }
                );
            }
        }
    };

    $(document).ready(function() {
        var imagesWithNoPhoto = [];

        $('table.monument').each(function() {
            var monumentTable = $(this);

            var hasPhoto = true;
            monumentTable.find('a').each(function() {
                var aElem = $(this);
                if (aElem.text() === 'Нет фото' || aElem.attr('title') === 'Нет фото') {
                    hasPhoto = false;
                    return false;
                }
            });

            if (hasPhoto) {
                return;
            }

            var wlmCategory = null;

            monumentTable.find('a.extiw').each(function() {
                var linkElem = $(this);
                var href = linkElem.attr('href');
                if (!href) {
                    return;
                }

                if (href.indexOf('https://commons.wikimedia.org/wiki/Category:WLM/') === 0) {
                    wlmCategory = href.replace(/https:\/\/commons\.wikimedia\.org\/wiki\//, '');
                    return false;
                }
            });

            if (wlmCategory) {
                var nameElement = monumentTable.find('span.monument-name').first();
                if (nameElement) {
                    imagesWithNoPhoto.push({
                        wlmCategory: wlmCategory,
                        nameElement: nameElement
                    });
                }
            }
        });

        var categories = [];
        imagesWithNoPhoto.forEach(function(elem) {
            categories.push(elem.wlmCategory);
        });

        CommonsApi.hasCategoriesFiles(categories, function(result) {
            imagesWithNoPhoto.forEach(function(imageWithNoPhoto) {
                var imageCat = imageWithNoPhoto.wlmCategory;
                if (result[imageCat]) {
                    $('<span>', {html: '&nbsp;[в галерее WLM есть изображения]', style: 'color: red;'}).insertAfter(
                        imageWithNoPhoto.nameElement
                    );
                }
            });
        });
    });
});
//</nowiki>