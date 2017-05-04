TypesetBot.paraUtils = (function(obj) {

    /**
     * Get the width of a space with 'word-spacing: 0'.
     * Note: Width depends on font-family and font-size.
     */
    obj.getDefaultSpaceWidth  = function (dom) {
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
    obj.setSpaceWidth  = function (dom, value, unit) {
        var defaultWidth = obj.getDefaultSpaceWidth(dom);
        dom.css('word-spacing', 'calc(1' + unit + '*(' + value + ') - ' + defaultWidth + 'px)');
    };

    /**
     * Return an array of words from some html text.
     */
    obj.getWords  = function (html) {
        return html.trim().replace( /\n/g, " " ).replace( /\s+/g, " " ).replace(/ (?![^<]*>)/g, '&nbsp;')
            .split('&nbsp;');
    };

    return obj;
})(TypesetBot.paraUtils || {});
