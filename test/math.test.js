'use strict';

describe('Math calculations:', function () {
    describe('Calculate adjustment ratio', function () {
        it('Perfect fit', function () {
            var settings = TypesetBot.settings.validate();
            expect(TypesetBot.math.calcAdjustmentRatio(500, 500, 10, 16 / 9, 16 / 6, settings)).toEqual(0);
        });
        it('Loose fit', function () {
            var settings = TypesetBot.settings.validate();
            expect(TypesetBot.math.calcAdjustmentRatio(500, 480, 10, 16 / 9, 16 / 6, settings))
            .not.toBeLessThan(0);
        });
        it('Tight fit', function () {
            var settings = TypesetBot.settings.validate();
            expect(TypesetBot.math.calcAdjustmentRatio(500, 510, 10, 16 / 9, 16 / 6, settings)).toBeLessThan(0);
        });
    });

    describe('Calculate badness', function () {
        it('Normal ratios', function () {
            var settings = TypesetBot.settings.validate();
            expect(TypesetBot.math.calcBadness(0.5, settings)).toEqual(13); // 100 * |0.5|^3 + 0.5
            expect(TypesetBot.math.calcBadness(-0.5, settings))
                .not.toBeLessThan(0); // Should only return positive values
            expect(TypesetBot.math.calcBadness(0.5, settings))
                .toBeLessThan(TypesetBot.math.calcBadness(0.51, settings));
        });
        it('Less than min ratio', function () {
            var settings = TypesetBot.settings.validate();
            expect(TypesetBot.math.calcBadness(-1, settings)).not.toEqual(Infinity);
            expect(TypesetBot.math.calcBadness(-1.0001, settings)).toEqual(Infinity);
        });
        it('Null ratio', function () {
            var settings = TypesetBot.settings.validate();
            expect(TypesetBot.math.calcBadness(null, settings)).toEqual(Infinity);
            expect(TypesetBot.math.calcBadness(undefined, settings)).toEqual(Infinity);
        });
    });

    describe('Calculate demerit', function () {
        it('Zero penalty', function () {
            var settings = TypesetBot.settings.validate();
            expect(TypesetBot.math.calcDemerit(10, 0, false, settings)).toEqual(121); // (1 + 10 + 0)^2 + 0
        });
        it('Positive penalty', function () {
            var settings = TypesetBot.settings.validate();
            expect(TypesetBot.math.calcDemerit(10, 50, false, settings)).toEqual(3721); // (1 + 10 + 50)^2 + 0
            expect(TypesetBot.math.calcDemerit(10, 50, false, settings))
                .toBeLessThan(TypesetBot.math.calcDemerit(10, 51, false, settings));
            expect(TypesetBot.math.calcDemerit(10, 50, false, settings))
                .toBeLessThan(TypesetBot.math.calcDemerit(11, 50, false, settings));
        });
        it('Negative penalty', function () {
            var settings = TypesetBot.settings.validate();
            expect(TypesetBot.math.calcDemerit(10, -50, false, settings)).toEqual(-2379); // (1 + 10)^2 - 50^2 + 0
        });
        it('Negative infinity penalty', function () {
            var settings = TypesetBot.settings.validate();
            expect(TypesetBot.math.calcDemerit(10, -Infinity, false, settings)).toEqual(121); // (1 + 10)^2 + 0
        });
        it('Penalty and flags', function () {
            var settings = TypesetBot.settings.validate(),
                zeroPenalty = TypesetBot.math.calcDemerit(10, 0, false, settings),
                penalty = TypesetBot.math.calcDemerit(10, 50, false, settings),
                zeroPenaltyFlag = TypesetBot.math.calcDemerit(10, 0, true, settings),
                penaltyFlag = TypesetBot.math.calcDemerit(10, 50, true, settings);

            expect(zeroPenalty).toBeLessThan(penalty);
            expect(zeroPenaltyFlag).toBeLessThan(penaltyFlag);
            expect(penalty).toBeLessThan(penaltyFlag);
        });
    });

});
