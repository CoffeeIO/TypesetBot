TypesetBot.render = (function(obj, $) {

    obj.appendWord = function (vars, lineVars) {
        var done = false,
            word = '',
            wordIndex = [];

        var tempHyphenIndex = lineVars.hyphenIndex;

        while (! done) {
            var node = vars.nodes[lineVars.nodeIndex];
            if (node == null) { // Possible final break
                vars.finalBreaks.push(TypesetBot.node.createBreak(
                    lineVars.nodeIndex,
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

            if (node.type === 'word') {
                if (lineVars.hyphenIndex !== null) {
                    var cutIndex = node.hyphenIndex[tempHyphenIndex];
                    var cut = node.str.substr(cutIndex + 1); // Offset by 1, fx: hy[p]-hen
                    var cutWidth = TypesetBot.hyphen.getSliceWidth(node.hyphenWidth, tempHyphenIndex, node.hyphenRemain);

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

    /**
     * Apply the found solutions to the element.
     */
    obj.applyBreaks = function(elem, nodes, breaks) {
        var bestFit = null;
        breaks.forEach(function (elem) {
            if (bestFit == null || elem.demerit < bestFit.demerit) {
                bestFit = elem;
            }
        });
        // console.log(bestFit);
        var index = bestFit.nodeIndex;


        // Change the nodes to an array so we can pop them off in correct order.
        var lines = [];
        while (true) {
            if (bestFit.origin == null) {
                break; // First line doesn't matter, we know it starts at word index 0
            }
            lines.push(bestFit);
            bestFit = bestFit.origin;
        }

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
            // console.log(lineContent);
        }
        // console.log(elem[0].outerHTML);


        elem.html(content);
        var alignmentClass = TypesetBot.utils.getAlignmentClass(settings.alignment);
        elem.addClass('typeset-paragraph ' + alignmentClass);
    }


    return obj;
})(TypesetBot.render || {}, jQuery);
