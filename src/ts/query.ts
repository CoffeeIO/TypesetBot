/**
 * Class for element querying.
 */
class TypesetBotElementQuery {
    private _tsb: TypesetBot;
    private _queryString: string = null;
    elems: NodeList; // Or array

    constructor(tsb: TypesetBot, query?: any) {
        this._tsb = tsb;
        this.handleQuery(query);
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
            this.elems = document.querySelectorAll(query);
            return;
        } else if(typeof query == 'object') {
            if (NodeList.prototype.isPrototypeOf(query)) {
                this.elems = query;
                return;
            } else if (Node.prototype.isPrototypeOf(query)) {
                this.elems = [query];
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




}
