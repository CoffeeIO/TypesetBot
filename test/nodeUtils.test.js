'use strict';

describe('Node utilities:', function () {
    beforeEach(function(done) {
        $('.unittest').remove(); // Remove existing tex documents
        $('body').append(__html__['fixtures/test1']);
        done();
    });

    // describe('Node properties:', function () {
    //     it('Normal words', function () {
    //         var words = TypesetBot.paraUtils.getWords($('.plain').html());
    //         expect(words.length).not.toBeLessThan(0);
    //         var props = TypesetBot.nodeUtils.wordsToNodes($('.plain'), words);
    //         expect(props.length).toEqual(words.length);
    //         props.forEach(function (index, item) {
    //             expect(item.width).not.toBeLessThan(0);
    //             expect(item.str).toEqual(words[index]);
    //         });
    //     });
    //     it('Empty array', function () {
    //         expect(TypesetBot.nodeUtils.getWordProperties($('.plain'), [])).toEqual([]);
    //     });
    // });
});
