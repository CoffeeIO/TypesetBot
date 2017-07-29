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
    obj.hyphenProperties = function (elem, vars, settings) {
        var nodes = vars.nodes,
            content = '',
            html = elem.html(), // Store copy
            // Requests of what node index and what type is being checked in the order they where added to the dom
            renderRequest = [];

        // Loops through all nodes to construct content.
        for (var i = 0; i < nodes.length; i++) {
            var node = nodes[i];

            if (node.toRender) { // Only happens on word nodes
                // Queue hyphen pieces, fx 'hy'.
                var lastIndex = 0;
                for (var j = 0; j < node.hyphenIndex.length; j++) {
                    var index = node.hyphenIndex[j],
                        cut = node.str.substring(lastIndex, index + 1);
                    lastIndex = index + 1;
                    content += '<span class="typeset-hyphen-check">' + cut + '</span>';
                    renderRequest.push({nodeIndex: i, type: 'hyphen'});
                }

                // Queue remain (if any), fx 'phen'.
                if (node.hyphenIndex.length !== 0 && node.str.length !== lastIndex) {
                    var cut = node.str.substr(lastIndex);
                    content += '<span class="typeset-hyphen-check">' + cut + '</span>';
                    renderRequest.push({nodeIndex: i, type: 'remain'});
                }

                // Queue dash, '-'.
                content += '<span class="typeset-hyphen-check">-</span>';
                renderRequest.push({nodeIndex: i, type: 'dash'});

                node.toRender = false; // Unset the toRender
            } else { // Just add to content, so tags are properly accounted for
                if (node.type === 'tag' || node.type === 'word') {
                    content += node.str;
                } else if (node.type === 'space') {
                    content += ' ';
                }
            }
        }

        // Check dimensions.
        elem.html(content);
        var index = 0;

        var hyphens = document.getElementsByClassName('typeset-hyphen-check'); // Find all properties to check
        for (var i = 0; i < hyphens.length; i++) {
            var hyphen = hyphens[i];

            var request = renderRequest[index++];
            var width = hyphen.getBoundingClientRect().width;
            var node = nodes[request.nodeIndex];
            if (request.type === 'hyphen') {
                node.hyphenWidth.push(width);
            } else if (request.type === 'remain') {
                node.hyphenRemain = width;
            } else if (request.type === 'dash') {
                node.dashWidth = width;
            }
        }

        elem.html(html);
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
