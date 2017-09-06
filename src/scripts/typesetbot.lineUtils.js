TypesetBot.lineUtils = (function(obj) {

    /**
     * Width of the last line that wasn't the max line width.
     */
    var lastLineWidth = 0;

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
        lastLineWidth = search;
        return search;
    }

    // Store of linewidths.
    obj.widthStore = {};

    /**
     * 
     */
    obj.nextLineWidthStore = function (dom, idealW, i) {
        // Try to find already defined width.
        if (obj.widthStore[i] != null) {
            return obj.widthStore[i];
        }
        var width = obj.nextLineWidth(dom, idealW, i);
        obj.widthStore[i] = width;
        return width;
    }

    /**
     * Get the ideal line with of the following line, assuming we're on a newline.
     *
     * Basic logic:
     * - We create and element "1 1", and we know it's dimensions.
     * - We add margin on the left side to push the element to the right side.
     * - When we find the maximum width of the line the element will overflow to next line, "1 " \n "1" and the element
     *   will be 2 lines high.
     * - We find the point were we've still on one line and return the margin we've added to the left side and the
     *   width of the element.
     *
     * Most cases will be full width, O(1)
     * Other cases will use binary search, O(log n)
     * Repeating of same line width, O(1)
     */
    obj.nextLineWidth = function (dom, idealW, i) {
        dom.html(
            '<span class="typeset-block" style="height: ' + i + 'px"></span>' +
            '<span class="typeset-linewidth">1 1</span>'
        );

        // The vertical scrollbar might dissapear when we remove the original content, giving more horizontal space,
        // so we need to offset the returned result for this.
        var scrollbarOffset = dom.width() - idealW;

        var pointer = dom.find('.typeset-linewidth'),
            yPos = pointer.position().top,
            baseW = pointer.width(),
            baseH = pointer.height(),
            accuracy = 0.001 * idealW; // Search width, 0.1% accuracy

        // Check if ideal width is the same as the last line.
        if (lastLineWidth !== 0) {
            var lowT = false,
                highT = false;

            pointer.css('margin-left', (lastLineWidth - baseW) + 'px');
            if (pointer.position().top === yPos && pointer.height() === baseH) { // Height unchanged
                lowT = true;
            }

            pointer.css('margin-left', (lastLineWidth - baseW + accuracy) + 'px');
            if (pointer.position().top === yPos && pointer.height() !== baseH) { // Height changed
                highT = true;
            }

            if (lowT && highT) {
                pointer.remove();
                return lastLineWidth - scrollbarOffset;
            }
        }

        // Check if ideal width is the actual line width.
        // If the y postiion and height of the span is unaffected, we can assume line width = ideal width.
        pointer.css('margin-left', (idealW - baseW) + 'px');
        if (pointer.position().top === yPos && pointer.height() === baseH) {
            pointer.remove();
            lastLineWidth = 0; // Reset last binary search
            return idealW;
        }

        return searchWidth(dom, accuracy, idealW / 2, idealW / 4, {
            elem: pointer,
            baseW,
            baseH,
            yPos
        }) - scrollbarOffset;
    };

    /**
     * Get ideal linewidths within a range.
     */
    obj.getAllLinewidths = function (elem, width, maxheight, settings) {
        var arr = [],
            content = elem.html();

        arr.push(TypesetBot.lineUtils.nextLineWidth(elem, width, 0));
        for (var i = 1; i <= maxheight + settings.dynamicWidthIncrement; i += settings.dynamicWidthIncrement) {
            arr.push(TypesetBot.lineUtils.nextLineWidth(elem, width, i));
        }

        elem.html(content); // Reset content
        return arr;
    };

    return obj;
})(TypesetBot.lineUtils || {});
