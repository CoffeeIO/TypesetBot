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
        var html = elem.html(),
            propArr = new Array(wordArr.length),
            index = 0,
            previousWord = '';

        elem.html('');
        wordArr.forEach(function (word) {
            elem.find('.typeset-property').remove();
            elem.append(previousWord + ' <span class="typeset-property">' + word + '</span>');
            propArr[index] = {
                str: word,
                width: elem.find('.typeset-property').width(),
                height: elem.find('.typeset-property').css('display', 'block').height()
            };
            previousWord = word;
            index++;
        });
        elem.html(html);

        return propArr;
    };

    return obj;
})(TypesetBot.wordUtils || {});
