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


    // Node variables.
    backupInnerHtml: string;
    tokens: TypesetBotToken[];

    // Font properties
    elemWidth: number; // In pixels
    elemFontSize: number;
    spaceWidth: number;
    spaceShrink: number;
    spaceStretch: number;

    // Breakpoint structures.
    activeBreakpoints: TypesetBotLinebreak[];
    shortestPath: object;
    finalBreakpoints: TypesetBotLinebreak[];

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
     * Typeset single element.
     *
     * @param element
     */
    typeset = function(element: Element) {
        // Reset HTML of node if the typesetting has run before.
        if (this.backupInnerHtml != null) {
            element.innerHTML = this.backupInnerHtml;
        }

        // Preprocess hyphenations and rendering dimensions.
        this.preprocessElement(element);

        // Calculate all feasible linebreak solutions.
        const finalBreakpoints = this.getFinalLineBreaks(element);

        // Get best solution.
        const solution = this.lowestDemerit(finalBreakpoints);
        if (solution == null) {
            this._tsb.logger.warn('No viable solution found during typesetting. Element is skipped.');
            return;
        }

        // Render solution to DOM.
        this.render.applyLineBreaks(element, solution);
    }

    /**
     * Get a set initial state properties of element.
     *
     * @param element
     */
    getElementProperties = function(element: Element) {
        this._tsb.logger.start('---- Getting element properties');

        if (this.backupInnerHtml == null) {
            this.backupInnerHtml = element.innerHTML;
        }

        // Set space width based on settings.
        this.render.setMinimumWordSpacing(element);

        this.elemWidth = this.render.getNodeWidth(element);

        // Get font size and calc real space properties.
        this.elemFontSize = this.render.getDefaultFontSize(element);
        this.spaceWidth = this.elemFontSize * this.settings.spaceWidth,
        this.spaceShrink = this.elemFontSize * this.settings.spaceShrinkability,
        this.spaceStretch = this.elemFontSize * this.settings.spaceStretchability;

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

        // Analyse working element.
        this.getElementProperties(element);

        // Tokenize element for words, space and tags.
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
     * Get the solution with lowest demerit from array of solutions.
     *
     * @param   finalBreakpoints
     * @returns                  The solution with lowest demerit
     */
    lowestDemerit = function(finalBreakpoints: TypesetBotLinebreak[]): TypesetBotLinebreak {
        this._tsb.logger.start('-- Finding solution');
        let solution = null;
        for (const breakpoint of finalBreakpoints) {
            if (solution == null) {
                solution = breakpoint;
                continue;
            }
            if (solution.demerit > breakpoint.demerit) {
                solution = breakpoint;
            }
        }
        this._tsb.logger.end('-- Finding solution');

        return solution;
    }

    /**
     * Get all possible solutions to break the text.
     *
     * @param   element
     * @param   looseness The current lossness of the maximum allowed adjustment ratio
     * @returns           All possible final breakpoints
     */
    getFinalLineBreaks = function(element: Element, looseness: number = 0): TypesetBotLinebreak[] {
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
            const originBreakpoint = this.activeBreakpoints.dequeue();
            // Check if there is no more element to dequeue.
            if (originBreakpoint == null) {
                isFinished = true;
                continue;
            }

            if (!this.isShortestPath(originBreakpoint)) {
                continue;
            }

            const lineProperties = this.initLineProperties(originBreakpoint);

            let lineIsFinished = false;
            while (!lineIsFinished) {
                let oldLineWidth: number = lineProperties.curWidth;
                const wordData = this.hyphen.nextWord(
                    element,
                    lineProperties.tokenIndex,
                    lineProperties.firstWordHyphenIndex,
                ) as TypesetBotWordData;

                lineProperties.firstWordHyphenIndex = null; // Unset hyphenindex for next words.
                if (wordData == null) {
                    // No more words are available in element, possible solution.
                    this.pushFinalBreakpoint(originBreakpoint, lineProperties);
                    lineIsFinished = true;
                    continue;
                }

                // Update token index.
                lineProperties.tokenIndex = wordData.tokenIndex;
                lineProperties.curWidth += wordData.width;
                lineProperties.lineHeight = wordData.height;
                lineProperties.wordCount++;

                const ratio = this.math.getRatio(
                    this.elemWidth,
                    lineProperties.curWidth,
                    lineProperties.wordCount,
                    this.spaceShrink,
                    this.spaceStretch,
                );

                if (this.math.ratioIsLessThanMax(ratio, looseness)) { // Valid breakpoint
                    // Loop all word parts in the word.
                    for (const tokenIndex of wordData.indexes) {
                        const token = this.tokens[tokenIndex] as TypesetBotWord;

                        if (!token.hasHyphen) {
                            continue;
                        }

                        for (let index = 0; index < token.hyphenIndexWidths.length; index++) {
                            oldLineWidth += token.hyphenIndexWidths[index];

                            const hyphenRatio: number = this.math.getRatio(
                                this.elemWidth,
                                oldLineWidth + token.dashWidth, // Add with of hyphen
                                lineProperties.wordCount,
                                this.spaceShrink,
                                this.spaceStretch,
                            );

                            if (!this.math.isValidRatio(hyphenRatio, looseness)) {
                                continue;
                            }

                            // Generate breakpoint.
                            const hyphenBreakpoint = this.getBreakpoint(
                                originBreakpoint,
                                lineProperties,
                                hyphenRatio,
                                wordData.lastWordTokenIndex, // Offset one as the word token is not finished
                                index,
                                true,
                            );

                            this.updateShortestPath(hyphenBreakpoint);
                        }
                    }

                    // Check the ratio is still valid.
                    if (!this.math.ratioIsHigherThanMin(ratio)) {
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
                    this.updateShortestPath(breakpoint);
                }

                lineProperties.curWidth += this.spaceWidth;
            }
        }

        this._tsb.logger.end('-- Dynamic programming');

        // Lossness is increased by 1 until a feasible solution if found.
        if (this.finalBreakpoints.length === 0 && looseness <= 4) {
            return this.getFinalLineBreaks(element, looseness + 1);
        }

        return this.finalBreakpoints;
    }

    /**
     * Push a breakpoint for a final solution.
     *
     * @param originBreakpoint
     * @param lineProperties
     */
    pushFinalBreakpoint = function(originBreakpoint: TypesetBotLinebreak, lineProperties: TypesetBotLineProperties) {
        this.finalBreakpoints.push(
            new TypesetBotLinebreak(
                originBreakpoint,
                null,
                null,
                originBreakpoint.demerit,
                false,
                null,
                originBreakpoint.lineNumber + 1,
                lineProperties.lineHeight,
            ),
        );
    }

    /**
     * Calculate demerit and return new linebreak object.
     *
     * @param   origin         The breakpoint of previous line
     * @param   lineProperties The properties of current line
     * @param   ratio          The current adjustment ratio
     * @param   tokenIndex     The current token index
     * @param   hyphenIndex    The current hyphenation index on token
     * @param   flag           Flag if there is some kind of penalty
     * @returns                The new linebreak
     */
    getBreakpoint = function(
        origin: TypesetBotLinebreak,
        lineProperties: TypesetBotLineProperties,
        ratio: number,
        tokenIndex: number,
        hyphenIndex: number = null,
        flag: boolean = false,
    ): TypesetBotLinebreak {
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
            origin.demerit + demerit, // Append demerit from previous line
            flag,
            fitnessClass,
            origin.lineNumber + 1,
            lineProperties.lineHeight,
        );
    }

    /**
     * Check if a certain breakpoint is the current shortest path to the break.
     * - Checks on specific line number.
     * - Checks on specific token index.
     * - Checks on specific hyphenation point.
     *
     * @param   breakpoint
     * @returns            Return true if the breakpoint is the shortest path, otherwise return false
     */
    isShortestPath = function(breakpoint: TypesetBotLinebreak) : boolean {
        const hyphenIndex = breakpoint.hyphenIndex == null ? -1 : breakpoint.hyphenIndex;

        // Safety check.
        if (
            this.shortestPath[breakpoint.lineNumber] != null &&
            this.shortestPath[breakpoint.lineNumber][breakpoint.tokenIndex] != null &&
            this.shortestPath[breakpoint.lineNumber][breakpoint.tokenIndex][hyphenIndex] != null &&
            this.shortestPath[breakpoint.lineNumber][breakpoint.tokenIndex][hyphenIndex] > breakpoint.demerit
        ) {
            this._tsb.logger.error('Dynamic: Found shortest path with higher demerit than current breakpoint');
        }

        // Real check.
        return (
            this.shortestPath[breakpoint.lineNumber] == null ||
            this.shortestPath[breakpoint.lineNumber][breakpoint.tokenIndex] == null ||
            this.shortestPath[breakpoint.lineNumber][breakpoint.tokenIndex][hyphenIndex] == null ||
            this.shortestPath[breakpoint.lineNumber][breakpoint.tokenIndex][hyphenIndex] === breakpoint.demerit
        );
    }

    /**
     * Update demerit if the breakpoint is the current shortest path.
     * - Checks on specific line number.
     * - Checks on specific token index.
     * - Checks on specific hyphenation point.
     *
     * @param   breakpoint
     * @returns            Return true if the breakpoint is the shortest path, otherwise return false
     */
    updateShortestPath = function(breakpoint: TypesetBotLinebreak): boolean {
        const hyphenIndex = breakpoint.hyphenIndex == null ? -1 : breakpoint.hyphenIndex;

        if (this.shortestPath[breakpoint.lineNumber] == null) {
            this.shortestPath[breakpoint.lineNumber] = {};
        }
        if (this.shortestPath[breakpoint.lineNumber][breakpoint.tokenIndex] == null) {
            this.shortestPath[breakpoint.lineNumber][breakpoint.tokenIndex] = {};
        }
        if (
            this.shortestPath[breakpoint.lineNumber][breakpoint.tokenIndex][hyphenIndex] == null ||
            this.shortestPath[breakpoint.lineNumber][breakpoint.tokenIndex][hyphenIndex] > breakpoint.demerit
        ) {
            this.shortestPath[breakpoint.lineNumber][breakpoint.tokenIndex][hyphenIndex] = breakpoint.demerit;
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


    /**
     * Get properties for a new line object.
     *
     * @param   origin
     * @returns        Line properties object
     */
    initLineProperties = function(origin: TypesetBotLinebreak): TypesetBotLineProperties {
        return new TypesetBotLineProperties(
            origin,
            origin.tokenIndex,
            origin.hyphenIndex,
            origin.lineNumber,
            0,
            0,
            0,
        );
    }
}

/**
 * Class representing a possible linebreak.
 */
class TypesetBotLinebreak {
    /**
     * @param origin        The linebreak object for previous line
     * @param tokenIndex    The index of token where the linebreak occured
     * @param hyphenIndex   The index where hyphenation occured, otherwise null
     * @param demerit       The demerit of solution
     * @param flag          Penalty flag of current line
     * @param fitnessClass  Fitness class of current line
     * @param lineNumber    Line number of current line
     * @param maxLineHeight Max line height of current solution
     */
    constructor(
        public origin:        TypesetBotLinebreak,
        public tokenIndex:    number,
        public hyphenIndex:   number,
        public demerit:       number,
        public flag:          boolean,
        public fitnessClass:  number,
        public lineNumber:    number,
        public maxLineHeight: number,
    ) { }
}

/**
 * Class representing properties for each line in the dynamic programming algorithm.
 */
class TypesetBotLineProperties {
    /**
     * @param origin               The linebreak object for previous line
     * @param tokenIndex           The index of the next token to append
     * @param firstWordHyphenIndex The hyphenIndex of the first word in the line
     * @param lineNumber           The current line number
     * @param wordCount            The number of words in line
     * @param curWidth             The current line width
     * @param lineHeight           The current max line height
     */
    constructor(
        public origin: TypesetBotLinebreak,
        public tokenIndex: number,
        public firstWordHyphenIndex: number,
        public lineNumber: number,
        public wordCount: number,
        public curWidth: number,
        public lineHeight: number,
    ) { }
}
