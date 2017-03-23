TypesetBot.node = (function(obj, $) {
    obj.createBreak = function (nodeIndex, hyphenIndex, origin, demerit, flag, fitnessClass, lineNumber, height) {
        return {
            nodeIndex,
            hyphenIndex,
            origin,
            demerit,
            flag,
            fitnessClass,
            lineNumber,
            height
        };
    };

    obj.createWord = function (str) {
        return {
            type: 'word',
            str,
            isHyphen: false
        };
    };

    obj.createTag = function (str, endTag) {
        return {
            type: 'tag',
            str,
            endTag
        };
    };

    obj.createSpace = function () {
        return {
            type: 'space',
            str: ' '
        };
    };

    return obj;
})(TypesetBot.node || {}, jQuery);
