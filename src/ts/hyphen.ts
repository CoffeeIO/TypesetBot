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
            const h = new (window as any).Hypher(module.exports);

            if (typeof module.exports.id === 'string') {
                module.exports.id = [module.exports.id];
            }

            for (let i = 0; i < module.exports.id.length; i += 1) {
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

        return (window as any).Hypher.languages[this._tsb.settings.hyphenLanguage].hyphenate(word);
    }

    /**
     * Get the right and left offset of non-word characters in string.
     * Fx: ,|Hello.$. --> { left: 2, right: 3 }
     *
     * @param   word
     * @returns      Additional word offset { left: number, right: number }
     */
    getWordOffset = function(word: string): object {
        const beginRegex = /^[\W]*/;
        const endRegex = /[\W]*$/;

        let left = 0;
        let right = 0;

        const matchesStart = word.match(beginRegex);
        if (matchesStart) {
            left = matchesStart[0].length;
        }

        const matchesEnd = word.match(endRegex);
        if (matchesEnd) {
            right = matchesEnd[0].length;
        }

        return {
            left,
            right,
        };
    };

    /**
     * Next word tokens until word is finished.
     * Definition:
     * - A word is at least 1 word node.
     * - A word can have any number of tags nodes and tags don't have to end.
     * - A word ends after a space node.
     *
     * @param   element    The element to typeset
     * @param   tokenIndex The node index to start constructing words
     * @returns            The next word represented as one or multiple nodes { str: string, indexes: number[] }
     */
    nextWord = function(element: Element, tokenIndex: number): object {
        let str: string = '';
        const indexes: number[] = [];

        const tokens = this._tsb.util.getElementTokens(element);

        let isFinished = false;
        while (!isFinished) {
            const token = tokens[tokenIndex];
            // Finish loop if there is no more tokens.
            if (token == null) {
                isFinished = true;
                continue;
            }

            switch (token.type) {
                case TypesetBotToken.types.WORD:
                    const word = token as TypesetBotWord;
                    str += word.text;
                    indexes.push(tokenIndex)
                    break;
                case TypesetBotToken.types.TAG:
                    // Ignore.
                    break;
                case TypesetBotToken.types.SPACE:
                    // Only allow word to finish if it is not empty.
                    if (str !== '') {
                        isFinished = true;
                    }
                    break;
                default:
                    // Ignore the other node types.
                    this._tsb.logger.error('Unknown token type found: ' + token.type);
                    break;
            }

            tokenIndex++;
        }

        // Return null if word is empty.
        if (str === '') {
            return null;
        }

        return {
            str,
            indexes,
            tokenIndex,
        };
    }

    /**
     * Calculate hyphens in word and attach hyphen properties to tokens.
     *
     * @param   element
     * @param   wordData Word string and token indexes
     */
    calcWordHyphens = function(element: Element, wordData: any) {
        const hyphens = this.hyphenate(wordData.str);

        // If does not have any hyphens, stop execution.
        if (hyphens.length <= 1) {
            return;
        }

        const tokens = this._tsb.util.getElementTokens(element);
        // Set properties on tokens.
        for (const tokenIndex of wordData.indexes) {
            tokens[tokenIndex].initHyphen();
        }

        const hyphenLengths = TypesetBotUtils.getArrayIndexes(hyphens);
        // First word token.
        let tokenIndex = 0;
        let curToken = tokens[wordData.indexes[tokenIndex++]] as TypesetBotWord;
        let curTokenLength = curToken.text.length;
        let prevLength = 0;
        let curHyphenLength = 0;

        // Add the accurate hyphen indexes to the nodes.
        // Fx: ['hyph', <tag>, 'e', <tag>, 'nation'] --> ['hyp(-)h', <tag>, 'e', </tag>, 'n(-)ation']
        for (const hyphenLength of hyphenLengths) {
            curHyphenLength += hyphenLength;
            // Go to next token until we find a token that contains a hyphen.
            while (curTokenLength < curHyphenLength) {
                prevLength = curTokenLength;
                curToken = tokens[wordData.indexes[tokenIndex++]] as TypesetBotWord;
                curTokenLength += curToken.text.length;
            }

            const hyphenIndex = curHyphenLength - prevLength - 1; // 1 for index offset
            curToken.hyphenIndexPositions.push(hyphenIndex);
        }
    }
}
