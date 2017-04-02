'use strict';

describe('General utilities:', function () {
    describe('String hashing', function () {
        it('Test normal html', function () {
            expect(TypesetBot.utils.getHash('lorem ipsum')).not.toEqual(null);
        });
        it('Test uniqueness', function () {
            expect(TypesetBot.utils.getHash('lorem ipsum')).not.toEqual(TypesetBot.utils.getHash('lorem ipsum '));
            expect(TypesetBot.utils.getHash('lorem ipsum')).not.toEqual(TypesetBot.utils.getHash('lorem ipsuM'));
            expect(TypesetBot.utils.getHash('lorem ipsum')).not.toEqual(TypesetBot.utils.getHash('<b>lorem ipsum</b>'));
        });
    });

    describe('Alignment class', function () {
        it('Normal case', function () {
            expect(TypesetBot.utils.getAlignmentClass('ragged-center')).toEqual('typeset-center');
        });
        it('Empty', function () {
            expect(TypesetBot.utils.getAlignmentClass('')).toEqual('');
            expect(TypesetBot.utils.getAlignmentClass(null)).toEqual('');
        });
        it('Unknown', function () {
            expect(TypesetBot.utils.getAlignmentClass('hello')).toEqual('');
        });
    });

    describe('Array indexes w. offset', function () {
        it('Normal case', function () {
            expect(TypesetBot.utils.getArrayIndexes(["hyp", "hen", "ation"])).toEqual([3, 3]);
        });
        it('Single element array', function () {
            expect(TypesetBot.utils.getArrayIndexes(["hyp"])).toEqual([]);
        });
        it('Empty array', function () {
            expect(TypesetBot.utils.getArrayIndexes(["hyp"])).toEqual([]);
        });
    });

    describe('Reverse tag list', function () {
        it('Single tag case', function () {
            var nodes = [];
            nodes.push(TypesetBot.node.createWord('hello'));
            nodes.push(TypesetBot.node.createTag('<i>', false));
            nodes.push(TypesetBot.node.createWord('world'));
            nodes.push(TypesetBot.node.createTag('<i>', true));
            var indexes = [1];
            expect(TypesetBot.utils.reverseStack(nodes, indexes)).toEqual(['</i>']);
        });
        it('Multi tag case', function () {
            var nodes = [];
            nodes.push(TypesetBot.node.createTag('<span class="test">', false));
            nodes.push(TypesetBot.node.createWord('hello'));
            nodes.push(TypesetBot.node.createTag('<b>', false));
            nodes.push(TypesetBot.node.createWord('world'));
            var indexes = [0, 2];
            expect(TypesetBot.utils.reverseStack(nodes, indexes)).toEqual(['</b>', '</span>']);
        });
    });
});
