"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

/**
 * The main TypesetBot class handing initializing new instances of TypesetBot.
 */
var TypesetBot =
/** @class */
function () {
  /**
   * Constructor of new TypesetBot objects.
   *
   * @param query    Nodes from a query or query selector
   * @param settings Custom settings object
   */
  function TypesetBot(query, settings) {
    this.logger = new TypesetBotLog(this);
    this.settings = new TypesetBotSettings(this, settings);
    this.elementQuery = new TypesetBotElementQuery(this, query);
  }

  ;
  return TypesetBot;
}();
/**
 * Class for handling debug messages and performance logging.
 */


var TypesetBotLog =
/** @class */
function () {
  /**
   * The constructor.
   *
   * @param tsb Instance of main class
   */
  function TypesetBotLog(tsb) {
    this.debug = true;
    /**
     * Log messages if debug mode is on.
     *
     * @param message The log message
     */

    this.log = function (message) {
      if (this.debug) {
        console.log('TypesetBot: %s', message);

        if (_typeof(message) === 'object') {
          console.log(message);
        }
      }
    };
    /**
     * Log messages if debug mode is on.
     *
     * @param message The log message
     */


    this.warn = function (message) {
      if (this.debug) {
        console.warn('TypesetBot: %s', message);

        if (_typeof(message) === 'object') {
          console.warn(message);
        }
      }
    };
    /**
     * Log messages if debug mode is on or off.
     *
     * @param message The log message
     */


    this.error = function (message) {
      console.error('TypesetBot: %s', message);

      if (_typeof(message) === 'object') {
        console.error(message);
      }
    };
    /**
     * Start performance capture on specific key.
     *
     * @param key
     */


    this.start = function (key) {
      if (!this.debug) {
        return;
      }

      if (!(key in this._performanceMap)) {
        this._performanceMap[key] = new TypesetBotPerformanceEntry();
      }

      this._performanceMap[key].start.push(performance.now());
    };
    /**
     * End performance capture on specific key.
     *
     * @param key
     */


    this.end = function (key) {
      if (!this.debug) {
        return;
      }

      if (!(key in this._performanceMap)) {
        this._performanceMap[key] = new TypesetBotPerformanceEntry();
      }

      this._performanceMap[key].end.push(performance.now());
    };
    /**
     * Get formatted string of total performance time of specific key.
     *
     * @param key
     *
     * @returns Formatted string in ms and number of calls.
     */


    this.diff = function (key) {
      var startTotal = 0;
      var endTotal = 0;
      var entry = this._performanceMap[key];

      for (var i = 0; i < entry.start.length; i++) {
        startTotal += entry.start[i];
        endTotal += entry.end[i];
      } // Substract combined timestamps and round to 2 decimal.


      return (endTotal - startTotal).toFixed(2) + 'ms --- (calls: ' + entry.start.length + ')';
    };

    this._tsb = tsb;
    this._performanceMap = {};
  }

  return TypesetBotLog;
}();
/**
 * Class to hold start and end timestamps for a specific key.
 */


var TypesetBotPerformanceEntry =
/** @class */
function () {
  function TypesetBotPerformanceEntry() {
    this.start = [];
    this.end = [];
  }

  return TypesetBotPerformanceEntry;
}();
/**
 * Class for element querying.
 */


var TypesetBotElementQuery =
/** @class */
function () {
  function TypesetBotElementQuery(tsb, query) {
    this._queryString = null;
    /**
     * Handle multiple type of queries.
     *
     * @param query The query string, Node or NodeList
     */

    this.handleQuery = function (query) {
      if (query == null) {
        return;
      }

      if (typeof query == 'string') {
        this._queryString = query;
        this.elems = document.querySelectorAll(query);
        return;
      } else if (_typeof(query) == 'object') {
        if (NodeList.prototype.isPrototypeOf(query)) {
          this.elems = query;
          return;
        } else if (Node.prototype.isPrototypeOf(query)) {
          this.elems = [query];
          return;
        }
      }

      this._tsb.logger.warn('Unknown type of query used.');
    };
    /**
     * Requery the elements to typeset.
     */


    this.updateElements = function () {
      if (this._queryString == null) {
        this._tsb.logger.warn('Can not update elements without a query string.');

        return;
      }

      this.elems = document.querySelectorAll(this._queryString);
    };
    /**
     * Find text blocks in element.
     *
     * @param elem
     */


    this.findTextInElement = function (elem) {};

    this._tsb = tsb;
    this.handleQuery(query);
  }

  return TypesetBotElementQuery;
}();
/**
 * Class for managing the program settings.
 */


var TypesetBotSettings =
/** @class */
function () {
  /**
   * The constructor.
   *
   * @param settings Optional settings object.
   */
  function TypesetBotSettings(tsb, settings) {
    /**
     * Merge custom settings with a default set of settings.
     *
     * @param baseSettings
     * @param settings
     *
     * @returns The merged settings object
     */
    this._mergeSettings = function (settings) {
      if (settings == null) {
        return;
      }

      for (var _i = 0, _a = Object.entries(settings); _i < _a.length; _i++) {
        var _b = _a[_i],
            key = _b[0],
            value = _b[1];

        if (this[key] === undefined) {
          this._tsb.logger.warn('Unknown settings key "' + key + '"');
        }

        this[key] = value;
      }
    }; // ------------------------------------------------------------------------
    // SETTINGS ---------------------------------------------------------------
    // ------------------------------------------------------------------------
    // Algorithm. -------------------------------------------------------------


    this.alignment = 'justify'; // Other options are 'ragged-right', 'ragged-left' and 'ragged-center'

    this.hyphenPenalty = 50; // Penalty for line-breaking on a hyphen

    this.hyphenPenaltyRagged = 500; // Penalty for line-breaking on a hyphen when using ragged text

    this.flagPenalty = 3000; // Penalty when current and last line had flag value 1. Reffered to as 'α'

    this.fitnessClassDemerit = 3000; // Penalty when switching between ratio classes. Reffered to as 'γ'

    this.demeritOffset = 1; // Offset to prefer fewer lines by increasing demerit of "~zero badness lines"
    // "the value of q is increased by 1 (if q < 0) or decreased by 1 (if q > 0) until a feasible solution is
    //  found." - DT p.114

    this.loosenessParam = 0; // If zero we find to solution with fewest total demerits. Reffered to as 'q'

    this.absoluteMaxRatio = 5; // Max adjustment ratio before we give up on finding solutions

    this.maxRatio = 2; // Maximum acceptable adjustment ratio. Referred to as 'p'

    this.minRatio = -1; // Minimum acceptable adjustment ratio. Less than -1 will make the text too closely spaced.
    // Hyphen. ----------------------------------------------------------------

    this.hyphenLanguage = 'en-us'; // Language of hyphenation patterns to use

    this.hyphenLeftMin = 2; // Minimum number of letters to keep on the left side of word

    this.hyphenRightMin = 2; // Minimum number of letters to keep on the right side of word
    // 4 classes of adjustment ratios.

    this.fitnessClass = [-1, -0.5, 0.5, 1, Infinity]; // Font. ------------------------------------------------------------------

    this.spaceUnit = 'em'; // Space width unit, em is relative to font-size

    this.spaceWidth = 1 / 3; // Ideal space width

    this.spaceStretchability = 1 / 6; // How much can the space width stretch

    this.spaceShrinkability = 1 / 9; // How much can the space width shrink
    // Inline element that the program will unwrap from paragraphs as they could disrupt the line breaking.

    this.unwrapElements = ['img']; // Dynamic width. ---------------------------------------------------------
    // Allow the paragraph to account for overlapping elements, turn this off if you know there's no overlapping
    // element to gain performance.

    this.dynamicWidth = true; // Pixel increment of vertical search, higher better performance, lower more accurate result.

    this.dynamicWidthIncrement = 5; // Settings functions. ----------------------------------------------------
    // Adjustment ratio.

    this.ratio = function (idealW, actualW, wordCount, shrink, stretch) {
      if (actualW < idealW) {
        return (idealW - actualW) / ((wordCount - 1) * stretch);
      }

      return (idealW - actualW) / ((wordCount - 1) * shrink);
    }; // Badness calculation.


    this.badness = function (ratio) {
      if (ratio == null || ratio < this.minRatio) {
        return Infinity;
      }

      return 100 * Math.pow(Math.abs(ratio), 3) + 0.5;
    }; // Demerit calculation.


    this.demerit = function (badness, penalty, flag) {
      var flagPenalty = flag ? this.flagPenalty : 0;

      if (penalty >= 0) {
        return Math.pow(this.demeritOffset + badness + penalty, 2) + flagPenalty;
      } else if (penalty === -Infinity) {
        return Math.pow(this.demeritOffset + badness, 2) + flagPenalty;
      } else {
        return Math.pow(this.demeritOffset + badness, 2) - Math.pow(penalty, 2) + flagPenalty;
      }
    };

    this._tsb = tsb;
    this._customSettings = settings;

    this._mergeSettings(settings);
  }

  return TypesetBotSettings;
}();