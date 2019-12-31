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
        this.settings = new TypesetBotSettings(this, settings);
        this.logger = new TypesetBotLog(this);
        this.uuid = TypesetBotUtils.createUUID();

        this.query = new TypesetBotElementQuery(this, query);
        this.typesetter = new TypesetBotTypeset(this);

        this.typeset();
    }

    /**
     * Typeset all elements in query.
     */
    typeset = function()  {
        console.log('typesettings init');

        this.logger.start('Typeset');
        this.typesetNodes(this.query.nodes);
        this.logger.end('Typeset');

        // Log the time diffs.

        this.logger.diff('Typeset');
        this.logger.diff('-- Preprocess');
        this.logger.diff('---- Clone working node');
        this.logger.diff('---- Tokenize text');
        this.logger.diff('---- Get render size of words');
        this.logger.diff('------ Build HTML');
        this.logger.diff('------ Update DOM');
        this.logger.diff('------ Query DOM');
        this.logger.diff('------ Get Properties');
        this.logger.diff('---- Getting element properties');
        this.logger.diff('---- Hyphen calc');
        this.logger.diff('---- Hyphen render');
        this.logger.diff('---- other');
        this.logger.diff('-- Dynamic programming');
        this.logger.diff('-- Finding solution');
        this.logger.diff('-- Apply breakpoints');
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
