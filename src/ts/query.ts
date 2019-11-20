/**
 * Class for element querying.
 */
class TypesetBotElementQuery {
    private _tsb: TypesetBot;
    private _queryString: string = null;
    private _index: number = 0;
    private _nodeMap: { [index: number] : Element; } = {};

    nodes: Array<Element> = []; // Or array

    constructor(tsb: TypesetBot, query?: any) {
        this._tsb = tsb;
        this.handleQuery(query);
        this.findTextInElements(this.nodes);
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

        if (typeof query == 'string') {
            this._queryString = query;
            let elems = document.querySelectorAll(query);
            console.log(elems);
            
            for (let elem of elems) {
                this.nodes.push(elem);
            }
            return;
        } else if(typeof query == 'object') {
            if (NodeList.prototype.isPrototypeOf(query)) {
                let elems = query;
                console.log(elems);
                for (let elem of elems) {
                    this.nodes.push(elem);
                }
                return;
            } else if (Node.prototype.isPrototypeOf(query)) {
                console.log(query);
                this.nodes.push(query);
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
    findTextInElements = function(nodes: Array<Element>) {
        for (let node of nodes) {
            this.findTextInElement(node);
        }
    }

    /**
     * Find text blocks in element.
     *
     * @param elem
     */
    findTextInElement = function(node: Element) {
        // Mark node to avoid look at the same element twice.
        if (node.getAttribute('data-tsb-uuid') != null) {
            return;
        }
        if (node.getAttribute('data-tsb-indexed') != null) {
            return;
        }

        node.setAttribute('data-tsb-uuid', this._tsb.uuid);
        node.setAttribute('data-tsb-indexed', this._index);
        this._nodeMap[this._index] = node;
        this._index += 1;

        if (!('childNodes' in node)) {
            return;
        }
        for (let child of node.childNodes) {
            console.log(child);
            
            console.log(child.nodeType);
            
        }
    }


}
