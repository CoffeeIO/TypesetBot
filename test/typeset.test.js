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
    describe('isShortestPath --', function() { // Interesting
        // @todo
    });
    describe('updateShortestPath --', function() { // Interesting
        it('Replacing solution based on demerit', function() {

            let typeset = new TypesetBotTypeset(new TypesetBot(null, { 'noRun': false }));

            let bp1 = new TypesetBotLinebreak(null, 1, 0, 300, false, 0, 1, 16);
            let bp2 = new TypesetBotLinebreak(null, 1, 0, 600, false, 0, 1, 16);
            let bp3 = new TypesetBotLinebreak(null, 1, 0, 200, false, 0, 1, 16);


            typeset.resetLineBreak();
            expect(typeset.shortestPath).toEqual({});

            expect(typeset.updateShortestPath(bp1)).toEqual(true);
            expect(typeset.updateShortestPath(bp1)).toEqual(false);
            expect(typeset.updateShortestPath(bp2)).toEqual(false);
            expect(typeset.updateShortestPath(bp3)).toEqual(true);

            expect(typeset.isShortestPath(bp2)).toEqual(false);
            expect(typeset.isShortestPath(bp3)).toEqual(true);
        });
    });
    describe('appendToTokenMap --', function() {
        // @todo
    });
    describe('initLineProperties --', function() {
        // @todo
    });
});
