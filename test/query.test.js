'use strict';

describe('query.ts:', function() {

    let defaultSettings = {
        'noRun': true,
    };

    let fixture =
        '<div class="test">' +
            'Hello world' +
        '</div>';

    describe('Query Node --', function() {
        it('Query single Node', function(done) {
            document.body.insertAdjacentHTML('beforeend', fixture);

            let t = document.querySelector('.test');
            let tsb = new TypesetBot(t, defaultSettings);

            setTimeout(function() {
                expect(tsb.query.nodes).not.toEqual(null);
                expect(tsb.query.nodes.length).toEqual(1);

                done();
            }, 100);
        });
        it('Query single Node, duplicate', function(done) {
            document.body.insertAdjacentHTML('beforeend', fixture);
            document.body.insertAdjacentHTML('beforeend', fixture);

            let t = document.querySelector('.test');
            let tsb = new TypesetBot(t, defaultSettings);

            setTimeout(function() {
                expect(tsb.query.nodes).not.toEqual(null);
                expect(tsb.query.nodes.length).toEqual(1);

                done();
            }, 100);
        });
    });

    describe('Query NodeList --', function() {
        it('Query selector all', function(done) {
            document.body.insertAdjacentHTML('beforeend', fixture);

            let t = document.querySelectorAll('.test');
            let tsb = new TypesetBot(t, defaultSettings);

            setTimeout(function() {
                expect(tsb.query.nodes).not.toEqual(null);
                expect(tsb.query.nodes.length).toEqual(1);

                done();
            }, 100);
        });
        it('Query selector all, multiple nodes', function(done) {
            document.body.insertAdjacentHTML('beforeend', fixture);
            document.body.insertAdjacentHTML('beforeend', fixture);

            let t = document.querySelectorAll('.test');
            let tsb = new TypesetBot(t, defaultSettings);

            setTimeout(function() {
                expect(tsb.query.nodes).not.toEqual(null);
                expect(tsb.query.nodes.length).toEqual(2);

                done();
            }, 100);
        });
    });

    describe('Query String --', function() {
        it('Class selector, multiple', function(done) {
            document.body.insertAdjacentHTML('beforeend', fixture);
            document.body.insertAdjacentHTML('beforeend', fixture);

            let tsb = new TypesetBot('.test', defaultSettings);

            setTimeout(function() {
                expect(tsb.query.nodes).not.toEqual(null);
                expect(tsb.query.nodes.length).toEqual(2);

                done();
            }, 100);
        });
        it('Tag selector, multiple', function(done) {
            let fixture =
                '<p class="test">' +
                    'Hello world' +
                '</p>';

            document.body.insertAdjacentHTML('beforeend', fixture);
            document.body.insertAdjacentHTML('beforeend', fixture);
            document.body.insertAdjacentHTML('beforeend', fixture);

            let tsb = new TypesetBot('body > p', defaultSettings);

            setTimeout(function() {
                expect(tsb.query.nodes).not.toEqual(null);
                expect(tsb.query.nodes.length).toEqual(3);

                done();
            }, 100);
        });
        it('ID selector, multiple', function(done) {
            let fixture =
                '<p id="test">' +
                    'Hello world' +
                '</p>';

            document.body.insertAdjacentHTML('beforeend', fixture);
            document.body.insertAdjacentHTML('beforeend', fixture);

            let tsb = new TypesetBot('body #test', defaultSettings);

            setTimeout(function() {
                expect(tsb.query.nodes).not.toEqual(null);
                expect(tsb.query.nodes.length).toEqual(2);

                done();
            }, 100);
        });

        it('Class selector, multiple class names', function(done) {
            let fixture2 =
                '<p class="test2">' +
                    'Hello world' +
                '</p>';

            document.body.insertAdjacentHTML('beforeend', fixture);
            document.body.insertAdjacentHTML('beforeend', fixture2);

            let tsb = new TypesetBot('.test, .test2', defaultSettings);

            setTimeout(function() {
                expect(tsb.query.nodes).not.toEqual(null);
                expect(tsb.query.nodes.length).toEqual(2);

                done();
            }, 100);
        });

        it('Not found element', function(done) {
            document.body.insertAdjacentHTML('beforeend', fixture);

            let tsb = new TypesetBot('.testNotFound', defaultSettings);

            setTimeout(function() {
                expect(tsb.query.nodes.length).toEqual(0);

                done();
            }, 100);
        });

        it('Null selector', function(done) {
            document.body.insertAdjacentHTML('beforeend', fixture);

            let tsb = new TypesetBot(null, defaultSettings);

            setTimeout(function() {
                expect(tsb.query.nodes.length).toEqual(0);

                done();
            }, 100);
        });

        // @todo
        // it('Nested selectors, only detect inner element', function(done) {
        //     let fixture =
        //         '<div class="test">' +
        //             '<p class="test">Hello world</p>' +
        //         '</div>';

        //     document.body.insertAdjacentHTML('beforeend', fixture);
        //     document.body.insertAdjacentHTML('beforeend', fixture);

        //     let tsb = new TypesetBot('.test', defaultSettings);

        //     setTimeout(function() {
        //         expect(tsb.query.nodes).not.toEqual(null);
        //         expect(tsb.query.nodes.length).toEqual(2);
        //         done();
        //     }, 100);
        // });
    });

    describe('Direct class call --', function() {
        it('Null selector with direct call to query', function(done) {
            document.body.insertAdjacentHTML('beforeend', fixture);
            document.body.insertAdjacentHTML('beforeend', fixture);

            let tsb = new TypesetBot(null, defaultSettings);

            setTimeout(function() {
                let query = new TypesetBotElementQuery(tsb, '.test');
                expect(query.nodes.length).toEqual(2);

                done();
            }, 100);
        });
    });

    describe('Multiple instances --', function() {
        it('Mulitple TSB instances, overlapping selectors', function(done) {
            let fixture2 =
                '<div class="test test2">' +
                    'Hello world' +
                '</div>';

            document.body.insertAdjacentHTML('beforeend', fixture2);
            document.body.insertAdjacentHTML('beforeend', fixture);
            document.body.insertAdjacentHTML('beforeend', fixture);

            let tsb1 = new TypesetBot('.test2', defaultSettings);
            let tsb2 = new TypesetBot('.test', defaultSettings);

            setTimeout(function() {
                expect(tsb1.query.nodes.length).toEqual(1);
                expect(tsb2.query.nodes.length).toEqual(2);

                done();
            }, 100);
        });
        it('Mulitple TSB instances, can not reselect', function(done) {
            let fixture2 =
                '<div class="test test2">' +
                    'Hello world' +
                '</div>';

            document.body.insertAdjacentHTML('beforeend', fixture2);
            document.body.insertAdjacentHTML('beforeend', fixture);
            document.body.insertAdjacentHTML('beforeend', fixture);

            let tsb1 = new TypesetBot('.test', defaultSettings);
            let tsb2 = new TypesetBot('.test2', defaultSettings);

            setTimeout(function() {
                expect(tsb1.query.nodes.length).toEqual(3);
                expect(tsb2.query.nodes.length).toEqual(0);

                done();
            }, 100);
        });
    });

    describe('Requery function --', function() {
        it('Requery - no difference', function(done) {
            document.body.insertAdjacentHTML('beforeend', fixture);
            document.body.insertAdjacentHTML('beforeend', fixture);

            let tsb1 = new TypesetBot('.test', defaultSettings);
            setTimeout(function() {
                expect(tsb1.query.nodes.length).toEqual(2);

                tsb1.query.requery();
                expect(tsb1.query.nodes.length).toEqual(2);

                done();
            }, 100);
        });
        it('Requery - more nodes', function(done) {
            document.body.insertAdjacentHTML('beforeend', fixture);
            document.body.insertAdjacentHTML('beforeend', fixture);

            let tsb1 = new TypesetBot('.test', defaultSettings);
            setTimeout(function() {
                expect(tsb1.query.nodes.length).toEqual(2);

                document.body.insertAdjacentHTML('beforeend', fixture);

                tsb1.query.requery();
                expect(tsb1.query.nodes.length).toEqual(3);

                done();
            }, 100);
        });
        it('Requery - less nodes', function(done) {
            document.body.insertAdjacentHTML('beforeend', fixture);
            document.body.insertAdjacentHTML('beforeend', fixture);

            let tsb1 = new TypesetBot('.test', defaultSettings);
            setTimeout(function() {
                expect(tsb1.query.nodes.length).toEqual(2);

                // Remove single node.
                document.querySelector('.test').remove();

                tsb1.query.requery();
                expect(tsb1.query.nodes.length).toEqual(1);

                done();
            }, 100);
        });
    });
});
