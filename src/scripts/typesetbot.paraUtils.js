TypesetBot.paraUtils = (function(obj) {

    /**
     * Get the width of a space with 'word-spacing: 0'.
     * Note: Width depends on font-family and font-size.
     */
    obj.getDefaultSpaceWidth = function (dom) {
        dom.prepend('<span class="typeset-space">1<span> </span>1</span>');
        var elem = dom.find('.typeset-space');
        elem.css('word-spacing', '0');
        var width = dom.find('.typeset-space > span').width();
        elem.remove();
        return width;
    };

    /**
     * Set specific word spacing, adjusting for the font's default size of a space.
     */
    obj.setSpaceWidth = function (dom, value, unit) {
        var defaultWidth = obj.getDefaultSpaceWidth(dom);
        dom.css('word-spacing', 'calc(1' + unit + '*(' + value + ') - ' + defaultWidth + 'px)');
    };

    /**
     * Return an array of words from some html text.
     */
    obj.getWords = function (html) {
        return html.trim().replace( /\n/g, " " ).replace( /\s+/g, " " ).replace(/ (?![^<]*>)/g, '&nbsp;')
            .split('&nbsp;');
    };

    /**
     * Remove breaks from paragraph.
     */
    obj.removeBreak = function (dom) {
        var html = dom.html().replace(/<br[\/]?>/g, '');
        dom.html(html);
    };

    /**
     * Remove breaks from paragraph.
     */
    obj.removeImage = function (dom) {
        var oldHtml = dom.html(),
            html = oldHtml.replace(/<img[\/]?>/g, '');
        if (html != oldHtml) {
            console.warn('Found image inside paragraph');
        }
        dom.html(html);

    };

    /**
     * Remove breaks from paragraph.
     */
    obj.isVisible = function (dom) {
        return dom.is(':visible');
    };

    return obj;
})(TypesetBot.paraUtils || {});
