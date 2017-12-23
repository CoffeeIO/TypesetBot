TypesetBot.typeset = (function(obj, $) {

    /**
     * Find paragraph elements in selector to typeset and typeset them.
     */
    obj.element = function (selector, settings) {
        selector.each(function () {
            var elem = $(this);
            if (elem.prop("tagName") === 'P' && !elem.hasClass('typeset-paragraph')) {
                // Typeset the element itself.
                obj.paragraph(elem, settings);
            } else {
                // Typeset any <p> element inside.
                elem.find('p:not(.typeset-paragraph)').each(function () {
                    var innerElem = $(this);
                    if (innerElem.hasClass('typeset-hidden')) {
                        innerElem.removeClass('typeset-hidden');
                        obj.paragraph(innerElem, settings);
                    } else {
                        obj.paragraph(innerElem, settings);
                    }
                });
            }
        });
    };

    /**
     * Typeset single paragraph.
     */
    obj.paragraph = function (elem, settings) {

        TypesetBot.utils.startTime('preprocesselem', settings);
        // Clean element
        TypesetBot.paraUtils.removeBreak(elem);
        TypesetBot.paraUtils.removeImage(elem);
        if (! TypesetBot.paraUtils.isVisible(elem)) {
            return; // Don't typeset invisible elements
        }

        settings.loosenessParam = 0;
        var hash = TypesetBot.typesetUtils.hashElem(elem),
            oldHash = elem.attr('hashcode');

        if (oldHash != null && oldHash !== hash) {
            // Delete any elements with the old hash.
            TypesetBot.typesetUtils.deleteWorkElem(oldHash);
        }
        // Retreive working element.
        var workElem = TypesetBot.typesetUtils.getWorkElem(elem, hash);

        elem.addClass('typeset-hidden'); // Hide original paragraph
        TypesetBot.utils.endTime('preprocesselem', settings);

        TypesetBot.utils.startTime('totallinebreak', settings);
        var breaks = obj.linebreak(workElem, settings);
        TypesetBot.utils.endTime('totallinebreak', settings);

        if (breaks != null) { // Solution was found
            TypesetBot.vars[hash] = breaks.nodes;
            TypesetBot.utils.startTime('apply', settings);
            TypesetBot.render.applyBreaks(workElem, breaks.nodes, breaks.solutions, settings);
            TypesetBot.utils.endTime('apply', settings);
        }
    };

    /**
     * Line break paragraph and get all solutions.
     */
    obj.linebreak = function (elem, settings) {
        // Set wordspacing.
        TypesetBot.utils.startTime('setspacing', settings);
        TypesetBot.paraUtils.setSpaceWidth(elem, settings.spaceWidth - settings.spaceShrinkability, settings.spaceUnit);
        TypesetBot.utils.endTime('setspacing', settings);

        // Get variables for algorithm.
        TypesetBot.utils.startTime('varinit', settings);
        var vars = TypesetBot.typesetUtils.initVars(elem, settings);
        TypesetBot.utils.endTime('varinit', settings);

        // Preprocess hyphens.
        TypesetBot.utils.startTime('hypheninit', settings);
        TypesetBot.typesetUtils.preprocessHyphens(elem, vars, settings); // Preprocess all hyphens and dimensions
        TypesetBot.utils.endTime('hypheninit', settings);

        TypesetBot.utils.startTime('linebreak', settings);
        // Queue starting node.
        vars.activeBreakpoints.enqueue(
            TypesetBot.node.createBreak(0, null, null, 0, false, null, 0, 0, 0)
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
            TypesetBot.utils.startTime('linevars', settings);
            var lineVars = TypesetBot.typesetUtils.initLineVars(elem, settings, vars, a);
            TypesetBot.utils.endTime('linevars', settings);

            // Find breakpoints on line.
            while (! lineVars.done) {
                var oldWidth = lineVars.curWidth,
                    word = TypesetBot.nodeUtils.appendWord(vars, lineVars);

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

                            if (TypesetBot.math.isValidRatio(hyphenRatio, settings)) {
                                var hyphenPenalty = settings.alignment === 'justify' ?
                                    settings.hyphenPenalty :
                                    settings.hyphenPenaltyRagged;
                                TypesetBot.typesetUtils.generateBreak(
                                    vars, lineVars, hyphenRatio, hyphenPenalty, true, wordIndex, key, settings
                                );
                            }
                        });
                    });

                    // Check the ratio is still valid.
                    if (ratio < settings.minRatio) {
                        lineVars.done = true;
                        continue; // Don't add the last node.
                    }

                    // Create break for full word.
                    TypesetBot.typesetUtils.generateBreak(
                        vars, lineVars, ratio, 0, false, lineVars.nodeIndex, null, settings
                    );
                }

                // Append space
                lineVars.curWidth += vars.spaceWidth;
            }
        }

        elem.html(vars.content);

        // Run again if no solution was found.-------------------
        if (vars.finalBreaks.length === 0) {
            if (settings.loosenessParam >= settings.absoluteMaxRatio) {
                return null;
            }
            settings.loosenessParam += 1;
            return obj.linebreak(elem, settings);
        }
        TypesetBot.utils.endTime('linebreak', settings);

        // Return nodes and found solutions.
        return {
            nodes: vars.nodes,
            solutions: vars.finalBreaks
        };
    };

    return obj;
})(TypesetBot.typeset || {}, TypesetBotQuery);
