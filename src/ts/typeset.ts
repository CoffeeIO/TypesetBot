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
    typeset = function(node: Element) {
        // Tokenize nodes and store them.
        const tokens = this.tokenizer.tokenize(node);
        this.appendToTokenMap(node, tokens);


    }

    /**
     * Add tokens to map for specific node.
     *
     * @param root
     * @param tokens
     */
    appendToTokenMap = function(root: Element, tokens: TypesetBotToken) {
        if (TypesetBotUtils.getElementIndex(root) == null) {
            this._tsb.logger.error('Root node is not indexed');
            this._tsb.logger.error(root);
            return;
        }

        const index = TypesetBotUtils.getElementIndex(root);
        this._tsb.indexToTokens[index] = tokens;
    }
}
