'use strict';

describe('html.ts:', function () {
    let defaultSettings = {
        // 'noRun': true,
        'logs': ['error', 'warn', 'log'],
    };

    let fixture =
        '<div class="test">' +
            '<span id="some-id" class="inner" data-hello="world" flag>Hello</span> world' +
        '</div>';

    describe('getHtmlFromTokensRange --', function() {
        // @todo
    });
    describe('getTagTokensOnLine --', function() {
        // @todo
    });
    describe('appendTagTokensOnLine --', function() {
        // @todo
    });
    describe('prependTagTokensOnLine --', function() {
        // @todo
    });

    describe('createTagHtml --', function() {
        it('General', function(done) {
            document.body.insertAdjacentHTML('beforeend', fixture);

            let tsb = new TypesetBot('.test', defaultSettings);

            setTimeout(function() {
                let html = new TypesetBotHtml(tsb);

                const node = tsb.query.nodes[0];
                const tokens = tsb.util.getElementTokens(node);
                expect(tokens[0].type).toEqual(3);
                expect(tokens[2].type).toEqual(3);

                // `flag` and `flag=""` is the same.
                expect(html.createTagHtml(node, tokens[0])).toEqual('<span id="some-id" class="inner" data-hello="world" flag="" >');
                expect(html.createTagHtml(node, tokens[0], true)).toEqual('</span>');
                expect(html.createTagHtml(node, tokens[2])).toEqual('</span>');

                done();
            }, 100);
        })
    });
});
