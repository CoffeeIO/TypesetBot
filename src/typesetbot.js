TypesetBot = (function(obj, $) {

    obj.global = 420;
    /**
     * Typeset selected elements.
     */
    obj.run = function(selector) {
        console.log(obj.lineUtils.func() + ' world');
    };

    /**
     * Attach selected elements to be watched and typeset by TypeBot.
     */
    obj.attach = function(selector) {
        throw "Not implemented";
    };

    /**
     * Detach selected elements not to be watched by TypeBot.
     */
    obj.detach = function(selector) {
        throw "Not implemented";
    };

    return obj;
}(TypesetBot || {}, jQuery));
