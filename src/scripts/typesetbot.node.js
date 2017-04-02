TypesetBot.node = (function(obj, $) {

    /**
     * Create break object.
     */
    obj.createBreak = function (
        nodeIndex, hyphenIndex, origin, demerit, flag, fitnessClass, lineNumber, height, curHeight, tagStack
    ) {
        return {
            nodeIndex,
            hyphenIndex,
            origin,
            demerit,
            flag,
            fitnessClass,
            lineNumber,
            height,
            curHeight,
            tagStack
        };
    };

    /**
     * Create word node.
     */
    obj.createWord = function (str) {
        return {
            type: 'word',
            str,
            isHyphen: false
        };
    };

    /**
     * Create tag node.
     */
    obj.createTag = function (str, endTag) {
        return {
            type: 'tag',
            str,
            endTag
        };
    };

    /**
     * Create space node.
     */
    obj.createSpace = function () {
        return {
            type: 'space'
        };
    };

    return obj;
})(TypesetBot.node || {}, jQuery);
