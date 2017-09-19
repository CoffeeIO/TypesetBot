'use strict';

describe('Typesetting utilities:', function () {
    beforeEach(function(done) {
        $('.unittest').remove(); // Remove existing tex documents
        $('body').append(__html__['fixtures/test1']);
        done();
    });

    describe('Update shortest path', function () {
        it('Normal', function () {
            var vars = {},
                lineVars = {};

            vars.shortestPath = {};
            vars.activeBreakpoints = new Queue();
            lineVars.line = 1;

            TypesetBot.typesetUtils.updateShortestPath(vars, lineVars, 5, null, {demerit: 123});
            TypesetBot.typesetUtils.updateShortestPath(vars, lineVars, 5, 0, {demerit: 256});
            TypesetBot.typesetUtils.updateShortestPath(vars, lineVars, 6, 2, {demerit: 266});

            expect(vars.shortestPath[1][5][-1]).toEqual(123);
            expect(vars.shortestPath[1][5][0]).toEqual(256);
            expect(vars.shortestPath[1][6][2]).toEqual(266);
        });

        it('Overwrite shortest path', function () {
            var vars = {},
                lineVars = {};

            vars.shortestPath = {};
            vars.activeBreakpoints = new Queue();
            lineVars.line = 1;

            TypesetBot.typesetUtils.updateShortestPath(vars, lineVars, 5, null, {demerit: 123});
            TypesetBot.typesetUtils.updateShortestPath(vars, lineVars, 5, null, {demerit: 50});
            TypesetBot.typesetUtils.updateShortestPath(vars, lineVars, 5, null, {demerit: 256});

            expect(vars.shortestPath[1][5][-1]).toEqual(50);
        });
    });

    describe('Check shortest path', function () {
        it('Valid', function () {
            var vars = {},
                lineVars = {};

            vars.shortestPath = {};
            vars.activeBreakpoints = new Queue();
            lineVars.line = 1;
            var a = {demerit: 123};
            TypesetBot.typesetUtils.updateShortestPath(vars, lineVars, 5, null, a);

            expect(TypesetBot.typesetUtils.checkShortestPath(vars, 1, a)).toEqual(false);
        });
        it('Invalid', function () {
            var vars = {},
                lineVars = {};

            vars.shortestPath = {};
            vars.activeBreakpoints = new Queue();
            lineVars.line = 1;
            var a = {demerit: 123};
            var b = {demerit: 124, nodeIndex: 5, hyphenIndex: null};
            TypesetBot.typesetUtils.updateShortestPath(vars, lineVars, 5, null, a);

            expect(TypesetBot.typesetUtils.checkShortestPath(vars, 1, b)).toEqual(true);
        });
    });

    describe('Initialize paragraph variables', function () {
        it('Standart', function () {
            var elem = $('.plain');
            var settings = TypesetBot.settings.get();
            var vars = TypesetBot.typesetUtils.initVars(elem, settings);

            expect(vars).not.toEqual(null);
            expect(vars.activeBreakpoints).not.toEqual(null);
            expect(vars.nodes.length).toEqual(257);
            expect(vars.finalBreaks.length).toEqual(0);

            expect(vars.spaceStretch).not.toBeLessThan(0);
            expect(vars.spaceShrink).not.toBeLessThan(0);
            expect(vars.spaceWidth).not.toBeLessThan(0);
            expect(vars.width).not.toBeLessThan(0);
            expect(vars.fontSize).not.toBeLessThan(0);

            expect(vars.lastRenderNode).toEqual(0);
            expect(vars.done).toEqual(false);

            expect(vars.renderContent).toEqual('');
            expect(vars.content).not.toEqual('');
        });
        it('No linewidths', function () {
            var elem = $('.plain');
            var settings = TypesetBot.settings.get({dynamicWidth: false});
            var vars = TypesetBot.typesetUtils.initVars(elem, settings);

            expect(vars).not.toEqual(null);
        });
        it('Existing nodes', function () {
            var elem = $('.plain');
            var settings = TypesetBot.settings.get();
            var hash = 'hashtest';
            elem.attr('hashcode', hash);
            TypesetBot.vars[hash] = 'test';

            var vars = TypesetBot.typesetUtils.initVars(elem, settings);

            expect(vars).not.toEqual(null);
            expect(vars.nodes).toEqual('test');
        });
    });

    describe('Initialize line variables', function () {
        it('Standart', function () {
            var elem = $('.plain');
            var settings = TypesetBot.settings.get();
            var vars = TypesetBot.typesetUtils.initVars(elem, settings);
            var a = {
                nodeIndex: 5,
                hyphenIndex: 1,
                height: 0,
                lineNumber: 2
            };

            var lineVars = TypesetBot.typesetUtils.initLineVars(elem, settings, vars, a);

            expect(lineVars).not.toEqual(null);
            expect(lineVars.curWidth).toEqual(0);
            expect(lineVars.done).toEqual(false);
            expect(lineVars.hyphenIndex).toEqual(1);
            expect(lineVars.line).toEqual(2);
            expect(lineVars.lineHeight).toEqual(0);
            expect(lineVars.nodeIndex).toEqual(5);
            expect(lineVars.origin).toEqual(a);
            expect(lineVars.wordCount).toEqual(0);
        });

        it('Skip node', function () {
            var elem = $('.plain');
            var settings = TypesetBot.settings.get();
            var vars = TypesetBot.typesetUtils.initVars(elem, settings);
            var a = {
                nodeIndex: 5,
                hyphenIndex: 1,
                height: 0,
                lineNumber: 2,
                demerit: 125 // Higher demerit
            };

            TypesetBot.typesetUtils.updateShortestPath(vars, {line: 1}, 5, 1, {demerit: 123});

            var lineVars = TypesetBot.typesetUtils.initLineVars(elem, settings, vars, a);
            expect(lineVars.done).toEqual(true);
        });
    });

    describe('Get work elem:', function () {
        it('Create new elem', function () {
            var elem = $('.plain');
            TypesetBot.typesetUtils.getWorkElem(elem, 'test123');
            expect($('p[hashcode="test123"]').length).toEqual(2);
        });

        it('Retreive existing elem', function () {
            var elem = $('.plain');
            var work = TypesetBot.typesetUtils.getWorkElem(elem, 'test123');
            work.addClass('typeset-paragraph');

            TypesetBot.typesetUtils.getWorkElem(elem, 'test123');
            expect($('p[hashcode="test123"]').length).toEqual(2);
        });
    });

    describe('Delete work elem:', function () {
        it('Remove multiple elem', function () {
            var elem1 = $('.plain');
            var elem2 = $('.space');
            var work1 = TypesetBot.typesetUtils.getWorkElem(elem1, 'test123');
            var work2 = TypesetBot.typesetUtils.getWorkElem(elem2, 'test123');
            work1.addClass('typeset-paragraph');
            work2.addClass('typeset-paragraph');

            TypesetBot.typesetUtils.deleteWorkElem('test123');

            expect($('.plain').length).toEqual(1);
            expect($('.space').length).toEqual(1);
        });
    });

    describe('Element css', function () {
        it('Same style', function () {
            var elem1 = $('.plain');
            var elem2 = $('.space');

            expect(TypesetBot.typesetUtils.getCssString(elem1)).toEqual(TypesetBot.typesetUtils.getCssString(elem2));
        });
        it('Different style', function () {
            var elem1 = $('.plain');
            var elem2 = $('.big-font');

            expect(TypesetBot.typesetUtils.getCssString(elem1))
                .not.toEqual(TypesetBot.typesetUtils.getCssString(elem2));
        });
    });


    describe('Element hashing', function () {
        it('Same content different style', function () {
            var elem1 = $('.plain');
            var elem2 = $('.big-font');

            expect(TypesetBot.utils.getHash(elem1.html())).toEqual(TypesetBot.utils.getHash(elem2.html()));
            expect(TypesetBot.typesetUtils.hashElem(elem1)).not.toEqual(TypesetBot.typesetUtils.hashElem(elem2));
        });
    });
});
