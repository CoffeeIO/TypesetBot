'use strict';

describe('Word utilities:', function () {
    describe('Hyphenate word:', function () {
        it('Normal words', function () {
            var settings = TypesetBot.settings.validate();
            expect(TypesetBot.wordUtils.hyphenWord('hyphenation', settings)).toEqual(['hy', 'phen', 'ation']);
            expect(TypesetBot.wordUtils.hyphenWord('test', settings)).toEqual(['test']);
        });
        it('Adjusting hyphen settings', function () {
            var settings = TypesetBot.settings.validate({ hyphenLanguage: 'da'});
            expect(TypesetBot.wordUtils.hyphenWord('hyphenate', settings)).toEqual(['hyp', 'he', 'na', 'te']);

            settings = TypesetBot.settings.validate({ hyphenLanguage: 'da', hyphenRightMin: 3, hyphenLeftMin: 4});
            expect(TypesetBot.wordUtils.hyphenWord('hyphenate', settings)).toEqual(['hyphe', 'nate']);
        });
    });
});
