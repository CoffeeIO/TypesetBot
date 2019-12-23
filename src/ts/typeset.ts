// Declare vendor library.
declare var Queue: any;

/**
 * Typesetting class for a single element.
 */
class TypesetBotTypeset {

    render: TypesetBotRender;
    tokenizer: TypesetBotTokenizer;
    hyphen: TypesetBotHyphen;

    tokens: TypesetBotToken[];

    private _tsb: TypesetBot;

    // Node variables.
    originalHTML: string;
    nodes: object;
    nodeProperties: object;

    // Font properties
    elemWidth: number; // In pixels
    elemFontSize: number;
    spaceWidth: number;
    spaceShrink: number;
    spaceStretch: number;

    lastRenderNodeIndex: number;
    renderContent: string;
    finalBreakpoints: TypesetBotLinebreak[];
    activeBreakpoints: TypesetBotLinebreak[];
    isFinished: boolean;
    shortestPath: object;

    /**
     * @param tsb Instance of main class
     */
    constructor(tsb: TypesetBot) {
        this._tsb = tsb;
        this.render = new TypesetBotRender(tsb);
        this.tokenizer = new TypesetBotTokenizer(tsb, this);
        this.hyphen = new TypesetBotHyphen(tsb);
    }

    /**
     * Typeset single node.
     *
     * @param node
     */
    typeset = function(node: Element) {
        console.log('Typesetting:');
        console.log(node);


        // Apply basic reset CSS styles.
        // (ignore for now)


        this._tsb.settings.loosenessParam = 0;

        // Check if node has changed content (inner nodes) since last typesetting.
        // (ignored for now)

        // Make a copy of node which can be worked on without breaking webpage.
        this._tsb.logger.start('---- Clone working node');
        const cloneNode = node.cloneNode(true);
        this._tsb.logger.end('---- Clone working node');


        // Calculate linebreaks.
        const linebreaks = this.calcLinebreaks(node);

        // Visually apply linebreaks to original element.
            // Loop final solutions and find the one with lowest demerit.
            // Construct lines.
                // Word, Tag Space
                // Close tags after each line.
                // Start unfinished tags at the beginning of each line.
            // Convert to HTML.
    }

    /**
     * Get a set initial state properties of element.
     *
     * @param node
     */
    getElementProperties = function(node: Element) {
        this._tsb.logger.start('---- Getting element properties');

        this.originalHTML = node.outerHTML;

        // Set space width based on settings.
        this.render.setMinimumWordSpacing(node);

        this.elemWidth = this.render.getNodeWidth(node);

        // Get font size and calc real space properties.
        this.elemFontSize = this.render.getDefaultFontSize(node);
        this.spaceWidth = this.elemFontSizeSize * this._tsb.settings.spaceWidth,
        this.spaceShrink = this.elemFontSize * this._tsb.settings.spaceShrinkability,
        this.spaceStretch = this.elemFontSize * this._tsb.settings.spaceStretchability;

        this._tsb.logger.end('---- Getting element properties');
    }

    /**
     * Calculate the hyphens on available tokens.
     *
     * @param node
     */
    setWordHyphens = function(node: Element) {

    }


    /**
     * Calculate the valid linebreaks
     */
    calcLinebreaks = function(node: Element): TypesetBotLinebreak[] {
        this._tsb.logger.start('-- Preprocess');

        // Get element width.
        // Init paragraph variables.
        // Copy content.
        this.getElementProperties(node);

        // Tokenize nodes and store them.
        this._tsb.logger.start('---- Tokenize text');
        this.tokens = this.tokenizer.tokenize(node);
        this._tsb.logger.end('---- Tokenize text');

        this._tsb.logger.start('---- other');
        // Append tokens to map for quick access.
        this.appendToTokenMap(node, this.tokens);
        this._tsb.logger.end('---- other');

        this._tsb.logger.start('---- Get render size of words');
        // Get render sizes of nodes.
        this.render.getWordProperties(node, this.tokens);
        this._tsb.logger.end('---- Get render size of words');

        this._tsb.logger.start('---- Hyphen calc');
        // Calculate hyphens on tokens.
        this.setWordHyphens(node);
        this._tsb.logger.start('---- Hyphen calc');

        this._tsb.logger.start('---- Hyphen render');
        // Calculate hyphens on tokens.
        this.render.getHyphenProperties(node, this.tokens);
        this._tsb.logger.start('---- Hyphen render');


        this._tsb.logger.end('-- Preprocess');

        this.activeBreakpoints = new Queue();
        this.shortestPath = [];
        this.finalBreakpoints = [];

            // Counter for last rendered node.

        // Preprocess all hyphens.
            // Loop all nodes.
                // Find hyphens in word.
                // Get hyphen properties of that word.

        // Create starting node.

        // Loop until queue is empty.

            // Init line variables.
                // Check if shortest path is found.
                // Get active node index.
                // Get active hyphen index of node.

            // Calculate adjustment ratio.

            // Check if this is a valid breakpoint (not within min ratio).

                // Loop hyphen breakpoints.

                    // Get hyphen adjustment ratio.

                    // If "valid" breaking point, generate break.

                // Check if adjustment ratio is within the minimum ratio.

                // Generate break.

            // Add space width to current line with.

        // Reset node content.

        // Run linebreaking algorithm again if no solution was found.

            // Increase looseness.

        // Return calculated nodes and valid linebreak solutions.


        return [];
    }


    addBreakpoint = function() {
        // Get fitness class
        // Check flagDemerit
        // Calc demerit
        // Check fitness class change.
        // Create breakpoint object.
        // Update shorted path.
    }

    checkShortestPath = function() : boolean {
        // Check if breakpoint if the lowest demerit on:
        // "specific line, with specific nodex, with specific hyphen index".
        return false;
    }

    updateShortestPath = function() {
        // If breakpoint has better demerit on "specific line, with specific nodex, with specific hyphen index".
        // Then update the breakpoint.
        // Append to active breakpoints queue.
    }

    /**
     * Add tokens to map for specific node.
     *
     * @param root
     * @param tokens
     */
    appendToTokenMap = function(root: Element, tokens: TypesetBotToken[]) {
        if (this._tsb.util.getElementIndex(root) == null) {
            this._tsb.logger.error('Root node is not indexed');
            this._tsb.logger.error(root);
            return;
        }

        const index = this._tsb.util.getElementIndex(root);
        this._tsb.indexToTokens[index] = tokens;
    }
}
