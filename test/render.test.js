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
        it('Default width', function(done) {
            document.body.insertAdjacentHTML('beforeend', fixture);

            let tsb = new TypesetBot(null, noRunSettings);

            setTimeout(function() {
                let render = new TypesetBotRender(tsb);
                let target = document.querySelector('.test');

                expect(render.getSpaceWidth(target)).toBeLessThan(10);
                expect(render.getSpaceWidth(target)).not.toBeLessThan(0);

                done();
            }, 100);
        });
        it('Condensed font', function(done) {
            // Verdana is quite a wide font.
            let style1 =
                '<style class="style">' +
                    '.test { font-family: Times New Roman, Verdana, Geneva, sans-serif; }' +
                '<style>';
            let style2 =
                '<style class="style">' +
                    '.test { font-family: "Open Sans Condensed", sans-serif; }' +
                '<style>';
            document.body.insertAdjacentHTML('beforeend', fixture);
            document.body.insertAdjacentHTML('beforeend', style1);

            let tsb = new TypesetBot(null, noRunSettings);

            setTimeout(function() {
                let render = new TypesetBotRender(tsb);
                let target = document.querySelector('.test');

                let regular = render.getSpaceWidth(target);

                // Change font.
                document.body.insertAdjacentHTML('beforeend', style2);

                expect(render.getSpaceWidth(target)).not.toBeLessThan(regular);

                done();
            }, 100);
        });

        // @todo: check affect of preset word-spacing.
    });
    describe('setMinimumWordSpacing --', function() {

    });
    describe('getNodeStyle --', function() {
        it('Various properties', function(done) {
            let style =
                '<style class="style">' +
                    '.test {' +
                        'width: 225px;' +
                        'font-weight: bold;' +
                        'float: right;' +
                    '}' +
                '<style>';

            document.body.insertAdjacentHTML('beforeend', fixture);
            document.body.insertAdjacentHTML('beforeend', style);

            let tsb = new TypesetBot(null, noRunSettings);

            setTimeout(function() {
                let render = new TypesetBotRender(tsb);
                let target = document.querySelector('.test');


                expect(render.getNodeStyle(target, 'width')).toEqual('225px');
                expect(render.getNodeStyle(target, 'font-weight')).toEqual('700'); // bold == 700
                expect(render.getNodeStyle(target, 'float')).toEqual('right');

                done();
            }, 100);
        });
    });
    describe('getNodeStyleNumber --', function() {
        it('Various properties', function(done) {
            let style =
                '<style class="style">' +
                    '.test {' +
                        'width: 225.6px;' +
                        'font-size: 22.5px;' +
                    '}' +
                '<style>';

            document.body.insertAdjacentHTML('beforeend', fixture);
            document.body.insertAdjacentHTML('beforeend', style);

            let tsb = new TypesetBot(null, noRunSettings);

            setTimeout(function() {
                let render = new TypesetBotRender(tsb);
                let target = document.querySelector('.test');

                expect(render.getNodeStyleNumber(target, 'width')).not.toBeLessThan(225.3);
                expect(render.getNodeStyleNumber(target, 'width')).toBeLessThan(225.9);
                expect(render.getNodeStyleNumber(target, 'font-size')).toEqual(22.5);

                done();
            }, 100);
        });
    });
    describe('getLineHeight --', function() {
        it('Lineheight depending on font size', function(done) {
            // Verdana is quite a wide font.
            let style1 =
                '<style class="style">' +
                    '.test { line-height: 20px; font-size: 16px; }' +
                '<style>';
            let style2 =
                '<style class="style">' +
                    '.test { line-height: normal; }' +
                '<style>';
            let style3 =
                '<style class="style">' +
                    '.test { line-height: 1.5; }' +
                '<style>';
            let style4 =
                '<style class="style">' +
                    '.test { line-height: 200%; }' +
                '<style>';
            let style5 =
                '<style class="style">' +
                    '.test { line-height: 3em; }' +
                '<style>';

            document.body.insertAdjacentHTML('beforeend', fixture);

            let tsb = new TypesetBot(null, noRunSettings);

            setTimeout(function() {
                let render = new TypesetBotRender(tsb);
                let target = document.querySelector('.test');


                document.body.insertAdjacentHTML('beforeend', style1);
                expect(render.getLineHeight(target)).toEqual(20);
                // Change style.
                document.body.insertAdjacentHTML('beforeend', style2);
                expect(render.getLineHeight(target)).toEqual(19.2); // 16*1.2=19.2

                document.body.insertAdjacentHTML('beforeend', style3);
                expect(render.getLineHeight(target)).toEqual(24);

                document.body.insertAdjacentHTML('beforeend', style4);
                expect(render.getLineHeight(target)).toEqual(32);

                document.body.insertAdjacentHTML('beforeend', style5);
                expect(render.getLineHeight(target)).toEqual(48);

                done();
            }, 100);
        });
    });
    describe('setJustificationClass --', function() {
        it('Get settings class', function(done) {
            let settings = {
                alignment: 'justify',
            };

            document.body.insertAdjacentHTML('beforeend', fixture);

            let tsb = new TypesetBot('.test', settings);

            setTimeout(function() {
                let target = document.querySelector('.test');

                expect([].slice.call(target.classList)).toEqual(['test', 'typesetbot-justify']);

                done();
            }, 500);
        });
        it('Get settings class, different setting', function(done) {
            let settings = {
                alignment: 'left',
            };

            document.body.insertAdjacentHTML('beforeend', fixture);

            let tsb = new TypesetBot('.test', settings);

            setTimeout(function() {
                let target = document.querySelector('.test');

                expect([].slice.call(target.classList)).toEqual(['test', 'typesetbot-left']);

                done();
            }, 500);
        });
    });
    describe('removeJustificationClass --', function() {
        it('Removing class', function(done) {
            let settings = {
                alignment: 'justify',
            };

            document.body.insertAdjacentHTML('beforeend', fixture);

            let tsb = new TypesetBot('.test', settings);

            setTimeout(function() {
                let render = new TypesetBotRender(tsb);

                let target = document.querySelector('.test');
                render.removeJustificationClass(target);

                expect([].slice.call(target.classList)).toEqual(['test']);

                done();
            }, 1000);
        });
    });

    // ---

    describe('getWordProperties --', function() {
        // @todo
    });
    describe('getHyphenProperties --', function() {
        // @todo
    });
    describe('applyLineBreaks --', function() {
        // @todo
    });
});
