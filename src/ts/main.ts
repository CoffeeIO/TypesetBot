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
    isTypesetting: boolean;
    indexToNodes: { [index: number] : Element[]; } = {};
    indexToTokens: { [index: number]: TypesetBotToken[] } = {};
    indexToTypesetInstance: { [index: number] : TypesetBotTypeset } = {};

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

        this.addEventListeners();
        this.typeset();
    }

    /**
     * Typeset all elements in query.
     */
    typeset = function()  {
        this.logger.resetTime();

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

    addEventListeners = function() {
        // Store instances in window to allow eventlisteners access.
        if ((window as any)['typesetbot--instances'] == null) {
            (window as any)['typesetbot--instances'] = [];
        }
        (window as any)['typesetbot--instances'].push(this);

        const index = (window as any)['typesetbot--instances'].length - 1;

        document.body.addEventListener('typesetbot-viewport--reize', function() {
            (window as any)['typesetbot--instances'][index].typeset();
        }, false);
    }

    /**
     * Typeset multiple nodes.
     *
     * @parma nodes
     */
    typesetNodes = function(nodes: Element[]) {
        if (this.isTypesetting) {
            this.logger.warn('Cannot typeset paragraph before calculations are done.');
            return;
        }
        this.isTypesetting = true;
        for (const node of nodes) {
            const typesetter = this.util.getTypesetInstance(node) as TypesetBotTypeset;
            typesetter.typeset(node);
        }
        this.isTypesetting = false;
    }
}
