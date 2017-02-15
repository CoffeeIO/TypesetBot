'use strict';

describe('Line utilities:', function () {

    beforeEach(function(done) {
        $('.unittest').remove(); // Remove existing tex documents
        $('body').append(__html__['fixtures/test2']);
        done();
    });

    describe('Get line width:', function () {
        it('Fast search for full line', function () {
            expect(0).toEqual(1);
        });
        it('Random case', function () {
            expect(0).toEqual(1);
        });
        it('Worst case', function () {
            expect(0).toEqual(1);
        });
        it('Fast search for repeating line width', function () {
            expect(0).toEqual(1);
        });
    });
});
