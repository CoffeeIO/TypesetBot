TypesetBot.typeset = (function(obj, $) {

    obj.initVars = function (elem, settings) {

        var hash = elem.attr('hashcode'),
            content = elem.html(), // Save for later
            width = elem.width(),
            height = elem.height();

        var foundVars = TypesetBot.vars['x' + hash];
        var props;

        if (foundVars == null) {
            var words = TypesetBot.paraUtils.getWords(content),
                nodes = TypesetBot.wordUtils.wordsToNodes(words);
            props = TypesetBot.wordUtils.getNodeProperties(elem, nodes);
            TypesetBot.vars['x' + hash] = props;

        } else {
            props = foundVars;
        }

        var linewidths = null;
        if (settings.dynamicWidth) {
            linewidths = TypesetBot.lineUtils.getAllLinewidths(elem, width, height, settings);
        }

        var fontSize = Number(elem.css('font-size').replace('px', '')),
            spaceWidth = fontSize * settings.spaceWidth,
            spaceShrink = fontSize * settings.spaceShrinkability,
            spaceStretch = fontSize * settings.spaceStretchability;

        var hyphenContent = '', // Content for checking hyphen dimensions
            hyphenIndex = 0; // Index for last hyphened word

        return {
            fontSize,
            spaceWidth,
            spaceShrink,
            spaceStretch,
            nodes: props,
            linewidths,
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
        var line = a.lineNumber;

        if (vars.shortestPath[line] == null) { // Add line object
            vars.shortestPath[line] = {};
        }
        var done = checkShortestPath(vars, line - 1, a);
        if (done) {
            return {
                done
            };
        }

        var nodeIndex = a.nodeIndex,
            hyphenIndex = a.hyphenIndex,
            idealWidth = vars.width;

        if (settings.dynamicWidth) {
            idealWidth = vars.linewidths[Math.ceil(a.height / settings.dynamicWidthIncrement)];
        }

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

    obj.typeset = function (selector, settings) {
        selector.each(function () {
            var elem = $(this);
            if (elem.prop("tagName") === 'P' && !elem.hasClass('typeset-paragraph')) {
                // Typeset the element itself.
                console.log('Found myself');

                obj.typesetElem(elem, settings);
            } else {
                // Typeset any <p> element inside.
                elem.find('p:not(.typeset-paragraph)').each(function () {
                    var innerElem = $(this);
                    console.log('Found elem');
                    // console.log('one elem');
                    if (innerElem.hasClass('typeset-hidden')) {
                        innerElem.removeClass('typeset-hidden');
                        obj.typesetElem(innerElem, settings);

                    } else {
                        obj.typesetElem(innerElem, settings);
                    }
                });
            }
        });
    }

    obj.detach = function (selector) {
        $(selector).each(function () {
            var elem = $(this);
            if (elem.prop("tagName") === 'P') {
                if (elem.hasClass('typeset-paragraph')) {
                    elem.remove();
                } else if (elem.hasClass('typeset-hidden')) {
                    elem.removeClass('typeset-hidden');
                } else {
                    elem.find('.typeset-paragraph').remove();
                    elem.find('.typeset-hidden').removeClass('typeset-hidden');
                }
            }
        });
    };

    obj.typesetElem = function (elem, settings) {
        console.time('pre');

        settings.loosenessParam = 0;
        var hash = TypesetBot.utils.hashCode(elem.html());
        if (elem.attr('hashcode') != null) {
            elem.parent().find('.typeset-paragraph[hashcode="' + hash + '"]').remove(); // Remove related typeset paragraph
            elem.removeClass('typeset-hidden');
        }

        elem.attr('hashcode', hash);

        var copy = elem[0].outerHTML;

        elem.addClass('typeset-hidden');

        elem.after(copy);
        var workElem = elem.next();

        console.timeEnd('pre');

        console.time('breaking');

        var breaks = obj.typesetParagraph(workElem, settings);
        console.timeEnd('breaking');

        console.log('solutions --> ', breaks.solutions.length);

        console.time('apply');
        if (breaks != null) {
            TypesetBot.vars['x' + hash] = breaks.nodes;
            TypesetBot.render.applyBreaks(workElem, breaks.nodes, breaks.solutions);
        }
        console.timeEnd('apply');

    };

    obj.typesetParagraph = function (elem, settings) {
        // Set wordspacing.
        TypesetBot.paraUtils.setSpaceWidth(elem, settings.spaceWidth - settings.spaceShrinkability, settings.spaceUnit);

        // Get variables for algorithm.
        console.time('vars init');
        var vars = obj.initVars(elem, settings);
        console.timeEnd('vars init');
        // vars.nodes.forEach(function (node) { console.log(node); }); // Debug

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

                var oldWidth = lineVars.curWidth;
                var word = TypesetBot.render.appendWord(vars, lineVars);

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

                if (ratio <= settings.maxRatio + settings.loosenessParam) { // Valid breakpoint

                    if (TypesetBot.hyphen.hyphenNodes(word, vars.nodes, settings)) {
                        TypesetBot.hyphen.renderHyphens(elem, word, vars, settings);
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
                                var hyphenPenalty = settings.alignment === 'justify' ? settings.hyphenPenalty : settings.hyphenPenaltyRagged;
                                obj.generateBreak(vars, lineVars, hyphenRatio, hyphenPenalty, true, wordIndex, key, settings);
                            }

                        });
                    });
                        // Check the ratio is still valid.

                    if (ratio < settings.minRatio) {
                        lineVars.done = true;
                        continue; // Don't add the last node.
                    }

                    // Create break for full word.
                    obj.generateBreak(vars, lineVars, ratio, 0, false, lineVars.nodeIndex, null, settings);
                }

                // Append space
                lineVars.curWidth += vars.spaceWidth;
            }
        }

        elem.html(vars.content);

        // Run again if no solution was found.-------------------
        if (vars.finalBreaks.length == 0) {
            console.log('no solution found');
            if (settings.loosenessParam >= settings.absoluteMaxRatio) {
                return null;
            }
            settings.loosenessParam += 1;
            return obj.typesetParagraph(elem, settings);
        }

        // console.log(vars.shortestPath);
        // console.log(vars.breakpoints);
        // console.log(vars.finalBreaks);

        // Apply found solution.
        return {
            nodes: vars.nodes,
            solutions: vars.finalBreaks
        };
    };

    obj.generateBreak = function (vars, lineVars, ratio, penalty, flag, wordIndex, hyphenIndex, settings) {
        var fitnessClass = TypesetBot.math.getFitness(ratio, settings);
        var flagDemerit = lineVars.origin.flag ? true : false; // Check if previous node was flagged

        var demerit = TypesetBot.math.calcDemerit(ratio, penalty, flagDemerit, settings);
        // Add demerit if fitness class moves more than 1.
        if (lineVars.origin.fitnessClass != null && Math.abs(lineVars.origin.fitnessClass - fitnessClass) > 1) {
            demerit += settings.fitnessClassDemerit;
        }

        var breakNode = TypesetBot.node.createBreak(
            wordIndex,
            hyphenIndex,
            lineVars.origin,
            lineVars.origin.demerit + demerit,
            flag,
            fitnessClass,
            lineVars.line + 1,
            lineVars.origin.height + lineVars.lineHeight,
            lineVars.lineHeight,
            ''
        );

        breakNode.ratio = ratio;
        breakNode.astr = vars.nodes[wordIndex].str;

        updateShortestPath(vars, lineVars, wordIndex, hyphenIndex, breakNode);
        vars.breakpoints.push(breakNode);
    }




    function checkShortestPath(vars, line, a) {
        var hIndex = a.hyphenIndex == null ? -1 : a.hyphenIndex;
        if (vars.shortestPath[line] != null &&
            vars.shortestPath[line][a.nodeIndex] != null &&
            vars.shortestPath[line][a.nodeIndex][hIndex] < a.demerit) {
            return true;
        }

        return false;
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
