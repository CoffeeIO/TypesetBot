'use strict';

describe('main.ts:', function () {
    let fixture =
        '<div class="test">' +
            'Hello world' +
        '</div>';

    let loremIpsumText = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis volutpat dolor non diam volutpat, laoreet porta risus sollicitudin. Phasellus cursus magna justo, a molestie metus aliquam a. Sed ut tellus non nunc iaculis pulvinar. Etiam suscipit nulla nec dui consectetur varius. Curabitur tortor odio, tincidunt at pharetra ut, varius a mauris. Interdum et malesuada fames ac ante ipsum primis in faucibus. Nulla elementum augue nulla, eget dictum odio auctor sit amet. Nunc commodo in eros at posuere. Aenean blandit auctor justo, porttitor laoreet arcu mattis eget. Nunc malesuada, enim vitae facilisis sagittis, nisl dolor fermentum eros, id euismod est sapien rhoncus velit. Curabitur id nisi id ligula convallis dapibus. Nam congue dolor eget cursus scelerisque. Etiam at sollicitudin nisl. Nullam semper mi dui, et ultrices arcu semper vitae. In quis metus felis.';
    let loremIpsum =
        '<div class="test">' +
            loremIpsumText +
        '</div>';

    let style =
        '<style class="style">' +
            '.test { width: 500px; line-height: 16px; }' +
        '<style>';

    /**
     * Generalize text by replacing double spaces with single spaces and trim spaces at the end.
     *
     * @param {string} text
     */
    function generalizeText(text) {
        return text.replace(/\s{2,}/g, ' ').trim();
    }

    describe('rerun --', function() { // constructor
        // @todo
    });
    describe('typesetNodes --', function() { // constructor
        // @todo
    });

    describe('constructor --', function() {
        it('Basic test', function (done) {

            document.body.insertAdjacentHTML('beforeend', style);
            document.body.insertAdjacentHTML('beforeend', loremIpsum);

            let target = document.querySelector('.test');
            let width = 500;

            expect(target.getBoundingClientRect().width).toEqual(width);
            expect(document.querySelector('tsb-line')).toEqual(null);

            let beforeHeight = target.getBoundingClientRect().height;
            // Magic values.
            expect(beforeHeight).toBeGreaterThan(100);
            expect(beforeHeight).toBeLessThan(300);

            let tsb = new TypesetBot('.test');

            setTimeout(function() {
                expect(document.querySelectorAll('tsb-line')).not.toEqual(null); // Typesetting worked.
                expect(target.getBoundingClientRect().width).toEqual(width);

                // Magic values.
                expect(document.querySelectorAll('tsb-line').length).toBeGreaterThan(10);
                expect(target.getBoundingClientRect().height).toBeGreaterThan(100);

                // Height should be less than or equal.
                expect(target.getBoundingClientRect().height).toBeLessThanOrEqual(beforeHeight);

                // Check use of hyphen character.
                var count = target.querySelectorAll('tsb-hyphen').length;
                expect(count).toBeGreaterThanOrEqual(0);

                // Check text content is not modified.
                expect(generalizeText(target.textContent)).toEqual(loremIpsumText);

                done();
            }, 100);
        });
        it('Mobile viewport', function (done) {
            let style =
                '<style class="style">' +
                    '.test { width: 200px; line-height: 16px; }' +
                '<style>';
            let fontSize = 16;
            let width = 200;

            document.body.insertAdjacentHTML('beforeend', style);
            document.body.insertAdjacentHTML('beforeend', loremIpsum);

            let target = document.querySelector('.test');

            expect(target.getBoundingClientRect().width).toEqual(width);
            expect(document.querySelector('tsb-line')).toEqual(null);

            let beforeHeight = target.getBoundingClientRect().height;
            // Magic values.
            expect(beforeHeight).toBeGreaterThan(300);
            expect(beforeHeight).toBeLessThan(600);

            let tsb = new TypesetBot('.test');

            setTimeout(function() {
                expect(document.querySelectorAll('tsb-line')).not.toEqual(null); // Typesetting worked.
                expect(target.getBoundingClientRect().width).toEqual(width);

                // Magic values.
                let lines = document.querySelectorAll('tsb-line').length;
                expect(lines).toBeGreaterThan(10);

                expect(target.getBoundingClientRect().height).toEqual(fontSize * lines);
                // On small viewport this should produce smaller height.
                expect(target.getBoundingClientRect().height).toBeLessThan(beforeHeight);

                // Check use of hyphen character.
                var count = target.querySelectorAll('tsb-hyphen').length;
                expect(count).toBeGreaterThan(0);

                // Check text content is not modified.
                expect(generalizeText(target.textContent)).toEqual(loremIpsumText);

                done();
            }, 100);
        });
        it('Wide viewport', function (done) {
            let style =
                '<style class="style">' +
                    '.test { width: 1000px; line-height: 16px; }' +
                '<style>';
            let fontSize = 16;
            let width = 1000;

            document.body.insertAdjacentHTML('beforeend', style);
            document.body.insertAdjacentHTML('beforeend', loremIpsum);

            let target = document.querySelector('.test');

            expect(target.getBoundingClientRect().width).toEqual(width);
            expect(document.querySelector('tsb-line')).toEqual(null);

            let beforeHeight = target.getBoundingClientRect().height;
            // Magic values.
            expect(beforeHeight).toBeGreaterThan(50);
            expect(beforeHeight).toBeLessThan(200);


            let tsb = new TypesetBot('.test');

            setTimeout(function() {
                expect(document.querySelectorAll('tsb-line')).not.toEqual(null); // Typesetting worked.
                expect(target.getBoundingClientRect().width).toEqual(width);

                // Magic values.
                let lines = document.querySelectorAll('tsb-line').length;
                expect(lines).toBeGreaterThan(3);

                expect(target.getBoundingClientRect().height).toEqual(fontSize * lines);
                // Wide viewports should have the same height.
                expect(target.getBoundingClientRect().height).toEqual(beforeHeight);

                // Check use of hyphen character.
                var count = target.querySelectorAll('tsb-hyphen').length;
                expect(count).toEqual(0);

                // Check text content is not modified.
                expect(generalizeText(target.textContent)).toEqual(loremIpsumText);

                done();
            }, 100);
        });
    });
    describe('terminate --', function() {
        it('General', function(done) {
            let fixture =
                '<div class="test" style="">' + // Need to add style as remove style still leaves the empty attribute.
                    'Hello world' +
                '</div>';

            document.body.insertAdjacentHTML('beforeend', fixture);

            expect(document.querySelector('tsb-line')).toEqual(null);

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
});
