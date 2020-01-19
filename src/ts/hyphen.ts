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
        return this.getWordParts(word, offset);
    }

    getHyphen = function(word: string): string[] {
        return (window as any).typesetbot[word];
    }

    setHyphen = function(word: string, parts: string[]) {
        (window as any).typesetbot[word] = parts;
    }

    /**
     * Hyphen word with specific settings.
     * Return array of possible word hyphens.
     * Fx: hyphenation --> ["hyp", "hen", "ation"]
     *
     * @param   word   The word to hyphen
     * @param   offset Addition offset of word
     * @returns        Array of string parts
     */
    getWordParts = function(word: string, offset: TypesetBotWordOffset = null): string[] {
        // Return found result.
        let result = this.getHyphen(word);
        if (result != null) {
            return result;
        }

        if (offset == null) {
            offset = new TypesetBotWordOffset(0, 0);
        }

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

        (window as any).Hypher.languages[this._tsb.settings.hyphenLanguage].leftMin = this._tsb.settings.hyphenLeftMin + offset.left;
        (window as any).Hypher.languages[this._tsb.settings.hyphenLanguage].rightMin = this._tsb.settings.hyphenRightMin + offset.right;

        result = (window as any).Hypher.languages[this._tsb.settings.hyphenLanguage].hyphenate(word)
        this.setHyphen(word, result);
        return result;
    }

    /**
     * Get the right and left offset of non-word characters in string.
     * Fx: ,|Hello.$. --> { left: 2, right: 3 }
     *
     * @param   word The word to check
     * @returns      Additional word offset
     */
    getWordOffset = function(word: string): TypesetBotWordOffset {
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

        return new TypesetBotWordOffset(left, right);
    };

    /**
     * Next word tokens until word is finished.
     * Definition:
     * - A word is at least 1 word node.
     * - A word can have any number of tags tokens and tags don't have to end.
     * - A word ends after a space node.
     *
     * @param   element              The element to typeset
     * @param   tokenIndex           The node index to start constructing words
     * @param   firstWordHyphenIndex Optional hyphenIndex of first node to start from
     * @returns                      The next word represented as one or multiple tokens
     */
    nextWord = function(element: Element, tokenIndex: number, firstWordHyphenIndex: number = null): TypesetBotWordData {
        let str: string = '';
        const indexes: number[] = [];
        let width: number = 0;
        let maxHeight: number = 0;
        let lastWordTokenIndex: number = null;

        const tokens = this._tsb.util.getElementTokens(element);

        let isFinished = false;
        while (!isFinished) {
            const token = tokens[tokenIndex] as TypesetBotToken;
            // Finish loop if there is no more tokens.
            if (token == null) {
                isFinished = true;
                continue;
            }

            switch (token.type) {
                case TypesetBotToken.types.WORD:
                    const word = token as TypesetBotWord;

                    // Update last word token index.
                    lastWordTokenIndex = tokenIndex;

                    if (firstWordHyphenIndex == null) {
                        str += word.text;

                        if (word.width != null) {
                            width += word.width;
                        }

                    } else {
                        // Calculate the post-hyphen word string and width.
                        const cutIndex = word.hyphenIndexPositions[firstWordHyphenIndex];
                        const cut = word.text.substr(cutIndex + 1); // Offset by 1, fx: hy[p]-hen
                        const cutWidth = this.getEndWidth(word.hyphenIndexWidths, firstWordHyphenIndex, word.hyphenRemainWidth);

                        str += cut;
                        width += cutWidth;
                        firstWordHyphenIndex = null; // Reset hyphenIndex
                    }

                    indexes.push(tokenIndex);

                    if (word.height != null && maxHeight < word.height) {
                        maxHeight = word.height;
                    }

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

        return new TypesetBotWordData(str, indexes, tokenIndex, width, maxHeight, lastWordTokenIndex);
    }

    /**
     * Get the width from hyphen index to end of word.
     *
     * Given [3,4], 0, 7    --> 11
     *
     * Fx: hyp-{hen-ation}   from first hyphen
     *     |3|  |4| | 7 |   --> 11
     *
     * @param   hyphenIndexWidths Array of width of the hyphen parts
     * @param   startIndex        Starting hyphen index to measure width from
     * @param   endOfWordWidth    Space between last hyphen position and end of word
     * @returns                   Width between hyphen starting position and end of word
     */
    getEndWidth = function(hyphenIndexWidths: number[], startIndex: number, endOfWordWidth: number): number {
        let width = 0;

        for (let index = startIndex + 1; index < hyphenIndexWidths.length; index++) {
            width += hyphenIndexWidths[index];
        }

        return width + endOfWordWidth;
    }

    /**
     * Calculate hyphens in word and attach hyphen properties to tokens.
     *
     * @param   element
     * @param   wordData Word string and token indexes
     */
    calcWordHyphens = function(element: Element, wordData: TypesetBotWordData) {
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
        let curTokenIndex = 0;
        let curToken = tokens[wordData.indexes[curTokenIndex++]] as TypesetBotWord;
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
                curToken = tokens[wordData.indexes[curTokenIndex++]] as TypesetBotWord;
                curTokenLength += curToken.text.length;
            }

            const hyphenIndex = curHyphenLength - prevLength - 1; // 1 for index offset
            curToken.hyphenIndexPositions.push(hyphenIndex);
        }
    }
}

/**
 * Class representing a word as one of multiple tokens.
 */
class TypesetBotWordData {
    /**
     * @param str                The total string in word
     * @param indexes            Token indexes of word tokens involved in word
     * @param tokenIndex         Next token index
     * @param width              Width of the word with one or multiple tokens
     * @param height             Max height of all tokens involved
     * @param lastWordTokenIndex Index of the last word token in the full appended word, needed for hyphenation
     */
    constructor(
        public str: string,
        public indexes: number[],
        public tokenIndex: number,
        public width: number,
        public height: number,
        public lastWordTokenIndex: number,
    ) { }
}

/**
 * Class representing additional offset on either side of word for hyphenation.
 */
class TypesetBotWordOffset {
    /**
     * @param left  Offset of left side of word
     * @param right Offset of right side of word
     */
    constructor(
        public left: number,
        public right: number,
    ) { }
}
