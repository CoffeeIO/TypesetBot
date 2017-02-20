TypesetBot.settings = (function(obj, $) {

    // Default settings the program will use.
    var defaultSettings = {
        // Algorithm.
        algorithm: 'total-fit', // Other options are 'first-fit' and 'best-fit'
        alignment: 'justify', // Other options are 'ragged-right' and 'ragged-center'

        hyphenPenalty: 50, // Penalty for line-breaking on a hyphen
        hyphenPenaltyRagged: 500, // Penalty for line-breaking on a hyphen when using ragged text
        flagPenalty: 3000, // Penalty when current and last line had flag value 1. Reffered to as 'α'
        classSwitchPenalty: 50, // Penalty when switching between ratio classes. Reffered to as 'γ'
        badnessOffset: 0.5,
        demeritOffset: 1, // Offset to prefer fewer lines by increasing badness of "zero* badness lines", if increased it will produce fewer lines

        // "the value of q is increased by 1 (if q < 0) or decreased by 1 (if q > 0) until a feasible solution is found." - DT p.114
        loosenessParam: 0, // If zero we find to solution with fewest total demerits. Reffered to as 'q'

        maxRatio: 2, // Maximum acceptable adjustment ratio. Algorithm will ignore this max if no other solutions are found. Referred to as 'p'
        minRatio: -1, // Minimum acceptable adjustment ratio. Less than -1 will make the text too closely spaced.

        // Hyphen.
        hyphenLanguage: 'en-us', // Language of hyphenation patterns to use
        hyphenLeftMin: 2, // Minimum number of letters to keep on the left side of word
        hyphenRightMin: 2, // Minimum number of letters to keep on the right side of word

        // 4 classes of adjustment ratios.
        classes: [-1, -0.5, 0.5, 1, Infinity],

        // Font.
        spaceUnit: 'em', // Space width unit, em is relative to font-size
        spaceWidth: '1/3', // Ideal space width
        spaceStretchability: '1/6', // How much can the space width stretch
        spaceShrinkability: '1/9', // How much can the space width shrink

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
