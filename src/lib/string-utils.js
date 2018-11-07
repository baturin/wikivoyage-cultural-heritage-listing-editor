
export const StringUtils = {
    contains: function(string, substring) {
        return string.indexOf(substring) >= 0;
    },

    trim: function(string) {
        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/Trim
        return string.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
    },

    emptyToString(value) {
        if (value === undefined || value === null) {
            return '';
        } else {
            return value;
        }
    }
};
