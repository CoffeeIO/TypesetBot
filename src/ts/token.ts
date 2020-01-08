/**
 * Class for tokenizing DOM nodes.
 */
class TypesetBotTokenizer {
    typesetter: TypesetBotTypeset;
    private _tsb: TypesetBot;

    /**
     * The constructor.
     *
     * @param tsb Instance of main class
     */
    constructor(tsb: TypesetBot, typesetter: TypesetBotTypeset) {
        this._tsb = tsb;
        this.typesetter = typesetter;
    }

    /**
     * Tokenize element and get array of tokens.
     *
     * @param root The root element node
     * @param node The node to tokenize
     * @returns    Array of tokens
     */
    tokenize = function(root: Element, node: Element = null): TypesetBotToken[] {
        let tokens: TypesetBotToken[] = [];
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
                    tokens = tokens.concat(this.tokenizeElement(root, child));
                    break;
                case 3: // Text
                    tokens = tokens.concat(this.tokenizeText(root, child));
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

        return tokens;
    }

    /**
     * Tokenize element node.
     *
     * @param root The root element node
     * @param node The node to tokenize
     * @returns    Array of tokens
     */
    tokenizeElement = function(root: Element, node: Element): TypesetBotToken[] {
        let tokens: TypesetBotToken[] = [];

        if (!TypesetBotUtils.isVisible(node)) {
            return [];
        }

        if (node.nodeName in this._tsb.settings.unsupportedTags) {
            this._tsb.logger.warn('Tokenizer found unsupported node type, typesetting might not work as intended.');
            this._tsb.logger.warn(node);
        }

        const nodeIndex = this.appendToNodeMap(root, node);

        // Add start tag.
        tokens.push(new TypesetBotTag(nodeIndex, node.nodeName, false));
        // Recursively add children.
        tokens = tokens.concat(this.tokenize(root, node));
        // Add end tag.
        tokens.push(new TypesetBotTag(nodeIndex, node.nodeName, true));

        return tokens;
    }

    /**
     * Tokenize text node.
     *
     * @param root The root element node
     * @param node The node to tokenize
     * @returns    Array of tokens
     */
    tokenizeText = function(root: Element, node: Element): TypesetBotToken[] {
        const tokens: TypesetBotToken[] = [];

        if (node.nodeType !== 3) {
            this._tsb.logger.warn('TokenizeText was called with wrong type: ' + node.nodeType);
            this._tsb.logger.warn(node);
            return [];
        }

        const nodeIndex: number = this.appendToNodeMap(root, node);
        const htmlNode = node as HTMLElement;
        const text: string = this.replaceInvalidCharacters(htmlNode.nodeValue);
        const words: string[] = text.split(' ');

        if (text[0] === ' ') {
            tokens.push(new TypesetBotSpace(nodeIndex));
        }

        for (const word of words) {
            if (word === '') {
                continue;
            }
            tokens.push(new TypesetBotWord(nodeIndex, word));
            // Assume all words are followed by a space.
            tokens.push(new TypesetBotSpace(nodeIndex));
        }

        if (htmlNode.nodeValue[htmlNode.nodeValue.length - 1] !== ' ') {
            tokens.pop();
        }

        return tokens;
    }

    /**
     * Append node to map of nodes for the specific query element.
     *
     * @param root The root element node
     * @param node The node to append
     * @returns    The index of appended node
     */
    appendToNodeMap = function(root: Element, node: Element): number {
        if (this._tsb.util.getElementIndex(root) == null) {
            this._tsb.logger.error('Root node is not indexed');
            this._tsb.logger.error(root);
            return null;
        }

        const index = this._tsb.util.getElementIndex(root);
        if (!(index in this._tsb.indexToNodes)) {
            this._tsb.indexToNodes[index] = [];
        }
        this._tsb.indexToNodes[index].push(node);

        // Return -1 as the array is zero indexed.
        return this._tsb.indexToNodes[index].length - 1;
    }

    /**
     * Replace various newlines characters with spaces.
     *
     * @param text The text to check
     * @returns    The new string with no newlines
     */
    replaceInvalidCharacters = function(text: string): string {
        return text.replace(/(?:\r\n|\r|\n)/g, ' ');
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
    width: number;
    height: number;
    // Hyphen properties.
    hasHyphen: boolean = false;     // Example: hyphenation --> true
    hyphenIndexPositions: number[]; // hy-phen-ation        --> [1, 5]
    hyphenIndexWidths: number[];    // hy: 16, phen: 31.1   --> [16, 31.1]
    hyphenRemainWidth: number;      // ation: 32            --> 32
    dashWidth: number;              // "-" : 5.3            --> 5.3

    /**
     * @param text The text of the word
     */
    constructor(nodeIndex: number, text: string) {
        super(nodeIndex, TypesetBotToken.types.WORD);
        this.text = text;
    }

    initHyphen = function() {
        this.hasHyphen = true;
        this.hyphenIndexPositions = [];
        this.hyphenIndexWidths = [];
        this.hyphenRemainWidth = 0;
        this.dashWidth = 0;
    }
}

/**
 * Class for space tokens.
 */
class TypesetBotSpace extends TypesetBotToken {
    constructor(nodeIndex: number) {
        super(nodeIndex, TypesetBotToken.types.SPACE);
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
