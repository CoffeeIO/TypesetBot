class TypesetBotTypeset {
    private _tsb: TypesetBot;

    tokenizer: TypesetBotTokenizer;

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
    typesetNodes = function(nodes: Array<Element>) {
        for (let node of nodes) {
            this.typeset(node);
        }
    }

    /**
     * Typeset single node.
     *
     * @param node
     */
    typeset = function (node: Element) {
        let tokens = this.tokenizer.tokenize(node);
        console.log(tokens);
    }
}
