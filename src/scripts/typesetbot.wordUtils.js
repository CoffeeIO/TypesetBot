TypesetBot.wordUtils = (function(obj) {

    obj.hyphenOffset = function (word) {
        var beginRegex = /^[\W]*/,
            endRegex = /[\W]*$/;

        var left = 0,
            right = 0;

        if (matches = word.match(beginRegex)) {
            var match = matches[0];
            left = match.length;
        }
        if (matches = word.match(endRegex)) {
            var match = matches[0];
            right = match.length;
        }

        return {
            left,
            right
        }
    };

    /**
     * Hyphen word with specific settings.
     */
    obj.hyphenWord  = function (word, settings, left = 0, right = 0) {
        if (window['Hypher']['languages'][settings.hyphenLanguage] == null) {
            return null;
        }
        window['Hypher']['languages'][settings.hyphenLanguage].leftMin = settings.hyphenLeftMin + left;
        window['Hypher']['languages'][settings.hyphenLanguage].rightMin = settings.hyphenRightMin + right;
        return window['Hypher']['languages'][settings.hyphenLanguage].hyphenate(word);
    };

    function isEndTag(tag) {
        if (tag.charAt(1) === '/') {
            return true;
        }
        return false;
    }

    function getTag(nodes, word) {
        var tagRegex = /<(?:.|\n)*?>/;

        if (matches = word.match(tagRegex)) {
            var match = matches[0];
            if (match.length === word.length) {
                nodes.push(TypesetBot.node.createTag(word, false));
                return '';
            } else {
                var index = word.indexOf(match);
                if (index === 0) {
                    nodes.push(TypesetBot.node.createTag(match, isEndTag(match)));
                    return word.substr(match.length);
                } else {
                    nodes.push(TypesetBot.node.createWord(word.substr(0, index)));

                    var tag = word.substr(index, match.length);
                    nodes.push(TypesetBot.node.createTag(tag, isEndTag(tag)));
                    return word.substr(index + match.length);
                }
            }
        } else {
            nodes.push(TypesetBot.node.createWord(word));
            return '';
        }

        return word;
    }

    /**
     * Break words into nodes.
     */
    obj.wordsToNodes = function (words) {
        var nodes = [];
        words.forEach(function (word) {
            while(word.length > 0) {
                word = getTag(nodes, word)
            }
            nodes.push(TypesetBot.node.createSpace());
        });
        nodes.pop(); // Remove last space
        return nodes;
    }

    obj.spaceStore = {};
    obj.hyphenStore = {};


    /**
     * Analyse words in a paragraph and return the array with all relevant properties.
     */
    obj.getNodeProperties = function (elem, nodes) {

        var html = elem.html(),
            props = [],
            allowSpace = false, // Disallow space as first node
            content = ''; // Html content, to correct for auto-closing tags when rendering

        elem.html('');
        nodes.forEach(function (node) {
            if (node.type === 'word') {
                // Add the word after, for when we remove typeset-property elem.
                elem.html(content + '<span class="typeset-property">' + node.str + '</span>' + node.str);
                content += node.str;

                var word = elem.find('.typeset-property');

                node.width = word.width();
                node.height = word.height();

                props.push(node);

                elem.find('.typeset-property').remove();

                allowSpace = true;
            } else if (node.type === 'tag') {
                var fontSize = null;

                content += node.str;

                if (! node.endtag) {
                    elem.html(content);
                    var tag = elem.find('*:last');
                    fontSize = Number(tag.css('font-size').replace('px', ''));
                }

                node.fontSize = fontSize

                props.push(node);
            } else if (node.type === 'space') {
                // Remove extra spaces, first space takes priority.
                // Fx: hello_<b>_world</b>
                // Real ->  |   |   <- Invisible
                if (allowSpace) {
                    content += ' ';
                    elem.html(content);

                    props.push(node);
                    allowSpace = false;
                }
            }

        });
        elem.html(html); // Put back html

        return props;
    };

    return obj;
})(TypesetBot.wordUtils || {});
