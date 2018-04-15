let CommonsImagesLoader = require('./commons-images-loader');

let CommonsImagesSelectDialog = {
    showDialog: function(knidWLM, knidWLE, commonsCat, onImageSelected) {
        let dialogElement = $('<div>');
        dialogElement.dialog({
            modal: true,
            height: 400,
            width: 800,
            title: 'Выбор изображения из галереи'
        });

        let loadingElement = $('<div>', {'html': 'загрузка...'});
        let contentElement = $('<div>');
        dialogElement.append(contentElement);
        dialogElement.append(loadingElement);

        function createImageElement(image)
        {
            let imageThumbElement = $('<img>',  {'alt': 'Image', 'src': image.thumb});
            let commonsUrl = 'https://commons.wikimedia.org/wiki/' + image.image;
            let selectLink = $('<a>', {
                href: 'javascript:;',
                html: '[выбрать]'
            });
            let viewLink = $('<a>', {
                href: commonsUrl,
                target: '_blank',
                html: '[смотреть]'
            });

            selectLink.click(function() {
                let imageName = image.image.replace(/^File:/, '').replace(' ', '_');
                onImageSelected(imageName);
                dialogElement.dialog('destroy')
            });

            let imageBlock = $('<div>', {
                style: 'padding: 5px; width: 210px; display: flex; flex-direction: column;' +
                'justify-content: center; align-items: center; align-content: center;'
            });
            imageBlock.append(imageThumbElement);
            imageBlock.append(selectLink);
            imageBlock.append(viewLink);
            return imageBlock;
        }

        function createImagesBlock(blockTitle, images)
        {
            let block = $('<div>');
            block.append($('<h5>', {'html': blockTitle}));

            let currentRow = null;
            let imagesInRow = 0;

            function addImage(image) {
                if (!currentRow || imagesInRow >= 4) {
                    currentRow = $('<div>', {
                        style: 'display: flex; flex-direction: row'
                    });
                    block.append(currentRow);
                    imagesInRow = 0;
                }

                currentRow.append(createImageElement(image));
                imagesInRow++;
            }

            images.forEach(function(image) {
                addImage(image);
            });

            return block;
        }

        CommonsImagesLoader.loadImagesFromWLMCategory(knidWLM, function(wlmImages) {
            if (wlmImages.length > 0) {
                contentElement.append(createImagesBlock(
                    "Изображения из категории WLM", wlmImages
                ));
            }

            CommonsImagesLoader.loadImagesFromWLECategory(knidWLE, function(wleImages) {
                if (wleImages.length > 0) {
                    contentElement.append(createImagesBlock(
                        "Изображения из категории WLE", wleImages
                    ));
                }

                CommonsImagesLoader.loadImagesFromCommonsCategory(commonsCat, function (commonsCatImages) {
                    if (commonsCatImages.length > 0) {
                        contentElement.append(createImagesBlock(
                            "Изображения из категории Commons", commonsCatImages
                        ));
                    }
                    if (wlmImages.length === 0 && wleImages.length === 0 && commonsCatImages.length === 0) {
                        contentElement.append(
                            $('<div>', {'html': "Для данного объекта нет ни одного изображения"})
                        );
                    }
                    loadingElement.hide();
                });
            });
        });
    }
};

module.exports = CommonsImagesSelectDialog;