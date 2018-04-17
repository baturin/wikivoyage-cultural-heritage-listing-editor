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

writeHeader "$NATURAL_EDITOR_RESULTING_FILE"
appendFile lib/messages.js "$NATURAL_EDITOR_RESULTING_FILE"
appendFile lib/string-utils.js "$NATURAL_EDITOR_RESULTING_FILE"
appendFile lib/array-utils.js "$NATURAL_EDITOR_RESULTING_FILE"
appendFile lib/async-utils.js "$NATURAL_EDITOR_RESULTING_FILE"
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