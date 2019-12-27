/**
 * Linebreak
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
     * @param curLineHeight Current height of line
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

class TypesetBotLineProperties {
    /**
     * @param origin     The linebreak object for previous line
     * @param tokenIndex The index of the next token to append
     * @param lineNumber The current line number
     * @param wordCount  The number of words in line
     * @param curWidth   The current line width
     * @param lineHeight The current max line height
     */
    constructor(
        public origin: TypesetBotLinebreak,
        public tokenIndex: number,
        public lineNumber: number,
        public wordCount: number,
        public curWidth: number,
        public lineHeight: number,
    ) { }
}
