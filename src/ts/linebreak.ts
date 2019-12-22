/**
 * Linebreak
 */
class TypesetBotLinebreak {
    private _tsb: TypesetBot;

    origin: TypesetBotLinebreak;
    nodeIndex: number;
    hyphenIndex: number;

    demerit: number;
    flag: boolean;
    fitnessClass: number;

    lineNumber: number;
    maxLineHeight: number;
    curLineHeight: number;

    constructor(tsb: TypesetBot) {
        this._tsb = tsb;
    }


}
