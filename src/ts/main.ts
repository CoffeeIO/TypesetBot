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
    isWatching: boolean;
    indexToNodes: { [index: number] : Element[]; } = {};
    indexToTokens: { [index: number]: TypesetBotToken[] } = {};
    indexToTypesetInstance: { [index: number] : TypesetBotTypeset } = {};

    // Calculated word hyphens store.
    // hyphenStore['en-us']['hyphenation'] = ["hy", "phen", "ate"]
    hyphenStore: { [lang: string] : { [word: string] : string[] } } = {};

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
        this.isWatching = true;
        this.typeset();
    }

    /**
     * Typeset all elements in query.
     */
    typeset = function(force: boolean = false)  {
        if (force || this.isWatching) {
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
    }

    /**
     * Force single rerun of typesetting.
     */
    rerun = function() {
        this.typeset(true);
    }

    /**
     * Query selector again and run typesetting.
     */
    requery = function() {
        this.query.requery();
        this.typeset(true);
    }

    /**
     * Watch nodes for typesetting if not already watching.
     */
    watch = function() {
        this.isWatching = true;
    }

    /**
     * Unwatch nodes for typesetting.
     */
    unwatch = function() {
        this.isWatching = false;
    }

    /**
     * Terminate watching nodes and clear up data.
     */
    terminate = function() {
        if (this.isTypesetting) {
            this.logger.warn('Cannot typeset paragraph before calculations are done.');
            return;
        }
        this.isTypesetting = true;
        for (const node of this.query.nodes) {
            let typesetter = this.util.getTypesetInstance(node) as TypesetBotTypeset;

            // Reset
            typesetter.reset(node);
            typesetter = null;
        }
        this.isTypesetting = false;

        this.unwatch();

        // Clear objects.
        this.indexToNodes = null;
        this.indexToNodes = null;
        this.indexToTokens = null;
        this.indexToTypesetInstance = null;
        this.hyphenStore = null;

        this.logger = null;
        this.settings = null;
        this.query = null;
        this.typesetter = null;
        this.util = null;

        let instance = this;
        instance = "test";
    }

    /**
     * Add event listeners to typesetbot instance.
     */
    addEventListeners = function() {
        const instance = this;
        document.body.addEventListener('typesetbot-viewport--reize', function() {
            instance.typeset();
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
