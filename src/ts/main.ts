/**
 * The main TypesetBot class handing initializing new instances of TypesetBot.
 */
class TypesetBot {
    private _query?: any;
    private _settings?: object;

    // Class instances.
    logger: TypesetBotLog;
    settings: TypesetBotSettings;
    elementQuery: TypesetBotElementQuery;

    /**
     * Constructor of new TypesetBot objects.
     * 
     * @param query    Nodes from a query or query selector
     * @param settings Custom settings object
     */
    constructor(query?: any, settings?: object) {
        this._query = query;
        this._settings = settings;
        
        this.logger = new TypesetBotLog(this);
        this.settings = new TypesetBotSettings(this, settings);
        this.elementQuery = new TypesetBotElementQuery(this);
    };
}
