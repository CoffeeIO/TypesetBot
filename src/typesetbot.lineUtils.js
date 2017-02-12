TypesetBot.lineUtils = (function(obj){

    obj.lastLineWidth = 0;
    obj.searchWidth = function (dom, idealW, search, p) {
        // Check search width, 1px accuracy.
        p.elem.css('margin-left', (search - p.baseW) + 'px');
        if (p.elem.position().top === p.yPos && p.elem.height() === p.baseH) {

        }

        // Search higher width.

        // Search lower width.
    };

    /**
     *
     */
    obj.nextLineWidth  = function (dom, idealW) {
        dom.append('<span class="typeset-linewidth">1 1</span>'); // Assuming any line is longer than '1 1'

        var pointer = dom.find('.typeset-linewidth'),
            yPos = pointer.position().top,
            baseW = pointer.width(),
            baseH = pointer.height();

        pointer.css('margin-left', (idealW - baseW) + 'px');

        // Check if ideal width is the actual line width.
        // If the y postiion and height of the span is unaffected, we can assume line width = ideal width.
        if (pointer.position().top === yPos && pointer.height() === baseH) {
            pointer.remove();
            return idealW;
        }

        // Check if ideal width is the same as the last line.
        if (obj.lastLineWidth !== 0) {
            //pointer.css('margin-left', (idealW - baseW + offset) + 'px');
        }

        return obj.searchWidth(dom, idealW, idealW / 2, {
            'elem': pointer,
            'baseW': baseW,
            'baseH': baseH,
            'yPos': yPos
        });
    };

    obj.getAdjustmentRatio  = function () {
        throw "Not implemented";
    };

    return obj;
})(TypesetBot.lineUtils || {});
