TypesetBot.typeset = (function(obj, $) {

    obj.typesetParagraph = function (elem, settings) {
        // console.log('%s - %s', settings.setSpaceWidth, settings.spaceShrinkability);
        TypesetBot.paraUtils.setSpaceWidth(elem, settings.spaceWidth - settings.spaceShrinkability, settings.spaceUnit);
        var fontSize = Number(elem.css('font-size').replace('px', '')),
            spaceWidth = fontSize * settings.spaceWidth,
            spaceShrink = fontSize * settings.spaceShrinkability,
            spaceStretch = fontSize * settings.spaceStretchability;

        var content = elem.html(); // Save for later

        var wordsTemp = TypesetBot.paraUtils.getWords(content),
            words = TypesetBot.wordUtils.getWordProperties(elem, wordsTemp),
            width = elem.width();
        console.log(wordsTemp);
        wordsTemp = null;

        var activeBreakpoints = new Queue(),
            breakpoints = [],
            finalBreaks = [],
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
            totalShrink: 0,
            height: 0
        };

        // breakpoints.push(startingNode);
        activeBreakpoints.enqueue(startingNode);

        elem.html('');
        var shortestPath = {};

        while (!done) {
            var a = activeBreakpoints.dequeue();
            if (a == null) {
                done = true;
                continue;
            }



            var wordIndex = a.wordIndex,
                line = a.lineNumber;

            if (shortestPath[line] == null) {
                shortestPath[line] = {};
            }

            elem.append('<span class="typeset-block" style="height: ' + a.height + 'px"></span>')
            var findBreaks = true,
                wordCount = 0,
                curWidth = 0,
                idealWidth = TypesetBot.lineUtils.nextLineWidth(elem, width),
                lineHeight = 0;
            elem.find('.typeset-block').remove();
            console.log('idealWidth %s', idealWidth);

            // Check that the active nodes doesn't have a better solution, in which case skip this solution
            if (shortestPath[line-1] != null && shortestPath[line-1][a.wordIndex] < a.demeritTotal) {
                console.log('compare %s --- %s', shortestPath[line-1][a.wordIndex], a.demeritTotal);
                findBreaks = false; // Skip node, we have a better solution
            }
            if (a.str != null && findBreaks) {
                console.log('Evaluate! --> %s - %s', a.str, a.demeritTotal);
            }

            while (findBreaks) {
                var word = words[wordIndex];
                if (word == null) {
                    // console.log(words[wordIndex-1].str);
                    findBreaks = false;
                    var newBreak = {
                        lineNumber: line + 1,
                        demeritTotal: a.demeritTotal,
                        origin: a,
                        wordIndex: wordIndex - 1,
                        height: a.height + lineHeight,
                        curHeight: lineHeight,
                        idealWidth

                    };
                    finalBreaks.push(newBreak);
                    continue;
                }
                if (lineHeight < word.height) {
                    lineHeight = word.height;
                }
                wordCount++;
                curWidth += word.width;
                var ratio = TypesetBot.math.calcAdjustmentRatio(idealWidth, curWidth, wordCount, spaceShrink, spaceStretch, settings)

                if (ratio <= settings.maxRatio && ratio >= settings.minRatio) { // Valid breakpoint
                    var badness = TypesetBot.math.calcBadness(ratio, settings),
                        demerit = TypesetBot.math.calcDemerit(badness, 0, false, settings),
                        demeritAcc = a.demeritTotal + demerit;
                    var nextWord = wordIndex + 1;
                    var newBreak = {
                        wordIndex: nextWord,
                        lineNumber: line + 1,
                        demeritTotal: demeritAcc,
                        str: word.str,
                        ratio: ratio,
                        badness: badness,
                        origin: a,
                        height: a.height + lineHeight,
                        curHeight: lineHeight,
                        idealWidth
                    };
                    if (shortestPath[line][nextWord] == null || shortestPath[line][nextWord] > demeritAcc) {
                        shortestPath[line][nextWord] = demeritAcc;
                        activeBreakpoints.enqueue(newBreak); // Only add items to queue if they have better demerit
                    }
                    breakpoints.push(newBreak);
                }
                if (ratio < settings.minRatio) { // stop searching
                    findBreaks = false;


                    // return;
                }
                // console.log('idealW %s, curW %s, wordCount %s, shrink %s, stretch %s, ratio: %s', idealWidth, curWidth, wordCount, 16/9, 16/6, ratio);
                // console.log('cur: %s, ratio %s, str %s', curWidth, ratio, word.str);

                curWidth += spaceWidth; // space
                wordIndex++;

            }
        }
        console.log(shortestPath);
        console.log(breakpoints);
        elem.html(content);
        console.log(finalBreaks);

        applyBreaks(elem, words, finalBreaks);

    };

    function applyBreaks(elem, words, breaks) {
        var bestFit = null;
        breaks.forEach(function (elem) {
            if (bestFit == null || elem.demeritTotal < bestFit.demeritTotal) {
                bestFit = elem;
            }
        });

        var construct = true,
            content = '',
            lastIndex = null,
            lastHeight = bestFit.curHeight;
        console.log(bestFit);

        bestFit = bestFit.origin;
        while (construct) {
            var slice;
            if (lastIndex == null) {
                slice = words.slice(bestFit.wordIndex);
            } else {
                slice = words.slice(bestFit.wordIndex, lastIndex);
            }
            lastIndex = bestFit.wordIndex;

            var lineContent = '';
            slice.forEach(function (elem) {
                lineContent += elem.str + ' ';
            });

            content = '<span class="typeset-line" line="' + bestFit.lineNumber + '" style="height:' + lastHeight + 'px">' + lineContent + '</span>' + content;
            if (bestFit.origin == null) {
                construct = false;
                continue;
            }
            lastHeight = bestFit.curHeight;
            bestFit = bestFit.origin;

        }
        elem.html(content);
        elem.addClass('typeset-paragraph');

    }

    return obj;
})(TypesetBot.typeset || {}, jQuery);
