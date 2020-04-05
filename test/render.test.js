'use strict';

describe('render.ts:', function () {
    let fixture =
        '<div class="test">' +
            'Hello world' +
        '</div>';
    let noRunSettings = {
        noRun: true,
    }

    describe('getDefaultFontSize --', function() {
        it('default browser font', function(done) {
            document.body.insertAdjacentHTML('beforeend', fixture);

            let tsb = new TypesetBot(null, noRunSettings);

            setTimeout(function() {
                let render = new TypesetBotRender(tsb);
                let target = document.querySelector('.test');

                expect(render.getDefaultFontSize(target)).not.toBeLessThan(8);
                expect(render.getDefaultFontSize(target)).toBeLessThan(30);

                done();
            }, 100);
        });
        it('Set font size (px)', function(done) {
            let style =
                '<style class="style">' +
                    '.test { font-size: 56px; }' +
                '<style>';

            document.body.insertAdjacentHTML('beforeend', fixture);
            document.body.insertAdjacentHTML('beforeend', style);

            let tsb = new TypesetBot(null, noRunSettings);

            setTimeout(function() {
                let render = new TypesetBotRender(tsb);
                let target = document.querySelector('.test');

                expect(render.getDefaultFontSize(target)).toEqual(56);

                done();
            }, 100);
        });
        it('Set font size (inherit)', function(done) {
            let style =
                '<style class="style">' +
                    'body { font-size: 20px}' +
                    '.test { font-size: inherit; }' +
                '<style>';

            document.body.insertAdjacentHTML('beforeend', fixture);
            document.body.insertAdjacentHTML('beforeend', style);

            let tsb = new TypesetBot(null, noRunSettings);

            setTimeout(function() {
                let render = new TypesetBotRender(tsb);
                let target = document.querySelector('.test');

                expect(render.getDefaultFontSize(target)).toEqual(20);

                done();
            }, 100);
        });
        it('Set font size (exact)', function(done) {
            let style =
                '<style class="style">' +
                    'body { font-size: 20px}' +
                    '.test { font-size: 3em; }' +
                '<style>';

            document.body.insertAdjacentHTML('beforeend', fixture);
            document.body.insertAdjacentHTML('beforeend', style);

            let tsb = new TypesetBot(null, noRunSettings);

            setTimeout(function() {
                let render = new TypesetBotRender(tsb);
                let target = document.querySelector('.test');

                expect(render.getDefaultFontSize(target)).toEqual(60);

                done();
            }, 100);
        });
        it('Set font size (em)', function(done) {
            let style =
                '<style class="style">' +
                    '.test { font-size: 2em; }' +
                '<style>';

            document.body.insertAdjacentHTML('beforeend', fixture);

            let tsb = new TypesetBot(null, noRunSettings);

            setTimeout(function() {

                let render = new TypesetBotRender(tsb);
                let target = document.querySelector('.test');

                let regular = render.getDefaultFontSize(target);

                document.body.insertAdjacentHTML('beforeend', style);

                expect(render.getDefaultFontSize(target)).toEqual(regular * 2);

                done();
            }, 100);
        });
        it('Set font size (absolute)', function(done) {
            let style =
                '<style class="style">' +
                    '.test { font-size: xx-large; }' +
                '<style>';

            document.body.insertAdjacentHTML('beforeend', fixture);
            document.body.insertAdjacentHTML('beforeend', style);

            let tsb = new TypesetBot(null, noRunSettings);

            setTimeout(function() {
                let render = new TypesetBotRender(tsb);
                let target = document.querySelector('.test');

                expect(render.getDefaultFontSize(target)).not.toBeLessThan(20);

                done();
            }, 100);
        });
    });
    describe('getNodeWidth --', function() {
        it('Default width', function(done) {
            document.body.insertAdjacentHTML('beforeend', fixture);

            let tsb = new TypesetBot(null, noRunSettings);

            setTimeout(function() {
                let render = new TypesetBotRender(tsb);
                let target = document.querySelector('.test');

                expect(render.getNodeWidth(target)).not.toBeLessThan(100);

                done();
            }, 100);
        });
        it('Specific width', function(done) {
            let style =
                '<style class="style">' +
                    '.test { width: 500px; }' +
                '<style>';

            document.body.insertAdjacentHTML('beforeend', fixture);
            document.body.insertAdjacentHTML('beforeend', style);

            let tsb = new TypesetBot(null, noRunSettings);

            setTimeout(function() {
                let render = new TypesetBotRender(tsb);
                let target = document.querySelector('.test');

                expect(render.getNodeWidth(target)).toEqual(500);

                done();
            }, 100);
        });
        it('Relative width', function(done) {
            let style =
                '<style class="style">' +
                    'body { width: 500px; }' +
                    '.test { width: 50%; }' +
                '<style>';

            document.body.insertAdjacentHTML('beforeend', fixture);
            document.body.insertAdjacentHTML('beforeend', style);

            let tsb = new TypesetBot(null, noRunSettings);

            setTimeout(function() {
                let render = new TypesetBotRender(tsb);
                let target = document.querySelector('.test');

                expect(render.getNodeWidth(target)).toEqual(250);

                done();
            }, 100);
        });
    });
    describe('getSpaceWidth --', function() {

    });
    describe('setMinimumWordSpacing --', function() {

    });
    describe('getNodeStyle --', function() {

    });
    describe('getNodeStyleNumber --', function() {

    });
    describe('getLineHeight --', function() {

    });
    describe('setJustificationClass --', function() {

    });
    describe('removeJustificationClass --', function() {

    });

    // ---

    describe('getWordProperties --', function() {

    });
    describe('getHyphenProperties --', function() {

    });
    describe('applyLineBreaks --', function() {

    });
});
