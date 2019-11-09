'use strict';

describe('Init TypesetBot:', function () {
    describe('Getting variable of instance', function () {
        it('New instance', function () {
            let tsb = new TypesetBot();
            
            expect(tsb.logger).not.toEqual(undefined);
            expect(tsb.settings).not.toEqual(undefined);
        });
    });
});
