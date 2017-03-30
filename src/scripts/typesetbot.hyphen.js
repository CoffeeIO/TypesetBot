TypesetBot.hyphen = (function(obj) {

    obj.hyphenOffset = function (word) {
        var beginRegex = /^[\W]*/,
            endRegex = /[\W]*$/;

        var left = 0,
            right = 0;

        if (matches = word.match(beginRegex)) {
            var match = matches[0];
            left = match.length;
        }
        if (matches = word.match(endRegex)) {
            var match = matches[0];
            right = match.length;
        }

        return {
            left,
            right
        };
    };

    /**
     * Hyphen word with specific settings.
     */
    obj.hyphenWord = function (word, settings, left = 0, right = 0) {
        if (window['Hypher']['languages'][settings.hyphenLanguage] == null) {
            return null;
        }
        window['Hypher']['languages'][settings.hyphenLanguage].leftMin = settings.hyphenLeftMin + left;
        window['Hypher']['languages'][settings.hyphenLanguage].rightMin = settings.hyphenRightMin + right;
        return window['Hypher']['languages'][settings.hyphenLanguage].hyphenate(word);
    };



    obj.renderHyphens = function (elem, word, vars, settings) {
        var nodes = vars.nodes,
            lastWordIndex = word.index[word.index.length - 1];

        // Get nodes between the last rendered node and the latest word node.
        for (var i = vars.lastRenderNode; i < nodes.length && i <= lastWordIndex; i++) {

            var node = nodes[i];
            var found = word.index.indexOf(i);
            if (found === -1) {
                vars.renderContent += node.str;
                continue;
            }

            // Found relevant word node.
            var lastIndex = 0;

            // Iterate over the word hyphens.
            node.hyphenIndex.forEach(function (index) {

                var cut = node.str.substring(lastIndex, index + 1);
                lastIndex = index + 1;
                elem.html(
                    vars.renderContent +
                    '<span class="typeset-word-check">' +
                        cut +
                    '</span>' +
                    '<span class="typeset-hyphen-check">-</span>'
                );

                // Push render properties.
                node.hyphenWidth.push(elem.find('.typeset-word-check').width());
                if (node.dashWidth == null) {
                    node.dashWidth = elem.find('.typeset-hyphen-check').width();
                }

            });
            // Add remaining length.
            if (node.hyphenIndex.length !== 0 && node.str.length !== lastIndex) {
                var cut = node.str.substr(lastIndex);
                elem.html(vars.renderContent + '<span class="typeset-hyphen-check">' + cut + '</span>');
                node.hyphenRemain = elem.find('.typeset-hyphen-check').width();
            }

            vars.renderContent += node.str;
        }
        elem.html(vars.renderContent);
        vars.lastRenderNode = lastWordIndex + 1;
    }

    obj.hyphenNodes = function (word, nodes, settings) {
        var index = 0;
        var node = nodes[word.index[index++]];

        if (node.isHyphen) {
            return false;
        }
        // Hyphen node.
        var offset = obj.hyphenOffset(word.str),
            hyphens = obj.hyphenWord(word.str, settings, offset.left, offset.right);

        var curLen = node.str.length, // First word-part
            prevLen = 0;

        // Init hyphen properties on nodes.
        word.index.forEach(function(index) {
            var n = nodes[index];
            n.isHyphen = true;
            n.hyphenIndex = [];
            n.hyphenWidth = [];
            n.hyphenRemain = 0;
        });

        if (hyphens.length <= 1) {
            return false;
        }

        var hyphenIndexes = obj.getHyphenIndex(hyphens);

        var curHyphen = 0;
        hyphenIndexes.forEach(function (hyphenLen) {


            curHyphen += hyphenLen;
            while (curLen < curHyphen) {
                prevLen = curLen;
                node = nodes[word.index[index++]];
                curLen += node.str.length;
            }

            var hyphenIndex = curHyphen - prevLen - 1; // 1 for index offset
            node.hyphenIndex.push(hyphenIndex);
        });

        return true;
    }

    obj.getHyphenIndex = function (hyphens) {
        var indexes = [];

        for (var i = 0; i < hyphens.length - 1; i++) {
            indexes.push(hyphens[i].length);
        }

        return indexes;
    }

    obj.getSliceWidth = function (hyphenArr, index, remain) {
        var arr = hyphenArr.slice(index + 1),
            width = 0;
        arr.forEach(function (elem) {
            width += elem;
        });
        return remain + width;
    }


    return obj;
})(TypesetBot.hyphen || {});
