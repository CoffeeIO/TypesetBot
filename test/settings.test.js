'use strict';

describe('Settings testing:', function () {

    // Default settings the program will use.
    var defaultSettings = {
        // Algorithm.
        alignment: 'justify', // Other options are 'ragged-right', 'ragged-left' and 'ragged-center'

        hyphenPenalty: 50, // Penalty for line-breaking on a hyphen
        hyphenPenaltyRagged: 500, // Penalty for line-breaking on a hyphen when using ragged text
        flagPenalty: 3000, // Penalty when current and last line had flag value 1. Reffered to as 'α'
        fitnessClassDemerit: 3000, // Penalty when switching between ratio classes. Reffered to as 'γ'
        demeritOffset: 1, // Offset to prefer fewer lines by increasing demerit of "~zero badness lines"

        // "the value of q is increased by 1 (if q < 0) or decreased by 1 (if q > 0) until a feasible solution is
        //  found." - DT p.114
        loosenessParam: 0, // If zero we find to solution with fewest total demerits. Reffered to as 'q'
        absoluteMaxRatio: 5, // Max adjustment ratio before we give up on finding solutions

        maxRatio: 2, // Maximum acceptable adjustment ratio. Referred to as 'p'
        minRatio: -1, // Minimum acceptable adjustment ratio. Less than -1 will make the text too closely spaced.

        // Hyphen.
        hyphenLanguage: 'en-us', // Language of hyphenation patterns to use
        hyphenLeftMin: 2, // Minimum number of letters to keep on the left side of word
        hyphenRightMin: 2, // Minimum number of letters to keep on the right side of word

        // 4 classes of adjustment ratios.
        fitnessClass: [-1, -0.5, 0.5, 1, Infinity],

        // Font.
        spaceUnit: 'em', // Space width unit, em is relative to font-size
        spaceWidth: 1/3, // Ideal space width
        spaceStretchability: 1/6, // How much can the space width stretch
        spaceShrinkability: 1/9, // How much can the space width shrink

        // Inline element that the program will unwrap from paragraphs as they could disrupt the line breaking.
        unwrapElements: ['img'],


        // Dynamic width.

        // Allow the paragraph to account for overlapping elements, turn this off if you know there's no overlapping
        // element to gain performance.
        dynamicWidth: true,
        // Pixel increment of vertical search, higher better performance, lower more accurate result.
        dynamicWidthIncrement: 5,

        // Functions.

        ratio (idealW, actualW, wordCount, shrink, stretch, settings) { // Adjustment ratio
            if (actualW < idealW) {
                return (idealW - actualW) / ((wordCount - 1) * stretch);
            }

            return (idealW - actualW) / ((wordCount - 1) * shrink);
        },
        badness (ratio, settings) { // Badness calculation
            if (ratio == null || ratio < settings.minRatio) {
                return Infinity;
            }

            return 100 * Math.pow(Math.abs(ratio), 3) + 0.5;
        },
        demerit (badness, penalty, flag, settings) { // Demerit calculation
            var flagPenalty = flag ? settings.flagPenalty : 0;
            if (penalty >= 0) {
                return Math.pow(settings.demeritOffset + badness + penalty, 2) + flagPenalty;
            } else if (penalty === -Infinity) {
                return Math.pow(settings.demeritOffset + badness, 2) + flagPenalty;
            } else {
                return Math.pow(settings.demeritOffset + badness, 2) - Math.pow(penalty, 2) + flagPenalty;
            }
        }
    };

    beforeEach(function(done) {
        spyOn(console, 'error');
        done();
    });

    describe('Validate settings:', function () {
        it('Overwrite default options', function () {
            var custom = {
                maxRatio: 3,
                classes: [-1, -0.6, 0.5, 1, Infinity],
                spaceStretchability: '1/6',
            };
            var newSettings = TypesetBot.settings.get(custom);

            expect(newSettings.alignment).toEqual('justify'); // No overwrite use default
            expect(newSettings.classes[1]).toEqual(-0.6); // Overwrite array
            expect(newSettings.maxRatio).toEqual(3); // Overwrite
            expect(newSettings.minRatio).toEqual(-1); // No overwrite use default
        });

        it('Empty settings', function () {
            var newSettings = TypesetBot.settings.get({});
            expect(JSON.stringify(newSettings)).toEqual(JSON.stringify(defaultSettings));
        });

        it('Null settings', function () {
            var newSettings = TypesetBot.settings.get(null);
            expect(JSON.stringify(newSettings)).toEqual(JSON.stringify(defaultSettings));
        });

        it('Unknown settings', function () {
            var custom = {
                algorithm: 'total-fit',
                newOption: 'Custom option'
            };
            var newSettings = TypesetBot.settings.get(custom);
            expect(newSettings.newOption).toEqual('Custom option');
        });


    });
});
