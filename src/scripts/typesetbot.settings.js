TypesetBot.settings = (function(obj){

    // Default settings the program will use.
    var defaultSettings = {
        // Algorithm.
        algorithm: 'total-fit', // Other options are 'first-fit' and 'best-fit'
        alignment: 'justify', // Other options are 'ragged-right' and 'ragged-center'

        hyphenPenalty: 50,
        hyphenPenaltyRagged: 500,
        q: undefined,

        maxRatio: undefined,
        minRatio: 1,

        tightClass: '-1 to -0.5',
        normalClass: '-0.5 to 0.5',
        looseClass: '0.5 to 1',
        veryLooseClass: '1 to infinite',

        // Font.
        spaceUnit: 'em',
        spaceWidth: '1/3',
        spaceStretchability: '1/6',
        spaceShrinkability: '1/9',

        // Selectors.
        unwrapElements: ['img']
    };

    obj.getSettings  = function (settings) {
        throw "Not implemented";
    };

    return obj;
})(TypesetBot.settings || {});
