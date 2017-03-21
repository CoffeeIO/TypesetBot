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
            width,
            shortestPath: {}, // Smallest demerit for each breakpoint on each line.
            done: false
        };
    };

    obj.initLineVars = function (elem, settings, vars, a) {
        elem.append('<span class="typeset-block" style="height: ' + a.height + 'px"></span>')

        var nodeIndex = a.nodeIndex,
            line = a.lineNumber,
            idealWidth = TypesetBot.lineUtils.nextLineWidth(elem, vars.width);

        if (vars.shortestPath[line] == null) { // Add line object
            vars.shortestPath[line] = {};
        }

        var done = false;

        // Check that the active nodes doesn't have a better solution, in which case skip this solution.
        if (vars.shortestPath[line - 1] != null && vars.shortestPath[line - 1][a.wordIndex] < a.demerit) {
            done = true; // Skip node, we have a better solution
        }

        elem.find('.typeset-block').remove();
        console.log('idealWidth %s', idealWidth);

        return {
            nodeIndex,
            line,
            wordCount: 0,
            curWidth: 0,
            lineHeight: 0,
            idealWidth,
            done
        };
    };

    obj.typesetParagraph = function (elem, settings) {
        // Set wordspacing.
        TypesetBot.paraUtils.setSpaceWidth(elem, settings.spaceWidth - settings.spaceShrinkability, settings.spaceUnit);

        // Get variables for algorithm.
        var vars = obj.initVars(elem, settings);

        vars.nodes.forEach(function (node) { console.log(node); }); // Debug

        // Init lists.
        var activeBreakpoints = new Queue(),
            breakpoints = [],
            finalBreaks = [];

        // Queue starting node.
        activeBreakpoints.enqueue(
            TypesetBot.node.createBreak(0, 0, null, 0, false, null, 0, 0) // Starting node
        );

        elem.html('');

        // Main loop
        while (! vars.done) {
            var a = activeBreakpoints.dequeue();
            if (a == null) { // No more queue elements
                vars.done = true;
                continue;
            }

            // Get relevant line variables for algorithm.
            var lineVars = obj.initLineVars(elem, settings, vars, a);

            console.log(vars);
            console.log(lineVars);
            // Find breakpoints on line.
            while (! lineVars.done) {

                // ----------------------- Add nodes until word is done

                var word = appendWord(vars, lineVars);
                var ratio = TypesetBot.math.calcAdjustmentRatio(
                    lineVars.idealWidth,
                    lineVars.curWidth,
                    lineVars.wordCount,
                    vars.spaceShrink,
                    vars.spaceStretch,
                    settings
                );


                console.log(ratio);
                console.log(word);

                if (ratio <= settings.maxRatio && ratio >= settings.minRatio) { // Valid breakpoint

                    if (hyphenNodes(word, vars.nodes, settings)) {
                        renderHyphens(word);
                    }


                    // We expect hyphens to be specified.
                    return;
                }
                if (ratio < settings.minRatio) { // stop searching
                    return;
                }

                // Append space
                lineVars.curWidth += vars.spaceWidth;

                // -----------------------

            }
        }

        // Run again if no solution was found.-------------------


        // ------------------------------------------------------

        console.log(shortestPath);
        console.log(breakpoints);
        elem.html(content);
        console.log(finalBreaks);

        // Apply found solution.
        applyBreaks(elem, words, finalBreaks);

    };

    function hyphenNodes(word, nodes, settings) {
        var index = 0;
        var node = nodes[word.index[index++]];

        if (node.isHyphen) {
            return false;
        }
        // Hyphen node.
        var offset = TypesetBot.wordUtils.hyphenOffset(word.str),
            hyphens = TypesetBot.wordUtils.hyphenWord(word.str, settings, offset.left, offset.right);

        console.log(word);
        console.log(hyphens);
        var curLen = node.str.length, // First word-part
            prevLen = 0;

        word.index.forEach(function(index) {
            node = nodes[index];
            node.isHyphen = true;
            node.hyphenIndex = [];
            node.hyphenWidth = [];
        });

        if (hyphens.length <= 1) {
            return false;
        }

        var hyphenIndexes = getHyphenIndex(hyphens);

        console.log(hyphenIndexes);
        var curHyphen = 0;
        hyphenIndexes.forEach(function (hyphenLen) {
            curHyphen += hyphenLen;
            while (curLen < curHyphen) {
                node = nodes[word.index[index++]];
                prevLen = curLen;
                curLen += node.str.length;
            }

            var hyphenIndex = curHyphen - prevLen - 1; // 1 for index offset
            console.log('hy: %s, at %s', node.str, hyphenIndex);
            node.hyphenIndex.push(hyphenIndex);
            node.hyphenWidth.push(0);
            console.log(node);
        });

        return true;
    }

    function getHyphenIndex(hyphens) {
        var indexes = [];

        for (var i = 0; i < hyphens.length - 1; i++) {
            indexes.push(hyphens[i].length);
        }

        return indexes;
    }

    function appendWord(vars, lineVars) {
        var done = false,
            word = '',
            wordIndex = [];

        while (! done) {
            var node = vars.nodes[lineVars.nodeIndex];
            if (node == null) { // Possible final break

            }

            console.log(node);
            if (node.type === 'word') {
                word += node.str;
                lineVars.curWidth += node.width;
                if (lineVars.lineHeight < node.height) { // Update max height for this line
                    lineVars.lineHeight = node.height;
                }
                wordIndex.push(lineVars.nodeIndex);
            } else if (node.type === 'tag') {
                if (! node.endtag) {
                    vars.fontSize = node.fontSize; // Update other properties?

                }

            } else if (node.type === 'space') {
                done = true;
            }

            lineVars.nodeIndex++;
        }
        lineVars.wordCount++;

        console.log(word);
        return {
            str: word,
            index: wordIndex
        };
    }

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
