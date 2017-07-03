TypesetBot.nodeUtils = (function(obj, $) {

    /**
     * Append nodes until word is finished.
     * Definition:
     * - A word is at least 1 word node.
     * - A word can have any number of tags nodes and tags don't have to end.
     * - A word ends after a space node.
     */
    obj.appendWord = function (vars, lineVars, isPreprocess = false) {
        var done = false,
            word = '',
            wordIndex = [];

        var tempHyphenIndex = lineVars.hyphenIndex;

        while (! done) {
            var node = vars.nodes[lineVars.nodeIndex];
            if (node == null) { // Possible final break
                if (! isPreprocess) {
                  vars.finalBreaks.push(TypesetBot.node.createBreak(
                      lineVars.nodeIndex,
                      null,
                      lineVars.origin,
                      lineVars.origin.demerit,
                      false,
                      0,
                      lineVars.line + 1,
                      lineVars.origin.height + lineVars.lineHeight,
                      lineVars.lineHeight
                  ));
                }

                return null;
            }

            if (node.type === 'word') {
                if (lineVars.hyphenIndex !== null) {
                    var cutIndex = node.hyphenIndex[tempHyphenIndex];
                    var cut = node.str.substr(cutIndex + 1); // Offset by 1, fx: hy[p]-hen
                    var cutWidth = TypesetBot.hyphen.getEndWidth(node.hyphenWidth, tempHyphenIndex, node.hyphenRemain);

                    word += cut;
                    lineVars.curWidth += cutWidth;
                    lineVars.hyphenIndex = null; // Reset hyphenIndex
                } else {
                    word += node.str;
                    lineVars.curWidth += node.width;
                }

                if (lineVars.lineHeight < node.height) {
                    lineVars.lineHeight = node.height; // Update max height for this line
                }

                wordIndex.push(lineVars.nodeIndex);
            } else if (node.type === 'tag') {
                if (! node.endtag) {
                    vars.fontSize = node.fontSize;
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
    };

    /**
     * Check if tag string is and end tag.
     * Fx: '<b>' -> false, </b> -> true.
     */
    obj.isEndTag = function (tag) {
        if (tag.charAt(1) === '/') {
            return true;
        }
        return false;
    };

    /**
     * Break words into word, tag and space nodes.
     */
    obj.wordsToNodes = function (words) {
        var nodes = [];
        words.forEach(function (word) {
            while(word.length > 0) {
                word = createNodes(nodes, word);
            }
            nodes.push(TypesetBot.node.createSpace());
        });
        nodes.pop(); // Remove last space
        return nodes;
    };

    /**
     * Create nodes word and break word into word nodes and tag nodes.
     */
    function createNodes(nodes, word) {
        var tagRegex = /<(?:.|\n)*?>/;

        if (matches = word.match(tagRegex)) {
            var match = matches[0];
            if (match.length === word.length) {
                nodes.push(TypesetBot.node.createTag(word, false));
                return '';
            } else {
                var index = word.indexOf(match);
                if (index === 0) {
                    nodes.push(TypesetBot.node.createTag(match, obj.isEndTag(match)));
                    return word.substr(match.length);
                } else {
                    nodes.push(TypesetBot.node.createWord(word.substr(0, index)));

                    var tag = word.substr(index, match.length);
                    nodes.push(TypesetBot.node.createTag(tag, obj.isEndTag(tag)));
                    return word.substr(index + match.length);
                }
            }
        } else {
            nodes.push(TypesetBot.node.createWord(word));
            return '';
        }

        return word;
    }

    return obj;
})(TypesetBot.nodeUtils || {}, jQuery);
