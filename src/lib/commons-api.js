import { AsyncUtils } from "./async-utils";

export const CommonsApi = {
    baseUrl: 'https://commons.wikimedia.org/w/api.php',

    executeRequest: function(parameters, onSuccess) {
        $.ajax({
            url: this.baseUrl,
            data: parameters,
            crossDomain: true,
            dataType: 'jsonp'
        }).done(function(data) {
            onSuccess(data);
        });
    },

    getCategoryFiles: function(category, limit, onSuccess) {
        let self = this;

        self.executeRequest(
            {
                'action': 'query',
                'list': 'categorymembers',
                'cmtype': 'file',
                'cmtitle': 'Category:' + category,
                'cmlimit': 'max',
                'format': 'json'
            },
            function(data) {
                if (data.query && data.query.categorymembers) {
                    let files = [];
                    data.query.categorymembers.forEach(function(member) {
                        if (member.title) {
                            files.push(member.title);
                        }
                    });

                    onSuccess(files);
                }
            }
        );
    },

    getCategoryImages: function(category, limit, onSucess) {
        this.getCategoryFiles(category, limit, function(files) {
            let images = [];
            files.forEach(function(file) {
                let extension = file.toLowerCase().substr(file.length - 4);
                if (extension === '.jpg' || extension === '.png' || extension === '.gif') {
                    images.push(file);
                }
            });
            onSucess(images);
        })
    },

    getImageInfo: function(image, onSuccess) {
        let self = this;

        self.executeRequest(
            {
                'action': 'query',
                'titles': image,
                'prop': 'imageinfo|revisions',
                'iiprop': 'url',
                'iiurlwidth': '200',
                'iiurlheight': '200',
                'rvprop': 'content',
                'rvlimit': '1',
                'format': 'json'
            },
            function(data) {
                if (!data.query || !data.query.pages) {
                    return;
                }

                let pages = data.query.pages;
                let firstPage = pages[Object.keys(pages)[0]];
                if (!firstPage || !firstPage.imageinfo || firstPage.imageinfo.length <= 0) {
                    return;
                }
                let text = '';
                if (firstPage.revisions && firstPage.revisions.length > 0) {
                    let revision = firstPage.revisions[0];
                    if (revision['*']) {
                        text = revision['*'];
                    }
                }

                let imageInfo = firstPage.imageinfo[0];
                onSuccess({
                    'image': image,
                    'thumb': imageInfo.thumburl,
                    'text': text,
                    'url': imageInfo.url
                });
            }
        )
    },

    getImagesInfo: function(images, onSuccess) {
        let self = this;
        AsyncUtils.runSequence(
            images.map(function(image) {
                return function(onSuccess) {
                    self.getImageInfo(image, onSuccess);
                }
            }),
            function(imageInfos) {
                onSuccess(imageInfos);
            }
        );
    },

    /**
     *
     * @param categories list of category titles, e.g. ['Novosibirsk', 'Tomsk', 'Culture_of_Novosibirsk']
     * @param onSuccess function which accepts single argument - list which has category
     * titles for each category which has at least one file, e.g.
     * ['Novosibirsk': 'Culture_of_Novosibirsk']
     */
    hasCategoriesFiles: function(categories, onSuccess) {
        let maxChunkSize = 30;
        AsyncUtils.runChunks(
            (categoriesChunk, onSuccess) => {
                this.executeRequest(
                    {
                        action: 'query',
                        titles: categoriesChunk.join("|"),
                        prop: 'categoryinfo',
                        format: 'json'
                    },
                    (data) => {
                        let result = [];

                        if (!data || !data.query || !data.query.pages) {
                            return;
                        }
                        Object.keys(data.query.pages).forEach(function (key) {
                            let pageInfo = data.query.pages[key];
                            if (
                                pageInfo.title &&
                                pageInfo.categoryinfo &&
                                pageInfo.categoryinfo.files &&
                                pageInfo.categoryinfo.files > 0
                            ) {
                                result.push(pageInfo.title);
                            }
                        });

                        onSuccess(result);
                    }
                );
            },
            maxChunkSize,
            categories,
            onSuccess
        );
    },

    /**
     *
     * @param categories list of category titles, e.g. ['Novosibirsk', 'Tomsk', 'Culture_of_Novosibirsk']
     * @param onSuccess function which accepts single argument -  list where each item has category
     * title and files count, e.g. [
     *   {category: 'Novosibirsk', files: 51},
     *   {category: 'Tomsk', files: 42}
     *   {category: 'Culture_of_Novosibirsk', files: 48}
     * ]
     */
    countCategoriesFiles: function(categories, onSuccess) {
        let maxChunkSize = 30;
        AsyncUtils.runChunks(
            (categoriesChunk, onSuccess) => {
                this.executeRequest(
                    {
                        action: 'query',
                        titles: categoriesChunk.join("|"),
                        prop: 'categoryinfo',
                        format: 'json'
                    },
                    (data) => {
                        let result = [];

                        if (!data || !data.query || !data.query.pages) {
                            return;
                        }
                        Object.keys(data.query.pages).forEach(function (key) {
                            let pageInfo = data.query.pages[key];
                            if (pageInfo.title) {
                                const filesCount = (
                                    (pageInfo.categoryinfo && pageInfo.categoryinfo.files) ?
                                        pageInfo.categoryinfo.files : 0
                                );
                                result.push({
                                    category: pageInfo.title,
                                    files: filesCount
                                });
                            }
                        });

                        onSuccess(result);
                    }
                );
            },
            maxChunkSize,
            categories,
            onSuccess
        );
    }
};
