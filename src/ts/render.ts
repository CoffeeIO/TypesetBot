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
        node.style.wordSpacing = 'calc((1px * ' + minSpaceSize + ') - ' + defaultWidth + 'px)';
    }

    getWordProperties = function(node: HTMLElement, tokens: TypesetBotToken[]) {
        const elementNodes = this._tsb.util.getElementNodes(node);
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
        return node.getBoundingClientRect().width
    }
}
