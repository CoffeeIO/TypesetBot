'use strict';

describe('typeset.ts:', function () {

    describe('typeset --', function() {
        // @todo
    });
    describe('reset --', function() { // Tested in main.test.js
        // @todo
    });
    describe('getElementProperties --', function() {
        // @todo
    });
    describe('setWordHyphens --', function() {
        // @todo
    });
    describe('preprocessElement --', function() {
        // @todo
    });
    describe('lowestDemerit --', function() {
        // @todo
    });
    describe('getFinalLineBreaks --', function() {
        // @todo
    });
    describe('pushFinalBreakpoint --', function() {
        // @todo
    });
    describe('getBreakpoint --', function() {
        // @todo
    });
    describe('updateShortestPath & isShortestPath --', function() { // Interesting
        it('Replacing solution based on demerit', function() {

            let typeset = new TypesetBotTypeset(new TypesetBot(null, { 'noRun': false }));

            let bp1 = new TypesetBotLinebreak(null, 1, 0, 300, false, 0, 1, 16);
            let bp2 = new TypesetBotLinebreak(null, 1, 0, 600, false, 0, 1, 16);
            let bp3 = new TypesetBotLinebreak(null, 1, 0, 200, false, 0, 1, 16);


            typeset.resetLineBreak();
            expect(typeset.shortestPath).toEqual({});

            expect(typeset.updateShortestPath(bp1)).toEqual(true);
            expect(typeset.updateShortestPath(bp1)).toEqual(false); // Duplicate
            expect(typeset.updateShortestPath(bp2)).toEqual(false); // Worse
            expect(typeset.updateShortestPath(bp3)).toEqual(true);  // Better

            expect(typeset.isShortestPath(bp2)).toEqual(false);
            expect(typeset.isShortestPath(bp3)).toEqual(true);
        });

        it('Different lines', function() {

            let typeset = new TypesetBotTypeset(new TypesetBot(null, { 'noRun': false }));

            let bp1 = new TypesetBotLinebreak(null, 1, 0, 300, false, 0, 1, 16);
            let bp2 = new TypesetBotLinebreak(null, 1, 0, 600, false, 0, 2, 16);
            let bp3 = new TypesetBotLinebreak(null, 1, 0, 200, false, 0, 2, 16);
            let bp4 = new TypesetBotLinebreak(null, 1, 0, 400, false, 0, 1, 16);


            typeset.resetLineBreak();
            expect(typeset.shortestPath).toEqual({});

            expect(typeset.updateShortestPath(bp1)).toEqual(true);
            expect(typeset.updateShortestPath(bp2)).toEqual(true);  // New line
            expect(typeset.updateShortestPath(bp3)).toEqual(true);  // Better
            expect(typeset.updateShortestPath(bp4)).toEqual(false); // Worse

            expect(typeset.isShortestPath(bp1)).toEqual(true);
            expect(typeset.isShortestPath(bp2)).toEqual(false);
            expect(typeset.isShortestPath(bp3)).toEqual(true);
            expect(typeset.isShortestPath(bp4)).toEqual(false);
        });

        it('Token index lines', function() {

            let typeset = new TypesetBotTypeset(new TypesetBot(null, { 'noRun': false }));

            let bp1 = new TypesetBotLinebreak(null, 9, 0, 300, false, 0, 3, 16);
            let bp2 = new TypesetBotLinebreak(null, 10, 0, 200, false, 0, 3, 16);
            let bp3 = new TypesetBotLinebreak(null, 9, 0, 200, false, 0, 3, 16);
            let bp4 = new TypesetBotLinebreak(null, 10, 0, 400, false, 0, 3, 16);

            typeset.resetLineBreak();
            expect(typeset.shortestPath).toEqual({});

            expect(typeset.updateShortestPath(bp1)).toEqual(true);
            expect(typeset.updateShortestPath(bp2)).toEqual(true);  // New token
            expect(typeset.updateShortestPath(bp3)).toEqual(true);  // Better
            expect(typeset.updateShortestPath(bp4)).toEqual(false); // Worse

            expect(typeset.isShortestPath(bp1)).toEqual(false);
            expect(typeset.isShortestPath(bp2)).toEqual(true);
            expect(typeset.isShortestPath(bp3)).toEqual(true);
            expect(typeset.isShortestPath(bp4)).toEqual(false);
        });

        it('Hyphen index lines', function() {

            let typeset = new TypesetBotTypeset(new TypesetBot(null, { 'noRun': false }));

            let bp1 = new TypesetBotLinebreak(null, 9, null, 200, false, 0, 3, 16);
            let bp2 = new TypesetBotLinebreak(null, 9, 1, 200, false, 0, 3, 16);
            let bp3 = new TypesetBotLinebreak(null, 9, 0, 200, false, 0, 3, 16);
            let bp4 = new TypesetBotLinebreak(null, 10, 0, 200, false, 0, 3, 16);
            let bp5 = new TypesetBotLinebreak(null, 9, 0, 200, false, 0, 2, 16);

            typeset.resetLineBreak();
            expect(typeset.shortestPath).toEqual({});

            expect(typeset.updateShortestPath(bp1)).toEqual(true);
            expect(typeset.updateShortestPath(bp2)).toEqual(true);  // New hyphen
            expect(typeset.updateShortestPath(bp3)).toEqual(true);  // New hyphen
            expect(typeset.updateShortestPath(bp4)).toEqual(true);  // New token
            expect(typeset.updateShortestPath(bp5)).toEqual(true);  // New line

            expect(typeset.isShortestPath(bp1)).toEqual(true);
            expect(typeset.isShortestPath(bp2)).toEqual(true);
            expect(typeset.isShortestPath(bp3)).toEqual(true);
            expect(typeset.isShortestPath(bp4)).toEqual(true);
            expect(typeset.isShortestPath(bp5)).toEqual(true);
        });
    });
    describe('appendToTokenMap --', function() {
        // @todo
    });
    describe('initLineProperties --', function() {
        // @todo
    });
});
