class TypesetBotHtml {
    private _tsb: TypesetBot;

    constructor(tsb: TypesetBot) {
        this._tsb = tsb;
    }

    createTagHtml = function(node: Element, token: TypesetBotTag): string {
        const elementNodes = this._tsb.util.getElementNodes(node);
        const tagNode = elementNodes[token.nodeIndex];

        console.log(token);
        console.log(elementNodes);
        console.log(tagNode);

        if (token.isEndTag) {
            console.log('</' + tagNode.tagName.toLowerCase() + '>');
            return '</' + tagNode.tagName.toLowerCase() + '>';
        } else {
            let attrText = '';
            for (const attr of tagNode.attributes) {
                attrText += attr.name + '=' + attr.value + ' ';
            }

            console.log('<' + tagNode.tagName.toLowerCase() + ' ' + attrText + '>');
            return '<' + tagNode.tagName.toLowerCase() + ' ' + attrText + '>';
        }
    }
}
