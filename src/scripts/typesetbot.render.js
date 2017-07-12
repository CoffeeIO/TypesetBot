TypesetBot.render = (function(obj, $) {

    /**
     * Detach selector from dom and remove typeset elements.
     */
    obj.detachSelector = function (selector) {
        $(selector).each(function () {
            var elem = $(this);
            if (elem.prop("tagName") === 'P') {
                if (elem.hasClass('typeset-paragraph')) {
                    elem.remove(); // Remove typeset element
                } else if (elem.hasClass('typeset-hidden')) {
                    elem.removeClass('typeset-hidden'); // Show original text
                } else {
                    elem.find('.typeset-paragraph').remove(); // Remove typeset element
                    elem.find('.typeset-hidden').removeClass('typeset-hidden'); // Show original text
                }
            }
        });
    };

    /**
     * Render nodes and return the array with all relevant properties.
     */
    obj.getNodeProperties = function (elem, nodes) {

        var html = elem.html(), // Copy the html content
            content = '', // Html content, to correct for auto-closing tags when rendering
            wordIndexes = []; // Indexes of word nodes

        for (var i = 0; i < nodes.length; i++) {
            var node = nodes[i];

            if (node.type === 'word') {
                wordIndexes.push(i);
                content += '<span class="typeset-word-node">' + node.str + '</span>';
            } else if (node.type === 'tag') {
                content += node.str;
            } else if (node.type === 'space') {
                content += ' ';
            }
        }

        elem.html(content);
        var words = document.getElementsByClassName('typeset-word-node');
        for (var i = 0; i < words.length; i++) {
            var word = words[i];
            var wordIndex = wordIndexes[i];

            nodes[wordIndex].height = word.getBoundingClientRect().height;
            nodes[wordIndex].width = word.getBoundingClientRect().width;

        }
        elem.html(html); // Put back html

        return nodes;
    };

    /**
     * Render word hyphens and get relevant properties.
     */
    obj.hyphenProperties = function (elem, word, vars, settings) {
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

            // Iterate over the word hyphens.
            node.hyphenIndex.forEach(function (index) {

                var cut = node.str.substring(lastIndex, index + 1);
                lastIndex = index + 1;
                elem.html(
                    vars.renderContent +
                    '<span class="typeset-word-check" id="typeset-word-check">' +
                        cut +
                    '</span>' +
                    '<span class="typeset-hyphen-check" id="typeset-hyphen-check">-</span>'
                );

                // Push render properties.
                node.hyphenWidth.push(document.getElementById('typeset-word-check').getBoundingClientRect().width);

                if (node.dashWidth == null) {
                    node.dashWidth = document.getElementById('typeset-hyphen-check').getBoundingClientRect().width;
                }

            });
            // Add remaining length.
            if (node.hyphenIndex.length !== 0 && node.str.length !== lastIndex) {
                var cut = node.str.substr(lastIndex);
                elem.html(vars.renderContent + '<span class="typeset-hyphen-check">' + cut + '</span>');
                node.hyphenRemain = elem.find('.typeset-hyphen-check').width();
            }

            vars.renderContent += node.str;
        }
        elem.html(vars.renderContent);
        vars.lastRenderNode = lastWordIndex + 1;
    };

    /**
     * Apply the found solutions to the element.
     */
    obj.applyBreaks = function(elem, nodes, breaks, settings) {
        var bestFit = null;
        breaks.forEach(function (elem) {
            if (bestFit == null || elem.demerit < bestFit.demerit) {
                bestFit = elem;
            }
        });
        var index = bestFit.nodeIndex;


        // Change the nodes to an array so we can pop them off in correct order.
        var lines = [],
            done = false;
        while (! done) {
            if (bestFit.origin == null) {
                done = true;
                continue; // First line doesn't matter, we know it starts at word index 0
            }
            lines.push(bestFit);
            bestFit = bestFit.origin;
        }

        var content = '',
            lastIndex = 0,
            cutIndex = 0,
            lastHyphen = null,
            lastHeight = bestFit.curHeight,
            tagStack = [];

        done = false;

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

                    if (line.hyphenIndex != null && cutIndex - 1 === i) { // Last word on line
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
                    if (cutIndex - 1 !== i) {
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
                lineContent += TypesetBot.utils.reverseStack(nodes, tagStack).join('');
            }

            // Add line to paragraph.
            content +=
                '<span class="typeset-line" line="' + line.lineNumber + '" style="height:' + line.curHeight + 'px" ' +
                    'ratio="' + line.ratio + '">' +
                    lineContent +
                '</span>';
        }

        elem.html(content);
        var alignmentClass = TypesetBot.utils.getAlignmentClass(settings.alignment);
        elem.addClass('typeset-paragraph ' + alignmentClass);
    };


    return obj;
})(TypesetBot.render || {}, jQuery);
