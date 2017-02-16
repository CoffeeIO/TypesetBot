'use strict';

describe('Line utilities:', function () {

    beforeEach(function(done) {
        $('.unittest').remove(); // Remove existing tex documents
        $('body').append(__html__['fixtures/test2']);
        $(function () {
            done();
        });
    });

    describe('Get line width:', function () {
        it('Fast search for full line', function () {
            expect(TypesetBot.lineUtils.nextLineWidth($('.plain'), $('.plain').width())).toEqual(500);
        });
        it('Random case', function () {
            expect(TypesetBot.lineUtils.nextLineWidth($('.overlay'), $('.overlay').width())).toBeLessThan(500 - $('.img1').width() + 0.5);
            expect(TypesetBot.lineUtils.nextLineWidth($('.overlay'), $('.overlay').width())).not.toBeLessThan(500 - $('.img1').width() - 0.5);
        });
        it('Worst case no stack overflow', function () {
            expect(TypesetBot.lineUtils.nextLineWidth($('.worst'), $('.worst').width())).toBeLessThan(500);
            expect(TypesetBot.lineUtils.nextLineWidth($('.worst'), $('.worst').width())).not.toBeLessThan(499);
        });
        it('Fast search for repeating line width', function () {
            var startT = window.performance.now();
            TypesetBot.lineUtils.nextLineWidth($('.overlay'), $('.overlay').width());
            var endT = window.performance.now(),
                timeT = endT - startT;

            $('.overlay').append('Hello world<br>');
            var startR = window.performance.now();
            TypesetBot.lineUtils.nextLineWidth($('.overlay'), $('.overlay').width())
            var endR = window.performance.now(),
                timeR = endR - startR;
            expect(timeR).toBeLessThan(timeT / 2);
        });
    });
});
