
let MediaWikiPage = {
    getPageName()
    {
        return mw.config.get('wgPageName');
    },

    isDiffMode()
    {
        return $('table.diff').length > 0;
    },

    isLastRevision()
    {
        return mw.config.get('wgCurRevisionId') === mw.config.get('wgRevisionId');
    },

    isViewAction()
    {
        return mw.config.get('wgAction') === 'view';
    },

    isViewSourceMode()
    {
        return $('#ca-viewsource').length > 0;
    },

    isViewSpecificRevisionMode()
    {
        return $('#mw-revision-info').length > 0;
    },

    isRegularNamespace()
    {
        let namespace = mw.config.get('wgNamespaceNumber');
        return (namespace === 0 || namespace === 2 || namespace === 4);
    },
};

module.exports = MediaWikiPage;
