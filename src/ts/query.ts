/**
 * Class for element querying.
 */
class TypesetBotElementQuery {

    nodes: Element[] = [];

    private _tsb: TypesetBot;
    private _queryString: string = null;
    private _index: number = 0;
    private _nodeMap: { [index: number] : Element; } = {};
    private _nodesTemp: Element[] = [];

    constructor(tsb: TypesetBot, query?: any) {
        this._tsb = tsb;
        this.handleQuery(query);
        this.indexNodes(this._nodesTemp);
    }

    /**
     * Handle multiple type of queries.
     *
     * @param query The query string, Node or NodeList
     */
    handleQuery = function(query?: any) {
        if (query == null) {
            return;
        }

        if (typeof query === 'string') {
            this._queryString = query;
            const elems = document.querySelectorAll(this._queryString);
            if (elems == null) {
                return;
            }
            for (const elem of elems) {
                this._nodesTemp.push(elem);
            }
            return;
        } else if (typeof query === 'object') {
            if (NodeList.prototype.isPrototypeOf(query)) {
                for (const elem of query) {
                    this._nodesTemp.push(elem);
                }
                return;
            } else if (Node.prototype.isPrototypeOf(query)) {
                this._nodesTemp.push(query);
                return;
            }
        }

        this._tsb.logger.warn('Unknown type of query used.');
    }

    /**
     * Requery elements.
     */
    requery = function() {
        if (this._queryString == null) {
            this._tsb.logger.warn('Can not requery since query string was not used.');
            return;
        }

        this._nodesTemp = [];
        const elems = document.querySelectorAll(this._queryString);
        if (elems == null) {
            return;
        }
        for (const elem of elems) {
            this._nodesTemp.push(elem);
        }

        this.indexNodes(this._nodesTemp);
    }

    /**
     * Find text blocks in element.
     *
     * @param elem
     */
    indexNodes = function(nodes: Element[]) {
        this.removeNodesNotInDom();

        for (const node of nodes) {
            this.indexNode(node);
        }
    }

    /**
     * Remove any queried Node no longer in DOM.
     */
    removeNodesNotInDom = function() {
        const newNodes: NodeList[] = [];
        for (const node of this.nodes) {
            if (document.body.contains(node)) {
                newNodes.push(node);
            }
        }
        this.nodes = newNodes;
    }

    /**
     * Find text blocks in element.
     *
     * @param elem
     */
    indexNode = function(node: Element) {
        // Mark node with unique TypesetBot id.
        if (node.getAttribute('data-tsb-uuid') != null) {
            return;
        }
        // Mark node to avoid look at the same element twice.
        if (this._tsb.util.getElementIndex(node) != null) {
            return;
        }

        this._tsb.util.setElementIndex(node, this._index);
        node.setAttribute('data-tsb-uuid', this._tsb.uuid);
        this.nodes.push(node);
        this._nodeMap[this._index] = node;
        this._index += 1;
    }
}
