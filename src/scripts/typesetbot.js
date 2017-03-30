TypesetBot = (function(obj, $) {

    id = 0;
    selectors = {};
    settingsStore = {};

    /**
     * Map of paragraph variables.
     */
    obj.vars = {};

    /**
     * Typeset selected elements.
     */
    obj.run = function(selector, custom = null) {
        settings = TypesetBot.settings.validate(custom);

        var elem = $(selector);

        if (elem.length === 0) {
            return false;
        }

        TypesetBot.typeset.typeset(elem, settings);
    };

    /**
     * Attach selected elements to be watched and typeset by TypeBot.
     */
    obj.attach = function(selector, custom = null) {
        selectors[id] = selector;
        settingsStore[id] = custom;
        obj.run(selector, custom);

        return id++;
    };

    /**
     * Detach all selectors.
     */
    obj.detachAll = function() {
        selectors = {};
    };

    /**
     * Unwatch selected specific id.
     */
    obj.detach = function(id) {
        if (selectors[id] != null) {
            var val = selectors[id];
            delete selectors[id];
            delete settingsStore[id];

            TypesetBot.typeset.detach(val);
            return true;
        }

        return false;
    };

    /**
     * Return ids of attached elements.
     */
    obj.getAttached = function() {
        return Object.keys(selectors);
    };

    /**
     * Run all attached selectors.
     */
    obj.runAllAttached = function() {
        for (var key in selectors) {
            obj.run(selectors[key], settingsStore[key]);
        }
    };

    return obj;
}(TypesetBot || {}, jQuery));
