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
        // console.log(value);
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

    /**
     * Wrap free text in paragraph tags, call recusively on children.
     */
    function recWrap(elem) {
        var regMarkup = /^[\s\b]*<[\w]+/;

        if (elem.html() === undefined) {
            return elem; // Ignore special elements without markup: style, script..
        }

        var html = '', // Returning markup
            clone = elem.clone();

        // Elements to skip
        var skipElem = ["P", "SCRIPT", "TH", "TD", "LI", "STYLE", "FIGCAPTION", "H1", "H2", "H3", "H4", "H5", "E",
            "SPAN", "Q"];
        if (skipElem.indexOf(clone.prop('tagName')) !== -1) {
            return elem;
        }

        // Check empty elements
        if (clone.html().trim() === '') {
            return elem;
        }

        // Iterate over all children
        while (clone.children().length > 0) {
            if (regMarkup.test(clone.html()) === false) {
                clone.html('<p>' + clone.html()); // When rendering the browser will wrap the end </p> appropriately
                html += clone.children(':nth-child(1)').clone().wrap('<div>').parent().html();
                clone.children(':nth-child(1)').remove();
            }
            var temp = recWrap(clone.children(':nth-child(1)'));
            if (temp.html() !== undefined) {
                html += temp.wrap('<div>').parent().html();
            }
            clone.children(':nth-child(1)').remove();
        }
        // Check for text after last child
        if (clone.html().trim() !== '' && regMarkup.test(clone.html()) === false) {
            clone.html('<p>' + clone.html());
            html += clone.children(':nth-child(1)').clone().wrap('<div>').parent().html();
            clone.children(':nth-child(1)').remove();
        }

        // Overwrite dom html
        elem.html(html);
        return elem;
    }

    /**
     * Wrap plain text in paragraph tags to make dom more consistent.
     */
    obj.wrapText  = function (dom) {
        var html = dom.html().replace(/<!--(.*?)-->/g, ""); // Remove all html comments
        recWrap(dom.html(html));
    };

    /**
     * Break up of paragraph into span lines.
     * Modified for custom element and generalizing spaces and newlines.
     * Full credit to 'miketeix' - http://jsfiddle.net/miketeix/2q8ac/
     */
    obj.breakParaInLines = function (dom) {
        dom.html(dom.html().replace( /\n/g, " " ).replace( /\s+/g, " " ));
        var spanInserted = dom.html().split(" ").join(" </span><span>");
        var wrapped = ("<span>").concat(spanInserted, "</span>");
        dom.html(wrapped);
        var refPos = dom.find('span:first-child').position().top;
        var newPos;
        dom.find('span').each(function(index) {
            newPos = $(this).position().top;
            if (index === 0){
                return;
            }
            if (newPos === refPos){
                $(this).prepend($(this).prev().text() + " ");
                $(this).prev().remove();
            }
            refPos = newPos;
        });
    };

    /**
     * Show adjustment ratios on plain text paragraph.
     * Return array of adjustment ratios.
     */
    obj.getAdjustmentRatios = function (dom, showRatio = false) {
        var arr = [];

        obj.breakParaInLines(dom);
        var idealW = dom.width();
        dom.find('span:last').attr('lastline', '');
        dom.find('span').each(function () {
            var elem = $(this),
                actualW = elem.width(),
                wordCount = obj.getWords(elem.html()).length,
                shrink = 16 / 9,
                stretch = 16 / 6;

            var ratio = TypesetBot.lineUtils.calcAdjustmentRatio(
                idealW, actualW, wordCount, shrink, stretch
            ).toFixed(3);

            if (elem.attr('lastline') !== undefined) { // Set last line to 0 as it's not a fair evaluation.
                ratio = 0.001;
            }

            arr.push(Number(ratio));
            if (showRatio) {
                elem.attr('adjustment-ratio', ratio);
            }
        });

        return arr;
    };

    return obj;
})(TypesetBot.paraUtils || {});
