'use strict';

describe('typeset.ts:', function () {
    let loremIpsum =
        '<div class="test">' +
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis volutpat dolor non diam volutpat, laoreet porta risus sollicitudin. Phasellus cursus magna justo, a molestie metus aliquam a. Sed ut tellus non nunc iaculis pulvinar. Etiam suscipit nulla nec dui consectetur varius. Curabitur tortor odio, tincidunt at pharetra ut, varius a mauris. Interdum et malesuada fames ac ante ipsum primis in faucibus. Nulla elementum augue nulla, eget dictum odio auctor sit amet. Nunc commodo in eros at posuere. Aenean blandit auctor justo, porttitor laoreet arcu mattis eget. Nunc malesuada, enim vitae facilisis sagittis, nisl dolor fermentum eros, id euismod est sapien rhoncus velit. Curabitur id nisi id ligula convallis dapibus. Nam congue dolor eget cursus scelerisque. Etiam at sollicitudin nisl. Nullam semper mi dui, et ultrices arcu semper vitae. In quis metus felis.' +
        '</div>';

    let style =
        '<style class="style">' +
            '.test { width: 500px; line-height: 16px; }' +
        '<style>';

    describe('getElementProperties --', function() {
        // @todo
    });
    describe('setWordHyphens --', function() {
        // @todo
    });
    describe('preprocessElement --', function() {
        // @todo
    });
    describe('getFinalLineBreaks --', function() {
        // @todo
    });
    describe('getBreakpoint --', function() {
        // @todo
    });
    describe('initLineProperties --', function() {
        // @todo
    });
    describe('lowestDemerit --', function() {
        it('Expect lowest demerit', function (done) {
            document.body.insertAdjacentHTML('beforeend', style);
            document.body.insertAdjacentHTML('beforeend', loremIpsum);

            let target = document.querySelector('.test');

            let tsb = new TypesetBot('.test');

            setTimeout(function() {

                let bp1 = new TypesetBotLinebreak(null, 1, 0, 300, false, 0, 1, 16);
                let bp2 = new TypesetBotLinebreak(null, 1, 0, 400, false, 0, 1, 16);
                let typeset = tsb.util.getTypesetInstance(target);

                typeset.finalBreakpoints.push(bp1); // Best
                typeset.finalBreakpoints.push(bp2); // Worse

                expect(typeset.lowestDemerit(typeset.finalBreakpoints)).toEqual(bp1);

                done();
            }, 100);
        });
    });
    describe('pushFinalBreakpoint --', function() {
        it('Multiple solutions', function (done) {
            document.body.insertAdjacentHTML('beforeend', style);
            document.body.insertAdjacentHTML('beforeend', loremIpsum);

            let target = document.querySelector('.test');
            let width = 500;


            let tsb = new TypesetBot('.test');

            setTimeout(function() {

                expect(tsb.util.getTypesetInstance(target).finalBreakpoints.length).toBeGreaterThan(10);

                done();
            }, 100);
        });
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

            expect(typeset.isShortestPath(bp1)).toEqual(false);
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

        it('Token index', function() {
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

        it('Hyphen index', function() {
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
});
