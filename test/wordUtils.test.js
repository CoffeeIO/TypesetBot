'use strict';

describe('Word utilities:', function () {
    beforeEach(function(done) {
        $('.unittest').remove(); // Remove existing tex documents
        $('body').append(__html__['fixtures/test1']);
        done();
    });

    describe('Hyphenate word:', function () {
        it('Normal words', function () {
            var settings = TypesetBot.settings.validate();
            expect(TypesetBot.wordUtils.hyphenWord('hyphenation', settings)).toEqual(['hy', 'phen', 'ation']);
            expect(TypesetBot.wordUtils.hyphenWord('test', settings)).toEqual(['test']);
        });
        it('Adjusting hyphen settings', function () {
            var settings = TypesetBot.settings.validate({hyphenLanguage: 'da'});
            expect(TypesetBot.wordUtils.hyphenWord('hyphenate', settings)).toEqual(['hyp', 'he', 'na', 'te']);

            settings = TypesetBot.settings.validate({hyphenLanguage: 'da', hyphenRightMin: 3, hyphenLeftMin: 4});
            expect(TypesetBot.wordUtils.hyphenWord('hyphenate', settings)).toEqual(['hyphe', 'nate']);
        });
        it('Language not found', function () {
            var settings = TypesetBot.settings.validate({hyphenLanguage: 'gg'});
            expect(TypesetBot.wordUtils.hyphenWord('hyphenate', settings)).toEqual(null);
        });
    });

    describe('Word properties:', function () {
        it('Normal words', function () {
            var words = TypesetBot.paraUtils.getWords($('.plain').html());
            expect(words.length).not.toBeLessThan(0)
            var props = TypesetBot.wordUtils.getWordProperties($('.plain'), words);
            expect(props.length).toEqual(words.length);
            props.forEach(function (index, item) {
                expect(item.width).not.toBeLessThan(0);
                expect(item.str).toEqual(words[index]);
            });
        });
        it('Empty array', function () {
            expect(TypesetBot.wordUtils.getWordProperties($('.plain'), [])).toEqual([]);
        });
    });
});
