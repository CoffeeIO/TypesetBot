// Declare vendor library.
declare var module: any;

/**
 * Class to handle text hyphenations.
 */
class TypesetBotHyphen {
    private _tsb: TypesetBot;

    constructor(tsb: TypesetBot) {
        this._tsb = tsb;
    }

    /**
     * Hyphenate word.
     *
     * @param   word The word to hyphen
     * @returns      Array of string parts
     */
    hyphenate = function(word: string): string[] {
        const offset = this.getWordOffset(word);
        return this.getWordParts(word, offset.right, offset.left);
    }

    /**
     * Hyphen word with specific settings.
     * Return array of possible word hyphens.
     * Fx: hyphenation --> ["hyp", "hen", "ation"]
     *
     * @param   word        The word to hyphen
     * @param   rightOffset Addition offset of word on right side
     * @param   leftOffset  Addition offset of word on left side
     * @returns             Array of string parts
     */
    getWordParts = function(word: string, rightOffset: number = 0, leftOffset: number = 0): string[] {
        if (this._tsb.settings.hyphenLanguage.trim() === '') {
            return [word];
        }
        if ((window as any).Hypher == null || (window as any).Hypher.languages == null) {
            console.warn('Hyphenation library not found');
            return[word];
        }
        if ((window as any).Hypher.languages[this._tsb.settings.hyphenLanguage] == null) { // Language not found
            var h = new (window as any).Hypher(module.exports);

            if (typeof module.exports.id === 'string') {
                module.exports.id = [module.exports.id];
            }

            for (var i = 0; i < module.exports.id.length; i += 1) {
                (window as any).Hypher.languages[module.exports.id[i]] = h;
            }
            if ((window as any).Hypher.languages[this._tsb.settings.hyphenLanguage] != null) {
                return this.getWordParts(word);
            }

            console.warn("Hyphenation language '%s' not found", this._tsb.settings.hyphenLanguage);
            return [word];
        }

        (window as any).Hypher.languages[this._tsb.settings.hyphenLanguage].leftMin = this._tsb.settings.hyphenLeftMin + leftOffset;
        (window as any).Hypher.languages[this._tsb.settings.hyphenLanguage].rightMin = this._tsb.settings.hyphenRightMin + rightOffset;

        console.log((window as any).Hypher.languages);
        console.log((window as any).Hypher.languages[this._tsb.settings.hyphenLanguage]);


        return (window as any).Hypher.languages[this._tsb.settings.hyphenLanguage].hyphenate(word);
    }

    /**
     * Get the right and left offset of non-word characters in string.
     * Fx: ,|Hello.$. --> { left: 2, right: 3 }
     *
     * @param   word
     * @returns      Additional word offset
     */
    getWordOffset = function(word: string): any {
        const beginRegex = /^[\W]*/;
        const endRegex = /[\W]*$/;

        let left = 0;
        let right = 0;

        const matchesStart = word.match(beginRegex);
        if (matchesStart) {
            left = matchesStart[0].length;
        }

        const matchesEnd = word.match(endRegex)
        if (matchesEnd) {
            right = matchesEnd[0].length;
        }

        return {
            left,
            right,
        };
    };
}
