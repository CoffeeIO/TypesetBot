/**
 * Class for tokenizing DOM nodes.
 */
class TypesetBotTokenizer {
    private _tsb: TypesetBot;
    private _elementMap: { [index: number] : Element[]; };

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
     * @param root The root element node
     * @param node The node to tokenize
     * @returns Array of tokens
     */
    tokenize = function(root: Element, node: Element = null): TypesetBotToken[] {
        const tokens = [];
        if (node == null) {
            node = root;
        }
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
                    tokens.push(this.tokenizeElement(node, child));
                    break;
                case 3: // Text
                    tokens.push(this.tokenizeText(node, child));
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
     * Tokenize element node.
     *
     * @param root The root element node
     * @param node The node to tokenize
     * @returns Array of tokens
     */
    tokenizeElement = function(root: Element, node: Element): TypesetBotToken[] {
        const tokens = [];

        if (!TypesetBotUtils.isVisible(node)) {
            return [];
        }

        // Add start tag.
        const nodeIndex = this.appendToNodeMap(root, node);

        tokens.push(new TypesetBotTag(nodeIndex, node.nodeName, false));
        // Recursively add children.
        tokens.push(this.tokenize(root, node));
        // Add end tag.
        tokens.push(new TypesetBotTag(nodeIndex, node.nodeName, true));

        return tokens;
    }

    /**
     * Tokenize text node.
     *
     * @param root The root element node
     * @param node The node to tokenize
     * @returns Array of tokens
     */
    tokenizeText = function(root: Element, node: Element): TypesetBotToken[] {
        const tokens = [];

        if (node.nodeType !== 3) {
            this._tsb.logger.warn('TokenizeText was called with wrong type: ' + node.nodeType);
            this._tsb.logger.warn(node);
            return [];
        }

    }

    /**
     * Append node to map of nodes for the specific query element.
     *
     * @param root The root element node
     * @param node The node to append
     * @returns The index of appended node
     */
    appendToNodeMap = function(root: Element, node: Element): number {
        if (TypesetBotUtils.getElementIndex(root) == null) {
            this._tsb.logger.error('Root node is not indexed');
            this._tsb.logger.error(root);
            return null;
        }

        const index = TypesetBotUtils.getElementIndex(root);
        if (!(index in this._elementMap)) {
            this._elementMap[index] = [];
        }
        this._elementMap[index].push(node);

        // Return -1 as the array is zero indexed.
        return this._elementMap[index].length - 1;
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
    nodeIndex: number;

    /**
     * @param type The type of token.
     */
    constructor(nodeIndex: number, type: number) {
        this.nodeIndex = nodeIndex;
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
    constructor(nodeIndex: number, text: string) {
        super(nodeIndex, TypesetBotToken.types.WORD);
        this.text = text;
    }
}

/**
 * Class for space tokens.
 */
class TypesetBotSpace extends TypesetBotToken {
    constructor(nodeIndex: number) {
        super(nodeIndex, TypesetBotToken.types.TAG);
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
    constructor(nodeIndex: number, tag: string, isEndTag: boolean) {
        super(nodeIndex, TypesetBotToken.types.TAG);
        this.tag = tag;
        this.isEndTag = isEndTag;
    }
}
