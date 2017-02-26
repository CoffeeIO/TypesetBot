TypesetBot.node = function (obj) {
    var nodeObj = {
        penalty: 0,
        flag: false,
        wordIndex: 0,
        fitnessClass: 1,
        lineNumber: 0,
        wordPointer: null,
        demeritTotal: 0,
        totalWidth: 0,
        totalStretch: 0,
        totalShrink: 0
    };

    return nodeObj;
};
