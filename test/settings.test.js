'use strict';

describe('settings.ts', function () {

    let fixture =
        '<div class="test">' +
            'Hello world' +
        '</div>';

    describe('Intialize settings, none --', function() {
        it('No custom settings', function(done) {
            document.body.insertAdjacentHTML('beforeend', fixture);

            let tsb = new TypesetBot('.test');

            setTimeout(function() {

                // Check default settings.
                expect(tsb.settings.spaceWidth).toEqual(1/3);
                expect(tsb.settings.hyphenPenalty).toEqual(50);

                done();
            }, 100);
        });
        it('Null custom settings', function(done) {
            document.body.insertAdjacentHTML('beforeend', fixture);

            let tsb = new TypesetBot('.test', null);

            setTimeout(function() {

                // Check default settings.
                expect(tsb.settings.spaceWidth).toEqual(1/3);
                expect(tsb.settings.hyphenPenalty).toEqual(50);

                done();
            }, 100);
        });
        it('Undefined custom settings', function(done) {
            document.body.insertAdjacentHTML('beforeend', fixture);

            let tsb = new TypesetBot('.test', undefined);

            setTimeout(function() {

                // Check default settings.
                expect(tsb.settings.spaceWidth).toEqual(1/3);
                expect(tsb.settings.hyphenPenalty).toEqual(50);

                done();
            }, 100);
        });
        it('Empty custom settings', function(done) {
            document.body.insertAdjacentHTML('beforeend', fixture);

            let tsb = new TypesetBot('.test', {});

            setTimeout(function() {

                // Check default settings.
                expect(tsb.settings.spaceWidth).toEqual(1/3);
                expect(tsb.settings.hyphenPenalty).toEqual(50);
                expect(tsb.settings.unsupportedTags).toEqual(['BR', 'IMG']);

                done();
            }, 100);
        });
    });

    describe('Overwrite settings --', function() {
        it('Few custom settings', function(done) {
            document.body.insertAdjacentHTML('beforeend', fixture);

            let settings = {
                'noRun': true,
                'hyphenPenalty': 25,
                unsupportedTags: ['BR', 'IMG', 'HR'],
            };

            let tsb = new TypesetBot('.test', settings);

            setTimeout(function() {

                // Check default settings.
                expect(tsb.settings.spaceWidth).toEqual(1/3);
                // Check overwrite setting.
                expect(tsb.settings.hyphenPenalty).toEqual(25);
                expect(tsb.settings.unsupportedTags).toEqual(['BR', 'IMG', 'HR']);

                done();
            }, 100);
        });
        it('Settings are independent per instance', function(done) {
            document.body.insertAdjacentHTML('beforeend', fixture);

            let settings = {
                noRun: true,
                hyphenPenalty: 25,
            };

            let tsb1= new TypesetBot('.test', settings);
            let tsb2 = new TypesetBot('.test');
            let tsb3 = new TypesetBot('.test', { hyphenPenalty: 100 });

            setTimeout(function() {

                // Check default settings.
                expect(tsb1.settings.spaceWidth).toEqual(1/3);
                // Check overwrite setting.
                expect(tsb1.settings.hyphenPenalty).toEqual(25);

                // Instance 2 should have defualt value.
                expect(tsb2.settings.hyphenPenalty).toEqual(50);

                // Instance 3 should have different custom value.
                expect(tsb3.settings.hyphenPenalty).toEqual(100);

                done();
            }, 100);
        });
    });
    describe('Unknown settings --', function() {
        it('Overwrite unknown setting', function(done) {
            console.warn = jasmine.createSpy("warn");

            document.body.insertAdjacentHTML('beforeend', fixture);

            let settings = {
                noRun: true,
                hyphenPenalty: 25,
                hello: 'world',
            };

            let tsb = new TypesetBot('.test', settings);

            setTimeout(function() {
                expect(console.warn).toHaveBeenCalled();
                expect(console.warn).toHaveBeenCalledWith('Unknown settings key "hello"');

                done();
            }, 100);
        })
    });
});
