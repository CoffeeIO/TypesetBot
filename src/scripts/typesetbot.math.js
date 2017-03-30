TypesetBot.math = (function(obj) {

    /**
     * Calculate the adjustment ratio of a line.
     */
    obj.getAdjustmentRatio = function (idealW, actualW, wordCount, shrink, stretch, settings) {
        return settings.ratio(idealW, actualW, wordCount, shrink, stretch, settings);
    };

    /**
     * Calculate the badness of a line.
     */
    obj.getBadness = function (ratio, settings) {
        return settings.badness(ratio, settings);
    };

    /**
     * Calculate the demerit of a line.
     */
    obj.getDemerit = function (badness, penalty, flag, settings) {
        return settings.demerit(badness, penalty, flag, settings);
    };

    obj.calcDemerit = function (ratio, penalty, flag, settings) {
        var badness = obj.getBadness(ratio, settings);
        return obj.getDemerit(badness, penalty, flag, settings);
    };

    obj.getFitness = function(ratio, settings) {
        for (var i = 0; i < settings.fitnessClass.length; i++) {
            if (ratio < settings.fitnessClass[i]) {
                return i;
            }
        }
    };

    obj.validRatio = function(ratio, settings) {
        if (ratio <= settings.maxRatio + settings.loosenessParam && ratio >= settings.minRatio) {
            return true;
        }

        return false;
    };

    return obj;
})(TypesetBot.math || {});
