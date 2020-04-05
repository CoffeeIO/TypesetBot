'use strict';

describe('main.ts:', function () {
    let fixture =
        '<div class="test">' +
            'Hello world' +
        '</div>';

    describe('constructor --', function() {
        // @todo
    });
    describe('init --', function() { // constructor
        // @todo
    });
    describe('typeset --', function() { // constructor
        // @todo
    });
    describe('rerun --', function() { // constructor
        // @todo
    });
    describe('requery --', function() { // tested in query.test.js
        // @todo
    });
    describe('watch --', function() { // boring?
        // @todo
    });
    describe('unwatch --', function() { // boring?
        // @todo
    });
    describe('terminate --', function() {
        it('General', function(done) {
            let fixture =
                '<div class="test" style="">' + // Need to add style as remove style still leaves the empty attribute.
                    'Hello world' +
                '</div>';

            document.body.insertAdjacentHTML('beforeend', fixture);

            let tsb = new TypesetBot('.test');

            setTimeout(function() {
                let target = document.querySelector('.test');

                expect(document.querySelector('tsb-line')).not.toEqual(null); // Typesetting worked.

                expect(target.outerHTML).not.toEqual(fixture);

                tsb.terminate();
                expect(target.outerHTML).toEqual(fixture);


                done();
            }, 100);
        });
        it('Complex', function(done) {
            let fixture =
                '<div class="test" custom-attr="123" style="">' + // Need to add style as remove style still leaves the empty attribute.
                    '<span>Hello testing</span> w<i custom-attr="456">o</i>rld' +
                    '<span>Hello<br> testing</span> w<i>o</i>rld' +
                '</div>';

            document.body.insertAdjacentHTML('beforeend', fixture);

            let tsb = new TypesetBot('.test');

            setTimeout(function() {
                let target = document.querySelector('.test');

                expect(document.querySelector('tsb-line')).not.toEqual(null); // Typesetting worked.

                expect(target.outerHTML).not.toEqual(fixture);

                tsb.terminate();
                expect(target.outerHTML).toEqual(fixture);


                done();
            }, 100);
        });
    });
    describe('typesetNodes --', function() { // constructor
        // @todo
    });
});
