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
     * @param   node  The element to typeset
     * @param   token The token representing HTML tag
     * @returns       The HTML string
     */
    createTagHtml = function(node: Element, token: TypesetBotTag, forceEndTag: boolean = false): string {
        const elementNodes = this._tsb.util.getElementNodes(node);
        const tagNode = elementNodes[token.nodeIndex];

        if (token.isEndTag || forceEndTag) {
            return '</' + tagNode.tagName.toLowerCase() + '>';
        } else {
            let attrText = '';
            for (const attr of tagNode.attributes) {
                attrText += attr.name + '="' + attr.value + '" ';
            }

            return '<' + tagNode.tagName.toLowerCase() + ' ' + attrText + '>';
        }
    }
}
