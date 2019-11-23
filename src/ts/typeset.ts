class TypesetBotTypeset {

    tokenizer: TypesetBotTokenizer;
    private _tsb: TypesetBot;

    /**
     * @param tsb Instance of main class
     */
    constructor(tsb: TypesetBot) {
        this._tsb = tsb;
        this.tokenizer = new TypesetBotTokenizer(tsb);
    }

    /**
     * Typeset multiple nodes.
     *
     * @parma nodes
     */
    typesetNodes = function(nodes: Element[]) {
        for (const node of nodes) {
            this.typeset(node);
        }
    }

    /**
     * Typeset single node.
     *
     * @param node
     */
    typeset = function (node: Element) {
        const tokens = this.tokenizer.tokenize(node);
        console.log(tokens);
    }
}
