/**
 * Class for tokenizing DOM nodes.
 */
class TypesetBotTokenizer {
    private _tsb: TypesetBot;

    /**
     * The constructor.
     *
     * @param tsb Instance of main class
     */
    constructor(tsb: TypesetBot) {
        this._tsb = tsb;
    }

    /**
     * Tokenize element and get array of tokens.
     *
     * @returns Array of tokens
     */
    tokenize = function(node: Element): Array<TypesetBotToken> {


        return [];
    }
}

/**
 * Class for general token.
 */
class TypesetBotToken {
    static readonly types = {
        WORD:  1,
        SPACE: 2,
        TAG:   3
    };
    type: number;

    /**
     * @param type The type of token.
     */
    constructor(type: number) {
        this.type = type;
    }
}

/**
 * Class for tag tokens.
 */
class TypesetBotTag extends TypesetBotToken {
    tag: string;
    isEndTag: boolean;

    /**
     * @param tag      The name of the tag
     * @param isEndTag Is this token an end tag
     */
    constructor(tag: string, isEndTag: boolean) {
        super(TypesetBotToken.types.TAG);
        this.tag = tag;
        this.isEndTag = isEndTag;
    }
}

/**
 * Class for word tokens.
 */
class TypesetBotWord extends TypesetBotToken {
    text: string;

    /**
     * @param text The text of the word
     */
    constructor(text: string) {
        super(TypesetBotToken.types.WORD);
        this.text = text;
    }
}

/**
 * Class for space tokens.
 */
class TypesetBotSpace extends TypesetBotToken {
    constructor() {
        super(TypesetBotToken.types.TAG);
    }
}
