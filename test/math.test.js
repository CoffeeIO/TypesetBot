'use strict';

describe('math.ts:', function () {

    let defaultSettings = {
        'noRun': true,
        'logs': ['error', 'warn', 'log'],
    };

    let fixture =
        '<div class="test">' +
            'Hello world' +
        '</div>';

    describe('getRatio --', function() {
        it('Perfect fit', function(done) {
            let tsb1 = new TypesetBot(null, defaultSettings);

            setTimeout(function() {
                let math = new TypesetBotMath(tsb1);
                let ratio = math.getRatio(500, 500, 10, 16/9, 16/6);

                expect(ratio).toEqual(0);

                done();
            }, 100);
        });
        it('Loose fit', function(done) {
            let tsb1 = new TypesetBot(null, defaultSettings);

            setTimeout(function() {
                let math = new TypesetBotMath(tsb1);
                let ratio = math.getRatio(500, 480, 10, 16/9, 16/6);

                expect(ratio).not.toBeLessThan(0);

                done();
            }, 100);
        });
        it('Tight fit', function(done) {
            let tsb1 = new TypesetBot(null, defaultSettings);

            setTimeout(function() {
                let math = new TypesetBotMath(tsb1);
                let ratio = math.getRatio(500, 510, 10, 16/9, 16/6);

                expect(ratio).toBeLessThan(0);

                done();
            }, 100);
        });
    });
    describe('getBadness --', function() {
        it('Normal ratios', function (done) {
            let tsb1 = new TypesetBot(null, defaultSettings);
            setTimeout(function() {
                let math = new TypesetBotMath(tsb1);

                expect(math.getBadness(0.5)).toEqual(13); // 100 * |0.5|^3 + 0.5
                expect(math.getBadness(-0.5)).not.toBeLessThan(0);
                expect(math.getBadness(0.5)).toBeLessThan(math.getBadness(-0.51));
                expect(math.getBadness(0.5)).toEqual(math.getBadness(-0.5));

                done();
            }, 100);
        });
        it('Less than min ratio', function (done) {
            let tsb1 = new TypesetBot(null, defaultSettings);
            setTimeout(function() {
                let math = new TypesetBotMath(tsb1);

                expect(math.getBadness(-1)).not.toEqual(Infinity);
                expect(math.getBadness(-1.0001)).toEqual(Infinity);

                done();
            }, 100);
        });
        it('Null ratio', function (done) {
            let tsb1 = new TypesetBot(null, defaultSettings);
            setTimeout(function() {
                let math = new TypesetBotMath(tsb1);

                expect(math.getBadness(null)).toEqual(Infinity);
                expect(math.getBadness(undefined)).toEqual(Infinity);

                done();
            }, 100);
        });

    });
    describe('getDemeritFromBadness --', function() {
        it('Zero penalty', function (done) {
            let tsb1 = new TypesetBot(null, defaultSettings);
            setTimeout(function() {
                let math = new TypesetBotMath(tsb1);

                expect(math.getDemeritFromBadness(10, 0, false)).toEqual(121);

                done();
            }, 100);
        });
        it('Positive penalty', function (done) {
            let tsb1 = new TypesetBot(null, defaultSettings);
            setTimeout(function() {
                let math = new TypesetBotMath(tsb1);

                expect(math.getDemeritFromBadness(10, 50, false)).toEqual(3721); // (1 + 10 + 50)^2 + 0
                expect(math.getDemeritFromBadness(10, 50, false)).toBeLessThan(math.getDemeritFromBadness(10, 51, false))
                expect(math.getDemeritFromBadness(10, 50, false)).toBeLessThan(math.getDemeritFromBadness(11, 50, false))

                done();
            }, 100);
        });
        it('Negative penalty', function (done) {
            let tsb1 = new TypesetBot(null, defaultSettings);
            setTimeout(function() {
                let math = new TypesetBotMath(tsb1);

                expect(math.getDemeritFromBadness(10, -50, false)).toEqual(-2379); // (1 + 10)^2 - 50^2 + 0

                done();
            }, 100);
        });
        it('Negative infinity penalty', function (done) {
            let tsb1 = new TypesetBot(null, defaultSettings);
            setTimeout(function() {
                let math = new TypesetBotMath(tsb1);

                expect(math.getDemeritFromBadness(10, -Infinity, false)).toEqual(121); // (1 + 10)^2 + 0

                done();
            }, 100);
        });
        it('Penalty and flags', function (done) {
            let tsb1 = new TypesetBot(null, defaultSettings);
            setTimeout(function() {
                let math = new TypesetBotMath(tsb1);
                let zeroPenalty = math.getDemerit(10, 0, false);
                let penalty = math.getDemerit(10, 50, false);
                let zeroPenaltyFlag = math.getDemerit(10, 0, true);
                let penaltyFlag = math.getDemerit(10, 50, true);

                expect(zeroPenalty).toBeLessThan(penalty);
                expect(zeroPenaltyFlag).toBeLessThan(penaltyFlag);
                expect(penalty).toBeLessThan(penaltyFlag);

                done();
            }, 100);
        });
    });
    describe('getDemerit --', function() {
        it('Ideal ratio', function (done) {
            let tsb1 = new TypesetBot(null, defaultSettings);
            setTimeout(function() {
                let math = new TypesetBotMath(tsb1);

                expect(math.getDemerit(0, false, false, false)).toBeLessThan(math.getDemerit(0.5, false, false, false));
                expect(math.getDemerit(0, false, false, false)).toBeLessThan(math.getDemerit(-0.5, false, false, false));

                done();
            }, 100);
        });
        it('Flags', function (done) {
            let tsb1 = new TypesetBot(null, defaultSettings);
            setTimeout(function() {
                let math = new TypesetBotMath(tsb1);

                expect(math.getDemerit(0, false, false, false)).toBeLessThan(math.getDemerit(0, true, false, false));
                expect(math.getDemerit(0, false, false, false)).toBeLessThan(math.getDemerit(0, false, true, false));
                expect(math.getDemerit(0, false, false, false)).toBeLessThan(math.getDemerit(0, false, false, true));

                expect(math.getDemerit(0, false, false, false)).toBeLessThan(math.getDemerit(1, true, false, false));
                expect(math.getDemerit(0, false, false, false)).toBeLessThan(math.getDemerit(1, false, true, false));
                expect(math.getDemerit(0, false, false, false)).toBeLessThan(math.getDemerit(1, false, false, true));

                done();
            }, 100);
        });
        it('Penalty settings', function (done) {
            const settings = Object.assign({}, defaultSettings);
            settings.hyphenPenalty = 50;
            settings.hyphenPenaltyRagged = 500;
            settings.fitnessClassDemerit = 3000;
            settings.flagPenalty = 3000;
            settings.alignment = 'justify';

            const settings2 = Object.assign({}, defaultSettings);
            settings2.flagPenalty = 4000;

            const settings3 = Object.assign({}, defaultSettings);
            settings3.hyphenPenalty = 100;

            const settings4 = Object.assign({}, defaultSettings);
            settings4.fitnessClassDemerit = 4000;

            const settings5 = Object.assign({}, defaultSettings);
            settings5.alignment = 'left';

            setTimeout(function() {
                let math1 = new TypesetBotMath(new TypesetBot(null, settings));
                let math2 = new TypesetBotMath(new TypesetBot(null, settings2));
                let math3 = new TypesetBotMath(new TypesetBot(null, settings3));
                let math4 = new TypesetBotMath(new TypesetBot(null, settings4));
                let math5 = new TypesetBotMath(new TypesetBot(null, settings5));

                // Increase flag penalty.
                expect(math1.getDemerit(0, false, false, false)).toEqual(math2.getDemerit(0, false, false, false));
                expect(math1.getDemerit(0, true, false, false)).toBeLessThan(math2.getDemerit(0, true, false, false));

                // Increase hyphen penalty.
                expect(math1.getDemerit(0, false, false, false)).toEqual(math3.getDemerit(0, false, false, false));
                expect(math1.getDemerit(0, false, true, false)).toBeLessThan(math3.getDemerit(0, false, true, false));

                // Increase class demerit.
                expect(math1.getDemerit(0, false, false, false)).toEqual(math4.getDemerit(0, false, false, false));
                expect(math1.getDemerit(0, false, false, true)).toBeLessThan(math4.getDemerit(0, false, false, true));

                // Change alignment to ragged.
                expect(math1.getDemerit(0, false, false, false)).toEqual(math5.getDemerit(0, false, false, false));
                expect(math1.getDemerit(0, false, true, false)).toBeLessThan(math5.getDemerit(0, false, true, false));

                done();
            }, 100);
        });
    });
    describe('getFitnessClass --', function() {
        it('Good ratio', function (done) {
            let tsb1 = new TypesetBot(null, defaultSettings);
            setTimeout(function() {
                let math = new TypesetBotMath(tsb1);

                expect(math.getFitnessClass(0.49)).toEqual(0.5);
                expect(math.getFitnessClass(0)).toEqual(0.5);
                expect(math.getFitnessClass(-0.51)).toEqual(-0.5);

                done();
            }, 100);
        });
        it('Lowest ratio', function (done) {
            let tsb1 = new TypesetBot(null, defaultSettings);
            setTimeout(function() {
                let math = new TypesetBotMath(tsb1);

                expect(math.getFitnessClass(-Infinity)).toEqual(-1);

                done();
            }, 100);
        });
        it('Highest ratio', function (done) {
            let tsb1 = new TypesetBot(null, defaultSettings);
            setTimeout(function() {
                let math = new TypesetBotMath(tsb1);

                expect(math.getFitnessClass(100)).toEqual(Infinity);
                expect(math.getFitnessClass(Infinity)).toEqual(Infinity);

                done();
            }, 100);
        });
    });
    describe('isValidRatio --', function() {
        it('Valid', function (done) {
            let tsb1 = new TypesetBot(null, defaultSettings);
            setTimeout(function() {
                let math = new TypesetBotMath(tsb1);

                expect(math.isValidRatio(0.5, 0)).toEqual(true);
                expect(math.isValidRatio(-1, 0)).toEqual(true);
                expect(math.isValidRatio(1, 0)).toEqual(true);
                expect(math.isValidRatio(2, 0)).toEqual(true);

                done();
            }, 100);
        });
        it('Invalid', function (done) {
            let tsb1 = new TypesetBot(null, defaultSettings);
            setTimeout(function() {
                let math = new TypesetBotMath(tsb1);

                expect(math.isValidRatio(-Infinity, 0)).toEqual(false);
                expect(math.isValidRatio(-1.1, 0)).toEqual(false);
                expect(math.isValidRatio(Infinity, 0)).toEqual(false);
                expect(math.isValidRatio(2.1, 0)).toEqual(false);

                done();
            }, 100);
        });
        it('Increased looseness', function(done) {
            let tsb1 = new TypesetBot(null, defaultSettings);
            setTimeout(function() {
                let math = new TypesetBotMath(tsb1);

                expect(math.isValidRatio(-1.1, 1)).toEqual(false);
                expect(math.isValidRatio(3, 1)).toEqual(true);
                expect(math.isValidRatio(3.1, 1)).toEqual(false);
                expect(math.isValidRatio(5, 3)).toEqual(true);
                expect(math.isValidRatio(5.1, 3)).toEqual(false);

                done();
            }, 100);
        });
    });
});
