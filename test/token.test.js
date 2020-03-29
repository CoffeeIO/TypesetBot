'use strict';

describe('token.ts:', function () {

    let defaultSettings = {
        'noRun': true,
    };

    let fixture =
        '<div class="test">Hello world</div>';

    describe('Init Token types --', function() {
        it('TypesetBotSpace', function() {
            let token = new TypesetBotSpace(1);

            expect(token.type).toEqual(TypesetBotToken.types.SPACE);
        });
        it('TypesetBotTag', function() {
            let token = new TypesetBotTag(1, 'SPAN', false);

            expect(token.tag).toEqual('SPAN');
            expect(token.isEndTag).toEqual(false);
            expect(token.type).toEqual(TypesetBotToken.types.TAG);

            token = new TypesetBotTag(1, 'SPAN', true);

            expect(token.tag).toEqual('SPAN');
            expect(token.isEndTag).toEqual(true);
            expect(token.type).toEqual(TypesetBotToken.types.TAG);
        });
        it('TypesetBotWord', function() {
            let token = new TypesetBotWord(1, 'hello');

            expect(token.text).toEqual('hello');
            expect(token.type).toEqual(TypesetBotToken.types.WORD);
        });
    });
    describe('tokenize --', function() {
        it('Simple', function(done) {
            document.body.insertAdjacentHTML('beforeend', fixture);

            let tsb1 = new TypesetBot(null, defaultSettings);

            setTimeout(function() {
                let tokenizer = new TypesetBotTokenizer(tsb1);

                let tokens = tokenizer.tokenize(document.querySelector('.test'));
                console.warn(tokens);


                expect(tokens.length).toEqual(3);
                expect(tokens[0].type).toEqual(TypesetBotToken.types.WORD);
                expect(tokens[1].type).toEqual(TypesetBotToken.types.SPACE);
                expect(tokens[2].type).toEqual(TypesetBotToken.types.WORD);

                done();
            }, 100);
        });
        it('Complex', function(done) {

            /**
             * Muliple concecutive spaces.
             * Tags in the middle of words to create 2 word tokens.
             * Starting and ending in spaces.
             */
            let fixtureComplex =
                '<div class="test">  Hel<span>lo   wor</span>ld.  </div>';

            document.body.insertAdjacentHTML('beforeend', fixtureComplex);

            let tsb1 = new TypesetBot(null, defaultSettings);

            setTimeout(function() {
                let tokenizer = new TypesetBotTokenizer(tsb1);

                let tokens = tokenizer.tokenize(document.querySelector('.test'));
                console.warn(tokens);


                expect(tokens.length).toEqual(9);
                expect(tokens[0].type).toEqual(TypesetBotToken.types.SPACE);
                expect(tokens[1].type).toEqual(TypesetBotToken.types.WORD);
                expect(tokens[2].type).toEqual(TypesetBotToken.types.TAG);
                expect(tokens[3].type).toEqual(TypesetBotToken.types.WORD);
                expect(tokens[4].type).toEqual(TypesetBotToken.types.SPACE);
                expect(tokens[5].type).toEqual(TypesetBotToken.types.WORD);
                expect(tokens[6].type).toEqual(TypesetBotToken.types.TAG);
                expect(tokens[7].type).toEqual(TypesetBotToken.types.WORD);
                expect(tokens[8].type).toEqual(TypesetBotToken.types.SPACE);

                done();
            }, 100);
        });
        it('Nested tags', function(done) {

            let fixtureComplex =
                '<div class="test"><div>Hel<span><b>lo</b> <i>test</i>   wor</span>ld.</div></div>';

            document.body.insertAdjacentHTML('beforeend', fixtureComplex);

            let tsb1 = new TypesetBot(null, defaultSettings);

            setTimeout(function() {
                let tokenizer = new TypesetBotTokenizer(tsb1);

                let tokens = tokenizer.tokenize(document.querySelector('.test'));
                console.warn(tokens);


                expect(tokens.length).toEqual(15);
                expect(tokens[0].tag).toEqual('DIV');
                expect(tokens[1].text).toEqual('Hel');
                expect(tokens[2].tag).toEqual('SPAN');
                expect(tokens[3].tag).toEqual('B');
                expect(tokens[4].text).toEqual('lo');
                expect(tokens[5].tag).toEqual('B');
                expect(tokens[6].type).toEqual(TypesetBotToken.types.SPACE);
                expect(tokens[7].tag).toEqual('I');
                expect(tokens[8].text).toEqual('test');
                expect(tokens[9].tag).toEqual('I');
                expect(tokens[10].type).toEqual(TypesetBotToken.types.SPACE);
                expect(tokens[11].text).toEqual('wor');
                expect(tokens[12].tag).toEqual('SPAN');
                expect(tokens[13].text).toEqual('ld.');
                expect(tokens[14].tag).toEqual('DIV');

                done();
            }, 100);
        });
        it('Special characters', function(done) {

            /**
             * Newline characters.
             */
            let fixtureComplex =
                '<div class="test">Hel<span>lo \n wor</span>ld.</div>';

            document.body.insertAdjacentHTML('beforeend', fixtureComplex);

            let tsb1 = new TypesetBot(null, defaultSettings);

            setTimeout(function() {
                let tokenizer = new TypesetBotTokenizer(tsb1);

                let tokens = tokenizer.tokenize(document.querySelector('.test'));
                console.warn(tokens);


                expect(tokens.length).toEqual(7);
                expect(tokens[0].type).toEqual(TypesetBotToken.types.WORD);
                expect(tokens[1].type).toEqual(TypesetBotToken.types.TAG);
                expect(tokens[2].type).toEqual(TypesetBotToken.types.WORD);
                expect(tokens[3].type).toEqual(TypesetBotToken.types.SPACE);
                expect(tokens[4].type).toEqual(TypesetBotToken.types.WORD);
                expect(tokens[5].type).toEqual(TypesetBotToken.types.TAG);
                expect(tokens[6].type).toEqual(TypesetBotToken.types.WORD);

                done();
            }, 100);
        });
        it('Unsupported tags', function(done) {

            /**
             * BR is by default not supported and will be removed.
             */
            let fixtureComplex =
                '<div class="test">Hello <br>world</div>';

            document.body.insertAdjacentHTML('beforeend', fixtureComplex);

            let tsb1 = new TypesetBot(null, defaultSettings);

            setTimeout(function() {
                let tokenizer = new TypesetBotTokenizer(tsb1);

                let tokens = tokenizer.tokenize(document.querySelector('.test'));
                console.warn(tokens);


                expect(tokens.length).toEqual(3);
                expect(tokens[0].type).toEqual(TypesetBotToken.types.WORD);
                expect(tokens[1].type).toEqual(TypesetBotToken.types.SPACE);
                expect(tokens[2].type).toEqual(TypesetBotToken.types.WORD);

                done();
            }, 100);
        });
    });

    describe('replaceInvalidCharacters --', function() {
        it('Replace newlines', function(done) {

            document.body.insertAdjacentHTML('beforeend', fixture);

            let tsb1 = new TypesetBot(null, defaultSettings);

            setTimeout(function() {
                let tokenizer = new TypesetBotTokenizer(tsb1);

                let str = tokenizer.replaceInvalidCharacters('This text \n\n   has newline characters');

                expect(str).toEqual('This text      has newline characters');

                done();
            }, 100);
        });
    });
});
