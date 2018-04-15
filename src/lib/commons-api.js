let AsyncUtils = require('./async-utils');

let CommonsApi = {
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
    }
};

module.exports = CommonsApi;