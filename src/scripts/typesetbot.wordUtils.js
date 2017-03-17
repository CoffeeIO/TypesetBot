TypesetBot.wordUtils = (function(obj) {

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
                nodes.push({
                    type: 'tag',
                    str: word,
                    endtag: false
                });
                return '';
            } else {
                var index = word.indexOf(match);
                if (index === 0) {
                    nodes.push({
                        type: 'tag',
                        str: match,
                        endtag: isEndTag(match)
                    });
                    return word.substr(match.length);
                } else {
                    nodes.push({
                        type: 'word',
                        str: word.substr(0, index)
                    });
                    var tag = word.substr(index, match.length)
                    nodes.push({
                        type: 'tag',
                        str: tag,
                        endtag: isEndTag(tag)
                    });
                    // console.log(word);
                    // console.log(match);
                    // console.log(index);
                    // console.log(word.substr(index, match.length));
                    return word.substr(index + match.length);
                }
            }
        } else {
            nodes.push({
                type: 'word',
                str: word
            });
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
            nodes.push({
                type: 'space'
            });
        });
        nodes.pop(); // Remove last space
        return nodes;
    }

    /**
     * Analyse words in a paragraph and return the array with all relevant properties.
     */
    obj.getWordProperties = function (elem, wordArr) {

        var html = elem.html(),
            propArr = new Array(wordArr.length),
            index = 0,
            previousWord = '';

        elem.html('');
        wordArr.forEach(function (word) {
            console.log(word);
            var tagBegin = [],
                tagEnd = [];

            // Analyse html tag begining and ending.
            while (matches = tagRegex.exec(word)) {
                // console.log('match --> %s', matches[0]);
                var match = matches[0];
                if (match.charAt(1) == '/') { // Check end tag
                    tagEnd.push(match);
                } else {
                    tagBegin.push(match);
                }
            }
            if (tagEnd != '' || tagBegin != '') {
                console.log('Found --> %s --- %s', tagBegin, tagEnd);
            }

            elem.find('.typeset-property').remove();
            elem.append(previousWord + ' <span class="typeset-property">' + word + '</span>');
            propArr[index] = {
                type: 'word',
                str: word,
                // str: word.replace(tagRegex, ''),
                width: elem.find('.typeset-property').width(),
                height: elem.find('.typeset-property').css('display', 'block').height(),
                tagBegin: (tagBegin.length === 0) ? null : tagBegin,
                tagEnd: (tagEnd.length === 0) ? null : tagEnd
            };
            propArr[index] = {
                type: 'space',
                str: word,
                // str: word.replace(tagRegex, ''),
                width: elem.find('.typeset-property').width(),
                height: elem.find('.typeset-property').css('display', 'block').height(),
                tagBegin: (tagBegin.length === 0) ? null : tagBegin,
                tagEnd: (tagEnd.length === 0) ? null : tagEnd
            };
            previousWord = word;
            index++;
        });
        elem.html(html);

        return propArr;
    };

    return obj;
})(TypesetBot.wordUtils || {});
