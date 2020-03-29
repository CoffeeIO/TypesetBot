'use strict';

describe('hyphen.ts:', function() {

    let defaultSettings = {
        'noRun': true,
        'hyphenLanguage': 'en-us',
        'hyphenLeftMin': 2,
        'hyphenRightMin': 2,
        'logs': ['error', 'warn', 'log'],
    };

    let fixture =
        '<div class="test">' +
            'Hello world' +
        '</div>';

    describe('hyphenate --', function() {
        it('Hyphenate english word', function(done) {
            let tsb1 = new TypesetBot(null, defaultSettings);

            setTimeout(function() {

                let hyphen = new TypesetBotHyphen(tsb1);
                let wordparts = hyphen.hyphenate('hyphenation');

                expect(wordparts.length).toEqual(3);
                expect(wordparts).toEqual(['hy', 'phen', 'ation']);

                done();
            }, 100);
        });
        it('Hyphenate english GB word', function(done) {
            const settings = Object.assign({}, defaultSettings);
            settings.hyphenLanguage = 'en-gb';
            let tsb1 = new TypesetBot(null, settings);

            setTimeout(function() {

                let hyphen = new TypesetBotHyphen(tsb1);
                let wordparts = hyphen.hyphenate('hyphenation');

                expect(wordparts.length).toEqual(4);
                expect(wordparts).toEqual(['hy', 'phen', 'a', 'tion']);

                done();
            }, 100);
        });
        it('Hyphenate word left min', function(done) {
            const settings = Object.assign({}, defaultSettings);
            settings.hyphenLanguage = 'en-gb';
            settings.hyphenLeftMin = 3;
            let tsb1 = new TypesetBot(null, settings);

            setTimeout(function() {

                let hyphen = new TypesetBotHyphen(tsb1);
                let wordparts = hyphen.hyphenate('hyphenation');

                expect(wordparts.length).toEqual(3);
                expect(wordparts).toEqual(['hyphen', 'a', 'tion']);

                done();
            }, 100);
        });
        it('Hyphenate word right min', function(done) {
            const settings = Object.assign({}, defaultSettings);
            settings.hyphenLanguage = 'en-gb';
            settings.hyphenRightMin = 5;
            let tsb1 = new TypesetBot(null, settings);

            setTimeout(function() {

                let hyphen = new TypesetBotHyphen(tsb1);
                let wordparts = hyphen.hyphenate('hyphenation');

                expect(wordparts.length).toEqual(3);
                expect(wordparts).toEqual(['hy', 'phen', 'ation']);

                done();
            }, 100);
        });

        it('Hyphenate danish word, no library', function(done) {
            const settings = Object.assign({}, defaultSettings);
            settings.hyphenLanguage = 'da';

            let tsb1 = new TypesetBot(null, settings);

            setTimeout(function() {

                let hyphen = new TypesetBotHyphen(tsb1);
                let wordparts = hyphen.hyphenate('hyphenate');

                expect(wordparts).toEqual(['hyphenate']);

                done();
            }, 100);
        });
        it('Hyphenate word - null library', function(done) {
            const settings = Object.assign({}, defaultSettings);
            settings.hyphenLanguage = null;

            let tsb1 = new TypesetBot(null, settings);

            setTimeout(function() {

                let hyphen = new TypesetBotHyphen(tsb1);
                let wordparts = hyphen.hyphenate('hyphenate');

                expect(wordparts).toEqual(['hyphenate']);

                done();
            }, 100);
        });
        it('Hyphenate word - empty library', function(done) {
            const settings = Object.assign({}, defaultSettings);
            settings.hyphenLanguage = '';

            let tsb1 = new TypesetBot(null, settings);

            setTimeout(function() {

                let hyphen = new TypesetBotHyphen(tsb1);
                let wordparts = hyphen.hyphenate('hyphenate');

                expect(wordparts).toEqual(['hyphenate']);

                done();
            }, 100);
        });
        it('Hyphenate word - unknown library', function(done) {
            const settings = Object.assign({}, defaultSettings);
            settings.hyphenLanguage = 'wasd';

            let tsb1 = new TypesetBot(null, settings);

            setTimeout(function() {

                let hyphen = new TypesetBotHyphen(tsb1);
                let wordparts = hyphen.hyphenate('hyphenate');

                expect(wordparts).toEqual(['hyphenate']);

                done();
            }, 100);
        });
    });
    describe('getWordOffset --', function() {
        it('Normal word, no offset', function(done) {
            let tsb1 = new TypesetBot(null, defaultSettings);

            setTimeout(function() {

                let hyphen = new TypesetBotHyphen(tsb1);
                let offset = hyphen.getWordOffset('hyphenate');

                expect(offset.left).toEqual(0);
                expect(offset.right).toEqual(0);

                done();
            }, 100);
        });
        it('Special characters', function(done) {
            let tsb1 = new TypesetBot(null, defaultSettings);

            setTimeout(function() {

                let hyphen = new TypesetBotHyphen(tsb1);
                let offset = hyphen.getWordOffset(',|Hello.$.');

                expect(offset.left).toEqual(2);
                expect(offset.right).toEqual(3);

                done();
            }, 100);
        });
    });
    describe('getEndWidth --', function() {
        it('General', function(done) {
            let tsb1 = new TypesetBot(null, defaultSettings);

            setTimeout(function() {

                let hyphen = new TypesetBotHyphen(tsb1);
                let width = hyphen.getEndWidth([3,4], 0, 7);

                expect(width).toEqual(11);

                done();
            }, 100);
        })
    });
    describe('nextWord --', function() {
        // Should be implemented.
    });
});
