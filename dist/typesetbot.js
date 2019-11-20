"use strict";

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * The main TypesetBot class handing initializing new instances of TypesetBot.
 */
var TypesetBot =
/**
 * Constructor of new TypesetBot objects.
 *
 * @param query    Nodes from a query or query selector
 * @param settings Custom settings object
 */
function TypesetBot(query, settings) {
  _classCallCheck(this, TypesetBot);

  this.logger = new TypesetBotLog(this);
  this.utils = new TypesetBotUtils(this);
  this.uuid = this.utils.create_UUID();
  this.settings = new TypesetBotSettings(this, settings);
  this.elementQuery = new TypesetBotElementQuery(this, query);
};
/**
 * Class for handling debug messages and performance logging.
 */


var TypesetBotLog =
/**
 * The constructor.
 *
 * @param tsb Instance of main class
 */
function TypesetBotLog(tsb) {
  _classCallCheck(this, TypesetBotLog);

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
};
/**
 * Class to hold start and end timestamps for a specific key.
 */


var TypesetBotPerformanceEntry = function TypesetBotPerformanceEntry() {
  _classCallCheck(this, TypesetBotPerformanceEntry);

  this.start = [];
  this.end = [];
};
/**
 * Class for element querying.
 */


var TypesetBotElementQuery = function TypesetBotElementQuery(tsb, query) {
  _classCallCheck(this, TypesetBotElementQuery);

  this._queryString = null;
  this._index = 0;
  this._nodeMap = {};
  this.nodes = []; // Or array

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
      var elems = document.querySelectorAll(query);
      console.log(elems);
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = elems[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var elem = _step.value;
          this.nodes.push(elem);
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator["return"] != null) {
            _iterator["return"]();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      return;
    } else if (_typeof(query) == 'object') {
      if (NodeList.prototype.isPrototypeOf(query)) {
        var _elems = query;
        console.log(_elems);
        var _iteratorNormalCompletion2 = true;
        var _didIteratorError2 = false;
        var _iteratorError2 = undefined;

        try {
          for (var _iterator2 = _elems[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
            var _elem = _step2.value;
            this.nodes.push(_elem);
          }
        } catch (err) {
          _didIteratorError2 = true;
          _iteratorError2 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion2 && _iterator2["return"] != null) {
              _iterator2["return"]();
            }
          } finally {
            if (_didIteratorError2) {
              throw _iteratorError2;
            }
          }
        }

        return;
      } else if (Node.prototype.isPrototypeOf(query)) {
        console.log(query);
        this.nodes.push(query);
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


  this.findTextInElements = function (nodes) {
    var _iteratorNormalCompletion3 = true;
    var _didIteratorError3 = false;
    var _iteratorError3 = undefined;

    try {
      for (var _iterator3 = nodes[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
        var node = _step3.value;
        this.findTextInElement(node);
      }
    } catch (err) {
      _didIteratorError3 = true;
      _iteratorError3 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion3 && _iterator3["return"] != null) {
          _iterator3["return"]();
        }
      } finally {
        if (_didIteratorError3) {
          throw _iteratorError3;
        }
      }
    }
  };
  /**
   * Find text blocks in element.
   *
   * @param elem
   */


  this.findTextInElement = function (node) {
    // Mark node to avoid look at the same element twice.
    if (node.getAttribute('data-tsb-uuid') != null) {
      return;
    }

    if (node.getAttribute('data-tsb-indexed') != null) {
      return;
    }

    node.setAttribute('data-tsb-uuid', this._tsb.uuid);
    node.setAttribute('data-tsb-indexed', this._index);
    this._nodeMap[this._index] = node;
    this._index += 1;

    if (!('childNodes' in node)) {
      return;
    }

    var _iteratorNormalCompletion4 = true;
    var _didIteratorError4 = false;
    var _iteratorError4 = undefined;

    try {
      for (var _iterator4 = node.childNodes[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
        var child = _step4.value;
        console.log(child);
        console.log(child.nodeType);
      }
    } catch (err) {
      _didIteratorError4 = true;
      _iteratorError4 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion4 && _iterator4["return"] != null) {
          _iterator4["return"]();
        }
      } finally {
        if (_didIteratorError4) {
          throw _iteratorError4;
        }
      }
    }
  };

  this._tsb = tsb;
  this.handleQuery(query);
  this.findTextInElements(this.nodes);
};
/**
 * Class for managing the program settings.
 */


var TypesetBotSettings =
/**
 * The constructor.
 *
 * @param settings Optional settings object.
 */
function TypesetBotSettings(tsb, settings) {
  _classCallCheck(this, TypesetBotSettings);

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

    for (var _i = 0, _Object$entries = Object.entries(settings); _i < _Object$entries.length; _i++) {
      var _Object$entries$_i = _slicedToArray(_Object$entries[_i], 2),
          key = _Object$entries$_i[0],
          value = _Object$entries$_i[1];

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
};

var TypesetBotUtils = function TypesetBotUtils(tsb) {
  _classCallCheck(this, TypesetBotUtils);

  this.create_UUID = function () {
    var dt = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = (dt + Math.random() * 16) % 16 | 0;
      dt = Math.floor(dt / 16);
      return (c == 'x' ? r : r & 0x3 | 0x8).toString(16);
    });
    return uuid;
  };

  this._tsb = tsb;
};