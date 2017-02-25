TypesetBot.typeset = (function(obj, $) {

    obj.typesetParagraph = function (elem, settings) {
        var content = elem.html();

        var wordsTemp = TypesetBot.paraUtils.getWords(elem.html()),
            words = TypesetBot.wordUtils.getWordProperties(elem, words),
            breakpoints = [],
            breakpointsIndex = 0;
            activeBreakpoints = new Queue(),
            width = elem.width();
        wordsTemp = null;

        var startingNode = {
            penalty: 0,
            flag: false,
            wordIndex: 0,
            fitnessClass: 1,
            lineNumber: 0,
            wordPointer: properties[0],
            demeritTotal: 0,
            totalWidth: 0,
            totalStretch: 0,
            totalShrink: 0
        }
        breakpoints.push(startingNode);

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
                var word = words[wordIndex++];
                wordCount++;
                line.append(' ' + word.str);
                curWidth += word.width;
                var ratio = TypesetBot.math.calcAdjustmentRatio(idealWidth, curWidth, wordCount, (wordCount-1)*16/9, (wordCount-1)*16/6, settings)
                curWidth += 16/3;

                console.log(ratio);
            }

            index++;
        }
    }

    return obj;
})(TypesetBot.typeset || {}, jQuery);
