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
            const elems = document.querySelectorAll(query);
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
     * Requery the elements to typeset.
     */
    updateElements = function() {
        if (this._queryString == null) {
            this._tsb.logger.warn('Can not update elements without a query string.');
            return;
        }

        this.elems = document.querySelectorAll(this._queryString);
    }

    /**
     * Find text blocks in element.
     *
     * @param elem
     */
    indexNodes = function(nodes: Element[]) {
        for (const node of nodes) {
            this.indexNode(node);
        }
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
        if (node.getAttribute('data-tsb-indexed') != null) {
            return;
        }

        node.setAttribute('data-tsb-uuid', this._tsb.uuid);
        node.setAttribute('data-tsb-indexed', this._index);
        this.nodes.push(node);
        this._nodeMap[this._index] = node;
        this._index += 1;
    }
}
