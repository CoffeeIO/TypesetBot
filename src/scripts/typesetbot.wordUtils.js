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

    return obj;
})(TypesetBot.wordUtils || {});
