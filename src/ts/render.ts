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
     * Reset attributes on elements.
     *
     * @param   element The node to check
     */
    reset = function(element: HTMLElement) {
        element.removeAttribute('data-tsb-indexed');
        element.removeAttribute('data-tsb-uuid');
        element.removeAttribute('data-tsb-word-spacing');
        this.removeJustificationClass(element);
        element.style.wordSpacing = '';
    }

    /**
     * Get default word space of node.
     *
     * @param   element The node to check
     * @returns         The default word spacing in pixels
     */
    getSpaceWidth = function(element: Element): number {
        const spanNode = document.createElement('TSB-NONE');
        const preTextNode = document.createTextNode('1');
        const postTextNode = document.createTextNode('1');
        const textNode = document.createTextNode(' ');
        const spaceContainer = document.createElement('TSB-NONE');

        spaceContainer.appendChild(textNode);
        spanNode.appendChild(preTextNode);
        spanNode.appendChild(spaceContainer);
        spanNode.appendChild(postTextNode);

        element.prepend(spanNode);

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
        if (element.getAttribute('data-tsb-word-spacing')) {
            return;
        }

        const minSpaceSize = this._tsb.settings.spaceWidth - this._tsb.settings.spaceShrinkability;
        const defaultWidth = this.getSpaceWidth(element);

        element.setAttribute('data-tsb-word-spacing', 'true')
        element.style.wordSpacing = 'calc((1em * ' + minSpaceSize + ') - ' + defaultWidth + 'px)';
    }

    /**
     * Get default font size of element.
     *
     * @param   element
     * @returns         The font size in pixels as number
     */
    getDefaultFontSize = function(element: HTMLElement) : number {
        return this.getNodeStyleNumber(element, 'font-size');
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
     * Get style property of element.
     *
     * @param   element  The element
     * @param   property The property name
     * @returns          The rendered style property
     */
    getNodeStyle = function(element: HTMLElement, property: string): string {
        return window.getComputedStyle(element).getPropertyValue(property);
    }

    /**
     * Get style property of element as Number without px postfix.
     *
     * @param   element  The element
     * @param   property The property name
     * @returns          The rendered style property
     */
    getNodeStyleNumber = function(element: HTMLElement, property: string): number {
        return Number(this.getNodeStyle(element, property).replace('px', ''));
    }

    /**
     * Get line height of element.
     *
     * @param element
     */
    getLineHeight = function(element: HTMLElement) {
        let lineHeight = this.getNodeStyle(element, 'line-height');
        if (lineHeight === 'normal') {
            // Make line height relative to font size.
            const fontSize = this.getNodeStyleNumber(element, 'font-size');
            lineHeight = 1.2 * fontSize; // 1.2 em
        } else {
            // Format number.
            lineHeight = Number(lineHeight.replace('px', ''));
        }

        return lineHeight;
    }

    /**
     * Add text justification class to element.
     *
     * @param element
     */
    setJustificationClass = function(element: Element) {
        this.removeJustificationClass(element);

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
                this._tsb.logger.warn('Unknown alignment type: ' + this._tsb.settings.alignment);
                break;
        }
    }

    /**
     * Remove all justification classes from element.
     *
     * @param element The element
     */
    removeJustificationClass = function(element: Element) {
        element.classList.remove('typesetbot-justify', 'typesetbot-left', 'typesetbot-right', 'typesetbot-center');
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
                    html += '<tsb-none class="typeset-word-node">' + word.text + '</tsb-none>';
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
            wordToken.height = this.getLineHeight(renderedWordNode);

            renderIndex += 1;
        }
        this._tsb.logger.end('------ Get Properties');


        this._tsb.logger.start('------ Update DOM');
        element.innerHTML = backupHtml;
        this._tsb.logger.end('------ Update DOM');
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

                        html += '<tsb-none class="typeset-hyphen-check">' + cut + '</tsb-none>';
                        renderRequest.push({
                            token,
                            type: 'hyphen',
                        });
                    }
                    // Queue remain (if any), fx 'phen'.
                    if (word.text.length !== lastIndex) {
                        const cut = word.text.substr(lastIndex);
                        html += '<tsb-none class="typeset-hyphen-check">' + cut + '</tsb-none>';
                        renderRequest.push({
                            token,
                            type: 'remain',
                        });
                    }

                    // Queue dash, '-'.
                    html += '<tsb-none class="typeset-hyphen-check">-</tsb-none>';
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
     * @param finalBreakpoint   The breakpoint of the final line in solution
     * @param defaultLineHeight
     */
    applyLineBreaks = function(element: Element, finalBreakpoint: TypesetBotLinebreak, defaultLineHeight: number) {
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

            lineHtml += this.htmlGenerator.prependTagTokensOnLine(element, tagStack);
            lineHtml += this.htmlGenerator.getHtmlFromTokensRange(
                element,
                curTokenIndex,
                lastHyphenIndex,
                line.tokenIndex,
                line.hyphenIndex,
                tagStack,
            );
            lineHtml += this.htmlGenerator.appendTagTokensOnLine(element, tagStack);

            curTokenIndex = line.tokenIndex;
            lastHyphenIndex = line.hyphenIndex;

            let lineHeight = line.maxLineHeight;
            if (lineHeight == null || lineHeight == 0) {
                lineHeight = defaultLineHeight;
            }

            var attr = '';
            if (this._tsb.settings.debug) {
                attr += 'typeset-bot-line="' + line.lineNumber + '" ';
                attr += 'typeset-bot-ratio="' + line.ratio + '" ';
            }

            html +=
                '<tsb-line ' + attr + ' style="height:' + lineHeight + 'px">' +
                    lineHtml +
                '</tsb-line>';
        }

        element.innerHTML = html;
        this.setJustificationClass(element);


        this._tsb.logger.end('-- Apply breakpoints');
    }
}
