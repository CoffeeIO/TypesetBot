class TypesetBotTokenizer {
    private _tsb: TypesetBot;

    constructor(tsb: TypesetBot) {
        this._tsb = tsb;
        
    }

    tokenize = function(nodes: Array<Element>) {

    }

}

class TypesetBotToken {
    readonly types = {
        WORD:  1,
        SPACE: 2,
        TAG:   3
    };
    type: number;
    
    initType = function(type: number) {
        this.type = type;
    }
}

class TypesetBotTag extends TypesetBotToken {
    tag: string;
    isEndTag: boolean;

    constructor(tag: string, isEndTag: boolean) {
        super();
        this.initType(this.types.TAG);
        this.tag = tag;
        this.isEndTag = isEndTag;
    }
}

class TypesetBotWord extends TypesetBotToken {
    text: string;

    constructor(text: string) {
        super();
        this.initType(this.types.WORD);
        this.text = text;
    }
}

class TypesetBotSpace extends TypesetBotToken {
    constructor() {
        super();
        this.initType(this.types.SPACE);
    }
}
