TypesetBot.typeset = (function(obj, $) {

    function hyphenProperties(elem, words, curIndex, searchIndex, settings) {
        for (var i = curIndex + 1; i < searchIndex; i++) {
            elem.append(words[i].str + ' ');
        }
        var hyphen = TypesetBot.wordUtils.hyphenWord(words[searchIndex].str, settings);
        // Ignore if word can't be hyphened.
        if (hyphen.length == 1) {
            elem.append(words[searchIndex].str + ' ');
            words[searchIndex].hyphenWidth = words[searchIndex].width;
            return elem.html();
        }
        console.log(hyphen);

        // Check width or individual parts.


        // Check width of '-' character.

        words[searchIndex].hyphen = hyphen;
    }

    obj.initVars = function (elem, settings) {
        var fontSize = Number(elem.css('font-size').replace('px', '')),
            spaceWidth = fontSize * settings.spaceWidth,
            spaceShrink = fontSize * settings.spaceShrinkability,
            spaceStretch = fontSize * settings.spaceStretchability;

        var content = elem.html(), // Save for later
            hyphenContent = '', // Content for checking hyphen dimensions
            hyphenIndex = 0; // Index for last hyphened word

        var words = TypesetBot.paraUtils.getWords(content),
            nodes = TypesetBot.wordUtils.wordsToNodes(words),
            props = TypesetBot.wordUtils.getNodeProperties(elem, nodes),
            width = elem.width();

        return {
            fontSize,
            spaceWidth,
            spaceShrink,
            spaceStretch,
            nodes: props,
            width
        };
    };

    obj.initLineVars = function (elem, settings, vars, node) {
        var wordIndex = node.wordIndex,
            line = node.lineNumber,
            wordCount = 0,
            curWidth = 0,
            idealWidth = TypesetBot.lineUtils.nextLineWidth(elem, width),
            lineHeight = 0;

        
    };

    obj.typesetParagraph = function (elem, settings) {
        TypesetBot.paraUtils.setSpaceWidth(elem, settings.spaceWidth - settings.spaceShrinkability, settings.spaceUnit);

        var vars = initVars(elem, settings);


        props.forEach(function (prop) {
            console.log(prop);
        });
        return;

        var activeBreakpoints = new Queue(),
            breakpoints = [],
            finalBreaks = [],
            done = false;

        var startingNode = {
            penalty: 0,
            flag: false,
            wordIndex: 0,
            fitnessClass: null,
            lineNumber: 0,
            wordPointer: words[0],
            demeritTotal: 0,
            height: 0
        };

        activeBreakpoints.enqueue(startingNode);

        elem.html('');
        var shortestPath = {}; // Smallest demerit for each breakpoint on each line.

        while (!done) {
            var a = activeBreakpoints.dequeue();
            if (a == null) {
                done = true;
                continue;
            }

            var lineVars = obj.initLineVars(elem, settings, vars, a);

            var wordIndex = a.wordIndex,
                line = a.lineNumber;

            if (shortestPath[line] == null) { // Add line object
                shortestPath[line] = {};
            }

            elem.append('<span class="typeset-block" style="height: ' + a.height + 'px"></span>')
            var findBreaks = true;

            elem.find('.typeset-block').remove();
            console.log('idealWidth %s', idealWidth);

            // Check that the active nodes doesn't have a better solution, in which case skip this solution.
            if (shortestPath[line-1] != null && shortestPath[line-1][a.wordIndex] < a.demeritTotal) {
                // console.log('compare %s --- %s', shortestPath[line-1][a.wordIndex], a.demeritTotal);
                findBreaks = false; // Skip node, we have a better solution
            }

            while (findBreaks) {
                var word = words[wordIndex];
                if (word == null) { // Possible final break
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
                var ratio = TypesetBot.math.calcAdjustmentRatio(idealWidth, curWidth, wordCount, spaceShrink, spaceStretch, settings);

                if (ratio <= settings.maxRatio && ratio >= settings.minRatio) { // Valid breakpoint
                    // Insert hyphen stuff.
                    if (word.hyphen == null) { // Make hyphen
                        hyphenContent = hyphenProperties(elem, words, hyphenIndex, wordIndex, settings);
                    }
                    // var word = words[wordIndex];
                    console.log(word.hyphen);

                    return;

                    // Check for fitclass.
                    var fitnessClass = TypesetBot.math.getFitness(ratio, settings);
                    var badness = TypesetBot.math.calcBadness(ratio, settings),
                        demerit = TypesetBot.math.calcDemerit(badness, 0, false, settings);

                    // Add demerit if fitness class moves more than 1.
                    if (a.fitnessClass != null && Math.abs(a.fitnessClass - fitnessClass) > 1) {
                        demerit += settings.fitnessClassDemerit;
                    }
                    var demeritAcc = a.demeritTotal + demerit,
                        nextWord = wordIndex + 1;

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
                        idealWidth,
                        penalty: 0,
                        penaltyWidth: 0,
                        hyphenIndex: 0,
                        fitnessClass
                    };

                    // Update lowest demerit on break point on specific line.
                    if (shortestPath[line][nextWord] == null || shortestPath[line][nextWord] > demeritAcc) {
                        shortestPath[line][nextWord] = demeritAcc;
                        activeBreakpoints.enqueue(newBreak); // Only add items to queue if they have better demerit
                    }
                    breakpoints.push(newBreak);
                }
                if (ratio < settings.minRatio) { // stop searching
                    // Check for the ratio of hyphened version
                    if (word.hyphen == null) { // Make hyphen
                        hyphenContent = hyphenProperties(elem, words, hyphenIndex, wordIndex, settings);
                    }

                    findBreaks = false;
                }
                // console.log('idealW %s, curW %s, wordCount %s, shrink %s, stretch %s, ratio: %s', idealWidth, curWidth, wordCount, 16/9, 16/6, ratio);
                // console.log('cur: %s, ratio %s, str %s', curWidth, ratio, word.str);

                // Append width of space after word.
                curWidth += spaceWidth;
                wordIndex++;
            }
        }
        console.log(shortestPath);
        console.log(breakpoints);
        elem.html(content);
        console.log(finalBreaks);

        applyBreaks(elem, words, finalBreaks);

    };

    /**
     * Apply the found solutions to the element.
     */
    function applyBreaks(elem, words, breaks) {
        var bestFit = null;
        breaks.forEach(function (elem) {
            if (bestFit == null || elem.demeritTotal < bestFit.demeritTotal) {
                bestFit = elem;
            }
        });
        console.log(bestFit);

        // Change the nodes to an array so we can pop them off in correct order.
        var lines = [];
        while (true) {
            if (bestFit.origin == null) {
                break; // First line doesn't matter, we know it starts at word index 0
            }
            lines.push(bestFit);
            bestFit = bestFit.origin;
        }
        // console.log(lines);

        var construct = true,
            content = '',
            lastIndex = 0,
            lastHeight = bestFit.curHeight,
            tagStack = [];

        // Construct the content from first line to last.
        while (construct) {
            var line = lines.pop();
            if (line == null) {
                construct = false;
                continue;
            }

            var slice = words.slice(lastIndex, line.wordIndex);
            lastIndex = line.wordIndex;

            var lineContent = '';
            if (tagStack.length > 0) {
                lineContent += tagStack.join('');
            }

            slice.forEach(function (elem) {
                // Check if we should insert tags on the stack.
                if (elem.tagBegin != null) {
                    tagStack = tagStack.concat(elem.tagBegin);
                    // console.log(elem.tagBegin.join());
                    // console.log(tagStack.join());
                }
                lineContent += elem.str + ' ';

                if (elem.tagEnd != null) {
                    elem.tagEnd.forEach(function (tag) {
                        tagStack.pop();
                        // console.log('pop');
                    });
                }
            });
            lineContent = lineContent.substring(0, lineContent.length - 1); // Remove last whitespace character

            // Close all tags on the stack.
            if (tagStack.length !== 0) {
                lineContent += reverseStack(tagStack).join('');
            }

            // Add line to paragraph.
            content +=
                '<span class="typeset-line" line="' + line.lineNumber + '" style="height:' + line.curHeight + 'px">'
                    + lineContent
                + '</span>';
        }

        elem.html(content);
        elem.addClass('typeset-paragraph');
    }

    /**
     * Take an array of begin tags, reverse them and create their closing tags.
     */
    function reverseStack(arr) {
        var newArr = [],
            tagNameRegex = /<(\w*)/;
        // Create a copy of array to not reverse original array.
        [].concat(arr).reverse().forEach(function (elem) {
            var res = elem.match(tagNameRegex);
            newArr.push('</' + res[1] + '>');
        });
        return newArr;
    }

    return obj;
})(TypesetBot.typeset || {}, jQuery);
