TypesetBot = (function(obj, $) {

    // Check if window is loaded (this includes fonts, so we can work on UI).
    obj.load = false;

    // Current selector id.
    var id = 0;

    // Id -> String query selectors.
    selectors = {};

    // Id -> settings object.
    settingsStore = {};

    /**
     * Map of paragraph hash to array of nodes.
     * Variable is exposed so the user can get and set this variable as they please.
     */
    obj.vars = {};

    obj.debugVars = {};
    function printDebug(settings) {
        if (settings.debug) {
            console.log('Total execution %sms', obj.debugVars.run);
            console.log('-- Init variables %sms', obj.debugVars.varinit);
            console.log('---- Node construction %s ms', obj.debugVars.nodeinit);
            console.log('---- Checking dynamic width %sms', obj.debugVars.dynamicwidth);
            console.log('-- Hyphen init %sms', obj.debugVars.hypheninit);
            console.log('-- Linebreaking %sms', obj.debugVars.linebreak);
            console.log('-- Apply linebreak %sms', obj.debugVars.apply);
        }
    }

    /**
     * Typeset selected elements.
     * @param {string} selector Query selector for the elements to typeset
     * @param {object} custom   The settings to use
     */
    obj.run = function(selector, custom = null, callback) {
        var settings = TypesetBot.settings.get(custom);
        var timer = setInterval(function () {
            if (obj.load) {
                var elem = $(selector);

                if (elem.length === 0) {
                    return false;
                }
                var timeRun = performance.now();
                TypesetBot.typeset.element(elem, settings);
                if (settings.debug) {
                    TypesetBot.debugVars.run = (performance.now() - timeRun).toFixed(2); // debug values
                }
                printDebug(settings)

                clearInterval(timer);
                if (callback != null) {
                    callback();
                }
            }
        }, 50);
    };

    /**
     * Attach selected elements to be watched and typeset by TypesetBot on viewport change.
     * @param {string} selector Query selector for the elements to typeset
     * @param {object} custom   The settings to use
     */
    obj.attach = function(selector, custom = null) {
        selectors[id] = selector;
        settingsStore[id] = custom;
        var oldId = id;
        id++;
        obj.run(selector, custom);

        return oldId;
    };

    /**
     * Detach all selectors.
     */
    obj.detachAll = function() {
        selectors = {};
    };

    /**
     * Unwatch selected specific id.
     * @param  {int} id The id of the attached selector to detach
     * @return {bool}   Return true if selector was detached, otherwise return false
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
     * @return {array} Int array of selector ids
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
