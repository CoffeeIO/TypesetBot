'use strict';

describe('Paragraph utilities:', function () {

    beforeEach(function(done) {
        $('.unittest').remove(); // Remove existing tex documents
        $('body').append(__html__['fixtures/test1']);
        done();
    });

    describe('Get words of paragraph:', function () {
        it('Plain words', function () {
            expect(TypesetBot.paraUtils.getWords($('.plain').html()).length).toEqual(129);
        });
        it('Handle multiple space and html entity', function () {
            expect(TypesetBot.paraUtils.getWords($('.space').html()).length).toEqual(129);
            expect(TypesetBot.paraUtils.getWords($('.space').html()).length).toEqual(TypesetBot.paraUtils.getWords($('.plain').html()).length);
        });
    });
});
