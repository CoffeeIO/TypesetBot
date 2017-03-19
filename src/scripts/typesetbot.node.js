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

    return obj;
})(TypesetBot.node || {}, jQuery);
