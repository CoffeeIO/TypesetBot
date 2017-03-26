TypesetBot.typeset = (function(obj, $) {

    // function hyphenProperties(elem, words, curIndex, searchIndex, settings) {
    //     for (var i = curIndex + 1; i < searchIndex; i++) {
    //         elem.append(words[i].str + ' ');
    //     }
    //     var hyphen = TypesetBot.wordUtils.hyphenWord(words[searchIndex].str, settings);
    //     // Ignore if word can't be hyphened.
    //     if (hyphen.length == 1) {
    //         elem.append(words[searchIndex].str + ' ');
    //         words[searchIndex].hyphenWidth = words[searchIndex].width;
    //         return elem.html();
    //     }
    //     console.log(hyphen);
    //
    //     // Check width or individual parts.
    //
    //
    //     // Check width of '-' character.
    //
    //     words[searchIndex].hyphen = hyphen;
    // }

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
            done: false,
            lastRenderNode: 0, // The last node we rendered
            renderContent: '',
            content,
            activeBreakpoints: new Queue(),
            breakpoints: [],
            finalBreaks: []
        };
    };

    obj.initLineVars = function (elem, settings, vars, a) {
        elem.html('<span class="typeset-block" style="height: ' + a.height + 'px"></span>');

        var nodeIndex = a.nodeIndex,
            hyphenIndex = a.hyphenIndex,
            line = a.lineNumber,
            idealWidth = TypesetBot.lineUtils.nextLineWidth(elem, vars.width);

        if (vars.shortestPath[line] == null) { // Add line object
            vars.shortestPath[line] = {};
        }

        var done = false;

        // Check that the active nodes doesn't have a better solution, in which case skip this solution.
        // if (vars.shortestPath[line - 1] != null && vars.shortestPath[line - 1][a.wordIndex] < a.demerit) {
        //     done = true; // Skip node, we have a better solution
        // }

        done = checkShortestPath(vars, line - 1, a);
        // Check that the active nodes doesn't have a better solution, in which case skip this solution.
        // if (shortestPath[line-1] != null && shortestPath[line-1][a.wordIndex] < a.demeritTotal) {
        //     // console.log('compare %s --- %s', shortestPath[line-1][a.wordIndex], a.demeritTotal);
        //     findBreaks = false; // Skip node, we have a better solution
        // }

        elem.find('.typeset-block').remove();
        // console.log('idealWidth %s', idealWidth);

        return {
            nodeIndex,
            hyphenIndex,
            line,
            wordCount: 0,
            curWidth: 0,
            lineHeight: 0,
            idealWidth,
            done,
            origin: a
        };
    };

    function checkShortestPath(vars, line, a) {
        if (vars.shortestPath[line] != null &&
            vars.shortestPath[line][a.nodeIndex] != null &&
            vars.shortestPath[line][a.nodeIndex][a.hyphenIndex] < a.demerit) {
            return true;
        }

        return false;
    }

    obj.typesetParagraph = function (elem, settings) {
        // Set wordspacing.
        TypesetBot.paraUtils.setSpaceWidth(elem, settings.spaceWidth - settings.spaceShrinkability, settings.spaceUnit);

        // Get variables for algorithm.
        var vars = obj.initVars(elem, settings);

        vars.nodes.forEach(function (node) { console.log(node); }); // Debug

        // Init lists.
        // var activeBreakpoints = new Queue(),
        //     breakpoints = [],
        //     finalBreaks = [];

        // Queue starting node.
        vars.activeBreakpoints.enqueue(
            TypesetBot.node.createBreak(0, null, null, 0, false, null, 0, 0, 0, '') // Starting node
        );

        elem.html('');

        // Main loop
        while (! vars.done) {
            var a = vars.activeBreakpoints.dequeue();
            if (a == null) { // No more queue elements
                vars.done = true;
                continue;
            }

            // Get relevant line variables for algorithm.
            var lineVars = obj.initLineVars(elem, settings, vars, a);

            // Find breakpoints on line.
            while (! lineVars.done) {
                // ----------------------- Add nodes until word is done

                var oldWidth = lineVars.curWidth;
                var word = appendWord(vars, lineVars);

                var ratio = TypesetBot.math.getAdjustmentRatio(
                    lineVars.idealWidth,
                    lineVars.curWidth,
                    lineVars.wordCount,
                    vars.spaceShrink,
                    vars.spaceStretch,
                    settings
                );


                if (word == null) { // Finish active node
                    lineVars.done = true;
                    continue;
                }

                if (ratio <= settings.maxRatio) { // Valid breakpoint

                    if (hyphenNodes(word, vars.nodes, settings)) {
                        renderHyphens(elem, word, vars, settings);
                    }

                    // Create breaks for hyphens.
                    word.index.forEach(function (wordIndex) {
                        var node = vars.nodes[wordIndex];
                        node.hyphenIndex.forEach(function (hyphenIndex, key) {
                            oldWidth += node.hyphenWidth[key];

                            var hyphenRatio = TypesetBot.math.getAdjustmentRatio(
                                lineVars.idealWidth,
                                oldWidth + node.dashWidth, // Add width of hyphen
                                lineVars.wordCount,
                                vars.spaceShrink,
                                vars.spaceStretch,
                                settings
                            );

                            if (TypesetBot.math.validRatio(hyphenRatio, settings)) {
                                // console.log('hyphenRatio: %s --> %s --- %s', node.str, hyphenRatio, ratio);
                                // console.log('oldw --> %s --- %s', oldWidth + node.dashWidth, lineVars.curWidth);
                                var fitnessClass = TypesetBot.math.getFitness(hyphenRatio, settings);
                                var flag = a.flag ? true : false; // Check if previous node was flagged
                                var demerit = TypesetBot.math.calcDemerit(hyphenRatio, 50, flag, settings);
                                // Add demerit if fitness class moves more than 1.
                                if (a.fitnessClass != null && Math.abs(a.fitnessClass - fitnessClass) > 1) {
                                    demerit += settings.fitnessClassDemerit;
                                }

                                var breakNode = TypesetBot.node.createBreak(
                                    wordIndex,
                                    key,
                                    a,
                                    lineVars.origin.demerit + demerit,
                                    true,
                                    fitnessClass,
                                    lineVars.line + 1,
                                    lineVars.origin.height + lineVars.lineHeight,
                                    lineVars.lineHeight,
                                    ''
                                );
                                breakNode.ratio = hyphenRatio;
                                breakNode.curWidth = oldWidth;
                                breakNode.wordCount = lineVars.wordCount;
                                // console.log('Hyphen break --- %s', hyphenRatio);
                                // console.log(breakNode);
                                // console.log(vars.nodes[wordIndex]);

                                updateShortestPath(vars, lineVars, wordIndex, key, breakNode);
                                // vars.activeBreakpoints.enqueue(breakNode);
                                vars.breakpoints.push(breakNode);

                            }

                        });
                    });
                        // Check the ratio is still valid.

                    if (ratio < settings.minRatio) {
                        lineVars.done = true;
                        // console.log('line done');
                        continue; // Don't add the last node.
                    }

                    // Create break for full word.
                    var fitness = TypesetBot.math.getFitness(ratio, settings);
                    var demerit = TypesetBot.math.calcDemerit(ratio, 0, false, settings);
                    var breakNode = TypesetBot.node.createBreak(
                        lineVars.nodeIndex,
                        null,
                        a,
                        lineVars.origin.demerit + demerit,
                        true,
                        fitness,
                        lineVars.line + 1,
                        lineVars.origin.height + lineVars.lineHeight,
                        lineVars.lineHeight,
                        ''
                    );
                    breakNode.ratio = ratio;
                    breakNode.curWidth = lineVars.curWidth;
                    breakNode.wordCount = lineVars.wordCount;

                    updateShortestPath(vars, lineVars, lineVars.nodeIndex, null, breakNode);
                    // vars.activeBreakpoints.enqueue(breakNode);
                    vars.breakpoints.push(breakNode);
                }

                // Append space
                lineVars.curWidth += vars.spaceWidth;
            }
        }

        // Run again if no solution was found.-------------------


        console.log(vars.shortestPath);
        console.log(vars.breakpoints);
        elem.html(vars.content);
        console.log(vars.finalBreaks);

        // Apply found solution.
        applyBreaks(elem, vars.nodes, vars.finalBreaks);
    };


    function renderHyphens(elem, word, vars, settings) {
        var nodes = vars.nodes,
            lastWordIndex = word.index[word.index.length - 1];

        // Get nodes between the last rendered node and the latest word node.
        for (var i = vars.lastRenderNode; i < nodes.length && i <= lastWordIndex; i++) {

            var node = nodes[i];
            var found = word.index.indexOf(i);
            if (found === -1) {
                vars.renderContent += node.str;
                continue;
            }

            // Found relevant word node.
            var lastIndex = 0;
            // console.log(found);
            // console.log(node);
            // Iterate over the word hyphens.
            node.hyphenIndex.forEach(function (index) {
                var cut = node.str.substring(lastIndex, index + 1);
                lastIndex = index + 1;
                elem.html(
                    vars.renderContent +
                    '<span class="typeset-word-check">' +
                        cut +
                    '</span>' +
                    '<span class="typeset-hyphen-check">-</span>'
                );

                // Push render properties.
                node.hyphenWidth.push(elem.find('.typeset-word-check').width());
                if (node.dashWidth == null) {
                    node.dashWidth = elem.find('.typeset-hyphen-check').width();
                }

            });
            // Add remaining length.
            // console.log('str %s, strlen: %s, index %s', node.str, node.str.length, lastIndex);
            if (node.hyphenIndex.length != 0 && node.str.length !== lastIndex) {
                var cut = node.str.substr(lastIndex);
                elem.html(vars.renderContent + '<span class="typeset-hyphen-check">' + cut + '</span>');
                node.hyphenRemain = elem.find('.typeset-hyphen-check').width();
            }

            vars.renderContent += node.str;
        }
        elem.html(vars.renderContent);
        vars.lastRenderNode = lastWordIndex + 1;
    }

    function hyphenNodes(word, nodes, settings) {
        var index = 0;
        var node = nodes[word.index[index++]];

        if (node.isHyphen) {
            return false;
        }
        // Hyphen node.
        var offset = TypesetBot.wordUtils.hyphenOffset(word.str),
            hyphens = TypesetBot.wordUtils.hyphenWord(word.str, settings, offset.left, offset.right);

        // console.log(hyphens);
        var curLen = node.str.length, // First word-part
            prevLen = 0;

        // Init hyphen properties on nodes.
        word.index.forEach(function(index) {
            var n = nodes[index];
            n.isHyphen = true;
            n.hyphenIndex = [];
            n.hyphenWidth = [];
            n.hyphenRemain = 0;
        });

        if (hyphens.length <= 1) {
            return false;
        }

        var hyphenIndexes = getHyphenIndex(hyphens);

        // console.log(hyphenIndexes);
        var curHyphen = 0;
        hyphenIndexes.forEach(function (hyphenLen) {
            curHyphen += hyphenLen;
            while (curLen < curHyphen) {
                prevLen = curLen;
                // console.log('inner');
                node = nodes[word.index[index++]];
                curLen += node.str.length;
            }

            var hyphenIndex = curHyphen - prevLen - 1; // 1 for index offset
            // console.log('hy: %s, at %s', node.str, hyphenIndex);
            node.hyphenIndex.push(hyphenIndex);
            // console.log(node);
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

        var tempHyphenIndex = lineVars.hyphenIndex;

        while (! done) {
            var node = vars.nodes[lineVars.nodeIndex];
            if (node == null) { // Possible final break
                // console.log('possible final break');
                vars.finalBreaks.push(TypesetBot.node.createBreak(
                    wordIndex - 1,
                    null,
                    lineVars.origin,
                    lineVars.origin.demerit,
                    false,
                    0,
                    lineVars.line + 1,
                    lineVars.origin.height + lineVars.lineHeight,
                    lineVars.lineHeight,
                    ''
                ));

                return null;
            }

            // console.log(node);
            if (node.type === 'word') {
                if (lineVars.hyphenIndex !== null) {
                    // console.log('Hyphen index start position --> %s', tempHyphenIndex);
                    var cutIndex = node.hyphenIndex[tempHyphenIndex];
                    var cut = node.str.substr(cutIndex + 1); // Offset by 1, fx: hy[p]-hen
                    var cutWidth = getSliceWidth(node.hyphenWidth, tempHyphenIndex, node.width);

                    // console.log('cut --> %s -- %s', cut, cutWidth);
                    // console.log(node.hyphenWidth);
                    word += cut;
                    lineVars.curWidth += cutWidth;
                    lineVars.hyphenIndex = null; // Reset hyphenIndex

                } else {
                    word += node.str;
                    lineVars.curWidth += node.width;

                }

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

        return {
            str: word,
            index: wordIndex
        };
    }

    function getSliceWidth(hyphenArr, index, fullWidth) {
        var arr = hyphenArr.slice(index + 1),
            width = 0;
        arr.forEach(function (elem) {
            width += elem;
        });
        return fullWidth - width;
    }

    function updateShortestPath(vars, lineVars, nodeIndex, hyphenIndex, breakNode) {
        if (vars.shortestPath[lineVars.line][nodeIndex] == null) {
            vars.shortestPath[lineVars.line][nodeIndex] = {};
        }
        if (hyphenIndex == null) {
            hyphenIndex = -1;
        }
        if (vars.shortestPath[lineVars.line][nodeIndex][hyphenIndex] == null || vars.shortestPath[lineVars.line][nodeIndex][hyphenIndex] > breakNode.demerit) {
            vars.shortestPath[lineVars.line][nodeIndex][hyphenIndex] = breakNode.demerit;
            vars.activeBreakpoints.enqueue(breakNode); // Only add items to queue if they have better demerit
        }
    }

    /**
     * Apply the found solutions to the element.
     */
    function applyBreaks(elem, nodes, breaks) {
        var bestFit = null;
        breaks.forEach(function (elem) {
            if (bestFit == null || elem.demerit < bestFit.demerit) {
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
        // return;
        var done = false,
            content = '',
            lastIndex = 0,
            cutIndex = 0,
            lastHyphen = null,
            lastHeight = bestFit.curHeight,
            tagStack = [];

        // Construct the content from first line to last.
        while (! done) {
            var line = lines.pop();
            var firstNode = true;

            if (line == null) {
                done = true;
                continue;
            }

            var slice = null;
            if (line.hyphenIndex != null) {
                cutIndex = line.nodeIndex + 1;
            } else {
                cutIndex = line.nodeIndex;
            }

            var lineContent = '';
            if (tagStack.length > 0) {
                tagStack.forEach(function (index) {
                    lineContent += nodes[index].str;
                });
            }

            for (var i = lastIndex; i < cutIndex; i++) {
                var node = nodes[i];

                if (node.type === 'word') {

                    if (line.hyphenIndex != null && cutIndex - 1 == i) { // Last word on line
                        var index = node.hyphenIndex[line.hyphenIndex] + 1;
                        lineContent += node.str.substring(0, index) + '-';

                    } else if (firstNode && lastHyphen != null) {
                        var index = node.hyphenIndex[lastHyphen] + 1;
                        lineContent += node.str.substring(index);
                        firstNode = false;

                    } else {
                        lineContent += node.str;

                    }

                } else if (node.type === 'tag') {
                    lineContent += node.str;
                    if (node.endTag) {
                        tagStack.pop();
                    } else {
                        tagStack.push(i);
                    }

                } else if (node.type === 'space') {
                    if (cutIndex - 1 != i) {
                        lineContent += ' ';
                    }
                }
            }
            if (line.hyphenIndex != null) {
                lastIndex = line.nodeIndex - 1;
                lastHyphen = line.hyphenIndex;
            } else {
                lastIndex = line.nodeIndex;
                lastHyphen = null;
            }

            if (tagStack.length > 0) {
                lineContent += reverseStack(nodes, tagStack).join('');
            }

            // Add line to paragraph.
            content +=
                '<span class="typeset-line" line="' + line.lineNumber + '" style="height:' + line.curHeight + 'px" ratio="' + line.ratio + '" width="'+line.curWidth+'" count="' + line.wordCount + '">'
                    + lineContent
                + '</span>';
            console.log(lineContent);
        }

        elem.html(content);
        elem.addClass('typeset-paragraph');
    }

    /**
     * Take an array of begin tags, reverse them and create their closing tags.
     */
    function reverseStack(nodes, nodeIndexes) {
        var arr = [];
        nodeIndexes.forEach(function (nodeIndex) {
            var node = nodes[nodeIndex];
            arr.push(node.str);
        });

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
