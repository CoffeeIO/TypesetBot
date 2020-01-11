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
     * @param node The node to check
     * @returns    The default word spacing in pixels
     */
    getSpaceWidth = function(node: Element): number {
        const spanNode = document.createElement('SPAN');
        const preTextNode = document.createTextNode('1');
        const postTextNode = document.createTextNode('1');
        const textNode = document.createTextNode(' ');
        const spaceContainer = document.createElement('SPAN');

        spaceContainer.appendChild(textNode);
        spanNode.appendChild(preTextNode);
        spanNode.appendChild(spaceContainer);
        spanNode.appendChild(postTextNode);
        node.appendChild(spanNode);

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
     * @param node
     */
    setMinimumWordSpacing = function(node: HTMLElement) {
        const minSpaceSize = this._tsb.settings.spaceWidth - this._tsb.settings.spaceShrinkability;
        const defaultWidth = this.getSpaceWidth(node);

        node.style.wordSpacing = 'calc((1em * ' + minSpaceSize + ') - ' + defaultWidth + 'px)';
    }

    getWordProperties = function(node: HTMLElement) {
        const tokens = this._tsb.util.getElementTokens(node);
        const backupHtml = node.innerHTML;
        const renderIndexToToken: { [index: number] : TypesetBotToken; } = {};
        let html = '';
        let currentIndex = 0;

        this._tsb.logger.start('------ Build HTML');
        for (const token of tokens) {
            switch (token.type) {
                case TypesetBotToken.types.WORD:
                    const word = token as TypesetBotWord;
                    // const wordNode = elementNodes[token.nodeIndex];
                    renderIndexToToken[currentIndex] = token;
                    currentIndex += 1;
                    html += '<span class="typeset-word-node">' + word.text + '</span>';
                    break;
                case TypesetBotToken.types.TAG:
                    const tag = token as TypesetBotTag;
                    html += this.htmlGenerator.createTagHtml(node, tag);
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
        node.innerHTML = html;
        this._tsb.logger.end('------ Update DOM');

        this._tsb.logger.start('------ Query DOM');
        const renderedWordNodes = node.querySelectorAll('.typeset-word-node');
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
        node.innerHTML = backupHtml;
        this._tsb.logger.end('------ Update DOM');

    }

    /**
     * Get default font size of element.
     *
     * @param   node
     * @returns      The font size in pixels as number
     */
    getDefaultFontSize = function(node: HTMLElement) : number {
        const fontSize = window.getComputedStyle(node).fontSize;

        // Remove pixels from output and convert to number.
        return Number(fontSize.replace('px', ''));
    }

    /**
     * Get width of node.
     *
     * @param   node
     * @returns      The width of node in pixels as number
     */
    getNodeWidth = function(node: HTMLElement): number {
        return node.getBoundingClientRect().width;
    }

    /**
     *
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

    applyLineBreaks = function(element: Element, finalBreakpoint: TypesetBotLinebreak) {
        this._tsb.logger.start('-- Apply breakpoints');

        const lines = [];
        let isFinished = false;

        let pointer = finalBreakpoint;
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

            // console.log(line.tokenIndex + ' : ' + line.hyphenIndex);


            lineHtml += this.prependTagTokensOnLine(element, tagStack);
            lineHtml += this.getHtmlFromTokensRange(
                element,
                curTokenIndex,
                lastHyphenIndex,
                line.tokenIndex,
                tagStack,
                line.hyphenIndex,
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

    prependTagTokensOnLine = function(element: Element, tagStack: TypesetBotToken[]): string {
        let html = '';
        for (const tag of tagStack) {
            html += this.htmlGenerator.createTagHtml(element, tag);
        }

        return html;
    }

    appendTagTokensOnLine = function(element: Element, tagStack: TypesetBotToken[]) {
        let html = '';
        for (const tag of tagStack) {
            html += this.htmlGenerator.createTagHtml(element, tag, true);
        }

        return html;
    }

    getHtmlFromTokensRange = function(
        element: Element,
        startIndex: number,
        startHyphenIndex: number,
        endIndex: number,
        tagStack: TypesetBotToken[],
        endHyphenIndex: number = null,
    ) {
        const tokens = this._tsb.util.getElementTokens(element);
        let html = '';

        if (endIndex == null) {
            endIndex = tokens.length - 1;
        }

        let isFirstToken = true;


        for (let index = startIndex; index < endIndex; index++) {
            // console.log('-->' + index);


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


                    // if (index === (endIndex - 1) && endHyphenIndex != null) {


                    //     continue;
                    // }

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

        if (endHyphenIndex != null) {
            const word = tokens[endIndex];
            const cutIndex = word.hyphenIndexPositions[endHyphenIndex];
            let cut = word.text.substr(0, cutIndex + 1);

            // console.log('Cut: ' + cut);


            html += cut + '-'; // Add dash to html
        }

        return html;
    }
}
