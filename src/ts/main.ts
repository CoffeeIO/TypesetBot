/**
 * The main TypesetBot class handing initializing new instances of TypesetBot.
 */
class TypesetBot {
    // Class instances.
    logger: TypesetBotLog;
    settings: TypesetBotSettings;
    elementQuery: TypesetBotElementQuery;
    utils: TypesetBotUtils;

    uuid: string;

    /**
     * Constructor of new TypesetBot objects.
     * 
     * @param query    Nodes from a query or query selector
     * @param settings Custom settings object
     */
    constructor(query?: any, settings?: object) {        
        this.logger = new TypesetBotLog(this);
        this.utils = new TypesetBotUtils(this);
        this.uuid = this.utils.create_UUID();
        
        this.settings = new TypesetBotSettings(this, settings);
        this.elementQuery = new TypesetBotElementQuery(this, query);
        
    };
}
