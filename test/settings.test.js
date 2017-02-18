'use strict';

describe('Settings testing:', function () {

    // Default settings the program will use.
    var defaultSettings = {
        // Algorithm.
        algorithm: 'total-fit', // Other options are 'first-fit' and 'best-fit'
        alignment: 'justify', // Other options are 'ragged-right' and 'ragged-center'

        hyphenPenalty: 50,
        hyphenPenaltyRagged: 500,
        q: null,

        maxRatio: 2, // Algorithm will ignore this max if no other solutions are found.
        minRatio: -1,

        // 4 classes of adjustment ratios.
        classes: [-1, -0.5, 0.5, 1, Infinity],

        // Font.
        spaceUnit: 'em',
        spaceWidth: '1/3',
        spaceStretchability: '1/6',
        spaceShrinkability: '1/9',

        // Inline element that the program will unwrap from paragraphs as they could disrupt the line breaking.
        unwrapElements: ['img']
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
            var newSettings = TypesetBot.settings.validate(custom);

            expect(newSettings.algorithm).toEqual('total-fit'); // No overwrite use default
            expect(newSettings.classes[1]).toEqual(-0.6); // Overwrite array
            expect(newSettings.maxRatio).toEqual(3); // Overwrite
            expect(newSettings.minRatio).toEqual(-1); // No overwrite use default
        });

        it('Empty settings', function () {
            var newSettings = TypesetBot.settings.validate({});
            expect(newSettings).toEqual(defaultSettings);
        });

        it('Null settings', function () {
            var newSettings = TypesetBot.settings.validate(null);
            expect(newSettings).toEqual(defaultSettings);
        });

        it('Unknown settings', function () {
            var custom = {
                algorithm: 'total-fit',
                newOption: 'Custom option'
            };
            var newSettings = TypesetBot.settings.validate(custom);
            expect(newSettings.newOption).toEqual('Custom option');
        });


    });
});
