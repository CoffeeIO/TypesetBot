TypesetBot.typesetUtils = (function(obj, $) {

    /**
     * Initialize variables relevant for each paragraph being typeset.
     */
    obj.initVars = function (elem, settings) {

        var hash = elem.attr('hashcode'),
            content = elem.html(), // Save for later
            width = elem.width(),
            height = elem.height();

        var foundVars = TypesetBot.vars[hash];
        var props;

        if (foundVars == null) {
            var words = TypesetBot.paraUtils.getWords(content),
                nodes = TypesetBot.nodeUtils.wordsToNodes(words);
            props = TypesetBot.render.getNodeProperties(elem, nodes);
            TypesetBot.vars[hash] = props;

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

    /**
     * Initialize variables relevant for each line being typeset.
     */
    obj.initLineVars = function (elem, settings, vars, a) {
        var line = a.lineNumber;

        var done = obj.checkShortestPath(vars, line - 1, a);
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

    /**
     * Generate possible break and calculate the demerit.
     */
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
            lineVars.lineHeight
        );

        breakNode.ratio = ratio;

        obj.updateShortestPath(vars, lineVars, wordIndex, hyphenIndex, breakNode);
        vars.breakpoints.push(breakNode);
    };

    /**
     * Check if node is the smallest demerit to a point.
     */
    obj.checkShortestPath = function (vars, line, a) {
        // Convert hyphen index null to -1, as 0 is a valid hyphen index.
        var hIndex = a.hyphenIndex == null ? -1 : a.hyphenIndex;
        if (vars.shortestPath[line] != null &&
            vars.shortestPath[line][a.nodeIndex] != null &&
            vars.shortestPath[line][a.nodeIndex][hIndex] < a.demerit
        ) {
            return true;
        }

        return false;
    };

    /**
     * Update value on specific line, node and hyphen if demerit is smaller.
     */
    obj.updateShortestPath = function (vars, lineVars, nodeIndex, hyphenIndex, breakNode) {
        if (vars.shortestPath[lineVars.line] == null) { // Add line object
            vars.shortestPath[lineVars.line] = {};
        }

        if (vars.shortestPath[lineVars.line][nodeIndex] == null) {
            vars.shortestPath[lineVars.line][nodeIndex] = {};
        }
        if (hyphenIndex == null) {
            hyphenIndex = -1; // Convert hyphen index null to -1, as 0 is a valid hyphen index
        }
        if (vars.shortestPath[lineVars.line][nodeIndex][hyphenIndex] == null ||
            vars.shortestPath[lineVars.line][nodeIndex][hyphenIndex] > breakNode.demerit
        ) {
            vars.shortestPath[lineVars.line][nodeIndex][hyphenIndex] = breakNode.demerit;
            vars.activeBreakpoints.enqueue(breakNode); // Only add items to queue if they have better demerit
        }
    };

    return obj;
})(TypesetBot.typesetUtils || {}, jQuery);
