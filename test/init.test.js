'use strict';

afterEach(function() {
    let x = document.body.querySelectorAll('.test');
    for (let y of x) {
        y.remove();
    }
});

describe('Init TypesetBot:', function () {
    describe('Getting variable of instance', function () {
        it('New instance', function () {
            let tsb = new TypesetBot();

            expect(tsb.logger).not.toEqual(undefined);
            expect(tsb.settings).not.toEqual(undefined);
        });
    });
});
