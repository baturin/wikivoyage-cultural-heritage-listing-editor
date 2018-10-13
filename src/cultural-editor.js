/******************************************************************
 Russian Cultural Heritage Listing Editor.

 Forked from "Listing Editor v2.1"
 - Original author: torty3
 - Additional contributors: Andyrom75, Wrh2, AlexeyBaturin
 ********************************************************************/
//<nowiki>
mw.loader.using(['mediawiki.api'], function() {
    'use strict';

    var CulturalHeritageListingEditor = {};

    var StringUtils = {
        contains: function(string, substring) {
            return string.indexOf(substring) >= 0;
        }
    };

    var monumentListingParameterDescriptors = [
        {
            id: 'name'
        },
        {
            id: 'type',
            possibleValues: [
                {
                    value: 'architecture',
                    title: 'памятник архитектуры'
                },
                {
                    value: 'history',
                    title: 'памятник истории'
                },
                {
                    value: 'monument',
                    title: 'памятник монументального искусства'
                },
                {
                    value: 'archeology',
                    title: 'памятник археологии'
                }
            ]
        },
        {
            id: 'style',
            possibleValues: [
                {
                    value: '',
                    title: ''
                },
                {
                    value: 'конструктивизм',
                    title: 'конструктивизм'
                },
                {
                    value: 'модерн',
                    title: 'модерн'
                }
            ]
        },
        {
            id: 'status'
        },
        {
            id: 'region',
            possibleValues: [
                {
                    value: "",
                    title: "не задан"
                },
                {
                    value: "ru-ad",
                    title: "Адыгея"
                },
                {
                    value: "ru-ba",
                    title: "Башкортостан"
                },
                {
                    value: "ru-bu",
                    title: "Бурятия"
                },
                {
                    value: "ru-al",
                    title: "Алтай"
                },
                {
                    value: "ru-da",
                    title: "Дагестан"
                },
                {
                    value: "ru-in",
                    title: "Ингушетия"
                },
                {
                    value: "ru-kb",
                    title: "Кабардино-Балкария"
                },
                {
                    value: "ru-kl",
                    title: "Калмыкия"
                },
                {
                    value: "ru-kc",
                    title: "Карачаево-Черкесия"
                },
                {
                    value: "ru-krl",
                    title: "Карелия"
                },
                {
                    value: "ru-ko",
                    title: "республика Коми"
                },
                {
                    value: "ru-me",
                    title: "Марий Эл"
                },
                {
                    value: "ru-mo",
                    title: "Мордовия"
                },
                {
                    value: "ru-sa",
                    title: "Якутия (Саха)"
                },
                {
                    value: "ru-se",
                    title: "Северная Осетия"
                },
                {
                    value: "ru-ta",
                    title: "Татарстан"
                },
                {
                    value: "ru-ty",
                    title: "Тува"
                },
                {
                    value: "ru-ud",
                    title: "Удмуртия"
                },
                {
                    value: "ru-kk",
                    title: "Хакасия"
                },
                {
                    value: "ru-ce",
                    title: "Чеченская республика"
                },
                {
                    value: "ru-chv",
                    title: "Чувашия"
                },
                {
                    value: "ru-alt",
                    title: "Алтайский край"
                },
                {
                    value: "ru-kda",
                    title: "Краснодарский край"
                },
                {
                    value: "ru-kya",
                    title: "Красноярский край"
                },
                {
                    value: "ru-pri",
                    title: "Приморский край"
                },
                {
                    value: "ru-sta",
                    title: "Ставропольский край"
                },
                {
                    value: "ru-kha",
                    title: "Хабаровский край"
                },
                {
                    value: "ru-amu",
                    title: "Амурская область"
                },
                {
                    value: "ru-ark",
                    title: "Архангельская область"
                },
                {
                    value: "ru-ast",
                    title: "Астраханская область"
                },
                {
                    value: "ru-bel",
                    title: "Белгородская область"
                },
                {
                    value: "ru-bry",
                    title: "Брянская область"
                },
                {
                    value: "ru-vla",
                    title: "Владимирская область"
                },
                {
                    value: "ru-vgg",
                    title: "Волгоградская область"
                },
                {
                    value: "ru-vol",
                    title: "Вологодская область"
                },
                {
                    value: "ru-vor",
                    title: "Воронежская область"
                },
                {
                    value: "ru-iva",
                    title: "Ивановская область"
                },
                {
                    value: "ru-irk",
                    title: "Иркутская область"
                },
                {
                    value: "ru-kal",
                    title: "Калининградская область"
                },
                {
                    value: "ru-klu",
                    title: "Калужская область"
                },
                {
                    value: "ru-kam",
                    title: "Камчатский край"
                },
                {
                    value: "ru-kem",
                    title: "Кемеровская область"
                },
                {
                    value: "ru-kir",
                    title: "Кировская область"
                },
                {
                    value: "ru-kos",
                    title: "Костромская область"
                },
                {
                    value: "ru-kgn",
                    title: "Курганская область"
                },
                {
                    value: "ru-krs",
                    title: "Курская область"
                },
                {
                    value: "ru-len",
                    title: "Ленинградская область"
                },
                {
                    value: "ru-lip",
                    title: "Липецкая область"
                },
                {
                    value: "ru-mag",
                    title: "Магаданская область"
                },
                {
                    value: "ru-mos",
                    title: "Московская область"
                },
                {
                    value: "ru-mur",
                    title: "Мурманская область"
                },
                {
                    value: "ru-niz",
                    title: "Нижегородская область"
                },
                {
                    value: "ru-ngr",
                    title: "Новгородская область"
                },
                {
                    value: "ru-nvs",
                    title: "Новосибирская область"
                },
                {
                    value: "ru-oms",
                    title: "Омская область"
                },
                {
                    value: "ru-ore",
                    title: "Оренбургская область"
                },
                {
                    value: "ru-orl",
                    title: "Орловская область"
                },
                {
                    value: "ru-pnz",
                    title: "Пензенская область"
                },
                {
                    value: "ru-per",
                    title: "Пермский край"
                },
                {
                    value: "ru-psk",
                    title: "Псковская область"
                },
                {
                    value: "ru-ros",
                    title: "Ростовская область"
                },
                {
                    value: "ru-rya",
                    title: "Рязанская область"
                },
                {
                    value: "ru-sam",
                    title: "Самарская область"
                },
                {
                    value: "ru-sar",
                    title: "Саратовская область"
                },
                {
                    value: "ru-sak",
                    title: "Сахалинская область"
                },
                {
                    value: "ru-sve",
                    title: "Свердловская область"
                },
                {
                    value: "ru-smo",
                    title: "Смоленская область"
                },
                {
                    value: "ru-tam",
                    title: "Тамбовская область"
                },
                {
                    value: "ru-tve",
                    title: "Тверская область"
                },
                {
                    value: "ru-tom",
                    title: "Томская область"
                },
                {
                    value: "ru-tul",
                    title: "Тульская область"
                },
                {
                    value: "ru-tyu",
                    title: "Тюменская область"
                },
                {
                    value: "ru-uly",
                    title: "Ульяновская область"
                },
                {
                    value: "ru-che",
                    title: "Челябинская область"
                },
                {
                    value: "ru-zab",
                    title: "Забайкальский край"
                },
                {
                    value: "ru-yar",
                    title: "Ярославская область"
                },
                {
                    value: "ru-mow",
                    title: "Москва"
                },
                {
                    value: "ru-spb",
                    title: "Санкт-Петербург"
                },
                {
                    value: "ru-jew",
                    title: "Еврейская автономная область"
                },
                {
                    value: "ru-km",
                    title: "Крым"
                },
                {
                    value: "ru-nen",
                    title: "Ненецкий автономный округ"
                },
                {
                    value: "ru-khm",
                    title: "Ханты-Мансийский автономный округ"
                },
                {
                    value: "ru-chu",
                    title: "Чукотский автономный округ"
                },
                {
                    value: "ru-yam",
                    title: "Ямало-Ненецкий автономный округ"
                },
                {
                    value: "ru-sev",
                    title: "Севастополь"
                }
            ]
        },
        {
            id: 'district'
        },
        {
            id: 'municipality'
        },
        {
            id: 'block'
        },
        {
            id: 'address'
        },
        {
            id: 'lat'
        },
        {
            id: 'long'
        },
        {
            id: 'precise'
        },
        {
            id: 'year'
        },
        {
            id: 'author'
        },
        {
            id: 'knid'
        },
        {
            id: 'complex'
        },
        {
            id: 'knid-new'
        },
        {
            id: 'image'
        },
        {
            id: 'wiki'
        },
        {
            id: 'wdid'
        },
        {
            id: 'commonscat'
        },
        {
            id: 'munid'
        },
        {
            id: 'document'
        },
        {
            id: 'link'
        },
        {
            id: 'linkextra'
        },
        {
            id: 'description'
        },
        {
            id: 'protection',
            possibleValues: [
                {
                    value: '',
                    title: ''
                },
                {
                    value: 'Ф',
                    title: 'федеральная'
                },
                {
                    value: 'Р',
                    title: 'региональная'
                },
                {
                    value: 'М',
                    title: 'местная'
                },
                {
                    value: 'В',
                    title: 'выявленный объект'
                }
            ]
        },
    ];

    function createTemplateParameters(parameterDescriptors) {
        var parametersById = {};
        var parameterIds = [];

        for (var i = 0; i < parameterDescriptors.length; i++) {
            var parameterData = parameterDescriptors[i];
            var parameterId = parameterData.id;
            parametersById [parameterId] = parameterData;
            parameterIds.push(parameterId);
        }

        return {
            _parametersById: parametersById,
            _parameterIds: parameterIds,

            getParameter: function (parameterId) {
                return this._parametersById[parameterId];
            }
        };
    }

    var monumentListingParameters = createTemplateParameters(monumentListingParameterDescriptors);

    function arrayHasElement(array, element) {
        return array.indexOf(element) >= 0;
    }

    function inArray(element, array) {
        return arrayHasElement(array, element);
    }

    function createListingSerializer(listingType, listingParameters, listingData) {
        return {
            _data: '',
            _serializedParameters: [],

            writeListingStart: function(addNewline) {
                this._data += '{{' + listingType;
                if (addNewline) {
                    this._data += "\n";
                } else {
                    this._data += ' ';
                }
            },

            writeParameterLine: function(parameterName, optional) {
                var parameterValue = listingData[parameterName];
                if (optional && (parameterValue === '' || parameterValue === undefined)) {
                    return;
                }
                if (parameterValue === undefined) {
                    parameterValue = '';
                }
                this._data += '|' + parameterName + "= " + parameterValue + "\n";
                this._serializedParameters.push(parameterName);
            },

            writeParametersLine: function(parameterNames, optionalParameters) {
                for (var i = 0; i < parameterNames.length; i++) {
                    var parameterName = parameterNames[i];
                    var parameterValue = listingData[parameterName];
                    var optional = optionalParameters && inArray(parameterName, optionalParameters);
                    if (optional && (parameterValue === '' || parameterValue === undefined)) {
                        continue;
                    }

                    if (parameterValue === undefined) {
                        parameterValue = '';
                    }
                    if (i > 0) {
                        this._data += " ";
                    }
                    this._data += "|" + parameterName + "= " + parameterValue;
                    this._serializedParameters.push(parameterName);
                }
                this._data += "\n";
            },

            writeOtherNonEmptyParameters: function() {
                for (var parameterName in listingData) {
                    if (listingData.hasOwnProperty(parameterName)) {
                        if (!arrayHasElement(this._serializedParameters, parameterName)) {
                            var parameterValue = listingData[parameterName];
                            if (parameterValue !== '' && parameterValue !== undefined) {
                                this._data += '|' + parameterName + "= " + parameterValue + "\n"
                            }
                        }
                    }
                }
            },

            writeListingEnd: function() {
                this._data += '}}';
            },

            getSerializedListing: function() {
                return this._data;
            }
        };
    }

    function serializeMonumentListing(listingData) {
        var serializer = createListingSerializer("monument", monumentListingParameterDescriptors, listingData);
        serializer.writeListingStart();
        serializer.writeParametersLine(["type", "status"]);
        serializer.writeParametersLine(["lat", "long", "precise"]);
        serializer.writeParameterLine("name");
        serializer.writeParametersLine(["knid", "complex"], ["complex"]);
        serializer.writeParameterLine("knid-new");
        serializer.writeParametersLine(["region", "district"]);
        serializer.writeParametersLine(["municipality", "munid"]);
        serializer.writeParameterLine("block", true);
        serializer.writeParameterLine("address");
        serializer.writeParametersLine(["year", "author"]);
        serializer.writeParameterLine("style", true);
        serializer.writeParameterLine("description");
        serializer.writeParameterLine("image");
        serializer.writeParameterLine("wdid");
        serializer.writeParameterLine("wiki");
        serializer.writeParametersLine(["commonscat", "protection"], ["protection"]);
        serializer.writeParameterLine("link");
        serializer.writeParameterLine("linkextra", true);
        serializer.writeParameterLine("document", true);
        serializer.writeParameterLine("doc", true);
        serializer.writeParameterLine("dismissed", true);
        serializer.writeOtherNonEmptyParameters();
        serializer.writeListingEnd();

        return serializer.getSerializedListing();
    }

    var InputInsertSymbols = {
        addQuotesInsertHandler: function(insertButton, insertToInput) {
            insertButton.click(function() {
                var selectionStart = insertToInput[0].selectionStart;
                var selectionEnd = insertToInput[0].selectionEnd;
                var oldValue = insertToInput.val();
                var newValue = oldValue.substring(0, selectionStart) + "«" + oldValue.substring(selectionStart, selectionEnd) + "»" + oldValue.substring(selectionEnd);
                insertToInput.val(newValue);
                InputInsertSymbols._selectRange(insertToInput[0], selectionStart + 1, selectionEnd + 1);
            });
        },

        addDashInsertHandler: function(insertButton, insertToInput) {
            insertButton.click(function() {
                var caretPos = insertToInput[0].selectionStart;
                var oldValue = insertToInput.val();
                var newValue = oldValue.substring(0, caretPos) + "—" + oldValue.substring(caretPos);
                insertToInput.val(newValue);
                InputInsertSymbols._selectRange(insertToInput[0], caretPos + 1);
            });
        },

        _selectRange: function(element, start, end) {
            if(end === undefined) {
                end = start;
            }
            element.focus();
            if('selectionStart' in element) {
                element.selectionStart = start;
                element.selectionEnd = end;
            } else if(element.setSelectionRange) {
                element.setSelectionRange(start, end);
            } else if(element.createTextRange) {
                var range = element.createTextRange();
                range.collapse(true);
                range.moveEnd('character', end);
                range.moveStart('character', start);
                range.select();
            }
        }
    };

    function runSequence(functions, onSuccess, results) {
        if (!results) {
            results = [];
        }

        if (functions.length > 0) {
            var firstFunction = functions[0];
            firstFunction(function(result) {
                results.push(result);
                setTimeout( // hack to break recursion chain
                    function() {
                        runSequence(functions.slice(1), onSuccess, results)
                    },
                    0
                );
            });
        } else {
            onSuccess(results);
        }
    }

    var CommonsApi = {
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
            var self = this;

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
                        var files = [];
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
                var images = [];
                files.forEach(function(file) {
                    var extension = file.toLowerCase().substr(file.length - 4);
                    if (extension === '.jpg' || extension === '.png' || extension === '.gif') {
                        images.push(file);
                    }
                });
                onSucess(images);
            })
        },

        getImageInfo: function(image, onSuccess) {
            var self = this;

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

                    var pages = data.query.pages;
                    var firstPage = pages[Object.keys(pages)[0]];
                    if (!firstPage || !firstPage.imageinfo || firstPage.imageinfo.length <= 0) {
                        return;
                    }
                    var text = '';
                    if (firstPage.revisions && firstPage.revisions.length > 0) {
                        var revision = firstPage.revisions[0];
                        if (revision['*']) {
                            text = revision['*'];
                        }
                    }

                    var imageInfo = firstPage.imageinfo[0];
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
            var self = this;
            runSequence(
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

    var ListingEditorFormComposer = {
        createInputFormRow: function(inputElementId, labelText)
        {
            var rowElement = $('<tr>');
            var label = $('<label>', {
                'for': inputElementId,
                html: labelText
            });
            var labelColumn = $('<td>', {
                'class': "editor-label-col",
                style: "width: 200px"
            }).append(label);
            var inputColumnElement = $('<td>');
            rowElement.append(labelColumn).append(inputColumnElement);
            return {
                rowElement: rowElement,
                inputColumnElement: inputColumnElement
            };
        },
        createInputFormRowCheckbox: function(inputElementId, labelText) {
            var row = this.createInputFormRow(inputElementId, labelText);
            var inputElement = $('<input>', {
                type: 'checkbox',
                id: inputElementId
            });
            row.inputColumnElement.append(inputElement);
            return {
                rowElement: row.rowElement,
                inputElement: inputElement
            }
        },
        createInputFormRowSelect: function(inputElementId, labelText, options)
        {
            var row = this.createInputFormRow(inputElementId, labelText);
            var inputElement = $('<select>', {
                id: inputElementId
            });
            options.forEach(function(option) {
                var optionElement = $('<option>', {
                    value: option.value,
                    html: option.title
                });
                inputElement.append(optionElement);
            });
            row.inputColumnElement.append(inputElement);
            return {
                rowElement: row.rowElement,
                inputElement: inputElement
            }
        },
        createInputFormRowText: function(inputElementId, labelText, placeholderText, partialWidth, insertSymbols)
        {
            if (!placeholderText) {
                placeholderText = '';
            }
            var row = this.createInputFormRow(inputElementId, labelText);
            var inputElement = $('<input>', {
                type: 'text',
                'class': partialWidth ? 'editor-partialwidth' : 'editor-fullwidth',
                style: insertSymbols ? 'width: 90%': '',
                placeholder: placeholderText,
                id: inputElementId
            });
            row.inputColumnElement.append(inputElement);
            if (insertSymbols) {
                var buttonInsertQuotes = $('<a>', {
                    'class': 'name-quotes-template',
                    href: 'javascript:;',
                    html: '«»'
                });
                var buttonInsertDash = $('<a>', {
                    'class': 'name-dash-template',
                    href: 'javascript:;',
                    html: '—'
                });
                InputInsertSymbols.addDashInsertHandler(buttonInsertDash, inputElement);
                InputInsertSymbols.addQuotesInsertHandler(buttonInsertQuotes, inputElement);

                row.inputColumnElement.append('&nbsp;');
                row.inputColumnElement.append(buttonInsertQuotes);
                row.inputColumnElement.append('&nbsp;');
                row.inputColumnElement.append(buttonInsertDash);
            }
            return {
                rowElement: row.rowElement,
                inputElement: inputElement
            }
        },
        createRowDivider: function() {
            return $('<tr>').append(
                $('<td>', {colspan: "2"}).append(
                    $('<div>', {
                        'class': "listing-divider",
                        style: "margin: 3px 0"
                    })
                )
            );
        },
        createRowLink: function(linkText) {
            var linkElement = $("<a>", {
                href: 'javascript:;',
                html: linkText
            });
            var rowElement = $('<tr>').append($('<td>')).append($('<td>').append(linkElement));
            return {
                rowElement: rowElement,
                linkElement: linkElement
            }
        },
        createChangesDescriptionRow: function () {
            var inputChangesSummary = $('<input>', {
                type: "text",
                'class': "editor-partialwidth",
                placeholder: "что именно было изменено",
                id: "input-summary"
            });
            var inputIsMinorChanges = $('<input>', {
                type: "checkbox",
                id: "input-minor"
            });
            var labelChangesSummary = $('<label>', {
                'for': "input-summary",
                html: 'Описание изменений'
            });
            var labelIsMinorChanges = $('<label>', {
                'for': "input-minor",
                'class': "listing-tooltip",
                title: "Установите галочку, если изменение незначительное, например, исправление опечатки",
                html: 'незначительное изменение?'
            });
            var spanIsMinorChanges = $('<span>', {id: "span-minor"});
            spanIsMinorChanges.append(inputIsMinorChanges).append(labelIsMinorChanges);
            var row = $('<tr>');
            row.append($('<td>', {'class': "editor-label-col", style: "width: 200px"}).append(labelChangesSummary));
            row.append($('<td>').append(inputChangesSummary).append(spanIsMinorChanges));
            return {
                row: row,
                inputChangesSummary: inputChangesSummary,
                inputIsMinorChanges: inputIsMinorChanges
            };
        },
        createObjectDescriptionRow: function() {
            var inputDescription = $('<textarea>', {
                rows:"4",
                'class': "editor-fullwidth",
                placeholder: "описание объекта",
                id: "input-description"
            });
            var labelDescription = $('<label>', {
                'for': "input-description",
                html: "Описание"
            });
            var row = $('<tr>');
            row.append($('<td>', {'class': "editor-label-col", style: "width: 200px"}).append(labelDescription));
            row.append($('<td>').append(inputDescription));
            return {
                row: row,
                inputDescription: inputDescription
            }
        },
        createTableFullWidth: function()
        {
            var tableElement = $('<table>', {
                'class': 'editor-fullwidth'
            });
            var wrapperElement = $('<div>');
            wrapperElement.append(tableElement);
            return {
                wrapperElement: wrapperElement,
                tableElement: tableElement
            };
        },
        createTableTwoColumns: function()
        {
            var leftTableElement = $('<table>', {
                'class': "editor-fullwidth"
            });
            var rightTableElement = $('<table>', {
                'class': "editor-fullwidth"
            });
            var wrapperElement = $('<div>');
            wrapperElement.append(
                $('<div>', {
                    'class': 'listing-col listing-span_1_of_2'
                }).append(leftTableElement)
            );
            wrapperElement.append(
                $('<div>', {
                    'class': 'listing-col listing-span_1_of_2'
                }).append(rightTableElement)
            );
            return {
                wrapperElement: wrapperElement,
                leftTableElement: leftTableElement,
                rightTableElement: rightTableElement
            };
        },
        createForm: function() {
            var formElement = $('<form id="listing-editor">');
            formElement.append($('<br>'));
            return {
                formElement: formElement
            }
        }
    };

    var CommonsImagesLoader = {
        loadImagesFromWLMCategory: function(knid, onSuccess) {
            var self = this;
            if (!knid) {
                onSuccess([]);
            } else {
                CommonsApi.getCategoryImages(
                    'WLM/' + knid, 'max',
                    function (images) {
                        self.loadImages(images, 'wlm', onSuccess);
                    }
                );
            }
        },

        loadImagesFromCommonsCategory: function(commonsCat, onSuccess) {
            var self = this;
            if (!commonsCat) {
                onSuccess([]);
            } else {
                CommonsApi.getCategoryImages(
                    commonsCat, 'max',
                    function (images) {
                        self.loadImages(images, 'commons', onSuccess);
                    }
                );
            }
        },

        loadImages: function (images, categoryType, onSuccess) {
            var self = this;
            CommonsApi.getImagesInfo(images, function (imagesInfo) {
                onSuccess(imagesInfo);
            });
        }
    };

    var CommonsImagesSelectDialog = {
        showDialog: function(knid, commonsCat, onImageSelected) {
            var dialogElement = $('<div>');
            dialogElement.dialog({
                modal: true,
                height: 400,
                width: 800,
                title: 'Выбор изображения из галереи'
            });

            var loadingElement = $('<div>', {'html': 'загрузка...'});
            var contentElement = $('<div>');
            dialogElement.append(contentElement);
            dialogElement.append(loadingElement);

            function createImageElement(image)
            {
                var imageThumbElement = $('<img>',  {'alt': 'Image', 'src': image.thumb});
                var commonsUrl = 'https://commons.wikimedia.org/wiki/' + image.image;
                var selectLink = $('<a>', {
                    href: 'javascript:;',
                    html: '[выбрать]'
                });
                var viewLink = $('<a>', {
                    href: commonsUrl,
                    target: '_blank',
                    html: '[смотреть]'
                });

                selectLink.click(function() {
                    var imageName = image.image.replace(/^File:/, '').replace(' ', '_');
                    onImageSelected(imageName);
                    dialogElement.dialog('destroy')
                });

                var imageBlock = $('<div>', {
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
                var block = $('<div>');
                block.append($('<h5>', {'html': blockTitle}));

                var currentRow = null;
                var imagesInRow = 0;

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

            CommonsImagesLoader.loadImagesFromWLMCategory(knid, function(wlmImages) {
                if (wlmImages.length > 0) {
                    contentElement.append(createImagesBlock(
                        "Изображения из категории WLM", wlmImages
                    ));
                }

                CommonsImagesLoader.loadImagesFromCommonsCategory(commonsCat, function (commonsCatImages) {
                    if (commonsCatImages.length > 0) {
                        contentElement.append(createImagesBlock(
                            "Изображения из категории Commons", commonsCatImages
                        ));
                    }
                    if (wlmImages.length === 0 && commonsCatImages.length === 0) {
                        contentElement.append(
                            $('<div>', {'html': "Для данного объекта нет ни одного изображения"})
                        );
                    }
                    loadingElement.hide();
                });
            });
        }
    };

    var MonumentListingEditorFormComposer = {
        createForm: function() {
            var editorForm = ListingEditorFormComposer.createForm();

            var inputObjectName = ListingEditorFormComposer.createInputFormRowText(
                'input-name', 'Название', 'название объекта', false, true
            );

            var tableObjectName = ListingEditorFormComposer.createTableFullWidth();
            tableObjectName.tableElement.append(inputObjectName.rowElement);
            tableObjectName.tableElement.append(ListingEditorFormComposer.createRowDivider());
            editorForm.formElement.append(tableObjectName.wrapperElement);

            var inputType = ListingEditorFormComposer.createInputFormRowSelect(
                'input-type', 'Тип', monumentListingParameters.getParameter('type').possibleValues
            );
            var inputDestroyed = ListingEditorFormComposer.createInputFormRowCheckbox(
                'input-destroyed', 'Утрачен'
            );
            var inputRegion = ListingEditorFormComposer.createInputFormRowSelect(
                'input-region', 'Регион', monumentListingParameters.getParameter('region').possibleValues
            );
            var inputDistrict = ListingEditorFormComposer.createInputFormRowText(
                'input-district', 'Район'
            );
            var inputMunicipality = ListingEditorFormComposer.createInputFormRowText(
                'input-municipality', 'Населённый пункт'
            );
            var inputBlock = ListingEditorFormComposer.createInputFormRowText(
                'input-block', 'Квартал'
            );
            var inputAddress = ListingEditorFormComposer.createInputFormRowText(
                'input-address', 'Адрес', 'улица название, номер дома'
            );
            var inputLat = ListingEditorFormComposer.createInputFormRowText(
                'input-lat', 'Широта', '11.11111', true
            );
            var inputLong = ListingEditorFormComposer.createInputFormRowText(
                'input-long', 'Долгота', '111.11111', true
            );
            var inputPrecise = ListingEditorFormComposer.createInputFormRowCheckbox(
                'input-precise', 'Точные координаты'
            );
            var inputYear = ListingEditorFormComposer.createInputFormRowText(
                'input-year', 'Год постройки', 'yyyy', true
            );
            var inputAuthor = ListingEditorFormComposer.createInputFormRowText(
                'input-author', 'Автор объекта', 'архитектор, скульптор, инженер и т.д.'
            );
            var inputStyle = ListingEditorFormComposer.createInputFormRowSelect(
                'input-style', 'Стиль', monumentListingParameters.getParameter('style').possibleValues
            );
            var inputKnid = ListingEditorFormComposer.createInputFormRowText(
                'input-knid', '10-значный № объекта', 'dddddddddd', true
            );
            var inputComplex = ListingEditorFormComposer.createInputFormRowText(
                'input-complex', '10-значный № комплекса', 'dddddddddd', true
            );
            var inputKnidNew = ListingEditorFormComposer.createInputFormRowText(
                'input-knid-new', '15-значный № объекта', 'ddddddddddddddd', true
            );
            var inputImage = ListingEditorFormComposer.createInputFormRowText(
                'input-image', 'Изображение', 'изображение на Викискладе'
            );
            var inputWiki = ListingEditorFormComposer.createInputFormRowText(
                'input-wiki', 'Википедия', 'статья в русской Википедии'
            );
            var inputWdid = ListingEditorFormComposer.createInputFormRowText(
                'input-wdid', 'Викиданные', 'идентификатор Викиданных', true
            );
            var inputCommonscat = ListingEditorFormComposer.createInputFormRowText(
                'input-commonscat', 'Викисклад', 'категория Викисклада'
            );
            var inputMunid = ListingEditorFormComposer.createInputFormRowText(
                'input-munid', 'Викиданные нас. пункта', 'идентификатор Викиданных', true
            );
            var inputDocument = ListingEditorFormComposer.createInputFormRowText(
                'input-document', 'Код документа', 'dDDMMYYYY', true
            );
            var inputLink = ListingEditorFormComposer.createInputFormRowText(
                'input-link', 'Ссылка №1', 'внешняя ссылка с дополнительной информацией об объекте'
            );
            var inputLinkExtra = ListingEditorFormComposer.createInputFormRowText(
                'input-linkextra', 'Ссылка №2', 'внешняя ссылка с дополнительной информацией об объекте'
            );
            var inputProtection = ListingEditorFormComposer.createInputFormRowSelect(
                'input-type', 'Категория охраны', monumentListingParameters.getParameter('protection').possibleValues
            );

            var tableObjectProperties = ListingEditorFormComposer.createTableTwoColumns();

            tableObjectProperties.leftTableElement.append(inputType.rowElement);
            tableObjectProperties.leftTableElement.append(inputDestroyed.rowElement);
            tableObjectProperties.leftTableElement.append(ListingEditorFormComposer.createRowDivider());
            tableObjectProperties.leftTableElement.append(inputRegion.rowElement);
            tableObjectProperties.leftTableElement.append(inputDistrict.rowElement);
            tableObjectProperties.leftTableElement.append(inputMunicipality.rowElement);
            tableObjectProperties.leftTableElement.append(inputBlock.rowElement);
            tableObjectProperties.leftTableElement.append(inputAddress.rowElement);
            tableObjectProperties.leftTableElement.append(ListingEditorFormComposer.createRowDivider());
            tableObjectProperties.leftTableElement.append(inputLat.rowElement);
            tableObjectProperties.leftTableElement.append(inputLong.rowElement);
            tableObjectProperties.leftTableElement.append(inputPrecise.rowElement);
            tableObjectProperties.leftTableElement.append(ListingEditorFormComposer.createRowDivider());
            tableObjectProperties.leftTableElement.append(inputYear.rowElement);
            tableObjectProperties.leftTableElement.append(inputAuthor.rowElement);
            tableObjectProperties.leftTableElement.append(inputStyle.rowElement);

            var selectImageLinkRow = ListingEditorFormComposer.createRowLink('выбрать изображение из галереи');
            selectImageLinkRow.linkElement.click(function() {
                CommonsImagesSelectDialog.showDialog(
                    inputKnid.inputElement.val(),
                    inputCommonscat.inputElement.val(),
                    function (selectedImage) {
                        inputImage.inputElement.val(selectedImage);
                    }
                )
            });

            tableObjectProperties.rightTableElement.append(inputKnid.rowElement);
            tableObjectProperties.rightTableElement.append(inputComplex.rowElement);
            tableObjectProperties.rightTableElement.append(inputKnidNew.rowElement);
            tableObjectProperties.rightTableElement.append(ListingEditorFormComposer.createRowDivider());
            tableObjectProperties.rightTableElement.append(inputImage.rowElement);
            tableObjectProperties.rightTableElement.append(selectImageLinkRow.rowElement);
            tableObjectProperties.rightTableElement.append(inputWiki.rowElement);
            tableObjectProperties.rightTableElement.append(inputWdid.rowElement);
            tableObjectProperties.rightTableElement.append(inputCommonscat.rowElement);
            tableObjectProperties.rightTableElement.append(inputMunid.rowElement);
            tableObjectProperties.rightTableElement.append(inputDocument.rowElement);
            tableObjectProperties.rightTableElement.append(ListingEditorFormComposer.createRowDivider());
            tableObjectProperties.rightTableElement.append(inputLink.rowElement);
            tableObjectProperties.rightTableElement.append(inputLinkExtra.rowElement);
            tableObjectProperties.rightTableElement.append(ListingEditorFormComposer.createRowDivider());
            tableObjectProperties.rightTableElement.append(inputProtection.rowElement);

            editorForm.formElement.append(tableObjectProperties.wrapperElement);

            var tableObjectDescription = ListingEditorFormComposer.createTableFullWidth();

            var objectDescriptionRow = ListingEditorFormComposer.createObjectDescriptionRow();
            tableObjectDescription.tableElement.append(objectDescriptionRow.row);
            tableObjectDescription.tableElement.append(ListingEditorFormComposer.createRowDivider());

            editorForm.formElement.append(tableObjectDescription.wrapperElement);

            var tableChanges = ListingEditorFormComposer.createTableFullWidth();

            var changesDescriptionRow = ListingEditorFormComposer.createChangesDescriptionRow();
            tableChanges.tableElement.append(ListingEditorFormComposer.createRowDivider());
            tableChanges.tableElement.append(changesDescriptionRow.row);

            editorForm.formElement.append(tableChanges.wrapperElement);

            var directMappingInputs = {
                name: inputObjectName.inputElement,
                type: inputType.inputElement,
                region: inputRegion.inputElement,
                district: inputDistrict.inputElement,
                municipality: inputMunicipality.inputElement,
                block: inputBlock.inputElement,
                address: inputAddress.inputElement,
                lat: inputLat.inputElement,
                long: inputLong.inputElement,
                year: inputYear.inputElement,
                author: inputAuthor.inputElement,
                knid: inputKnid.inputElement,
                complex: inputComplex.inputElement,
                'knid-new': inputKnidNew.inputElement,
                image: inputImage.inputElement,
                wiki: inputWiki.inputElement,
                wdid: inputWdid.inputElement,
                commonscat: inputCommonscat.inputElement,
                munid: inputMunid.inputElement,
                document: inputDocument.inputElement,
                link: inputLink.inputElement,
                linkextra: inputLinkExtra.inputElement,
                description: objectDescriptionRow.inputDescription,
                protection: inputProtection.inputElement,
            };

            return {
                formElement: editorForm.formElement,

                setValues: function(listing) {
                    Object.keys(directMappingInputs).forEach(function(key) {
                        if (listing[key]) {
                            directMappingInputs[key].val(listing[key]);
                        }
                    });
                    if (listing['style']) {
                        inputStyle.inputElement.val(listing['style'].toLowerCase());
                    }
                    inputDestroyed.inputElement.attr('checked', listing['status'] === 'destroyed');
                    inputPrecise.inputElement.attr('checked', listing['precise'] === 'yes');
                },

                getValues: function() {
                    var listingData = {};
                    Object.keys(directMappingInputs).forEach(function(key) {
                        listingData[key] = directMappingInputs[key].val();
                    });
                    if (inputDestroyed.inputElement.is(':checked')) {
                        listingData['status'] = 'destroyed';
                    } else {
                        listingData['status'] = '';
                    }
                    if (inputPrecise.inputElement.is(':checked')) {
                        listingData['precise'] = 'yes';
                    } else {
                        listingData['precise'] = 'no';
                    }
                    listingData['link'] = this._normalizeUrl(listingData['link']);
                    listingData['linkextra'] = this._normalizeUrl(listingData['linkextra']);
                    listingData['style'] = inputStyle.inputElement.val();
                    return listingData;
                },

                getObjectName: function() {
                    return inputObjectName.inputElement.val();
                },

                getChangesSummary: function() {
                    return changesDescriptionRow.inputChangesSummary.val();
                },

                getChangesIsMinor: function() {
                    return changesDescriptionRow.inputIsMinorChanges.is(':checked');
                },

                _normalizeUrl: function(url) {
                    var webRegex = new RegExp('^https?://', 'i');
                    if (!webRegex.test(url) && url !== '') {
                        return 'http://' + url;
                    } else {
                        return url;
                    }
                }
            };
        }
    };

    CulturalHeritageListingEditor.Core = function() {
        var TRANSLATIONS = {
            addTitle: 'Добавить объект',
            editTitle: 'Редактировать объект',
            saving: 'Сохранение...',
            submit: 'Сохранить',
            cancel: 'Отмена',
            added: 'Добавлен объект ',
            updated: 'Обновлён объект ',
            helpPage: '//ru.wikivoyage.org/wiki/%D0%9A%D1%83%D0%BB%D1%8C%D1%82%D1%83%D1%80%D0%BD%D0%BE%D0%B5_%D0%BD%D0%B0%D1%81%D0%BB%D0%B5%D0%B4%D0%B8%D0%B5_%D0%A0%D0%BE%D1%81%D1%81%D0%B8%D0%B8',
            enterCaptcha: 'Введите CAPTCHA',
            externalLinks: 'Введённый текст содержит внешние ссылки.',
            licenseText: 'Нажимая кнопку «Сохранить», вы соглашаетесь с <a class="external" target="_blank" href="https://foundation.wikimedia.org/wiki/Terms_of_Use/ru">условиями использования</a>, а также соглашаетесь на неотзывную публикацию по лицензии <a class="external" target="_blank" href="https://en.wikipedia.org/wiki/ru:Википедия:Текст_Лицензии_Creative_Commons_Attribution-ShareAlike_3.0_Unported">CC-BY-SA 3.0</a>.',
            submitApiError: 'Во время сохранения листинга на сервере произошла ошибка, пожайлуста, попробуйте сохранить ещё раз',
            submitBlacklistError: 'Ошибка: текст содержит ссылку из чёрного списка, пожайлуста, удалите её и попробуйте сохранить снова',
            submitUnknownError: 'Ошибка: при попытке сохранить листинг произошла неизвестная ошибка, пожайлуста, попробуйте сохранить ещё раз',
            submitHttpError: 'Ошибка: сервер сообщил о HTTP ошибке, возникшей во время сохранения листинга, пожайлуста, попробуйте сохранить ещё раз',
            submitEmptyError: 'Ошибка: сервер вернул пустой ответ при попытке сохранить листинг, пожайлуста, попробуйте сохранить ещё раз'
        };

        // if the browser window width is less than MAX_DIALOG_WIDTH (pixels), the
        // listing editor dialog will fill the available space, otherwise it will
        // be limited to the specified width
        var MAX_DIALOG_WIDTH = 1200;

        var currentForm = null;

        var api = new mw.Api();
        var MODE_ADD = 'add';
        var MODE_EDIT = 'edit';
        // selector that identifies the edit link as created by the
        // addEditButtons() function
        var SAVE_FORM_SELECTOR = '#progress-dialog';
        var CAPTCHA_FORM_SELECTOR = '#captcha-dialog';
        var sectionText, replacements = {};

        /**
         * Return false if the current page should not enable the listing editor.
         * Examples where the listing editor should not be enabled include talk
         * pages, edit pages, history pages, etc.
         */
        function listingEditorAllowedForCurrentPage() {
            var namespace = mw.config.get( 'wgNamespaceNumber' );
            if (namespace !== 0 && namespace !== 2 && namespace !== 4) {
                return false;
            }
            if (
                mw.config.get('wgAction') !== 'view' ||
                $('#mw-revision-info').length ||
                mw.config.get('wgCurRevisionId') !== mw.config.get('wgRevisionId') ||
                $('#ca-viewsource').length
            ) {
                return false;
            }

            return isCulturalHeritagePage() && !isDiffMode();
        }

        function getCurrentPageName()
        {
            return mw.config.get('wgPageName');
        }

        /**
         * Whether we are viewing page in "diff" mode.
         *
         * @returns {boolean}
         */
        function isDiffMode()
        {
            return $('table.diff').length > 0;
        }

        /**
         * Whether current page is related to Cultural Heritage.
         *
         * @returns {boolean}
         */
        function isCulturalHeritagePage()
        {
            // We do not use "Культурное_наследие_России/" here as Crimea is outside of that space
            // and is located at "Культурное_наследие/" space.
            return StringUtils.contains(getCurrentPageName(), 'Культурное_наследие') && !StringUtils.contains(getCurrentPageName(), 'Культурное_наследие_Казахстана');
        }

        /**
         * Place an "add listing" link at the top of each section heading next to
         * the "edit" link in the section heading.
         */
        var addButtons = function() {
            var pageBodyContentElement = $('.mw-parser-output');

            var currentSectionIndex = 0;
            var currentListingIndex = 0;

            function isTableOfContentsHeader(headerElement) {
                return headerElement.parents('.toc').length > 0;
            }

            // Here we add buttons to:
            // - add new listing - for each section header
            // - edit existing listing - for each existing listing
            //
            // It is required to know:
            // - section index, to which we are going to add new listing
            // - section index and listing index (within a section) for listing which we are going to edit
            // To calculate section index and listing index, we iterate over all section header and listing
            // table elements sequentially (in the same order as we have them in HTML).
            // When we meet header - we consider that new section is started and increase current section index,
            // and reset current listing index (listings are enumerated within section). All listings belong
            // to that section until we meet the next header.
            // When we meet listing table - we increase current listing index.
            pageBodyContentElement.find('h1, h2, h3, h4, h5, h6, table.monument').each(function() {
                if (inArray(this.tagName, ['H1', 'H2', 'H3', 'H4', 'H5', 'H6'])) {
                    var headerElement = $(this);

                    if (!isTableOfContentsHeader(headerElement)) {
                        currentSectionIndex++;
                        currentListingIndex = 0;
                        addAddNewListingButton(headerElement, currentSectionIndex);
                    }
                } else if (this.tagName === 'TABLE') {
                    var listingTable = $(this);
                    addEditExistingListingButton(listingTable, currentSectionIndex, currentListingIndex);
                    currentListingIndex++;
                }
            });
        };

        function addEditExistingListingButton(listingTable, sectionIndex, listingIndex)
        {
            var editListingButton = $('<span class="vcard-edit-button noprint" style="padding-left: 5px;">')
                .html('<a href="javascript:" class="icon-pencil" title="Редактировать">Редактировать</a>' )
                .click(function() {
                    initListingEditorDialog(MODE_EDIT, sectionIndex, listingIndex);
                });
            var nameElement = listingTable.find('span.monument-name').first();
            if (nameElement) {
                nameElement.append(editListingButton);
            }
        }

        function addAddNewListingButton(headerElement, sectionIndex)
        {
            var sectionEditLink = $('<a href="javascript:">добавить</a>');
            var bracketStart = $('<span class="mw-editsection-bracket">[</span>');
            var bracketEnd = $('<span class="mw-editsection-bracket">]</span>');
            headerElement.append(
                $('<span class="mw-editsection"/>').append(bracketStart).append(sectionEditLink).append(bracketEnd)
            );
            sectionEditLink.click(function() {
                initListingEditorDialog(MODE_ADD, sectionIndex);
            });
        }

        /**
         * This method is invoked when an "add" or "edit" listing button is
         * clicked and will execute an Ajax request to retrieve all of the raw wiki
         * syntax contained within the specified section.  This wiki text will
         * later be modified via the listing editor and re-submitted as a section
         * edit.
         */
        var initListingEditorDialog = function(mode, sectionIndex, listingIndex) {
            $.ajax({
                url: mw.util.wikiScript(''),
                data: { title: mw.config.get('wgPageName'), action: 'raw', section: sectionIndex },
                cache: false // required
            }).done(function(data, textStatus, jqXHR) {
                sectionText = data;
                openListingEditorDialog(mode, sectionIndex, listingIndex);
            }).fail(function(jqXHR, textStatus, errorThrown) {
                alert('Ошибка при получении исходного вики-текста статьи: ' + textStatus + ' ' + errorThrown);
            });
        };

        var closeCurrentForm = function() {
            if (currentForm && currentForm.formElement.dialog("isOpen")) {
                currentForm.formElement.dialog("destroy");
                currentForm = null;
            }
        };

        /**
         * This method is called asynchronously after the initListingEditorDialog()
         * method has retrieved the existing wiki section description that the
         * listing is being added to (and that contains the listing wiki syntax
         * when editing).
         */
        var openListingEditorDialog = function(mode, sectionNumber, listingIndex) {
            sectionText = stripComments(sectionText);
            mw.loader.using( ['jquery.ui.dialog'], function () {
                var listingTemplateAsMap, listingTemplateWikiSyntax;
                if (mode === MODE_ADD) {
                    listingTemplateAsMap = {};
                } else {
                    listingTemplateWikiSyntax = getListingWikitextBraces(listingIndex);
                    listingTemplateAsMap = wikiTextToListing(listingTemplateWikiSyntax);
                }
                // if a listing editor dialog is already open, get rid of it
                closeCurrentForm();

                currentForm = MonumentListingEditorFormComposer.createForm();
                // populate the empty form with existing values
                currentForm.setValues(listingTemplateAsMap);

                // wide dialogs on huge screens look terrible
                var windowWidth = $(window).width();
                var dialogWidth = (windowWidth > MAX_DIALOG_WIDTH) ? MAX_DIALOG_WIDTH : 'auto';
                // modal form - must submit or cancel
                currentForm.formElement.dialog({
                    modal: true,
                    height: 'auto',
                    width: dialogWidth,
                    title: (mode === MODE_ADD) ? TRANSLATIONS.addTitle : TRANSLATIONS.editTitle,
                    dialogClass: 'listing-editor-dialog',
                    buttons: [
                        {
                            text: '?',
                            id: 'listing-help',
                            click: function() { window.open(TRANSLATIONS.helpPage);}
                        },
                        {
                            text: TRANSLATIONS.submit, click: function() {
                                formToText(mode, listingTemplateWikiSyntax, listingTemplateAsMap, sectionNumber);
                                closeCurrentForm();
                            }
                        },
                        {
                            text: TRANSLATIONS.cancel,
                            click: function() {
                                closeCurrentForm();
                            }
                        }
                    ],
                    create: function() {
                        $('.ui-dialog-buttonpane').append('<div class="listing-license">' + TRANSLATIONS.licenseText + '</div>');
                    }
                });
            });
        };

        var replaceSpecial = function(str) {
            return str.replace(/[.?*+^$[\]\\(){}|-]/g, "\\$&");
        };

        /**
         * Return a regular expression that can be used to find all listing
         * template invocations (as configured via the LISTING_TEMPLATE_PARAMETERS map)
         * within a section of wikitext.  Note that the returned regex simply
         * matches the start of the template ("{{listing") and not the full
		 * template ("{{listing|key=value|...}}").
		 */
        var getListingTypesRegex = function() {
            return new RegExp('{{\\s*(monument)(\\s|\\|)','ig');
        };

        /**
         * Given a listing index, return the full wikitext for that listing
         * ("{{listing|key=value|...}}"). An index of 0 returns the first listing
         * template invocation, 1 returns the second, etc.
         */
        var getListingWikitextBraces = function(listingIndex) {
            sectionText = sectionText.replace(/[^\S\n]+/g,' ');
            // find the listing wikitext that matches the same index as the listing index
            var listingRegex = getListingTypesRegex();
            // look through all matches for "{{listing|see|do...}}" within the section
            // wikitext, returning the nth match, where 'n' is equal to the index of the
            // edit link that was clicked
            var listingSyntax, regexResult, listingMatchIndex;
            for (var i = 0; i <= listingIndex; i++) {
                regexResult = listingRegex.exec(sectionText);
                listingMatchIndex = regexResult.index;
                listingSyntax = regexResult[0];
            }
            // listings may contain nested templates, so step through all section
            // text after the matched text to find MATCHING closing braces
            // the first two braces are matched by the listing regex and already
            // captured in the listingSyntax variable
            var curlyBraceCount = 2;
            var endPos = sectionText.length;
            var startPos = listingMatchIndex + listingSyntax.length;
            var matchFound = false;
            for (var j = startPos; j < endPos; j++) {
                if (sectionText[j] === '{') {
                    ++curlyBraceCount;
                } else if (sectionText[j] === '}') {
                    --curlyBraceCount;
                }
                if (curlyBraceCount === 0 && (j + 1) < endPos) {
                    listingSyntax = sectionText.substring(listingMatchIndex, j + 1);
                    matchFound = true;
                    break;
                }
            }
            if (!matchFound) {
                listingSyntax = sectionText.substring(listingMatchIndex);
            }
            return $.trim(listingSyntax);
        };

        /**
         * Convert raw wiki listing syntax into a mapping of key-value pairs
         * corresponding to the listing template parameters.
         */
        var wikiTextToListing = function(listingTemplateWikiSyntax) {
            // remove the trailing braces
            listingTemplateWikiSyntax = listingTemplateWikiSyntax.slice(0,-2);
            var listingTemplateAsMap = {};
            var lastKey;
            var listParams = listingTemplateToParamsArray(listingTemplateWikiSyntax);
            for (var j=1; j < listParams.length; j++) {
                var param = listParams[j];
                var index = param.indexOf('=');
                if (index > 0) {
                    // param is of the form key=value
                    var key = $.trim(param.substr(0, index));
                    var value = $.trim(param.substr(index+1));
                    listingTemplateAsMap[key] = value;
                    lastKey = key;
                } else if (listingTemplateAsMap[lastKey].length) {
                    // there was a pipe character within a param value, such as
                    // "key=value1|value2", so just append to the previous param
                    listingTemplateAsMap[lastKey] += '|' + param;
                }
            }
            for (var key in listingTemplateAsMap) {
                // if the template value contains an HTML comment that was
                // previously converted to a placehold then it needs to be
                // converted back to a comment so that the placeholder is not
                // displayed in the edit form
                listingTemplateAsMap[key] = restoreComments(listingTemplateAsMap[key], false);
            }
            return listingTemplateAsMap;
        };

        /**
         * Split the raw template wikitext into an array of params.  The pipe
         * symbol delimits template params, but this method will also inspect the
         * description to deal with nested templates or wikilinks that might contain
         * pipe characters that should not be used as delimiters.
         */
        var listingTemplateToParamsArray = function(listingTemplateWikiSyntax) {
            var results = [];
            var paramValue = '';
            var pos = 0;
            while (pos < listingTemplateWikiSyntax.length) {
                var remainingString = listingTemplateWikiSyntax.substr(pos);
                // check for a nested template or wikilink
                var patternMatch = findPatternMatch(remainingString, "{{", "}}");
                if (patternMatch.length === 0) {
                    patternMatch = findPatternMatch(remainingString, "[[", "]]");
                }
                if (patternMatch.length > 0) {
                    paramValue += patternMatch;
                    pos += patternMatch.length;
                } else if (listingTemplateWikiSyntax.charAt(pos) === '|') {
                    // delimiter - push the previous param and move on to the next
                    results.push(paramValue);
                    paramValue = '';
                    pos++;
                } else {
                    // append the character to the param value being built
                    paramValue += listingTemplateWikiSyntax.charAt(pos);
                    pos++;
                }
            }
            if (paramValue.length > 0) {
                // append the last param value
                results.push(paramValue);
            }
            return results;
        };

        /**
         * Utility method for finding a matching end pattern for a specified start
         * pattern, including nesting.  The specified value must start with the
         * start value, otherwise an empty string will be returned.
         */
        var findPatternMatch = function(value, startPattern, endPattern) {
            var matchString = '';
            var startRegex = new RegExp('^' + replaceSpecial(startPattern), 'i');
            if (startRegex.test(value)) {
                var endRegex = new RegExp('^' + replaceSpecial(endPattern), 'i');
                var matchCount = 1;
                for (var i = startPattern.length; i < value.length; i++) {
                    var remainingValue = value.substr(i);
                    if (startRegex.test(remainingValue)) {
                        matchCount++;
                    } else if (endRegex.test(remainingValue)) {
                        matchCount--;
                    }
                    if (matchCount === 0) {
                        matchString = value.substr(0, i);
                        break;
                    }
                }
            }
            return matchString;
        };

        /**
         * Commented-out listings can result in the wrong listing being edited, so
         * strip out any comments and replace them with placeholders that can be
         * restored prior to saving changes.
         */
        var stripComments = function(text) {
            var comments = text.match(/<!--[\s\S]*?-->/mig);
            if (comments !== null ) {
                for (var i = 0; i < comments.length; i++) {
                    var comment = comments[i];
                    var rep = '<<<COMMENT' + i + '>>>';
                    text = text.replace(comment, rep);
                    replacements[rep] = comment;
                }
            }
            return text;
        };

        /**
         * Search the text provided, and if it contains any text that was
         * previously stripped out for replacement purposes, restore it.
         */
        var restoreComments = function(text, resetReplacements) {
            for (var key in replacements) {
                var val = replacements[key];
                text = text.replace(key, val);
            }
            if (resetReplacements) {
                replacements = {};
            }
            return text;
        };

        /**
         * Convert the listing editor form entry fields into wiki text.  This
         * method converts the form entry fields into a listing template string,
         * replaces the original template string in the section text with the
         * updated entry, and then submits the section text to be saved on the
         * server.
         */
        var formToText = function(mode, listingTemplateWikiSyntax, listing, sectionNumber) {
            var formData = currentForm.getValues();
            Object.keys(formData).forEach(function(key) {
                listing[key] = formData[key];
            });

            var text = serializeMonumentListing(listing);

            var summary = editSummarySection();
            if (mode === MODE_ADD) {
                summary = updateSectionTextWithAddedListing(summary, text, listing);
            } else {
                summary = updateSectionTextWithEditedListing(summary, text, listingTemplateWikiSyntax);
            }
            summary += currentForm.getObjectName();
            var formSummary = currentForm.getChangesSummary();

            if (formSummary !== '') {
                summary += ' - ' + formSummary;
            }

            var minor = currentForm.getChangesIsMinor();

            saveForm(summary, minor, sectionNumber, '', '');
        };

        /**
         * Begin building the edit summary by trying to find the section name.
         */
        var editSummarySection = function() {
            var sectionName = getSectionName();
            return (sectionName.length) ? '/* ' + sectionName + ' */ ' : "";
        };

        var getSectionName = function() {
            var HEADING_REGEX = /^=+\s*([^=]+)\s*=+\s*\n/;
            var result = HEADING_REGEX.exec(sectionText);
            return (result !== null) ? result[1].trim() : "";
        };

        /**
         * After the listing has been converted to a string, add additional
         * processing required for adds (as opposed to edits), returning an
         * appropriate edit summary string.
         */
        var updateSectionTextWithAddedListing = function(originalEditSummary, listingWikiText, listing) {
            var summary = originalEditSummary;
            summary += TRANSLATIONS.added;
            // add the new listing to the end of the section.  if there are
            // sub-sections, add it prior to the start of the sub-sections.
            var index = sectionText.indexOf('===');
            if (index === 0) {
                index = sectionText.indexOf('====');
            }
            //**RUS** add condition to make sure listingWikiText gets inserted before the footer
            if (index === 0) {
                index = sectionText.indexOf('{{footer');
            }
            if (index > 0) {
                sectionText = sectionText.substr(0, index) + listingWikiText
                    + '\n' + sectionText.substr(index);
            } else {
                sectionText += '\n' + listingWikiText;
            }
            sectionText = restoreComments(sectionText, true);
            return summary;
        };

        /**
         * After the listing has been converted to a string, add additional
         * processing required for edits (as opposed to adds), returning an
         * appropriate edit summary string.
         */
        var updateSectionTextWithEditedListing = function(originalEditSummary, listingWikiText, listingTemplateWikiSyntax) {
            var summary = originalEditSummary;
            summary += TRANSLATIONS.updated;
            sectionText = sectionText.replace(listingTemplateWikiSyntax, listingWikiText);
            sectionText = restoreComments(sectionText, true);
            return summary;
        };

        /**
         * Render a dialog that notifies the user that the listing editor changes
         * are being saved.
         */
        var savingForm = function() {
            // if a progress dialog is already open, get rid of it
            if ($(SAVE_FORM_SELECTOR).length > 0) {
                $(SAVE_FORM_SELECTOR).dialog('destroy').remove();
            }
            var progress = $('<div id="progress-dialog">' + TRANSLATIONS.saving + '</div>');
            progress.dialog({
                modal: true,
                height: 100,
                width: 300,
                title: ''
            });
            $(".ui-dialog-titlebar").hide();
        };

        /**
         * Execute the logic to post listing editor changes to the server so that
         * they are saved.  After saving the page is refreshed to show the updated
         * article.
         */
        var saveForm = function(summary, minor, sectionNumber, cid, answer) {
            var editPayload = {
                action: "edit",
                title: mw.config.get( "wgPageName" ),
                section: sectionNumber,
                text: sectionText,
                summary: summary,
                captchaid: cid,
                captchaword: answer
            };
            if (minor) {
                $.extend( editPayload, { minor: 'true' } );
            }
            api.postWithToken(
                "csrf",
                editPayload
            ).done(function(data, jqXHR) {
                if (data && data.edit && data.edit.result == 'Success') {
                    // since the listing editor can be used on diff pages, redirect
                    // to the canonical URL if it is different from the current URL
                    var canonicalUrl = $("link[rel='canonical']").attr("href");
                    var currentUrlWithoutHash = window.location.href.replace(window.location.hash, "");
                    if (canonicalUrl && currentUrlWithoutHash != canonicalUrl) {
                        var sectionName = encodeURIComponent(getSectionName()).replace(/%20/g,'_').replace(/%/g,'.');
                        if (sectionName.length) {
                            canonicalUrl += "#" + sectionName;
                        }
                        window.location.href = canonicalUrl;
                    } else {
                        window.location.reload();
                    }
                } else if (data && data.error) {
                    saveFailed(TRANSLATIONS.submitApiError + ' "' + data.error.code + '": ' + data.error.info );
                } else if (data && data.edit.spamblacklist) {
                    saveFailed(TRANSLATIONS.submitBlacklistError + ': ' + data.edit.spamblacklist );
                } else if (data && data.edit.captcha) {
                    $(SAVE_FORM_SELECTOR).dialog('destroy').remove();
                    captchaDialog(summary, minor, sectionNumber, data.edit.captcha.url, data.edit.captcha.id);
                } else {
                    saveFailed(TRANSLATIONS.submitUnknownError);
                }
            }).fail(function(code, result) {
                if (code === "http") {
                    saveFailed(TRANSLATIONS.submitHttpError + ': ' + result.textStatus );
                } else if (code === "ok-but-empty") {
                    saveFailed(TRANSLATIONS.submitEmptyError);
                } else {
                    saveFailed(TRANSLATIONS.submitUnknownError + ': ' + code );
                }
            });
            savingForm();
        };

        /**
         * If an error occurs while saving the form, remove the "saving" dialog,
         * restore the original listing editor form (with all user description), and
         * display an alert with a failure message.
         */
        var saveFailed = function(msg) {
            $(SAVE_FORM_SELECTOR).dialog('destroy').remove();
            currentForm.formElement.dialog('open');
            alert(msg);
        };

        /**
         * If the result of an attempt to save the listing editor description is a
         * Captcha challenge then display a form to allow the user to respond to
         * the challenge and resubmit.
         */
        var captchaDialog = function(summary, minor, sectionNumber, captchaImgSrc, captchaId) {
            // if a captcha dialog is already open, get rid of it
            if ($(CAPTCHA_FORM_SELECTOR).length > 0) {
                $(CAPTCHA_FORM_SELECTOR).dialog('destroy').remove();
            }
            var captcha = $('<div id="captcha-dialog">').text(TRANSLATIONS.externalLinks);
            var image = $('<img class="fancycaptcha-image">')
                .attr('src', captchaImgSrc)
                .appendTo(captcha);
            var label = $('<label for="input-captcha">').text(TRANSLATIONS.enterCaptcha).appendTo(captcha);
            var input = $('<input id="input-captcha" type="text">').appendTo(captcha);
            captcha.dialog({
                modal: true,
                title: TRANSLATIONS.enterCaptcha,
                buttons: [
                    {
                        text: TRANSLATIONS.submit, click: function() {
                            saveForm(summary, minor, sectionNumber, captchaId, $('#input-captcha').val());
                            $(this).dialog('destroy').remove();
                        }
                    },
                    {
                        text: TRANSLATIONS.cancel, click: function() {
                            $(this).dialog('destroy').remove();
                        }
                    }
                ]
            });
        };

        /**
         * Called on DOM ready, this method initializes the listing editor and
         * adds the "add/edit listing" links to sections and existing listings.
         */
        var initListingEditor = function() {
            if (!listingEditorAllowedForCurrentPage()) {
                return;
            }
            addButtons();
        };

        // expose public members
        return {
            MODE_ADD: MODE_ADD,
            MODE_EDIT: MODE_EDIT,
            init: initListingEditor
        };
    }();

    $(document).ready(function() {
        CulturalHeritageListingEditor.Core.init();
    });
});
//</nowiki>
