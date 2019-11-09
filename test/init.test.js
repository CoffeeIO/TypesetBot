'use strict';

describe('Init TypesetBot:', function () {
    describe('Getting variable of instance', function () {
        it('New instance', function () {
            let query = ".main";
            let tsb = new TypesetBot(query);
            
            expect(tsb.logger).not.toEqual(undefined);
            expect(tsb.settings).not.toEqual(undefined);
        });
    });
});
