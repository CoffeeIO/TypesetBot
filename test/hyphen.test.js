'use strict';

describe('Hyphenation:', function () {

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

    describe('Hyphenation offset:', function () {
        it('Normal word', function () {
            var offset = TypesetBot.hyphen.getWordOffset('hyphen');
            expect(offset.right).toEqual(0);
            expect(offset.left).toEqual(0);
        });
        it('Special character word', function () {
            var offset = TypesetBot.hyphen.getWordOffset(',|Hello.$.');
            expect(offset.right).toEqual(3);
            expect(offset.left).toEqual(2);
        });
    });

    describe('Hyphenation end width:', function () {
        it('Normal word', function () {
            expect(TypesetBot.hyphen.getEndWidth([3, 4], 0, 7)).toEqual(11);
            expect(TypesetBot.hyphen.getEndWidth([3, 4], 1, 7)).toEqual(7);
            expect(TypesetBot.hyphen.getEndWidth([3, 4], 1, 0)).toEqual(0);
        });
    });


});
