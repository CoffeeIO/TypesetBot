TypesetBot.typeset = (function(obj, $) {

    var startingNode = {
        penalty: 0,
        flag: false,
        wordIndex: 0,
        fitnessClass: 1,
        lineNumber: 0,
        wordPointer: words[0],
        demeritTotal: 0,
        totalWidth: 0,
        totalStretch: 0,
        totalShrink: 0
    };

    obj.typesetParagraph = function (elem, settings) {
        TypesetBot.paraUtils.setSpaceWidth(elem, settings.spaceWidth, settings.spaceUnit);
        var fontSize = Number(elem.css('font-size').replace('px', '')),
            spaceWidth = fontSize * settings.spaceWidth,
            spaceShrink = fontSize * settings.spaceShrinkability,
            spaceStretch = fontSize * settings.spaceStretchability;

        var content = elem.html();

        var wordsTemp = TypesetBot.paraUtils.getWords(content),
            words = TypesetBot.wordUtils.getWordProperties(elem, wordsTemp),
            breakpoints = [],
            breakpointsIndex = 0;
            activeBreakpoints = new Queue(),
            width = elem.width();
        wordsTemp = null;

        breakpoints.push(startingNode);

        var index = 0;
        elem.html('');
        while(breakpoints[index] != null) {
            var breakpoint = breakpoints[index];
            elem.append('<span line="' + breakpoint.lineNumber + '"></span>');
            var line = elem.find('span');
            var breakItDown = true,
                wordIndex = breakpoint.wordIndex,
                wordCount = 0,
                idealWidth = TypesetBot.lineUtils.nextLineWidth(elem, width),
                curWidth = 0;
            while (breakItDown) {
                var word = words[wordIndex];
                wordCount++;
                line.append(' ' + word.str);
                curWidth += word.width;
                var ratio = TypesetBot.math.calcAdjustmentRatio(idealWidth, curWidth, wordCount, spaceShrink, spaceStretch, settings)

                if (ratio <= settings.maxRatio && ratio >= settings.minRatio) { // Valid breakpoint

                    var newBreak = {
                        penalty: 0,
                        flag: false,
                        wordIndex: 0,
                        fitnessClass: 1,
                        lineNumber: 0,
                        wordPointer: words[0],
                        demeritTotal: 0,
                        totalWidth: 0,
                        totalStretch: 0,
                        totalShrink: 0
                    };
                    breakpoints.push(newBreak);
                    activeBreakpoints.enqueue(newBreak);
                }
                if (ratio < settings.minRatio) { // stop searching
                    // breakItDown = false;
                }
                // console.log('idealW %s, curW %s, wordCount %s, shrink %s, stretch %s, ratio: %s', idealWidth, curWidth, wordCount, 16/9, 16/6, ratio);
                console.log('cur: %s, ratio %s, str %s', curWidth, ratio, word.str);

                curWidth += spaceWidth; // space
                wordIndex
            }

            index++;
        }
    }

    return obj;
})(TypesetBot.typeset || {}, jQuery);
