#!/bin/bash

# Do not use webpack as we need super-human readable resulting code
# so anyone on Wikivoyage who even does not know JavaScript and all
# related stuff could fix obvious issues.

writeHeader() {
    resultFile="$1";
    echo "mw.loader.using(['mediawiki.api'], function() {" > "$resultFile";
}

writeFooter() {
    resultFile="$1";
    echo '});' >> "$resultFile";
}

appendFile() {
    sourceFile="$1";
    resultFile="$2";
    cat "src/$sourceFile" | grep -v 'require' | grep -v -e 'import .* from .*;' | grep -v 'module.exports = .*;' | npx babel --presets es2015 | grep -v "use strict">> "$resultFile";
}

NATURAL_EDITOR_RESULTING_FILE=dist/natural-editor.js
CULTURAL_EDITOR_KZ_RESULTING_FILE=dist/cultural-editor-kz.js
NO_IMAGE_WARNING_FILE=dist/no-image-warning.js
IMAGE_COUNT_FILE=dist/image-count.js

writeHeader "$NATURAL_EDITOR_RESULTING_FILE"
appendFile lib/messages.js "$NATURAL_EDITOR_RESULTING_FILE"
appendFile lib/string-utils.js "$NATURAL_EDITOR_RESULTING_FILE"
appendFile lib/array-utils.js "$NATURAL_EDITOR_RESULTING_FILE"
appendFile lib/async-utils.js "$NATURAL_EDITOR_RESULTING_FILE"
appendFile lib/object-utils.js "$NATURAL_EDITOR_RESULTING_FILE"
appendFile lib/validation-utils.js "$NATURAL_EDITOR_RESULTING_FILE"
appendFile lib/mediawiki-page.js "$NATURAL_EDITOR_RESULTING_FILE"
appendFile lib/captcha-dialog.js "$NATURAL_EDITOR_RESULTING_FILE"
appendFile lib/listing-editor-utils.js "$NATURAL_EDITOR_RESULTING_FILE"
appendFile lib/listing-editor-buttons.js "$NATURAL_EDITOR_RESULTING_FILE"
appendFile lib/listing-editor-dialog.js "$NATURAL_EDITOR_RESULTING_FILE"
appendFile lib/listing-editor-form-composer.js "$NATURAL_EDITOR_RESULTING_FILE"
appendFile lib/regions.js "$NATURAL_EDITOR_RESULTING_FILE"
appendFile lib/mediawiki-page-wikitext.js "$NATURAL_EDITOR_RESULTING_FILE"
appendFile lib/regions.js "$NATURAL_EDITOR_RESULTING_FILE"
appendFile lib/natural-editor/monument-categories.js "$NATURAL_EDITOR_RESULTING_FILE"
appendFile lib/natural-editor/monument-statuses.js "$NATURAL_EDITOR_RESULTING_FILE"
appendFile lib/natural-editor/monument-types.js "$NATURAL_EDITOR_RESULTING_FILE"
appendFile lib/natural-editor/editor-form.js "$NATURAL_EDITOR_RESULTING_FILE"
appendFile lib/wikitext-parser.js "$NATURAL_EDITOR_RESULTING_FILE"
appendFile lib/wikitext-section-editor.js "$NATURAL_EDITOR_RESULTING_FILE"
appendFile lib/listing-serializer.js "$NATURAL_EDITOR_RESULTING_FILE"
appendFile lib/natural-editor/listing-serializer.js "$NATURAL_EDITOR_RESULTING_FILE"
appendFile lib/saving-form.js "$NATURAL_EDITOR_RESULTING_FILE"
appendFile lib/input-insert-symbols.js "$NATURAL_EDITOR_RESULTING_FILE"
appendFile lib/commons-api.js "$NATURAL_EDITOR_RESULTING_FILE"
appendFile lib/commons-images-loader.js "$NATURAL_EDITOR_RESULTING_FILE"
appendFile lib/commons-images-select-dialog.js "$NATURAL_EDITOR_RESULTING_FILE"
appendFile lib/init-listing-editor.js "$NATURAL_EDITOR_RESULTING_FILE"
appendFile natural-editor.js "$NATURAL_EDITOR_RESULTING_FILE"
writeFooter "$NATURAL_EDITOR_RESULTING_FILE"

writeHeader "$CULTURAL_EDITOR_KZ_RESULTING_FILE"
appendFile lib/messages.js "$CULTURAL_EDITOR_KZ_RESULTING_FILE"
appendFile lib/string-utils.js "$CULTURAL_EDITOR_KZ_RESULTING_FILE"
appendFile lib/array-utils.js "$CULTURAL_EDITOR_KZ_RESULTING_FILE"
appendFile lib/async-utils.js "$CULTURAL_EDITOR_KZ_RESULTING_FILE"
appendFile lib/object-utils.js "$CULTURAL_EDITOR_KZ_RESULTING_FILE"
appendFile lib/validation-utils.js "$CULTURAL_EDITOR_KZ_RESULTING_FILE"
appendFile lib/mediawiki-page.js "$CULTURAL_EDITOR_KZ_RESULTING_FILE"
appendFile lib/captcha-dialog.js "$CULTURAL_EDITOR_KZ_RESULTING_FILE"
appendFile lib/listing-editor-utils.js "$CULTURAL_EDITOR_KZ_RESULTING_FILE"
appendFile lib/listing-editor-buttons.js "$CULTURAL_EDITOR_KZ_RESULTING_FILE"
appendFile lib/listing-editor-dialog.js "$CULTURAL_EDITOR_KZ_RESULTING_FILE"
appendFile lib/listing-editor-form-composer.js "$CULTURAL_EDITOR_KZ_RESULTING_FILE"
appendFile lib/mediawiki-page-wikitext.js "$CULTURAL_EDITOR_KZ_RESULTING_FILE"
appendFile lib/regions.js "$CULTURAL_EDITOR_KZ_RESULTING_FILE"
appendFile lib/cultural-monument-styles.js "$CULTURAL_EDITOR_KZ_RESULTING_FILE"
appendFile lib/cultural-monument-types.js "$CULTURAL_EDITOR_KZ_RESULTING_FILE"
appendFile lib/cultural-editor-kz/protections.js "$CULTURAL_EDITOR_KZ_RESULTING_FILE"
appendFile lib/regions-kz.js "$CULTURAL_EDITOR_KZ_RESULTING_FILE"
appendFile lib/cultural-editor-kz/editor-form.js "$CULTURAL_EDITOR_KZ_RESULTING_FILE"
appendFile lib/cultural-editor-kz/listing-serializer.js "$CULTURAL_EDITOR_KZ_RESULTING_FILE"
appendFile lib/wikitext-parser.js "$CULTURAL_EDITOR_KZ_RESULTING_FILE"
appendFile lib/wikitext-section-editor.js "$CULTURAL_EDITOR_KZ_RESULTING_FILE"
appendFile lib/listing-serializer.js "$CULTURAL_EDITOR_KZ_RESULTING_FILE"
appendFile lib/saving-form.js "$CULTURAL_EDITOR_KZ_RESULTING_FILE"
appendFile lib/input-insert-symbols.js "$CULTURAL_EDITOR_KZ_RESULTING_FILE"
appendFile lib/commons-api.js "$CULTURAL_EDITOR_KZ_RESULTING_FILE"
appendFile lib/commons-images-loader.js "$CULTURAL_EDITOR_KZ_RESULTING_FILE"
appendFile lib/commons-images-select-dialog.js "$CULTURAL_EDITOR_KZ_RESULTING_FILE"
appendFile lib/init-listing-editor.js "$CULTURAL_EDITOR_KZ_RESULTING_FILE"
appendFile cultural-editor-kz.js "$CULTURAL_EDITOR_KZ_RESULTING_FILE"
writeFooter "$CULTURAL_EDITOR_KZ_RESULTING_FILE"

writeHeader "$NO_IMAGE_WARNING_FILE"
appendFile lib/async-utils.js "$NO_IMAGE_WARNING_FILE"
appendFile lib/string-utils.js "$NO_IMAGE_WARNING_FILE"
appendFile lib/array-utils.js "$NO_IMAGE_WARNING_FILE"
appendFile lib/object-utils.js "$NO_IMAGE_WARNING_FILE"
appendFile lib/mediawiki-page.js "$NO_IMAGE_WARNING_FILE"
appendFile lib/commons-api.js "$NO_IMAGE_WARNING_FILE"
appendFile lib/listing-table-html.js "$NO_IMAGE_WARNING_FILE"
appendFile lib/listing-editor-utils.js "$NO_IMAGE_WARNING_FILE"
appendFile no-image-warning.js "$NO_IMAGE_WARNING_FILE"
writeFooter "$NO_IMAGE_WARNING_FILE"

writeHeader "$IMAGE_COUNT_FILE"
appendFile lib/async-utils.js "$IMAGE_COUNT_FILE"
appendFile lib/string-utils.js "$IMAGE_COUNT_FILE"
appendFile lib/array-utils.js "$IMAGE_COUNT_FILE"
appendFile lib/object-utils.js "$IMAGE_COUNT_FILE"
appendFile lib/mediawiki-page.js "$IMAGE_COUNT_FILE"
appendFile lib/commons-api.js "$IMAGE_COUNT_FILE"
appendFile lib/listing-table-html.js "$IMAGE_COUNT_FILE"
appendFile lib/listing-editor-utils.js "$IMAGE_COUNT_FILE"
appendFile image-count.js "$IMAGE_COUNT_FILE"
writeFooter "$IMAGE_COUNT_FILE"

