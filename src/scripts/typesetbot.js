TypesetBot = (function(obj, $) {

    // Check if window is loaded (this includes fonts, so we can work on UI).
    obj.load = false;

    // Selector ids.
    id = 0;

    // Id -> String query selectors.
    selectors = {};

    // Id -> settings object.
    settingsStore = {};

    /**
     * Map of paragraph hash to array of node objects.
     * User can get and set this variable as they please
     */
    obj.vars = {};

    /**
     * Typeset selected elements.
     */
    obj.run = function(selector, custom = null) {
        settings = TypesetBot.settings.get(custom);

        var elem = $(selector);

        if (elem.length === 0) {
            return false;
        }

        TypesetBot.typeset.element(elem, settings);
    };

    /**
     * Attach selected elements to be watched and typeset by TypesetBot on viewport change.
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
            if ({}.hasOwnProperty.call(selectors, key)) {
                obj.run(selectors[key], settingsStore[key]);
            }
        }
    };

    return obj;
}(TypesetBot || {}, jQuery));
