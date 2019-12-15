/**
 * The main TypesetBot class handing initializing new instances of TypesetBot.
 */
class TypesetBot {
    // Class instances.
    logger:     TypesetBotLog;
    settings:   TypesetBotSettings;
    query:      TypesetBotElementQuery;
    typesetter: TypesetBotTypeset;
    util:       TypesetBotUtils;

    // Variables.
    uuid: string;
    indexToNodes: { [index: number] : Element[]; } = {};
    indexToTokens: { [index: number]: TypesetBotToken[] } = {};

    /**
     * Constructor of new TypesetBot objects.
     *
     * @param query?    Nodes from a query or query selector
     * @param settings? Custom settings object
     */
    constructor(query?: any, settings?: object) {
        this.util = new TypesetBotUtils(this);
        this.logger = new TypesetBotLog(this);
        this.uuid = TypesetBotUtils.createUUID();

        this.settings = new TypesetBotSettings(this, settings);
        this.query = new TypesetBotElementQuery(this, query);
        this.typesetter = new TypesetBotTypeset(this);

        this.typeset();
    }

    /**
     * Typeset all elements in query.
     */
    typeset = function()  {
        console.log('typesettings init');

        this.typesetNodes(this.query.nodes);
    }

    /**
     * Typeset multiple nodes.
     *
     * @parma nodes
     */
    typesetNodes = function(nodes: Element[]) {
        for (const node of nodes) {
            const typesetter = new TypesetBotTypeset(this);
            typesetter.typeset(node);
        }
    }
}
