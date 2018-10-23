
import { StringUtils } from "./string-utils";

export const WikitextParser = {
    /**
     * Given a listing index, return the full wikitext for that listing
     * ("{{listing|key=value|...}}"). An index of 0 returns the first listing
     * template invocation, 1 returns the second, etc.
     */
    getListingWikitextBraces(wikitext, listingName, listingIndex) {
        // find the listing wikitext that matches the same index as the listing index
        let listingRegex = new RegExp('{{\\s*(' + listingName + ')(\\s|\\|)','ig');
        // look through all matches for "{{listing|see|do...}}" within the section
        // wikitext, returning the nth match, where 'n' is equal to the index of the
        // edit link that was clicked
        let listingSyntax, regexResult, listingMatchIndex;
        for (let i = 0; i <= listingIndex; i++) {
            regexResult = listingRegex.exec(wikitext);
            if (!regexResult) {
                return null;
            }

            listingMatchIndex = regexResult.index;
            listingSyntax = regexResult[0];
        }
        // listings may contain nested templates, so step through all section
        // text after the matched text to find MATCHING closing braces
        // the first two braces are matched by the listing regex and already
        // captured in the listingSyntax variable
        let curlyBraceCount = 2;
        let endPos = wikitext.length;
        let startPos = listingMatchIndex + listingSyntax.length;
        let matchFound = false;
        for (let j = startPos; j < endPos; j++) {
            if (wikitext[j] === '{') {
                ++curlyBraceCount;
            } else if (wikitext[j] === '}') {
                --curlyBraceCount;
            }
            if (curlyBraceCount === 0 && (j + 1) < endPos) {
                listingSyntax = wikitext.substring(listingMatchIndex, j + 1);
                matchFound = true;
                break;
            }
        }
        if (!matchFound) {
            listingSyntax = wikitext.substring(listingMatchIndex);
        }
        return StringUtils.trim(listingSyntax);
    },

    /**
     * Convert raw wiki listing syntax into a mapping of key-value pairs
     * corresponding to the listing template parameters.
     */
    wikiTextToListing(wikitext) {
        // remove the trailing braces if there are some
        for (let i = 0; i < 2; i++) {
            if (wikitext[wikitext.length - 1] === '}') {
                wikitext = wikitext.slice(0, -1);
            }
        }

        let listingData = {};
        let lastKey;
        let listParams = WikitextParser.listingTemplateToParamsArray(wikitext);
        for (let i = 1; i < listParams.length; i++) {
            let param = listParams[i];
            let index = param.indexOf('=');
            if (index > 0) {
                // param is of the form key=value
                let key = StringUtils.trim(param.substr(0, index));
                listingData[key] = StringUtils.trim(param.substr(index+1));
                lastKey = key;
            } else if (listingData[lastKey].length) {
                // there was a pipe character within a param value, such as
                // "key=value1|value2", so just append to the previous param
                listingData[lastKey] += '|' + param;
            }
        }

        return listingData;
    },

    /**
     * Split the raw template wikitext into an array of params. The pipe
     * symbol delimits template params, but this method will also inspect the
     * description to deal with nested templates or wikilinks that might contain
     * pipe characters that should not be used as delimiters.
     */
    listingTemplateToParamsArray(wikitext) {
        let results = [];
        let paramValue = '';
        let pos = 0;
        while (pos < wikitext.length) {
            let remainingString = wikitext.substr(pos);
            // check for a nested template or wikilink
            let patternMatch = WikitextParser.findPatternMatch(remainingString, "{{", "}}");
            if (patternMatch.length === 0) {
                patternMatch = WikitextParser.findPatternMatch(remainingString, "[[", "]]");
            }
            if (patternMatch.length > 0) {
                paramValue += patternMatch;
                pos += patternMatch.length;
            } else if (wikitext.charAt(pos) === '|') {
                // delimiter - push the previous param and move on to the next
                results.push(paramValue);
                paramValue = '';
                pos++;
            } else {
                // append the character to the param value being built
                paramValue += wikitext.charAt(pos);
                pos++;
            }
        }
        if (paramValue.length > 0) {
            // append the last param value
            results.push(paramValue);
        }
        return results;
    },

    /**
     * Utility method for finding a matching end pattern for a specified start
     * pattern, including nesting.  The specified value must start with the
     * start value, otherwise an empty string will be returned.
     */
    findPatternMatch(value, startPattern, endPattern) {
        let matchString = '';
        let startRegex = new RegExp('^' + WikitextParser.replaceSpecial(startPattern), 'i');
        if (startRegex.test(value)) {
            let endRegex = new RegExp('^' + WikitextParser.replaceSpecial(endPattern), 'i');
            let matchCount = 1;
            for (let i = startPattern.length; i < value.length; i++) {
                let remainingValue = value.substr(i);
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
    },

    replaceSpecial(str) {
        return str.replace(/[.?*+^$[\]\\(){}|-]/g, "\\$&");
    }
};
