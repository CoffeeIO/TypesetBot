class TypesetBot {
    query : any;
    settings? : object;

    constructor(query : any, settings? : object) {
        this.query = query;
        this.settings = settings;
    };

    getQuery = function() : any {
        return this.query;
    };
}
  