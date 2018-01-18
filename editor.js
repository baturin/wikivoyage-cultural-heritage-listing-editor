/******************************************************************
 Russian Cultural Heritage Listing Editor.

 Forked from "Listing Editor v2.1"
 - Original author: torty3
 - Additional contributors: Andyrom75, Wrh2
 ********************************************************************/
//<nowiki>
mw.loader.using(['mediawiki.api'], function() {
    'use strict';

    var CulturalHeritageListingEditor = {};

    var monumentListingParameterDescriptors = [
        {
            id: 'name',
            formInputId: 'input-name'
        },
        {
            id: 'type',
            formInputId: 'input-type',
            possibleValues: [
                {
                    'value': 'architecture',
                    'title': 'памятник архитектуры'
                },
                {
                    'value': 'history',
                    'title': 'памятник истории'
                },
                {
                    'value': 'monument',
                    'title': 'памятник монументального искусства'
                },
                {
                    'value': 'archeology',
                    'title': 'памятник археологии'
                }
            ]
        },
        {
            id: 'status',
            getValue: function() {
                if ($('#input-destroyed').is(':checked')) {
                    return 'destroyed';
                } else {
                    return '';
                }
            },
            setValue: function(form, value) {
                $('#input-destroyed', form).attr('checked', value === 'destroyed');
            }
        },
        {
            id: 'region',
            formInputId: 'input-region'
        },
        {
            id: 'district',
            formInputId: 'input-district'
        },
        {
            id: 'municipality',
            formInputId: 'input-municipality'
        },
        {
            id: 'block',
            formInputId: 'input-block'
        },
        {
            id: 'address',
            formInputId: 'input-address'
        },
        {
            id: 'lat',
            formInputId: 'input-lat'
        },
        {
            id: 'long',
            formInputId: 'input-long'
        },
        {
            id: 'precise',
            getValue: function() {
                if ($('#input-precise').is(':checked')) {
                    return 'yes';
                } else {
                    return 'no';
                }
            },
            setValue: function(form, value) {
                $('#input-precise', form).prop('checked', value === 'yes')
            }
        },
        {
            id: 'year',
            formInputId: 'input-year'
        },
        {
            id: 'author',
            formInputId: 'input-author'
        },
        {
            id: 'knid',
            formInputId: 'input-knid'
        },
        {
            id: 'complex',
            formInputId: 'input-complex'
        },
        {
            id: 'knid-new',
            formInputId: 'input-knid-new'
        },
        {
            id: 'image',
            formInputId: 'input-image'
        },
        {
            id: 'wiki',
            formInputId: 'input-wiki'
        },
        {
            id: 'wdid',
            formInputId: 'input-wdid'
        },
        {
            id: 'commonscat',
            formInputId: 'input-commonscat'
        },
        {
            id: 'munid',
            formInputId: 'input-munid'
        },
        {
            id: 'document',
            formInputId: 'input-document'
        },
        {
            id: 'link',
            formInputId: 'input-link'
        },
        {
            id: 'linkextra',
            formInputId: 'input-linkextra'
        },
        {
            id: 'description',
            formInputId: 'input-description'
        }
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
            },

            getParameterIds: function () {
                return this._parameterIds;
            },

            foreachParameter: function(callback) {
                for (var i = 0; i < parameterDescriptors.length; i++) {
                    var parameterData = parameterDescriptors[i];
                    callback(parameterData);
                }
            }
        };
    }

    var monumentListingParameters = createTemplateParameters(monumentListingParameterDescriptors);

    function arrayHasElement(array, element) {
        return array.indexOf(element) >= 0;
    }

    function createListingSerializer(listingType, listingParameters, listingData) {
        return {
            _data: '',
            _serializedParameters: [],

            writeListingStart: function() {
                this._data += '{{' + listingType + '\n';
            },

            writeParameterLine: function(parameterName, optional) {
                var parameterValue = listingData[parameterName];
                if (optional && (parameterValue === '' || parameterValue === undefined)) {
                    return;
                }
                if (parameterValue === undefined) {
                    parameterValue = '';
                }
                this._data += '|' + parameterName + "=" + parameterValue + "\n";
                this._serializedParameters.push(parameterName);
            },

            writeParametersLine: function(parameterNames) {
                for (var i = 0; i < parameterNames.length; i++) {
                    var parameterName = parameterNames[i];
                    var parameterValue = listingData[parameterName];
                    if (parameterValue === undefined) {
                        parameterValue = '';
                    }
                    if (i > 0) {
                        this._data += " ";
                    }
                    this._data += "|" + parameterName + "=" + parameterValue;
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
                                this._data += '|' + parameterName + "=" + parameterValue + "\n"
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
        serializer.writeParameterLine("type");
        serializer.writeParametersLine(["lat", "long", "precise"]);
        serializer.writeParameterLine("name");
        serializer.writeParametersLine(["knid", "complex"]);
        serializer.writeParameterLine("knid-new");
        serializer.writeParametersLine(["region", "district"]);
        serializer.writeParametersLine(["municipality", "munid"]);
        serializer.writeParameterLine("block", true);
        serializer.writeParameterLine("address");
        serializer.writeParameterLine("year");
        serializer.writeParameterLine("author");
        serializer.writeParameterLine("description");
        serializer.writeParameterLine("status", true);
        serializer.writeParameterLine("image");
        serializer.writeParameterLine("wdid");
        serializer.writeParameterLine("wiki");
        serializer.writeParameterLine("commonscat");
        serializer.writeParameterLine("link");
        serializer.writeParameterLine("linkextra", true);
        serializer.writeParameterLine("document");
        serializer.writeParameterLine("doc", true);
        serializer.writeParameterLine("style", true);
        serializer.writeParameterLine("protection", true);
        serializer.writeParameterLine("dismissed", true);
        serializer.writeOtherNonEmptyParameters();
        serializer.writeListingEnd();

        return serializer.getSerializedListing();
    }

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
            licenseText: 'Нажимая кнопку «Сохранить», вы соглашаетесь с <a class="external" target="_blank" href="https://wikimediafoundation.org/wiki/Terms_of_Use/ru">условиями использования</a>, а также соглашаетесь на неотзывную публикацию по лицензии <a class="external" target="_blank" href="https://en.wikipedia.org/wiki/ru:Википедия:Текст_Лицензии_Creative_Commons_Attribution-ShareAlike_3.0_Unported">CC-BY-SA 3.0</a>.',
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

        var EDITOR_FORM_SELECTOR = '#listing-editor';
        var EDITOR_SUMMARY_SELECTOR = '#input-summary';
        var EDITOR_MINOR_EDIT_SELECTOR = '#input-minor';

        function editorFormRow(inputId, label, innerHtml)
        {
            return (
                '<tr id="div_' + inputId + '">' +
                '<td class="editor-label-col" style="width: 200px">' +
                '<label for="input-' + inputId + '">' + label + '</label>' +
                '</td>' +
                '<td>' +
                innerHtml +
                '</td>' +
                '</tr>'
            );
        }

        function editorFormRowText(inputId, label, placeholder, partialWidth, insertSymbols)
        {
            var style = '';
            var inputClass = 'editor-fullwidth';
            if (partialWidth) {
                inputClass = 'editor-partialwidth';
            } else {
                if (insertSymbols) {
                    style=" style='width: 90%'";
                }
            }
            if (!placeholder) {
                placeholder = '';
            }

            var controlHtml = '<input type="text" class="' + inputClass + '"' + style + ' placeholder="' + placeholder + '" id="input-' + inputId + '">';
            if (insertSymbols) {
                controlHtml += '&nbsp;';
                controlHtml += '<a class="name-quotes-template" href="javascript:">«»</a>&nbsp;';
                controlHtml += '<a class="name-dash-template" href="javascript:">—</a>';
            }
            return editorFormRow(inputId, label, controlHtml);
        }

        function editorFormRowCheckbox(inputId, label)
        {
            var controlHtml = '<input type="checkbox" id="input-' + inputId + '">';
            return editorFormRow(inputId, label, controlHtml);
        }

        function editorFormRowSelect(inputId, label, options)
        {
            var controlHtml = '<select id="input-' + inputId + '">';
            options.forEach(function(option) {
                controlHtml += '<option value="' + option.value + '">';
                controlHtml += option.title;
                controlHtml += '</option>';
            });
            controlHtml += '</select>';
            return editorFormRow(inputId, label, controlHtml);
        }

        function tableFullWidth(rows)
        {
            return (
                '<div>' +
                '<table class="editor-fullwidth">' +
                rows.join('') +
                '</table>' +
                '</div>'
            );
        }

        function tableTwoColumns(leftRows, rightRows)
        {
            return (
                '<div>' +
                '<div class="listing-col listing-span_1_of_2">' +
                '<table class="editor-fullwidth">' +
                leftRows.join('') +
                '</table>' +
                '</div>' +
                '<div class="listing-col listing-span_1_of_2">' +
                '<table class="editor-fullwidth">' +
                rightRows.join('') +
                '</table>' +
                '</div>' +
                '</div>'
            );
        }

        function rowDivider()
        {
            return '<tr><td colspan="2"><div class="listing-divider" style="margin: 3px 0"/></td></tr>';
        }

        var EDITOR_FORM_HTML = '' +
            '<form id="listing-editor">' +
            '<br/>' +
            tableFullWidth(
                [
                    editorFormRowText('name', 'Название', 'название объекта', false, true),
                    rowDivider()
                ]
            ) +
            tableTwoColumns(
                [
                    editorFormRowSelect('type', 'Тип', monumentListingParameters.getParameter('type').possibleValues),
                    editorFormRowCheckbox('destroyed', 'Утрачен'),
                    rowDivider(),
                    editorFormRowText('region', 'Регион (ISO-код)'),
                    editorFormRowText('district', 'Район'),
                    editorFormRowText('municipality', 'Населённый пункт'),
                    editorFormRowText('block', 'Квартал', ''),
                    editorFormRowText('address', 'Адрес', 'улица название, номер дома'),
                    rowDivider(),
                    editorFormRowText('lat', 'Широта', '11.11111', true),
                    editorFormRowText('long', 'Долгота', '111.11111', true),
                    editorFormRowCheckbox('precise', 'Точные координаты'),
                    rowDivider(),
                    editorFormRowText('year', 'Год постройки', 'yyyy', true),
                    editorFormRowText('author', 'Автор объекта', 'архитектор, скульптор, инженер и т.д.')
                ],
                [
                    editorFormRowText('knid', '10-ти значный № объекта', 'dddddddddd', true),
                    editorFormRowText('complex', '10-ти значный № комплекса', 'dddddddddd', true),
                    editorFormRowText('knid-new', '15-ти значный № объекта', 'ddddddddddddddd', true),
                    rowDivider(),
                    editorFormRowText('image', 'Изображение', 'изображение на Викискладе'),
                    editorFormRowText('wiki', 'Википедия', 'статья в русской Википедии'),
                    editorFormRowText('wdid', 'Викиданные', 'идентификатор Викиданных', true),
                    editorFormRowText('commonscat', 'Викисклад', 'категория Викисклада'),
                    editorFormRowText('munid', 'Викиданные нас. пункта', 'идентификатор Викиданных', true),
                    editorFormRowText('document', 'Код документа', 'dDDMMYYYY', true),
                    rowDivider(),
                    editorFormRowText('link', 'Ссылка №1', 'внешняя ссылка с дополнительной информацией об объекте'),
                    editorFormRowText('linkextra', 'Ссылка №2', 'внешняя ссылка с дополнительной информацией об объекте'),
                    rowDivider()
                ]
            ) +
            tableFullWidth(
                [
                    rowDivider(),
                    '<tr id="div_description">' +
                    '<td class="editor-label-col" style="width: 200px"><label for="input-description">Описание</label></td>' +
                    '<td><textarea rows="4" class="editor-fullwidth" placeholder="описание объекта" id="input-description"></textarea></td>' +
                    '</tr>'
                ]
            ) +
            tableFullWidth(
                [
                    rowDivider(),
                    '<tr>' +
                    '<td class="editor-label-col" style="width: 200px"><label for="input-summary">Описание изменений</label></td>' +
                    '<td>' +
                    '<input type="text" class="editor-partialwidth" placeholder="что именно было изменено" id="input-summary">' +
                    '<span id="span-minor"><input type="checkbox" id="input-minor"><label for="input-minor" class="listing-tooltip" title="Установите галочку, если изменение незначительное, например, исправление опечатки">незначительное изменение?</label></span>' +
                    '</td>' +
                    '</tr>'
                ]
            ) +
            '</form>';
        
        
        
        var api = new mw.Api();
        var MODE_ADD = 'add';
        var MODE_EDIT = 'edit';
        // selector that identifies the edit link as created by the
        // addEditButtons() function
        var SAVE_FORM_SELECTOR = '#progress-dialog';
        var CAPTCHA_FORM_SELECTOR = '#captcha-dialog';
        var sectionText, inlineListing, replacements = {};

        /**
         * Return false if the current page should not enable the listing editor.
         * Examples where the listing editor should not be enabled include talk
         * pages, edit pages, history pages, etc.
         */
        var listingEditorAllowedForCurrentPage = function() {
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
            if (mw.config.get('wgPageName').indexOf('Культурное_наследие_России') < 0) {
                return false;
            }
            return true;
        };

        /**
         * Place an "add listing" link at the top of each section heading next to
         * the "edit" link in the section heading.
         */
        var addButtons = function() {
            var tableOfContentsCount = 0;
            var firstListingTableWithinSection = null;

            var pageBodyContentElement = $('#bodyContent');

            // Iterate over section headers
            pageBodyContentElement.find('h2').each(function(headerElementIndex) {
                var headerElement = $(this);

                var isTableOfContents = headerElement.parents('.toc').length > 0;
                if (isTableOfContents) {
                    tableOfContentsCount += 1;
                    return;
                }

                var sectionIndex = headerElementIndex - tableOfContentsCount + 1;
                var sectionEditLink = $('<a href="javascript:">добавить</a>');
                var bracketStart = $('<span class="mw-editsection-bracket">[</span>');
                var bracketEnd = $('<span class="mw-editsection-bracket">]</span>');
                headerElement.append(
                    $('<span class="mw-editsection"/>').append(bracketStart).append(sectionEditLink).append(bracketEnd)
                );
                sectionEditLink.click(function() {
                    initListingEditorDialog(MODE_ADD, sectionIndex);
                });

                // Iterate over listings inside sections
                headerElement.nextUntil("h1, h2", "table.monument").each(function(listingIndex) {
                    var listingTable = $(this);
                    if (firstListingTableWithinSection === null) {
                        firstListingTableWithinSection = listingTable;
                    }
                    addEditButton(listingTable, sectionIndex, listingIndex);
                });
            });

            // Iterate over listings that are before any section
            pageBodyContentElement.find('table.monument').each(function(listingIndex) {
                var listingTable = $(this);

                if (listingTable.is(firstListingTableWithinSection)) {
                    return false;
                }

                addEditButton(listingTable, 0, listingIndex);
            });
        };

        function addEditButton(listingTable, sectionIndex, listingIndex)
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
                if ($(EDITOR_FORM_SELECTOR).length > 0) {
                    $(EDITOR_FORM_SELECTOR).dialog('destroy').remove();
                }
                var form = $(createForm(mode, listingTemplateAsMap));
                // wide dialogs on huge screens look terrible
                var windowWidth = $(window).width();
                var dialogWidth = (windowWidth > MAX_DIALOG_WIDTH) ? MAX_DIALOG_WIDTH : 'auto';
                // modal form - must submit or cancel
                form.dialog({
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
                                if (validateForm()) {
                                    formToText(mode, listingTemplateWikiSyntax, listingTemplateAsMap, sectionNumber);
                                    $(this).dialog('close');
                                }
                            }
                        },
                        {
                            text: TRANSLATIONS.cancel,
                            click: function() {
                                $(this).dialog('destroy').remove();
                            }
                        }
                    ],
                    create: function() {
                        $('.ui-dialog-buttonpane').append('<div class="listing-license">' + TRANSLATIONS.licenseText + '</div>');
                    }
                });
            });
        };

        /**
         * Generate the form UI for the listing editor.  If editing an existing
         * listing, pre-populate the form input fields with the existing values.
         */
        var createForm = function(mode, listingTemplateAsMap) {
            var form = $(EDITOR_FORM_HTML);

            // populate the empty form with existing values
            monumentListingParameters.foreachParameter(function(parameterData) {
                var inputId = parameterData.formInputId;
                var input = $('#' + inputId, form);

                var paramValue = listingTemplateAsMap[parameterData.id];
                if (paramValue) {
                    if (parameterData.setValue) {
                        parameterData.setValue(form, paramValue);
                    } else {
                        input.val(paramValue);
                    }
                }
            });
            initQuotesInsert(form);
            initDashInsert(form);
            return form;
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
         * Logic invoked on form submit to analyze the values entered into the
         * editor form and to block submission if any fatal errors are found.
         */
        var validateForm = function() {
            // newlines in listing description won't render properly in lists, so
            // replace them with <p> tags
            $('#input-description').val($.trim($('#input-description').val()).replace(/\n+/g, '<p>'));
            var webRegex = new RegExp('^https?://', 'i');
            var url = $('#input-url').val();
            if (!webRegex.test(url) && url !== '') {
                $('#input-url').val('http://' + url);
            }
            return true;
        };

        /**
         * Convert the listing editor form entry fields into wiki text.  This
         * method converts the form entry fields into a listing template string,
         * replaces the original template string in the section text with the
         * updated entry, and then submits the section text to be saved on the
         * server.
         */
        var formToText = function(mode, listingTemplateWikiSyntax, listing, sectionNumber) {
            monumentListingParameters.foreachParameter(function(parameterData) {
                if (parameterData.getValue) {
                    listing[parameterData.id] = parameterData.getValue();
                } else {
                    var input = $("#" + parameterData.formInputId);
                    listing[parameterData.id] = input.val();
                }
            });
            var text = serializeMonumentListing(listing);

            var summary = editSummarySection();
            if (mode === MODE_ADD) {
                summary = updateSectionTextWithAddedListing(summary, text, listing);
            } else {
                summary = updateSectionTextWithEditedListing(summary, text, listingTemplateWikiSyntax);
            }
            summary += $("#input-name").val();
            if ($(EDITOR_SUMMARY_SELECTOR).val() !== '') {
                summary += ' - ' + $(EDITOR_SUMMARY_SELECTOR).val();
            }

            var minor = $(EDITOR_MINOR_EDIT_SELECTOR).is(':checked') ? true : false;

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
            $(EDITOR_FORM_SELECTOR).dialog('open');
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

        var initQuotesInsert = function(form) {
            $('.name-quotes-template', form).click(function() {
                var link = $(this);
                var input = link.siblings('input').first();
                var selectionStart = input[0].selectionStart;
                var selectionEnd = input[0].selectionEnd;
                var oldValue = input.val();
                var newValue = oldValue.substring(0, selectionStart) + "«" + oldValue.substring(selectionStart, selectionEnd) + "»" + oldValue.substring(selectionEnd);
                input.val(newValue);
            });
        };

        var initDashInsert = function(form) {
            $('.name-dash-template', form).click(function() {
                var link = $(this);
                var input = link.siblings('input').first();
                var caretPos = input[0].selectionStart;
                var oldValue = input.val();
                var newValue = oldValue.substring(0, caretPos) + "—" + oldValue.substring(caretPos);
                input.val(newValue);
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