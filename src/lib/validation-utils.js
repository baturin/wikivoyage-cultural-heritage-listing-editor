
export const ValidationUtils = {
    normalizeUrl: function(url) {
        let webRegex = new RegExp('^https?://', 'i');
        if (!webRegex.test(url) && url !== '') {
            return 'http://' + url;
        } else {
            return url;
        }
    }
};
