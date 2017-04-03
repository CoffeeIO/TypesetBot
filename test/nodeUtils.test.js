'use strict';

describe('Node utilities:', function () {
    describe('Check endtag:', function () {
        it('Valid', function () {
            expect(TypesetBot.nodeUtils.isEndTag('</b>')).toEqual(true);
            expect(TypesetBot.nodeUtils.isEndTag('</span>')).toEqual(true);
        });
        it('Invalid', function () {
            expect(TypesetBot.nodeUtils.isEndTag('<span>')).toEqual(false);
            expect(TypesetBot.nodeUtils.isEndTag('<b class="test">')).toEqual(false);
        });
    });
});
