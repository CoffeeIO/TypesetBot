'use strict';

describe('Line utilities:', function () {

    beforeEach(function(done) {
        $('.unittest').remove(); // Remove existing tex documents
        $('body').append(__html__['fixtures/test2']);
        setTimeout(function () {
            done();
        }, 500);
        // Reset last line variable.
        TypesetBot.lineUtils.nextLineWidth($('.plain'), $('.plain').width());
    });

    describe('Get line width:', function () {
        it('Fast search for full line', function () {
            expect(TypesetBot.lineUtils.nextLineWidth($('.plain'), $('.plain').width(), 0)).toEqual(500);
        });
        it('Random case', function () {
            expect(TypesetBot.lineUtils.nextLineWidth($('.overlay'), $('.overlay').width(), 0))
                .toBeLessThan(500 - $('.img1').width() + 0.5);
            expect(TypesetBot.lineUtils.nextLineWidth($('.overlay'), $('.overlay').width(), 0))
                .not.toBeLessThan(500 - $('.img1').width() - 0.5);
        });
        it('Worst case no stack overflow', function () {
            expect(TypesetBot.lineUtils.nextLineWidth($('.worst'), $('.worst').width(), 0)).toBeLessThan(500);
            expect(TypesetBot.lineUtils.nextLineWidth($('.worst'), $('.worst').width(), 0)).not.toBeLessThan(489);
        });
        it('Fast search for repeating line width', function () {
            var startT = window.performance.now();
            TypesetBot.lineUtils.nextLineWidth($('.worst'), $('.worst').width(), 0);
            var endT = window.performance.now(),
                timeT = endT - startT;

            $('.overlay').append('Hello world<br>');
            var startR = window.performance.now();
            TypesetBot.lineUtils.nextLineWidth($('.worst'), $('.worst').width(), 0);
            var endR = window.performance.now(),
                timeR = endR - startR;
            expect(timeR).toBeLessThan(timeT / 2); // Expect at least twice as fast
        });
    });

    describe('Get line width from store:', function () {
        it('Normal', function () {
            TypesetBot.lineUtils.widthStore = {};
            expect(TypesetBot.lineUtils.nextLineWidthStore($('.plain'), $('.plain').width(), 0)).toEqual(500);
        });
        it('Modified store', function () {
            TypesetBot.lineUtils.widthStore = {0: 350};
            expect(TypesetBot.lineUtils.nextLineWidthStore($('.plain'), $('.plain').width(), 0)).toEqual(350);
        });
    });
});
