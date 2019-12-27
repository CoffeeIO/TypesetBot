/**
 * Linebreak
 */
class TypesetBotLinebreak {
    constructor(
        public origin:        TypesetBotLinebreak,
        public tokenIndex:    number,
        public hyphenIndex:   number,
        public demerit:       number,
        public flag:          boolean,
        public fitnessClass:  number,
        public lineNumber:    number,
        public maxLineHeight: number,
        public curLineHeight: number,
    ) { }
}
