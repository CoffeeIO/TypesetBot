TypesetBot.typeset = (function(obj, $) {

    obj.typesetParagraph = function (elem, settings) {
        TypesetBot.paraUtils.setSpaceWidth(elem, settings.spaceWidth, settings.spaceUnit);
        var fontSize = Number(elem.css('font-size').replace('px', '')),
            spaceWidth = fontSize * settings.spaceWidth,
            spaceShrink = fontSize * settings.spaceShrinkability,
            spaceStretch = fontSize * settings.spaceStretchability;

        var content = elem.html(); // Save for later

        var wordsTemp = TypesetBot.paraUtils.getWords(content),
            words = TypesetBot.wordUtils.getWordProperties(elem, wordsTemp),
            width = elem.width();
        wordsTemp = null;

        var activeBreakpoints = new Queue(),
            breakpoints = [],
            done = false;

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

        breakpoints.push(startingNode);
        activeBreakpoints.enqueue(startingNode);

        elem.html('');

        while (!done) {
            var a = activeBreakpoints.dequeue();
            if (a == null) {
                done = true;
            }

            var wordIndex = a.wordIndex,
                line = a.lineNumber;
            var findBreaks = true,
                wordCount = 0,
                curWidth = 0,
                idealWidth = TypesetBot.lineUtils.nextLineWidth(elem, width);


            while (findBreaks) {
                var word = words[wordIndex];
                wordCount++;
                curWidth += word.width;

                var ratio = TypesetBot.math.calcAdjustmentRatio(idealWidth, curWidth, wordCount, spaceShrink, spaceStretch, settings)

                if (ratio <= settings.maxRatio && ratio >= settings.minRatio) { // Valid breakpoint
                    var badness = TypesetBot.math.calcBadness(ratio, settings),
                        demerit = TypesetBot.math.calcDemerit(badness, 0, false, settings);
                    var newBreak = {
                        wordIndex: wordIndex,
                        lineNumber: line + 1,
                        demeritTotal: a.demeritTotal + demerit
                    };
                    breakpoints.push(newBreak);
                    activeBreakpoints.enqueue(newBreak);
                }
                if (ratio < settings.minRatio) { // stop searching
                    // findBreaks = false;
                    console.log(breakpoints);
                    return;
                }
                // console.log('idealW %s, curW %s, wordCount %s, shrink %s, stretch %s, ratio: %s', idealWidth, curWidth, wordCount, 16/9, 16/6, ratio);
                console.log('cur: %s, ratio %s, str %s', curWidth, ratio, word.str);

                curWidth += spaceWidth; // space
                wordIndex++;

            }
        }
    };

    return obj;
})(TypesetBot.typeset || {}, jQuery);
