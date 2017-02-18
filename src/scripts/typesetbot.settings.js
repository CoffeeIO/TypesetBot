TypesetBot.settings = (function(obj, $) {

    // Default settings the program will use.
    var defaultSettings = {
        // Algorithm.
        algorithm: 'total-fit', // Other options are 'first-fit' and 'best-fit'
        alignment: 'justify', // Other options are 'ragged-right' and 'ragged-center'
        language: 'en-us',
        leftmin: 2,
        rightmin: 2,

        hyphenPenalty: 50,
        hyphenPenaltyRagged: 500,
        q: null,

        maxRatio: 2, // Algorithm will ignore this max if no other solutions are found.
        minRatio: -1,

        // 4 classes of adjustment ratios.
        classes: [-1, -0.5, 0.5, 1, Infinity],

        // Font.
        spaceUnit: 'em',
        spaceWidth: '1/3',
        spaceStretchability: '1/6',
        spaceShrinkability: '1/9',

        // Inline element that the program will unwrap from paragraphs as they could disrupt the line breaking.
        unwrapElements: ['img']
    };

    /**
    * Merge two json objects.
    *
    * @param o1 The default json, base
    * @param o2 The custom json, overwrite existing elements
    */
    function jsonConcat(o1, o2) {
        for (var key in o2) {
            if ({}.hasOwnProperty.call(o2, key)) {
                o1[key] = o2[key];
            }
        }
        return o1;
    }

    /**
     * Validate settings and merge with default settings.
     */
    obj.validate  = function (settings) {
        if (settings == null) {
            return $.extend(true, {}, defaultSettings);
        }
        settings = jsonConcat($.extend(true, {}, defaultSettings), settings);

        return settings;
    };

    return obj;
})(TypesetBot.settings || {}, jQuery);
