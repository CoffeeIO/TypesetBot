TypesetBot.wordUtils = (function(obj) {

    /**
     * Hyphen word with specific settings.
     */
    obj.hyphenWord  = function (word, settings) {
        if (window['Hypher']['languages'][settings.hyphenLanguage] == null) {
            return null;
        }
        window['Hypher']['languages'][settings.hyphenLanguage].leftMin = settings.hyphenLeftMin;
        window['Hypher']['languages'][settings.hyphenLanguage].rightMin = settings.hyphenRightMin;
        return window['Hypher']['languages'][settings.hyphenLanguage].hyphenate(word);
    };

    /**
     * Analyse words in a paragraph and return the array with all relevant properties.
     */
    obj.getWordProperties = function (elem, wordArr) {
        var tagRegex = /<(.|\n)*?>/g;

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
