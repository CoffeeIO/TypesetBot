'use strict';

describe('Math calculations:', function () {
    describe('Calculate adjustment ratio', function () {
        it('Perfect fit', function () {
            var settings = TypesetBot.settings.get();
            expect(TypesetBot.math.getAdjustmentRatio(500, 500, 10, 16 / 9, 16 / 6, settings)).toEqual(0);
        });
        it('Loose fit', function () {
            var settings = TypesetBot.settings.get();
            expect(TypesetBot.math.getAdjustmentRatio(500, 480, 10, 16 / 9, 16 / 6, settings))
            .not.toBeLessThan(0);
        });
        it('Tight fit', function () {
            var settings = TypesetBot.settings.get();
            expect(TypesetBot.math.getAdjustmentRatio(500, 510, 10, 16 / 9, 16 / 6, settings)).toBeLessThan(0);
        });
    });

    describe('Calculate badness', function () {
        it('Normal ratios', function () {
            var settings = TypesetBot.settings.get();
            expect(TypesetBot.math.getBadness(0.5, settings)).toEqual(13); // 100 * |0.5|^3 + 0.5
            expect(TypesetBot.math.getBadness(-0.5, settings))
                .not.toBeLessThan(0); // Should only return positive values
            expect(TypesetBot.math.getBadness(0.5, settings))
                .toBeLessThan(TypesetBot.math.getBadness(0.51, settings));
        });
        it('Less than min ratio', function () {
            var settings = TypesetBot.settings.get();
            expect(TypesetBot.math.getBadness(-1, settings)).not.toEqual(Infinity);
            expect(TypesetBot.math.getBadness(-1.0001, settings)).toEqual(Infinity);
        });
        it('Null ratio', function () {
            var settings = TypesetBot.settings.get();
            expect(TypesetBot.math.getBadness(null, settings)).toEqual(Infinity);
            expect(TypesetBot.math.getBadness(undefined, settings)).toEqual(Infinity);
        });
    });

    describe('Calculate demerit', function () {
        it('Zero penalty', function () {
            var settings = TypesetBot.settings.get();
            expect(TypesetBot.math.getDemerit(10, 0, false, settings)).toEqual(121); // (1 + 10 + 0)^2 + 0
        });
        it('Positive penalty', function () {
            var settings = TypesetBot.settings.get();
            expect(TypesetBot.math.getDemerit(10, 50, false, settings)).toEqual(3721); // (1 + 10 + 50)^2 + 0
            expect(TypesetBot.math.getDemerit(10, 50, false, settings))
                .toBeLessThan(TypesetBot.math.getDemerit(10, 51, false, settings));
            expect(TypesetBot.math.getDemerit(10, 50, false, settings))
                .toBeLessThan(TypesetBot.math.getDemerit(11, 50, false, settings));
        });
        it('Negative penalty', function () {
            var settings = TypesetBot.settings.get();
            expect(TypesetBot.math.getDemerit(10, -50, false, settings)).toEqual(-2379); // (1 + 10)^2 - 50^2 + 0
        });
        it('Negative infinity penalty', function () {
            var settings = TypesetBot.settings.get();
            expect(TypesetBot.math.getDemerit(10, -Infinity, false, settings)).toEqual(121); // (1 + 10)^2 + 0
        });
        it('Penalty and flags', function () {
            var settings = TypesetBot.settings.get(),
                zeroPenalty = TypesetBot.math.getDemerit(10, 0, false, settings),
                penalty = TypesetBot.math.getDemerit(10, 50, false, settings),
                zeroPenaltyFlag = TypesetBot.math.getDemerit(10, 0, true, settings),
                penaltyFlag = TypesetBot.math.getDemerit(10, 50, true, settings);

            expect(zeroPenalty).toBeLessThan(penalty);
            expect(zeroPenaltyFlag).toBeLessThan(penaltyFlag);
            expect(penalty).toBeLessThan(penaltyFlag);
        });
    });

    describe('Calculate fitness class', function () {
        it('Good ratio', function () {
            var settings = TypesetBot.settings.get();
            expect(TypesetBot.math.getFitness(0, settings)).toEqual(2);
            // [-1, -0.5, 0.5, 1, Infinity] --> 2
        });
        it('Lowest ratio', function () {
            var settings = TypesetBot.settings.get();
            expect(TypesetBot.math.getFitness(-Infinity, settings)).toEqual(0);
            // [-1, -0.5, 0.5, 1, Infinity] --> 0
        });
        it('Highest ratio', function () {
            var settings = TypesetBot.settings.get();
            expect(TypesetBot.math.getFitness(100, settings)).toEqual(4);
            expect(TypesetBot.math.getFitness(Infinity, settings)).toEqual(4);
            // [-1, -0.5, 0.5, 1, Infinity] --> 4
        });
    });

    describe('Check valid ratio:', function () {
        it('Valid', function () {
            var settings = TypesetBot.settings.get();
            expect(TypesetBot.math.isValidRatio(0.5, settings)).toEqual(true);
            expect(TypesetBot.math.isValidRatio(-1, settings)).toEqual(true);
            expect(TypesetBot.math.isValidRatio(1, settings)).toEqual(true);
            expect(TypesetBot.math.isValidRatio(2, settings)).toEqual(true);
        });
        it('Invalid', function () {
            var settings = TypesetBot.settings.get();
            expect(TypesetBot.math.isValidRatio(-Infinity, settings)).toEqual(false);
            expect(TypesetBot.math.isValidRatio(-1.1, settings)).toEqual(false);
            expect(TypesetBot.math.isValidRatio(Infinity, settings)).toEqual(false);
            expect(TypesetBot.math.isValidRatio(2.1, settings)).toEqual(false);
        });
    });

});
