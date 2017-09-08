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
        // Clean element
        TypesetBot.paraUtils.removeBreak(elem);
        TypesetBot.paraUtils.removeImage(elem);
        if (! TypesetBot.paraUtils.isVisible(elem)) {
            return; // Don't typeset invisible elements
        }

        settings.loosenessParam = 0;
        var hash = TypesetBot.utils.getHash(elem.html());
        if (elem.attr('hashcode') != null) {
            // Remove related typeset paragraph.
            elem.parent().find('.typeset-paragraph[hashcode="' + hash + '"]').remove();
            elem.removeClass('typeset-hidden');
        }

        elem.attr('hashcode', hash);
        var copy = elem[0].outerHTML;
        elem.addClass('typeset-hidden');
        elem.after(copy);
        var workElem = elem.next();

        var breaks = obj.linebreak(workElem, settings);
        if (breaks != null) {
            TypesetBot.vars[hash] = breaks.nodes;
            var timeApply = TypesetBot.utils.startTime();
            TypesetBot.render.applyBreaks(workElem, breaks.nodes, breaks.solutions, settings);
            TypesetBot.debugVars.apply = settings.debug ? TypesetBot.utils.endTime(timeApply) : 0;
        }
    };

    /**
     * Line break paragraph and get all solutions.
     */
    obj.linebreak = function (elem, settings) {
        // Set wordspacing.
        TypesetBot.paraUtils.setSpaceWidth(elem, settings.spaceWidth - settings.spaceShrinkability, settings.spaceUnit);

        // Get variables for algorithm.
        var timeVarInit = TypesetBot.utils.startTime();
        var vars = TypesetBot.typesetUtils.initVars(elem, settings);
        TypesetBot.debugVars.varinit = settings.debug ? TypesetBot.utils.endTime(timeVarInit) : 0;

        // Preprocess hyphens.
        var timeHyphenInit = TypesetBot.utils.startTime();
        TypesetBot.typesetUtils.preprocessHyphens(elem, vars, settings); // Preprocess all hyphens and dimensions
        TypesetBot.debugVars.hypheninit = settings.debug ? TypesetBot.utils.endTime(timeHyphenInit) : 0;

        var timeLinebreak = TypesetBot.utils.startTime();
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
            var lineVars = TypesetBot.typesetUtils.initLineVars(elem, settings, vars, a);

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
        TypesetBot.debugVars.linebreak = settings.debug ? TypesetBot.utils.endTime(timeLinebreak) : 0;

        // Return nodes and found solutions.
        return {
            nodes: vars.nodes,
            solutions: vars.finalBreaks
        };
    };

    return obj;
})(TypesetBot.typeset || {}, jQuery);
