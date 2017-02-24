TypesetBot.math = (function(obj) {

    /**
     * Calculate the adjustment ratio of a line.
     */
    obj.calcAdjustmentRatio = function (idealW, actualW, wordCount, shrink, stretch, settings) {
        return settings.ratio(idealW, actualW, wordCount, shrink, stretch, settings);
    };

    /**
     * Calculate the badness of a line.
     */
    obj.calcBadness = function (ratio, settings) {
        return settings.badness(ratio, settings);
    };

    /**
     * Calculate the demerit of a line.
     */
    obj.calcDemerit = function (badness, penalty, flag, settings) {
        return settings.demerit(badness, penalty, flag, settings);
    };

    return obj;
})(TypesetBot.math || {});
