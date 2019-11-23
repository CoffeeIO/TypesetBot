/**
 * The main TypesetBot class handing initializing new instances of TypesetBot.
 */
class TypesetBot {
    // Class instances.
    logger:     TypesetBotLog;
    settings:   TypesetBotSettings;
    query:      TypesetBotElementQuery;
    typesetter: TypesetBotTypeset;

    // Variables.
    uuid: string;

    /**
     * Constructor of new TypesetBot objects.
     *
     * @param query?    Nodes from a query or query selector
     * @param settings? Custom settings object
     */
    constructor(query?: any, settings?: object) {
        this.logger = new TypesetBotLog(this);
        this.uuid = TypesetBotUtils.createUUID();

        this.settings = new TypesetBotSettings(this, settings);
        this.query = new TypesetBotElementQuery(this, query);
        this.typesetter = new TypesetBotTypeset(this);
    }

    /**
     * Typeset all elements in query.
     */
    typeset = function()  {
        this.typesetter.typesetNodes(this.query.nodes);
    }
}
