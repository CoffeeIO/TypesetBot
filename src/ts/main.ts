/**
 * The main TypesetBot class handing initializing new instances of TypesetBot.
 */
class TypesetBot {
    // Class instances.
    logger: TypesetBotLog;
    settings: TypesetBotSettings;
    query: TypesetBotElementQuery;
    utils: TypesetBotUtils;
    tokenizer: TypesetBotTokenizer;

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
        this.uuid = this.utils.createUUID();

        this.settings = new TypesetBotSettings(this, settings);
        this.query = new TypesetBotElementQuery(this, query);

        this.tokenizer = new TypesetBotTokenizer(this);
    };

    typeset = function() {
        this.token.tokenizeNodes(this.query.nodes);
    }
}
