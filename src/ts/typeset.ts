// Declare vendor library.
declare var Queue: any;

/**
 * Typesetting class for a single element.
 */
class TypesetBotTypeset {
    private _tsb: TypesetBot;
    render:       TypesetBotRender;
    tokenizer:    TypesetBotTokenizer;
    hyphen:       TypesetBotHyphen;
    math:         TypesetBotMath;
    settings:     TypesetBotSettings;

    tokens: TypesetBotToken[];

    // Node variables.
    originalHTML: string;

    // Font properties
    elemWidth: number; // In pixels
    elemFontSize: number;
    spaceWidth: number;
    spaceShrink: number;
    spaceStretch: number;

    // Breakpoint structures.
    finalBreakpoints: TypesetBotLinebreak[];
    activeBreakpoints: TypesetBotLinebreak[];
    shortestPath: object;

    /**
     * @param tsb Instance of main class
     */
    constructor(tsb: TypesetBot) {
        this._tsb = tsb;
        this.render = new TypesetBotRender(tsb);
        this.tokenizer = new TypesetBotTokenizer(tsb, this);
        this.hyphen = new TypesetBotHyphen(tsb);
        this.math = new TypesetBotMath(tsb);
        this.settings = tsb.settings;
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


        this.settings.loosenessParam = 0;

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
        this.spaceWidth = this.elemFontSize * this.settings.spaceWidth,
        this.spaceShrink = this.elemFontSize * this.settings.spaceShrinkability,
        this.spaceStretch = this.elemFontSize * this.settings.spaceStretchability;

        console.log("spaceWidth " + this.spaceWidth);
        console.log("spaceShrink " + this.spaceShrink);
        console.log("spaceStretch " + this.spaceStretch);


        this._tsb.logger.end('---- Getting element properties');
    }

    /**
     * Calculate the hyphens on available tokens.
     *
     * @param element
     */
    setWordHyphens = function(element: Element) {
        let tokenIndex = 0;

        let isFinished = false;
        while (!isFinished) {
            const wordData = this.hyphen.nextWord(element, tokenIndex);
            if (wordData == null) {
                isFinished = true;
                continue;
            }

            tokenIndex = wordData.tokenIndex;
            this.hyphen.calcWordHyphens(element, wordData);
        }
    }

    /**
     * Preprocess element
     *
     * @param element
     */
    preprocessElement = function(element: Element) {
        this._tsb.logger.start('-- Preprocess');

        // Get element width.
        // Init paragraph variables.
        // Copy content.
        this.getElementProperties(element);

        // Tokenize nodes and store them.
        this._tsb.logger.start('---- Tokenize text');
        this.tokens = this.tokenizer.tokenize(element);
        this._tsb.logger.end('---- Tokenize text');

        this._tsb.logger.start('---- other');
        // Append tokens to map for quick access.
        this.appendToTokenMap(element, this.tokens);
        this._tsb.logger.end('---- other');

        this._tsb.logger.start('---- Get render size of words');
        // Get render sizes of nodes.
        this.render.getWordProperties(element);
        this._tsb.logger.end('---- Get render size of words');

        this._tsb.logger.start('---- Hyphen calc');
        // Calculate hyphens on tokens.
        this.setWordHyphens(element);
        this._tsb.logger.end('---- Hyphen calc');

        this._tsb.logger.start('---- Hyphen render');
        // Calculate hyphens on tokens.
        this.render.getHyphenProperties(element, this.tokens);
        this._tsb.logger.end('---- Hyphen render');

        this._tsb.logger.end('-- Preprocess');
    }

    /**
     * Calculate the valid linebreaks
     */
    calcLinebreaks = function(element: Element): TypesetBotLinebreak[] {
        this.preprocessElement(element);

        this._tsb.logger.start('-- Dynamic programming');

        this.activeBreakpoints = new Queue();
        this.shortestPath = {};
        this.finalBreakpoints = [];

        this.activeBreakpoints.enqueue(
            new TypesetBotLinebreak(
                null,
                0,
                null,
                0,
                false,
                null,
                0,
                0,
            ),
        );

        let isFinished = false;
        while (!isFinished) {
            console.log('loop main');

            const originBreakpoint = this.activeBreakpoints.dequeue();
            // Check if there is no more element to dequeue.
            if (originBreakpoint == null) {
                isFinished = true;
                continue;
            }

            const lineProperties = this.initLineProperties(element, originBreakpoint);

            let lineIsFinished = false;
            while (!lineIsFinished) {
                // console.log('loop line ' + lineProperties.tokenIndex);

                const oldLineWidth = lineProperties.curWidth;
                const wordData = this.hyphen.nextWord(element, lineProperties.tokenIndex)
                if (wordData == null) {
                    // Push final break.
                    // this.finalBreakpoints.push(
                    //     new TypesetBotLinebreak(
                    //         originBreakpoint,
                    //         lineProperties.tokenIndex,
                    //         null,
                    //         originBreakpoint.demerit,
                    //         false,
                    //         null,
                    //         lineProperties.lineNumber + 1,
                    //         originBreakpoint.maxLineHeight,
                    //     ),
                    // );

                    lineIsFinished = true;
                    continue;
                }
                // Update token index.
                lineProperties.tokenIndex = wordData.tokenIndex;
                lineProperties.curWidth += wordData.width;
                lineProperties.wordCount++;

                const ratio = this.math.getRatio(
                    this.elemWidth,
                    lineProperties.curWidth,
                    lineProperties.wordCount,
                    this.spaceShrink,
                    this.spaceStretch,
                );
                // console.log(ratio);


                if (this.math.ratioIsLessThanMax(ratio)) { // Valid breakpoint
                    for (const tokenIndex of wordData.indexes) {
                        const token = this.tokens[tokenIndex];

                        // const hyphenRatio = this.math.getRatio(
                        //     this.elemWidth,
                        //     lineProperties.curWidth,
                        //     lineProperties.wordCount,
                        //     this.spaceShrink,
                        //     this.spaceStretch,
                        // );
                    }

                    // Check the ratio is still valid.
                    if (!this.math.ratioIsHigherThanMin(ratio)) {
                        console.log('break min');

                        lineIsFinished = true;
                        continue; // Don't add the last node.
                    }

                    // Generate breakpoint.
                    const breakpoint = this.getBreakpoint(
                        originBreakpoint,
                        lineProperties,
                        ratio,
                        lineProperties.tokenIndex,
                    );
                    this.updateShortestPath(breakpoint, lineProperties.tokenIndex)

                    console.log(wordData);
                }
                console.log(ratio);

                lineProperties.curWidth += this.spaceWidth;
            }
        }

        this._tsb.logger.end('-- Dynamic programming');
        return [];
    }


    getBreakpoint = function(
        origin: TypesetBotLinebreak,
        lineProperties: TypesetBotLineProperties,
        ratio: number,
        tokenIndex: number,
        hyphenIndex: number = null,
        flag: boolean = false,
    ) {
        // Get fitness class
        const fitnessClass = this.math.getFitnessClass(ratio);
        const consecutiveFlag = origin.flag && flag;
        const hasHyphen = hyphenIndex != null;
        const skippingFitnessClass = origin.fitnessClass != null && Math.abs(origin.fitnessClass - fitnessClass) > 1

        const demerit = this.math.getDemerit(ratio, consecutiveFlag, hasHyphen, skippingFitnessClass);

        return new TypesetBotLinebreak(
            origin,
            tokenIndex,
            hyphenIndex,
            demerit,
            flag,
            fitnessClass,
            origin.lineNumber + 1,
            lineProperties.lineHeight,
        );
    }

    checkShortestPath = function() : boolean {
        // Check if breakpoint if the lowest demerit on:
        // "specific line, with specific nodex, with specific hyphen index".
        return false;
    }

    updateShortestPath = function(
        breakpoint: TypesetBotLinebreak,
        lineProperties: TypesetBotLineProperties,
        hyphenIndex: number = -1,
    ): boolean {
        // If breakpoint has better demerit on "specific line, with specific nodex, with specific hyphen index".
        // Then update the breakpoint.
        // Append to active breakpoints queue.
        if (this.shortestPath[lineProperties.lineNumber] == null) {
            this.shortestPath[lineProperties.lineNumber] = {};
        }
        if (this.shortestPath[lineProperties.lineNumber][lineProperties.tokenIndex] == null) {
            this.shortestPath[lineProperties.lineNumber][lineProperties.tokenIndex] = {};
        }
        if (
            this.shortestPath[lineProperties.lineNumber][lineProperties.tokenIndex][hyphenIndex] == null ||
            this.shortestPath[lineProperties.lineNumber][lineProperties.tokenIndex][hyphenIndex] > breakpoint.demerit
        ) {
            this.shortestPath[lineProperties.lineNumber][lineProperties.tokenIndex][hyphenIndex] = breakpoint.demerit;
            this.activeBreakpoints.enqueue(breakpoint);
            return true;
        }

        return false;
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

    initLineProperties = function(elem: Element, origin: TypesetBotLinebreak): TypesetBotLineProperties {
        // Check if origin is the current shortest path.
        // @todo

        return new TypesetBotLineProperties(
            origin,
            origin.tokenIndex,
            origin.lineNumber,
            0,
            0,
            0,
        );
    }
}
