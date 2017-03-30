TypesetBot.lineUtils = (function(obj) {

    obj.lastLineWidth = 0;

    /**
     * Binary search for ideal line width.
     */
    function searchWidth (dom, accuracy, search, offset, p) {
        p.elem.css('margin-left', (search - p.baseW) + 'px');
        if (!(p.elem.position().top === p.yPos && p.elem.height() === p.baseH)) {
            // Search lower width.
            return searchWidth(dom, accuracy, search - offset, offset / 2, p);
        }

        p.elem.css('margin-left', (search - p.baseW + accuracy) + 'px');
        if (p.elem.position().top === p.yPos && p.elem.height() === p.baseH) {
            // Search higher width.
            return searchWidth(dom, accuracy, search + offset, offset / 2, p);
        }

        // Found width.
        p.elem.remove();
        obj.lastLineWidth = search;
        return search;
    }

    /**
     * Get the ideal line with of the following line, assuming we're on a newline.
     *
     * Most cases will be full width, O(1)
     * Other cases will use binary search, O(log n)
     * Repeating of same line width, O(1)
     */
    obj.nextLineWidth  = function (dom, idealW, i) {
        dom.html('<span class="typeset-block" style="height: ' + i + 'px"></span><span class="typeset-linewidth">1 1</span>');

        // dom.append('<span class="typeset-linewidth">1 1</span>'); // Assuming all lines are longer than '1 1'

        var pointer = dom.find('.typeset-linewidth'),
            yPos = pointer.position().top,
            baseW = pointer.width(),
            baseH = pointer.height(),
            accuracy = 0.001 * idealW; // Search width, 0.1% accuracy

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

        // Check if ideal width is the actual line width.
        // If the y postiion and height of the span is unaffected, we can assume line width = ideal width.
        pointer.css('margin-left', (idealW - baseW) + 'px');
        if (pointer.position().top === yPos && pointer.height() === baseH) {
            pointer.remove();
            obj.lastLineWidth = 0; // Reset last binary search
            return idealW;
        }

        return searchWidth(dom, accuracy, idealW / 2, idealW / 4, {
            elem: pointer,
            baseW,
            baseH,
            yPos
        });
    };

    obj.getAllLinewidths = function (elem, width, maxheight) {
        var arr = [];

        var content = elem.html();

        for (var i = 0; i <= maxheight; i++) {
            arr.push(TypesetBot.lineUtils.nextLineWidth(elem, width, i));

        }

        elem.html(content); // Reset content
        console.log(arr);
        return arr;
    }

    return obj;
})(TypesetBot.lineUtils || {});
