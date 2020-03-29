'use strict';

describe('utils.ts:', function () {
    describe('createUUID', function() {
        it('Uniqueness of uuid', function() {
            let map = {};
            for (let index = 0; index < 1000; index++) {
                let uuid = TypesetBotUtils.createUUID();
                map[uuid] = true;
            }

            expect(Object.keys(map).length).toEqual(1000);
        });
    });
    describe('isVisible', function() {
        it('Check display none', function() {
            let fixture =
                '<div class="test">' +
                    'Hello world' +
                '</div>';
            let style =
                '<style class="style">' +
                    '.test { display: none; }' +
                '<style>';

            document.body.insertAdjacentHTML('beforeend', fixture);
            expect(TypesetBotUtils.isVisible(document.querySelector('.test'))).toEqual(true);

            document.body.insertAdjacentHTML('beforeend', style);
            expect(TypesetBotUtils.isVisible(document.querySelector('.test'))).toEqual(false);
        });
        // it('Check empty element', function() {
        //     let fixture =
        //         '<div class="test">' +
        //             '' +
        //         '</div>';

        //     document.body.insertAdjacentHTML('beforeend', fixture);
        //     expect(TypesetBotUtils.isVisible(document.querySelector('.test'))).toEqual(false);
        // });
    });
    describe('getArrayIndexes', function() {
        it('General', function() {
            expect(TypesetBotUtils.getArrayIndexes(["hyp", "hen", "ation"])).toEqual([3, 3]);
            expect(TypesetBotUtils.getArrayIndexes(["hyptation"])).toEqual([]);
        })
    })
});
