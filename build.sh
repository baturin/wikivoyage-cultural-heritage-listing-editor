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
    cat "src/$sourceFile" | grep -v -e 'import .* from .*;' | grep -v 'module.exports = .*;' | npx babel --presets es2015 | grep -v "use strict">> "$resultFile";
}

NATURAL_EDITOR_RESULTING_FILE=dist/natural-editor.js

writeHeader "$NATURAL_EDITOR_RESULTING_FILE"
appendFile lib/string-utils.js "$NATURAL_EDITOR_RESULTING_FILE"
appendFile lib/array-utils.js "$NATURAL_EDITOR_RESULTING_FILE"
appendFile lib/mediawiki-page.js "$NATURAL_EDITOR_RESULTING_FILE"
appendFile lib/listing-editor-utils.js "$NATURAL_EDITOR_RESULTING_FILE"
appendFile lib/listing-editor-buttons.js "$NATURAL_EDITOR_RESULTING_FILE"
appendFile lib/listing-editor-dialog.js "$NATURAL_EDITOR_RESULTING_FILE"
appendFile lib/listing-editor-form-composer.js "$NATURAL_EDITOR_RESULTING_FILE"
appendFile natural-editor.js "$NATURAL_EDITOR_RESULTING_FILE"
writeFooter "$NATURAL_EDITOR_RESULTING_FILE"