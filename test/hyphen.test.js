'use strict';

describe('Hyphenation:', function () {
    beforeEach(function(done) {
        $('.unittest').remove(); // Remove existing tex documents
        $('body').append(__html__['fixtures/test1']);
        done();
    });

    describe('Hyphenate word:', function () {
        it('Normal words', function () {
            var settings = TypesetBot.settings.get();
            expect(TypesetBot.hyphen.word('hyphenation', settings)).toEqual(['hy', 'phen', 'ation']);
            expect(TypesetBot.hyphen.word('test', settings)).toEqual(['test']);
        });
        it('Adjusting hyphen settings', function () {
            var settings = TypesetBot.settings.get({hyphenLanguage: 'da'});
            expect(TypesetBot.hyphen.word('hyphenate', settings)).toEqual(['hyp', 'he', 'na', 'te']);

            settings = TypesetBot.settings.get({hyphenLanguage: 'da', hyphenRightMin: 3, hyphenLeftMin: 4});
            expect(TypesetBot.hyphen.word('hyphenate', settings)).toEqual(['hyphe', 'nate']);
        });
        it('Language not found', function () {
            var settings = TypesetBot.settings.get({hyphenLanguage: 'gg'});
            expect(TypesetBot.hyphen.word('hyphenate', settings)).toEqual(null);
        });
    });

});
