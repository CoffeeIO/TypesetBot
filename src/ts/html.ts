/**
 * Class for constructing HTML code.
 */
class TypesetBotHtml {
    private _tsb: TypesetBot;

    constructor(tsb: TypesetBot) {
        this._tsb = tsb;
    }

    /**
     * Create HTML code from HTML tag object.
     *
     * @param   node        The element to typeset
     * @param   token       The token representing HTML tag
     * @param   forceEndTag Get HTML of end tag, disregarding any tag properties
     * @returns             The HTML string
     */
    createTagHtml = function(node: Element, token: TypesetBotTag, forceEndTag: boolean = false): string {
        const elementNodes = this._tsb.util.getElementNodes(node);
        const tagNode = elementNodes[token.nodeIndex];

        if (token.isEndTag || forceEndTag) {
            return '</' + tagNode.tagName.toLowerCase() + '>';
        }

        let attrText = '';
        for (const attr of tagNode.attributes) {
            attrText += attr.name + '="' + attr.value + '" ';
        }

        return '<' + tagNode.tagName.toLowerCase() + ' ' + attrText + '>';
    }

    /**
     * Get HTMl string of prepended tags on line.
     *
     * @param   element
     * @param   tagStack Array of open tags to repeat
     * @returns          The HTML of tag code
     */
    prependTagTokensOnLine = function(element: Element, tagStack: TypesetBotToken[]): string {
        return this.getTagTokensOnLine(element, tagStack, false);
    }

    /**
     * Get HTML string of appended closing tags on line.
     *
     * @param   element
     * @param   tagStack Array of open tags to close
     * @returns          The HTML of closing tags
     */
    appendTagTokensOnLine = function(element: Element, tagStack: TypesetBotToken[]): string {
        return this.getTagTokensOnLine(element, tagStack, true);
    }

    /**
     * Get HTML string of tags on line.
     *
     * @param   element
     * @param   tagStack     Array of open tags
     * @param   isClosingTag Get the HTML of the closing or opening tags
     * @returns              The HTML of tags
     */
    getTagTokensOnLine = function(element: Element, tagStack: TypesetBotToken[], isClosingTag: boolean): string {
        let html = '';
        for (const tag of tagStack) {
            html += this.createTagHtml(element, tag, isClosingTag);
        }

        return html;
    }

    /**
     * Get HTML of token range.
     *
     * @param   element
     * @param   startIndex       Index of first token
     * @param   startHyphenIndex Hyphenation index for the first word token
     * @param   endIndex         Index of last token
     * @param   endHyphenIndex   Hyphenation index for the last word token
     * @param   tagStack         Stack of open tags
     * @returns                  The HTML string
     */
    getHtmlFromTokensRange = function(
        element: Element,
        startIndex: number,
        startHyphenIndex: number,
        endIndex: number,
        endHyphenIndex: number,
        tagStack: TypesetBotToken[],
    ): string {
        const tokens = this._tsb.util.getElementTokens(element);
        let html = '';

        if (endIndex == null) {
            endIndex = tokens.length;
        }

        // Only the first word token can be hyphenated.
        let isFirstToken = true;

        // Loop all tokens between start and end token.
        for (let index = startIndex; index < endIndex; index++) {
            const token = tokens[index];
            switch (token.type) {
                case TypesetBotToken.types.WORD:
                    const word = token as TypesetBotWord;
                    if (isFirstToken && startHyphenIndex != null) {
                        // Calculate the post-hyphen word string and width.
                        const cutIndex = word.hyphenIndexPositions[startHyphenIndex];
                        const cut = word.text.substr(cutIndex + 1); // Offset by 1, fx: hy[p]-hen
                        html += cut;

                        isFirstToken = false;
                        continue;
                    }

                    html += word.text;
                    break;
                case TypesetBotToken.types.TAG:
                    const tag = token as TypesetBotTag;
                    if (!tag.isEndTag) {
                        tagStack.push(tag);
                    } else {
                        tagStack.pop();
                    }

                    html += this.createTagHtml(element, tag);
                    break;
                case TypesetBotToken.types.SPACE:
                    html += ' ';
                    break;
                default:
                    // Ignore the other node types.
                    this._tsb.logger.error('Unknown token type found: ' + token.type);
                    break;
            }
        }

        // Calculate the pre-hyphen word string and width.
        if (endHyphenIndex != null) {
            const word = tokens[endIndex];
            const cutIndex = word.hyphenIndexPositions[endHyphenIndex];
            const cut = word.text.substr(0, cutIndex + 1);

            html += cut + '<tsb-hyphen></tsb-hyphen>'; // Add dash to html
        }

        return html;
    }
}
