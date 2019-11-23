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
     * @param node
     * @returns Array of tokens
     */
    tokenize = function(node: Element): TypesetBotToken[] {
        const tokens = [];
        if (!('childNodes' in node)) {
            return [];
        }
        // Only add tokens if node is visible.
        if (!TypesetBotUtils.isVisible(node)) {
            return [];
        }

        // Cast childNodes to list of Elements.
        for (const child of node.childNodes as NodeListOf<Element>) {
            switch (child.nodeType) {
                case 1: // Element
                    tokens.push(this.tokenizeElement(child));
                    break;
                case 3: // Text
                    tokens.push(this.tokenizeText(child));
                    break;
                case 2: // Attr
                case 8: // Comment
                case 9: // Document
                case 10: // DocumentType
                    // Ignore types.
                    this._tsb.logger.log('Tokenizer ignores node type: ' + child.nodeType);
                    this._tsb.logger.warn(child);
                default:
                    this._tsb.logger.warn('Tokenizer found unknown node type: ' + child.nodeType);
                    this._tsb.logger.warn(child);
                    break;
            }
        }

    }

    /**
     * Tokennize element node.
     *
     * @param node
     * @returns Array of tokens
     */
    tokenizeElement = function(node: Element): TypesetBotToken[] {
        const tokens = [];

        if (!TypesetBotUtils.isVisible(node)) {
            return [];
        }

        // Add start tag.
        tokens.push(new TypesetBotTag(node.nodeName, node.attributes, false));
        // Recursively add children.
        tokens.push(this.tokenize(node));
        // Add end tag.
        tokens.push(new TypesetBotTag(node.nodeName, node.attributes, true));

        return tokens;
    }

    /**
     * Tokenize text node.
     *
     * @param node
     * @returns Array of tokens
     */
    tokenizeText = function(node: Element): TypesetBotToken[] {
        const tokens = [];

        if (node.nodeType !== 3) {
            this._tsb.logger.warn('TokenizeText was called with wrong type: ' + node.nodeType);
            this._tsb.logger.warn(node);
            return [];
        }

    }
}

/**
 * Class for general token.
 */
class TypesetBotToken {
    static readonly types = {
        WORD:  1,
        SPACE: 2,
        TAG:   3,
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

/**
 * Class for tag tokens.
 */
class TypesetBotTag extends TypesetBotToken {
    tag: string;
    attributes: NamedNodeMap;
    isEndTag: boolean;

    /**
     * @param tag      The name of the tag
     * @param isEndTag Is this token an end tag
     */
    constructor(tag: string, attributes: NamedNodeMap, isEndTag: boolean) {
        super(TypesetBotToken.types.TAG);
        this.tag = tag;
        this.attributes = attributes;
        this.isEndTag = isEndTag;
    }
}
