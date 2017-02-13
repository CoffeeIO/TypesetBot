TypesetBot.lineUtils = (function(obj){

    obj.lastLineWidth = 0;
    obj.searchWidth = function (dom, accuracy, search, p) {
        p.elem.css('margin-left', (search - p.baseW) + 'px');
        if (!(p.elem.position().top === p.yPos && p.elem.height() === p.baseH)) {
            // Search lower width.
            return obj.searchWidth(dom, accuracy, search * 0.5, p);
        }

        p.elem.css('margin-left', (search - p.baseW + accuracy) + 'px');
        if (p.elem.position().top === p.yPos && p.elem.height() === p.baseH) {
            // Search higher width.
            return obj.searchWidth(dom, accuracy, search * 1.5, p);
        }

        // Found width.
        p.elem.remove();
        obj.lastLineWidth = search;
        return search;
    };

    /**
     * Get the ideal line with of the following line.
     * Assume we are on a newline.
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
            obj.lastLineWidth = 0; // Reset last binary search
            return idealW;
        }

        // Check search width, 0.2% accuracy.
        var accuracy = 0.002 * idealW;

        // Check if ideal width is the same as the last line.
        if (obj.lastLineWidth !== 0) {
            var lowT = false,
                highT = false;

            pointer.css('margin-left', (obj.lastLineWidth - baseW) + 'px');
            if (pointer.position().top === yPos && pointer.height() === baseH) { // Height unchanged
                lowT = true;
            }

            pointer.css('margin-left', (obj.lastLineWidth - baseW + accuracy) + 'px');
            if (pointer.position().top === yPos && pointer.height() !== baseH) { // Height changed
                highT = true;
            }

            if (lowT && highT) {
                pointer.remove();
                return obj.lastLineWidth;
            }
        }

        return obj.searchWidth(dom, accuracy, idealW / 2, {
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
