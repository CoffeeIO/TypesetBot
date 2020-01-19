/**
 * Class that does complex DOM interactions.
 */
class TypesetBotRender {

    htmlGenerator: TypesetBotHtml;
    private _tsb: TypesetBot;

    constructor(tsb: TypesetBot) {
        this._tsb = tsb;
        this.htmlGenerator = new TypesetBotHtml(tsb);
    }

    /**
     * Get default word space of node.
     *
     * @param   element The node to check
     * @returns         The default word spacing in pixels
     */
    getSpaceWidth = function(element: Element): number {
        const spanNode = document.createElement('SPAN');
        const preTextNode = document.createTextNode('1');
        const postTextNode = document.createTextNode('1');
        const textNode = document.createTextNode(' ');
        const spaceContainer = document.createElement('SPAN');

        spaceContainer.appendChild(textNode);
        spanNode.appendChild(preTextNode);
        spanNode.appendChild(spaceContainer);
        spanNode.appendChild(postTextNode);
        element.appendChild(spanNode);

        const rect = spaceContainer.getBoundingClientRect();
        const width = rect.right - rect.left;
        spanNode.remove();

        return width;
    }

    /**
     * Get word spacing on node to the minimum allowed word spacing for typesetting.
     * This will setup the code for checking how many words can possibly be on a line.
     * This does not reflect how many words should be on any given line.
     *
     * @param element
     */
    setMinimumWordSpacing = function(element: HTMLElement) {
        const minSpaceSize = this._tsb.settings.spaceWidth - this._tsb.settings.spaceShrinkability;
        const defaultWidth = this.getSpaceWidth(element);

        element.style.wordSpacing = 'calc((1em * ' + minSpaceSize + ') - ' + defaultWidth + 'px)';
    }

    /**
     * Get rendering dimensions of words in element.
     *
     * @param element
     */
    getWordProperties = function(element: HTMLElement) {
        const tokens = this._tsb.util.getElementTokens(element);
        const backupHtml = element.innerHTML;
        const renderIndexToToken: { [index: number] : TypesetBotToken; } = {};
        let html = '';
        let currentIndex = 0;

        this._tsb.logger.start('------ Build HTML');
        for (const token of tokens) {
            switch (token.type) {
                case TypesetBotToken.types.WORD:
                    const word = token as TypesetBotWord;

                    renderIndexToToken[currentIndex] = token;
                    currentIndex += 1;
                    html += '<span class="typeset-word-node">' + word.text + '</span>';
                    break;
                case TypesetBotToken.types.TAG:
                    const tag = token as TypesetBotTag;
                    html += this.htmlGenerator.createTagHtml(element, tag);
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
        this._tsb.logger.end('------ Build HTML');


        this._tsb.logger.start('------ Update DOM');
        element.innerHTML = html;
        this._tsb.logger.end('------ Update DOM');

        this._tsb.logger.start('------ Query DOM');
        const renderedWordNodes = element.querySelectorAll('.typeset-word-node');
        this._tsb.logger.end('------ Query DOM');

        this._tsb.logger.start('------ Get Properties');
        let renderIndex = 0;
        for (const renderedWordNode of renderedWordNodes) {
            const wordToken = renderIndexToToken[renderIndex] as TypesetBotWord;
            wordToken.width = renderedWordNode.getBoundingClientRect().width;
            wordToken.height = renderedWordNode.getBoundingClientRect().height;

            renderIndex += 1;
        }
        this._tsb.logger.end('------ Get Properties');


        this._tsb.logger.start('------ Update DOM');
        element.innerHTML = backupHtml;
        this._tsb.logger.end('------ Update DOM');

    }

    /**
     * Get default font size of element.
     *
     * @param   element
     * @returns         The font size in pixels as number
     */
    getDefaultFontSize = function(element: HTMLElement) : number {
        const fontSize = window.getComputedStyle(element).fontSize;

        // Remove pixels from output and convert to number.
        return Number(fontSize.replace('px', ''));
    }

    /**
     * Get width of node.
     *
     * @param   element
     * @returns         The width of node in pixels as number
     */
    getNodeWidth = function(element: HTMLElement): number {
        return element.getBoundingClientRect().width;
    }

    /**
     * Get rendering dimensions of words and word parts for hyphenation.
     *
     * @param element
     */
    getHyphenProperties = function(element: HTMLElement) {
        const tokens = this._tsb.util.getElementTokens(element);
        const backupHtml: string = element.innerHTML;
        let html: string = '';
        // Array of objects in dom to inspect.
        const renderRequest: any[] = [];

        // Loop tokens to build HTML.
        for (const token of tokens) {
            switch (token.type) {
                case TypesetBotToken.types.WORD:
                    const word = token as TypesetBotWord;
                    let lastIndex = 0;

                    // Skip if word has not hyphens
                    if (!word.hasHyphen) {
                        continue;
                    }
                    // Queue hyphenation parts or word.
                    for (const hyphenIndex of word.hyphenIndexPositions) {
                        const cut = word.text.substring(lastIndex, hyphenIndex + 1);
                        lastIndex = hyphenIndex + 1;

                        html += '<span class="typeset-hyphen-check">' + cut + '</span>';
                        renderRequest.push({
                            token,
                            type: 'hyphen',
                        });
                    }
                    // Queue remain (if any), fx 'phen'.
                    if (word.text.length !== lastIndex) {
                        const cut = word.text.substr(lastIndex);
                        html += '<span class="typeset-hyphen-check">' + cut + '</span>';
                        renderRequest.push({
                            token,
                            type: 'remain',
                        });
                    }

                    // Queue dash, '-'.
                    html += '<span class="typeset-hyphen-check">-</span>';
                    renderRequest.push({
                        token,
                        type: 'dash',
                    });

                    break;
                case TypesetBotToken.types.TAG:
                    const tag = token as TypesetBotTag;
                    html += this.htmlGenerator.createTagHtml(element, tag);
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

        element.innerHTML = html;

        const renderedHyphenNodes = element.querySelectorAll('.typeset-hyphen-check');

        // Loop elements from DOM.
        let renderIndex = 0;
        for (const renderedHyphenNode of renderedHyphenNodes) {
            const request = renderRequest[renderIndex++];
            const token = request.token as TypesetBotWord;

            // Get width of requested element and insert to correct type.
            const width = renderedHyphenNode.getBoundingClientRect().width;
            switch (request.type) {
                case 'hyphen':
                    token.hyphenIndexWidths.push(width);
                    break;
                case 'remain':
                    token.hyphenRemainWidth = width;
                case 'dash':
                    token.dashWidth = width;
                    break;
                default:
                    this._tsb.logger.error('Unknown request object type found: ' + request.type);
                    break;
            }
        }

        element.innerHTML = backupHtml;
    }

    /**
     * Apply linebreaks of solution to element.
     *
     * @param element
     * @param finalBreakpoint The breakpoint of the final line in solution
     */
    applyLineBreaks = function(element: Element, finalBreakpoint: TypesetBotLinebreak) {
        this._tsb.logger.start('-- Apply breakpoints');

        const lines = [];
        let pointer = finalBreakpoint;

        let isFinished = false;
        // Construct array of all lines.
        while (!isFinished) {
            if (pointer == null) {
                isFinished = true;
                continue;
            }

            lines.push(pointer);

            pointer = pointer.origin;
        }

        // Ignore first line element, as it's always the same.
        lines.pop();
        // Reverse lines, so first line appears first.
        lines.reverse();

        let html = '';
        let curTokenIndex = 0;
        let lastHyphenIndex = null;
        // Fifo stack of open html tags.
        const tagStack: TypesetBotToken[] = [];

        // Construct the lines.
        for (const line of lines) {
            let lineHtml = '';

            lineHtml += this.prependTagTokensOnLine(element, tagStack);
            lineHtml += this.getHtmlFromTokensRange(
                element,
                curTokenIndex,
                lastHyphenIndex,
                line.tokenIndex,
                line.hyphenIndex,
                tagStack,
            );
            lineHtml += this.appendTagTokensOnLine(element, tagStack);

            curTokenIndex = line.tokenIndex;
            lastHyphenIndex = line.hyphenIndex;

            html +=
                '<tsb-line line="' + line.lineNumber + '" style="height:' + line.maxLineHeight + 'px">' +
                    lineHtml +
                '</tsb-line>';
        }

        element.innerHTML = html;
        this.setJustificationClass(element);


        this._tsb.logger.end('-- Apply breakpoints');
    }

    /**
     * Add text justification class to element.
     *
     * @param element
     */
    setJustificationClass = function(element: Element) {
        // @todo : remove any existing typesetbot classes.

        switch (this._tsb.settings.alignment) {
            case 'justify':
                element.classList.add('typesetbot-justify');
                break;
            case 'left':
                element.classList.add('typesetbot-left');
                break;
            case 'right':
                element.classList.add('typesetbot-right');
                break;
            case 'center':
                element.classList.add('typesetbot-center');
                break;
            default:
                this._tsb.logger.notice('Unknown alignment type: ' + this._tsb.settings.alignment);
                break;
        }

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
            html += this.htmlGenerator.createTagHtml(element, tag, isClosingTag);
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
            endIndex = tokens.length - 1;
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

                    html += this.htmlGenerator.createTagHtml(element, tag);
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

            html += cut + '-'; // Add dash to html
        }

        return html;
    }
}
