TypesetBot.hyphen = (function(obj) {

    /**
     * Get the right and left offset of non-word characters in string.
     * Fx: ,|Hello.$. --> { left: 2, right: 3 }
     */
    obj.getWordOffset = function (word) {
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
     * Return array of possible word hyphens.
     * Fx: hyphenation --> ["hyp", "hen", "ation"]
     */
    obj.word = function (word, settings, left = 0, right = 0) {
        if (settings.hyphenLanguage.trim() === '') {
            return [word];
        }
        if (window['Hypher']['languages'][settings.hyphenLanguage] == null) { // Language not found
            console.warn("Hyphenation language '%s' not found", settings.hyphenLanguage);
            return [word];
        }
        window['Hypher']['languages'][settings.hyphenLanguage].leftMin = settings.hyphenLeftMin + left;
        window['Hypher']['languages'][settings.hyphenLanguage].rightMin = settings.hyphenRightMin + right;

        return window['Hypher']['languages'][settings.hyphenLanguage].hyphenate(word);
    };

    /**
     * Update certain nodes with hyphen properties.
     * Return true if we added properties and need to render them to get dimensions otherwise return false.
     */
    obj.updateNodes = function (word, nodes, settings) {
        var index = 0;
        var node = nodes[word.index[index++]];

        // Check if node is already hyphened, in which case just return.
        if (node.isHyphen) {
            return false;
        }
        // Hyphen node.
        var offset = obj.getWordOffset(word.str),
            hyphens = obj.word(word.str, settings, offset.left, offset.right);

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

        // If word returned 1 or less elements, it can't be hyphened.
        if (hyphens.length <= 1) {
            return false;
        }

        var hyphenIndexes = TypesetBot.utils.getArrayIndexes(hyphens);

        var curHyphen = 0;

        // Add the accurate hyphen indexes to the nodes.
        // Fx: ['hyph', <tag>, 'e', <tag>, 'nation'] --> ['hyp(-)h', <tag>, 'e', </tag>, 'n(-)ation']
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

        nodes[word.index[0]].toRendered = true; //

        return true;
    };

    /**
     * Get the width from hyphen index to end of word.
     * Fx: hyp-{hen-ation}   from first hyphen
     *     |3|  |4| | 7 |   --> 11
     */
    obj.getEndWidth = function (hyphenArr, index, remain) {
        var arr = hyphenArr.slice(index + 1),
            width = 0;
        arr.forEach(function (elem) {
            width += elem;
        });

        return remain + width;
    };

    return obj;
})(TypesetBot.hyphen || {});
