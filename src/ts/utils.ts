/**
 * Class for utility functions.
 */
class TypesetBotUtils {
    private _tsb: TypesetBot;

    /**
     * @param tsb Instance of main class
     */
    constructor(tsb: TypesetBot) {
        this._tsb = tsb;
    }

    /**
     * Create UUID.
     *
     * @returns UUID
     */
    static createUUID = function(): string {
        let dt = new Date().getTime();
        const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            const r = (dt + Math.random()*16)%16 | 0;
            dt = Math.floor(dt/16);
            return (c=='x' ? r :(r&0x3|0x8)).toString(16);
        });
        return uuid;
    }

    /**
     * Check if node is visible in dom.
     *
     * @returns True if visible, otherwise return false
     */
    static isVisible = function(node: Element): boolean {
        const elem = node as HTMLElement;
        return !!( elem.offsetWidth || elem.offsetHeight || elem.getClientRects().length );
    }

    /**
     * Take a string array and return array of string length and ignore last element.
     * Fx: ["hyp", "hen", "ation"] --> [3, 3].
     *
     * @param   arr Array of word parts
     * @returns     Array of word parts length
     */
    static getArrayIndexes = function(arr: string[]): number[] {
        const indexes = [];

        for (let i = 0; i < arr.length - 1; i++) {
            indexes.push(arr[i].length);
        }

        return indexes;
    };

    /**
     * Set index on node.
     *
     * @param node  The node to set index on
     * @param index The index to set
     */
    setElementIndex = function(node: Element, index: number) {
        node.setAttribute('data-tsb-indexed', '' + index);
    }

    /**
     * Get index of queried node.
     *
     * @param node The node to get index of
     * @returns    The index of the node, otherwise null
     */
    getElementIndex = function(node: Element): number {
        if (node.getAttribute('data-tsb-indexed') == null) {
            return null;
        }

        const indexString = node.getAttribute('data-tsb-indexed');
        const index = parseInt(indexString);
        // Check NaN and if information is lost in integer parsing.
        if (isNaN(index) || index.toString() !== indexString) {
            this._tsb.logger.error('Element has attribute "data-tsb-indexed", but could not parse it.');
            this._tsb.logger.error(node);
            return null;
        }

        return index;
    }

    /**
     * Get nodes of element.
     *
     * @param   node
     * @returns      Array of nodes
     */
    getElementNodes = function(node: Element): Element[] {
        const index = this.getElementIndex(node);
        if (isNaN(index)) {
            this._tsb.logger.error('Could not find nodes to element.');
        }
        return this._tsb.indexToNodes[index];
    }

    /**
     * Get tokens of element.
     *
     * @param   node
     * @returns      Array of tokens
     */
    getElementTokens = function(node: Element): TypesetBotToken[] {
        const index = this.getElementIndex(node);
        if (isNaN(index)) {
            this._tsb.logger.error('Could not find nodes to element.');
            return null;
        }
        return this._tsb.indexToTokens[index];
    }

    /**
     * Get existing instance of typesetting for particular element.
     *
     * @param   element
     * @returns         Existing typset instance, otherwise return new instance
     */
    getTypesetInstance = function(node: Element): TypesetBotTypeset {
        const index = this.getElementIndex(node);
        if (index == null) {
            return null;
        }

        if (this._tsb.indexToTypesetInstance[index] == null) {
            const typeset = new TypesetBotTypeset(this._tsb);
            this._tsb.indexToTypesetInstance[index] = typeset;
        }

        return this._tsb.indexToTypesetInstance[index];
    }

    /**
     * Add tokens to map for specific node.
     *
     * @param root
     * @param tokens
     */
    appendToTokenMap = function(root: Element, tokens: TypesetBotToken[]) {
        if (this.getElementIndex(root) == null) {
            this._tsb.logger.error('Root node is not indexed');
            this._tsb.logger.error(root);
            return;
        }

        const index = this.getElementIndex(root);
        this._tsb.indexToTokens[index] = tokens;
    }

}
