//code.stephenmorley.org @see http://code.stephenmorley.org/javascript/queues/
function Queue(){var a=[],b=0;this.getLength=function(){return a.length-b};this.isEmpty=function(){return 0==a.length};this.enqueue=function(b){a.push(b)};this.dequeue=function(){if(0!=a.length){var c=a[b];2*++b>=a.length&&(a=a.slice(b),b=0);return c}};this.peek=function(){return 0<a.length?a[b]:void 0}};

"use strict";

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

if (!Object.entries) {
  Object.entries = function (obj) {
    var ownProps = Object.keys(obj),
        i = ownProps.length,
        resArray = new Array(i); // preallocate the Array

    while (i--) {
      resArray[i] = [ownProps[i], obj[ownProps[i]]];
    }

    return resArray;
  };
}
/**
 * The main TypesetBot class handing initializing new instances of TypesetBot.
 */


var TypesetBot =
/**
 * Constructor of new TypesetBot objects.
 *
 * @param query?    Nodes from a query or query selector
 * @param settings? Custom settings object
 */
function TypesetBot(query, settings) {
  _classCallCheck(this, TypesetBot);

  this.indexToNodes = {};
  this.indexToTokens = {};
  this.indexToTypesetInstance = {}; // Calculated word hyphens store.
  // hyphenStore['en-us']['hyphenation'] = ["hy", "phen", "ate"]

  this.hyphenStore = {};
  /**
   * Initialize TypesetBot instance.
   * This function will be called delayed if the document is not ready.
   */

  this.init = function () {
    if (this.isInitialized) {
      return;
    }

    this.isInitialized = true;
    this.util = new TypesetBotUtils(this);
    this.settings = new TypesetBotSettings(this, this.initParamSettings);
    this.logger = new TypesetBotLog(this);
    this.uuid = TypesetBotUtils.createUUID();
    this.query = new TypesetBotElementQuery(this, this.initParamQuery);
    this.typesetter = new TypesetBotTypeset(this);
    this.isWatching = true;

    if (!this.settings.noRun) {
      this.typeset();
    }
  };
  /**
   * Typeset all elements in query.
   */


  this.typeset = function () {
    var force = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

    if (!this.isInitialized) {
      return;
    }

    if (force || this.isWatching) {
      this.logger.resetTime();
      this.logger.start('Typeset');
      this.typesetNodes(this.query.nodes);
      this.logger.end('Typeset'); // Log the time diffs.

      this.logger.diff('Typeset');
      this.logger.diff('-- Preprocess');
      this.logger.diff('---- Clone working node');
      this.logger.diff('---- Tokenize text');
      this.logger.diff('---- Get render size of words');
      this.logger.diff('------ Build HTML');
      this.logger.diff('------ Update DOM');
      this.logger.diff('------ Query DOM');
      this.logger.diff('------ Get Properties');
      this.logger.diff('---- Getting element properties');
      this.logger.diff('---- Hyphen calc');
      this.logger.diff('---- Hyphen render');
      this.logger.diff('---- other');
      this.logger.diff('-- Dynamic programming');
      this.logger.diff('-- Finding solution');
      this.logger.diff('-- Apply breakpoints');
    }
  };
  /**
   * Force single rerun of typesetting.
   */


  this.rerun = function () {
    this.typeset(true);
  };
  /**
   * Query selector again and run typesetting.
   */


  this.requery = function () {
    this.query.requery();
    this.typeset(true);
  };
  /**
   * Watch nodes for typesetting if not already watching.
   */


  this.watch = function () {
    this.isWatching = true;
  };
  /**
   * Unwatch nodes for typesetting.
   */


  this.unwatch = function () {
    this.isWatching = false;
  };
  /**
   * Terminate watching nodes and clear up data.
   */


  this.terminate = function () {
    if (this.isTypesetting) {
      this.logger.warn('Cannot typeset paragraph before calculations are done.');
      return;
    }

    this.isTypesetting = true;
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = this.query.nodes[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var node = _step.value;
        var typesetter = this.util.getTypesetInstance(node); // Reset

        typesetter.reset(node);
        typesetter = null;
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

    this.isTypesetting = false;
    this.unwatch(); // Clear objects.

    delete this.indexToNodes;
    delete this.indexToNodes;
    delete this.indexToTokens;
    delete this.indexToTypesetInstance;
    delete this.hyphenStore;
    delete this.logger;
    delete this.settings;
    delete this.query;
    delete this.typesetter;
    delete this.util;
  };
  /**
   * Add event listeners to typesetbot instance.
   */


  this.addEventListeners = function () {
    var instance = this;
    document.addEventListener('typesetbot--complete', function () {
      instance.init();
    }, false);
    document.addEventListener('typesetbot--interactive', function () {
      instance.init();
    }, false);
    document.addEventListener('typesetbot-viewport--reize', function () {
      instance.typeset();
    }, false);
  };
  /**
   * Typeset multiple nodes.
   *
   * @parma nodes
   */


  this.typesetNodes = function (nodes) {
    if (this.isTypesetting) {
      this.logger.warn('Cannot typeset paragraph before calculations are done.');
      return;
    }

    this.isTypesetting = true;
    var _iteratorNormalCompletion2 = true;
    var _didIteratorError2 = false;
    var _iteratorError2 = undefined;

    try {
      for (var _iterator2 = nodes[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
        var node = _step2.value;
        var typesetter = this.util.getTypesetInstance(node);
        typesetter.typeset(node);
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

    this.isTypesetting = false;
  };

  this.initParamQuery = query;
  this.initParamSettings = settings;
  this.isInitialized = false;
  this.addEventListeners();

  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    this.init();
  }
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

  this.debug = false;
  this.logs = [];
  /**
   * Log messages if debug mode is on.
   *
   * @param message The log message
   */

  this.log = function (message) {
    if (this.logs.includes('log')) {
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
    if (this.logs.includes('warn')) {
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
    if (this.logs.includes('error')) {
      console.error('TypesetBot: %s', message);

      if (_typeof(message) === 'object') {
        console.error(message);
      }
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
   * @param key       Key of the time log
   * @param logOutput Should output be logged in console
   * @returns         Formatted string in ms and number of calls.
   */


  this.diff = function (key) {
    var logOutput = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

    if (!this.debug) {
      return;
    }

    var startTotal = 0;
    var endTotal = 0;
    var entry = this._performanceMap[key];

    if (entry == null) {
      return;
    }

    for (var i = 0; i < entry.start.length; i++) {
      startTotal += entry.start[i];
      endTotal += entry.end[i];
    } // Substract combined timestamps and round to 2 decimal.


    var output = key + ' ' + (endTotal - startTotal).toFixed(2) + 'ms --- (calls: ' + entry.start.length + ')';

    if (logOutput) {
      this.log(output);
    }

    return output;
  };

  this.resetTime = function () {
    this._performanceMap = {};
  };

  this._tsb = tsb;
  this._performanceMap = {};
  this.debug = this._tsb.settings.debug;
  this.logs = this._tsb.settings.logs;
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

  this.nodes = [];
  this._queryString = null;
  this._index = 0;
  this._nodeMap = {};
  this._nodesTemp = [];
  /**
   * Handle multiple type of queries.
   *
   * @param query The query string, Node or NodeList
   */

  this.handleQuery = function (query) {
    if (query == null) {
      return;
    }

    if (typeof query === 'string') {
      this._queryString = query;
      var elems = document.querySelectorAll(this._queryString);

      if (elems == null) {
        return;
      }

      var _iteratorNormalCompletion3 = true;
      var _didIteratorError3 = false;
      var _iteratorError3 = undefined;

      try {
        for (var _iterator3 = elems[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
          var elem = _step3.value;

          this._nodesTemp.push(elem);
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

      return;
    } else if (_typeof(query) === 'object') {
      if (NodeList.prototype.isPrototypeOf(query)) {
        var _iteratorNormalCompletion4 = true;
        var _didIteratorError4 = false;
        var _iteratorError4 = undefined;

        try {
          for (var _iterator4 = query[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
            var _elem = _step4.value;

            this._nodesTemp.push(_elem);
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

        return;
      } else if (Node.prototype.isPrototypeOf(query)) {
        this._nodesTemp.push(query);

        return;
      }
    }

    this._tsb.logger.warn('Unknown type of query used.');
  };
  /**
   * Requery elements.
   */


  this.requery = function () {
    if (this._queryString == null) {
      this._tsb.logger.warn('Can not requery since query string was not used.');

      return;
    }

    this._nodesTemp = [];
    var elems = document.querySelectorAll(this._queryString);

    if (elems == null) {
      return;
    }

    var _iteratorNormalCompletion5 = true;
    var _didIteratorError5 = false;
    var _iteratorError5 = undefined;

    try {
      for (var _iterator5 = elems[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
        var elem = _step5.value;

        this._nodesTemp.push(elem);
      }
    } catch (err) {
      _didIteratorError5 = true;
      _iteratorError5 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion5 && _iterator5["return"] != null) {
          _iterator5["return"]();
        }
      } finally {
        if (_didIteratorError5) {
          throw _iteratorError5;
        }
      }
    }

    this.indexNodes(this._nodesTemp);
  };
  /**
   * Find text blocks in element.
   *
   * @param elem
   */


  this.indexNodes = function (nodes) {
    this.removeNodesNotInDom();
    var _iteratorNormalCompletion6 = true;
    var _didIteratorError6 = false;
    var _iteratorError6 = undefined;

    try {
      for (var _iterator6 = nodes[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
        var node = _step6.value;
        this.indexNode(node);
      }
    } catch (err) {
      _didIteratorError6 = true;
      _iteratorError6 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion6 && _iterator6["return"] != null) {
          _iterator6["return"]();
        }
      } finally {
        if (_didIteratorError6) {
          throw _iteratorError6;
        }
      }
    }
  };
  /**
   * Remove any queried Node no longer in DOM.
   */


  this.removeNodesNotInDom = function () {
    var newNodes = [];
    var _iteratorNormalCompletion7 = true;
    var _didIteratorError7 = false;
    var _iteratorError7 = undefined;

    try {
      for (var _iterator7 = this.nodes[Symbol.iterator](), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
        var node = _step7.value;

        if (document.body.contains(node)) {
          newNodes.push(node);
        }
      }
    } catch (err) {
      _didIteratorError7 = true;
      _iteratorError7 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion7 && _iterator7["return"] != null) {
          _iterator7["return"]();
        }
      } finally {
        if (_didIteratorError7) {
          throw _iteratorError7;
        }
      }
    }

    this.nodes = newNodes;
  };
  /**
   * Find text blocks in element.
   *
   * @param elem
   */


  this.indexNode = function (node) {
    // Mark node with unique TypesetBot id.
    if (node.getAttribute('data-tsb-uuid') != null) {
      return;
    } // Mark node to avoid look at the same element twice.


    if (this._tsb.util.getElementIndex(node) != null) {
      return;
    }

    this._tsb.util.setElementIndex(node, this._index);

    node.setAttribute('data-tsb-uuid', this._tsb.uuid);
    this.nodes.push(node);
    this._nodeMap[this._index] = node;
    this._index += 1;
  };

  this._tsb = tsb;
  this.handleQuery(query);
  this.indexNodes(this._nodesTemp);
};
/**
 * Class for managing the program settings.
 */


var TypesetBotSettings =
/**
 * @param tsb
 * @param settings Optional settings object.
 */
function TypesetBotSettings(tsb) {
  var settings = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

  _classCallCheck(this, TypesetBotSettings);

  // ------------------------------------------------------------------------
  // SETTINGS ---------------------------------------------------------------
  // ------------------------------------------------------------------------
  // Hyphenation. -----------------------------------------------------------
  // Language of hyphenation patterns to use
  this.hyphenLanguage = 'en-us'; // Minimum number of letters to keep on the left side of word

  this.hyphenLeftMin = 2; // Minimum number of letters to keep on the right side of word

  this.hyphenRightMin = 2; // Algorithm. -------------------------------------------------------------
  // Other options are 'left', 'right' and 'center'.

  this.alignment = 'justify'; // Penalty for line-breaking on a hyphen

  this.hyphenPenalty = 50; // Penalty for line-breaking on a hyphen when using ragged text

  this.hyphenPenaltyRagged = 500; // Penalty when current and last line had flag value 1.

  this.flagPenalty = 3000; // Penalty when switching between ratio classes.

  this.fitnessClassDemerit = 3000; // 4 classes of adjustment ratios.

  this.fitnessClasses = [-1, -0.5, 0.5, 1, Infinity]; // Offset to prefer fewer lines by increasing demerit of "~zero badness lines"

  this.demeritOffset = 1; // Max adjustment ratio before we give up on finding solutions

  this.absoluteMaxRatio = 5; // Maximum acceptable adjustment ratio.

  this.maxRatio = 2; // Minimum acceptable adjustment ratio. Less than -1 will make the text too closely spaced.

  this.minRatio = -1; // Tags inside element that might break the typesetting algorithm

  this.unsupportedTags = ['BR', 'IMG']; // Font. ------------------------------------------------------------------
  // Ideal space width

  this.spaceWidth = 1 / 3; // How much can the space width stretch

  this.spaceStretchability = 1 / 6; // How much can the space width shrink

  this.spaceShrinkability = 1 / 9; // Debug mode. ------------------------------------------------------------
  // Prints performance stats.

  this.debug = false; // Don't run Typesetting as soon as program is initialized.

  this.noRun = false; // Define levels to log. Options: 'error', 'warn', 'log'

  this.logs = ['error', 'warn'];
  /**
   * Merge custom settings with a default set of settings.
   *
   * @param settings The custom overwrite settings
   */

  this._mergeSettings = function () {
    var settings = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

    if (settings == null) {
      return;
    }

    for (var _i = 0, _Object$entries = Object.entries(settings); _i < _Object$entries.length; _i++) {
      var _Object$entries$_i = _slicedToArray(_Object$entries[_i], 2),
          key = _Object$entries$_i[0],
          value = _Object$entries$_i[1];

      if (typeof this[key] === 'undefined') {
        console.warn('Unknown settings key "' + key + '"');
        continue;
      }

      this[key] = value;
    }
  };

  this._tsb = tsb;
  this._customSettings = settings;

  this._mergeSettings(settings);
};
/**
 * Class for utility functions.
 */


var TypesetBotUtils =
/**
 * @param tsb Instance of main class
 */
function TypesetBotUtils(tsb) {
  _classCallCheck(this, TypesetBotUtils);

  /**
   * Set index on node.
   *
   * @param node  The node to set index on
   * @param index The index to set
   */
  this.setElementIndex = function (node, index) {
    node.setAttribute('data-tsb-indexed', '' + index);
  };
  /**
   * Get index of queried node.
   *
   * @param node The node to get index of
   * @returns    The index of the node, otherwise null
   */


  this.getElementIndex = function (node) {
    if (node.getAttribute('data-tsb-indexed') == null) {
      return null;
    }

    var indexString = node.getAttribute('data-tsb-indexed');
    var index = parseInt(indexString); // Check NaN and if information is lost in integer parsing.

    if (isNaN(index) || index.toString() !== indexString) {
      this._tsb.logger.error('Element has attribute "data-tsb-indexed", but could not parse it.');

      this._tsb.logger.error(node);

      return null;
    }

    return index;
  };
  /**
   * Get nodes of element.
   *
   * @param   node
   * @returns      Array of nodes
   */


  this.getElementNodes = function (node) {
    var index = this.getElementIndex(node);

    if (isNaN(index)) {
      this._tsb.logger.error('Could not find nodes to element.');
    }

    return this._tsb.indexToNodes[index];
  };
  /**
   * Get tokens of element.
   *
   * @param   node
   * @returns      Array of tokens
   */


  this.getElementTokens = function (node) {
    var index = this.getElementIndex(node);

    if (isNaN(index)) {
      this._tsb.logger.error('Could not find nodes to element.');

      return null;
    }

    return this._tsb.indexToTokens[index];
  };
  /**
   * Get existing instance of typesetting for particular element.
   *
   * @param   element
   * @returns         Existing typset instance, otherwise return new instance
   */


  this.getTypesetInstance = function (node) {
    var index = this.getElementIndex(node);

    if (index == null) {
      return null;
    }

    if (this._tsb.indexToTypesetInstance[index] == null) {
      var typeset = new TypesetBotTypeset(this._tsb);
      this._tsb.indexToTypesetInstance[index] = typeset;
    }

    return this._tsb.indexToTypesetInstance[index];
  };
  /**
   * Add tokens to map for specific node.
   *
   * @param root
   * @param tokens
   */


  this.appendToTokenMap = function (root, tokens) {
    if (this.getElementIndex(root) == null) {
      this._tsb.logger.error('Root node is not indexed');

      this._tsb.logger.error(root);

      return;
    }

    var index = this.getElementIndex(root);
    this._tsb.indexToTokens[index] = tokens;
  };

  this._tsb = tsb;
};
/**
 * Create UUID.
 *
 * @returns UUID
 */


TypesetBotUtils.createUUID = function () {
  var dt = new Date().getTime();
  var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = (dt + Math.random() * 16) % 16 | 0;
    dt = Math.floor(dt / 16);
    return (c == 'x' ? r : r & 0x3 | 0x8).toString(16);
  });
  return uuid;
};
/**
 * Check if node is visible in dom.
 *
 * @returns True if visible, otherwise return false
 */


TypesetBotUtils.isVisible = function (node) {
  var elem = node;
  return !!(elem.offsetWidth || elem.offsetHeight || elem.getClientRects().length);
};
/**
 * Take a string array and return array of string length and ignore last element.
 * Fx: ["hyp", "hen", "ation"] --> [3, 3].
 *
 * @param   arr Array of word parts
 * @returns     Array of word parts length
 */


TypesetBotUtils.getArrayIndexes = function (arr) {
  var indexes = [];

  for (var i = 0; i < arr.length - 1; i++) {
    indexes.push(arr[i].length);
  }

  return indexes;
};
/**
 * Check for when user stops resizing viewport and fires event to all running typesetbot instances.
 */
// Initialize ready and onload variables.


typesetbotWindowSet('ready', false);
typesetbotWindowSet('onload', false);
document.addEventListener('DOMContentLoaded', function () {
  typesetbotWindowSet('ready', true);
  var event = new Event('typesetbot--interactive'); // Dispatch the event to all TSB instances.

  document.dispatchEvent(event);
});

window.onload = function () {
  typesetbotWindowSet('onload', true);
  var event = new Event('typesetbot--complete'); // Dispatch the event to all TSB instances.

  document.dispatchEvent(event);
}; // Set global typesetbot variables in window


typesetbotWindowSet('viewport--lastWidth', window.innerWidth);
typesetbotWindowSet('viewport--delta', 200);
typesetbotWindowSet('viewport--rtime', null);
typesetbotWindowSet('viewport--timeout', false);
window.onresize = typesetbotCheckResize;
/**
 * Indicate that viewport is being resize and start checking when resize is ended.
 */

function typesetbotCheckResize() {
  if (typesetbotWindowGet('viewport--lastWidth') !== window.innerWidth) {
    document.body.classList.add('typesetbot-viewport');
    typesetbotWindowSet('viewport--rtime', new Date().getTime());

    if (typesetbotWindowGet('viewport--timeout') === false) {
      typesetbotWindowSet('viewport--timeout', true);
      setTimeout(function () {
        typesetbotEndResize();
      }, typesetbotWindowGet('viewport--delta'));
    }

    typesetbotWindowSet('viewport--lastWidth', window.innerWidth);
  }
}
/**
 * Check if enough time has passed to end resize.
 */


function typesetbotEndResize() {
  if (new Date().getTime() - typesetbotWindowGet('viewport--rtime') < typesetbotWindowGet('viewport--delta')) {
    setTimeout(typesetbotEndResize, typesetbotWindowGet('viewport--delta'));
    return;
  }

  typesetbotWindowSet('viewport--timeout', false);
  document.body.classList.remove('typeset-viewport');
  var event = new Event('typesetbot-viewport--reize'); // Dispatch the event to all TSB instances.

  document.dispatchEvent(event);
}
/**
 * Get variable from window.
 *
 * @param   key Some key
 * @returns     Some value
 */


function typesetbotWindowGet(key) {
  if (window.typesetbot == null) {
    window.typesetbot = {};
  }

  return window.typesetbot[key];
}
/**
 * Set variable in window.
 *
 * @param key   Some key
 * @param value Some value
 */


function typesetbotWindowSet(key, value) {
  if (window.typesetbot == null) {
    window.typesetbot = {};
  }

  window.typesetbot[key] = value;
}

var TypesetBotMath = function TypesetBotMath(tsb) {
  _classCallCheck(this, TypesetBotMath);

  /**
   * Calculate adjustment ratio.
   *
   * @param idealW    The ideal line width
   * @param actualW   The current width of the line
   * @param wordCount The current word count on the line
   * @param shrink    The shrinkability of the word spacing
   * @param stretch   The stretchability of the word spacing
   * @returns         The adjustment ratio
   */
  this.getRatio = function (idealW, actualW, wordCount, shrink, stretch) {
    if (actualW < idealW) {
      return (idealW - actualW) / ((wordCount - 1) * stretch);
    }

    return (idealW - actualW) / ((wordCount - 1) * shrink);
  };
  /**
   * Calculate the badness score.
   *
   * @param ratio The adjustment ratio
   * @returns     The badness
   */


  this.getBadness = function (ratio) {
    if (ratio == null || ratio < this.settings.minRatio) {
      return Infinity;
    }

    return 100 * Math.pow(Math.abs(ratio), 3) + 0.5;
  };
  /**
   * Calculate the demerit.
   *
   * @param badness The badness
   * @param penalty The additional penalty to add
   * @param flag    Indicator if flag penalty shound be added
   * @returns       The line demerit
   */


  this.getDemeritFromBadness = function (badness, penalty, flag) {
    var flagPenalty = flag ? this.settings.flagPenalty : 0;

    if (penalty >= 0) {
      return Math.pow(this.settings.demeritOffset + badness + penalty, 2) + flagPenalty;
    } else if (penalty === -Infinity) {
      return Math.pow(this.settings.demeritOffset + badness, 2) + flagPenalty;
    }

    return Math.pow(this.settings.demeritOffset + badness, 2) - Math.pow(penalty, 2) + flagPenalty;
  };
  /**
   * Get demerit from properties.
   *
   * @param ratio                The adjustment ratio
   * @param flag                 Does the linebreak have a penalty flag
   * @param hasHyphen            Does the line have a hyphen
   * @param skippingFitnessClass Does the line skip more than one fitness class
   * @returns                    The demerit
   */


  this.getDemerit = function (ratio, flag, hasHyphen, skippingFitnessClass) {
    var badness = this.getBadness(ratio);
    var additionalPenalty = 0;

    if (hasHyphen) {
      if (this.settings.alignment === 'justify') {
        additionalPenalty += this.settings.hyphenPenalty;
      } else {
        // Left, right, center
        additionalPenalty += this.settings.hyphenPenaltyRagged;
      }
    }

    var demerit = this.getDemeritFromBadness(badness, additionalPenalty, flag);

    if (skippingFitnessClass) {
      demerit += this.settings.fitnessClassDemerit;
    }

    return demerit;
  };
  /**
   * Get fitness class from adjustment ratio.
   *
   * @param   ratio The adjustment ratio
   * @returns       The fitness class
   */


  this.getFitnessClass = function (ratio) {
    var _iteratorNormalCompletion8 = true;
    var _didIteratorError8 = false;
    var _iteratorError8 = undefined;

    try {
      for (var _iterator8 = this.settings.fitnessClasses[Symbol.iterator](), _step8; !(_iteratorNormalCompletion8 = (_step8 = _iterator8.next()).done); _iteratorNormalCompletion8 = true) {
        var fitnessClass = _step8.value;

        if (ratio < fitnessClass) {
          return fitnessClass;
        }
      }
    } catch (err) {
      _didIteratorError8 = true;
      _iteratorError8 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion8 && _iterator8["return"] != null) {
          _iterator8["return"]();
        }
      } finally {
        if (_didIteratorError8) {
          throw _iteratorError8;
        }
      }
    }

    return this.settings.fitnessClasses[this.settings.fitnessClasses.length - 1]; // Default for infinite ratio
  };
  /**
   * Check if adjustment ratio is within a valid range.
   *
   * @param   ratio     The adjustment ratio
   * @param   looseness The loosness to add the maximum allowed adjustment ratio
   * @returns           Return true if ratio is valid for breakpoint, otherwise false
   */


  this.isValidRatio = function (ratio, looseness) {
    return this.ratioIsLessThanMax(ratio, looseness) && this.ratioIsHigherThanMin(ratio);
  };
  /**
   * Check if ratio is less or equal to allowed maximum ratio.
   *
   * @param   ratio     The adjustment ratio
   * @param   looseness The loosness to add the maximum allowed adjustment ratio
   * @returns           Return true if ratio is less than max. ratio
   */


  this.ratioIsLessThanMax = function (ratio, looseness) {
    return ratio <= this.settings.maxRatio + looseness;
  };
  /**
   * Check if ratio is higher or equal to allowed minimum ratio.
   *
   * @param   ratio The adjustment ratio
   * @returns       Return true if ratio is higher than min. ratio
   */


  this.ratioIsHigherThanMin = function (ratio) {
    return ratio >= this.settings.minRatio;
  };

  this._tsb = tsb;
  this.settings = tsb.settings;
};
/**
 * Class for tokenizing DOM nodes.
 */


var TypesetBotTokenizer =
/**
 * The constructor.
 *
 * @param tsb Instance of main class
 */
function TypesetBotTokenizer(tsb, typesetter) {
  _classCallCheck(this, TypesetBotTokenizer);

  /**
   * Tokenize element and get array of tokens.
   *
   * @param root The root element node
   * @param node The node to tokenize
   * @returns    Array of tokens
   */
  this.tokenize = function (root) {
    var node = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
    var tokens = [];

    if (node == null) {
      node = root;
    }

    if (!('childNodes' in node)) {
      return [];
    } // Only add tokens if node is visible.


    if (!TypesetBotUtils.isVisible(node)) {
      return [];
    } // Cast childNodes to list of Elements.


    var _iteratorNormalCompletion9 = true;
    var _didIteratorError9 = false;
    var _iteratorError9 = undefined;

    try {
      for (var _iterator9 = node.childNodes[Symbol.iterator](), _step9; !(_iteratorNormalCompletion9 = (_step9 = _iterator9.next()).done); _iteratorNormalCompletion9 = true) {
        var child = _step9.value;

        switch (child.nodeType) {
          case 1:
            // Element
            tokens = tokens.concat(this.tokenizeElement(root, child));
            break;

          case 3:
            // Text
            tokens = tokens.concat(this.tokenizeText(root, child));
            break;

          case 2: // Attr

          case 8: // Comment

          case 9: // Document

          case 10:
            // DocumentType
            // Ignore types.
            this._tsb.logger.log('Tokenizer ignores node type: ' + child.nodeType);

            this._tsb.logger.warn(child);

          default:
            this._tsb.logger.warn('Tokenizer found unknown node type: ' + child.nodeType);

            this._tsb.logger.warn(child);

            break;
        }
      }
    } catch (err) {
      _didIteratorError9 = true;
      _iteratorError9 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion9 && _iterator9["return"] != null) {
          _iterator9["return"]();
        }
      } finally {
        if (_didIteratorError9) {
          throw _iteratorError9;
        }
      }
    }

    return tokens;
  };
  /**
   * Tokenize element node.
   *
   * @param root The root element node
   * @param node The node to tokenize
   * @returns    Array of tokens
   */


  this.tokenizeElement = function (root, node) {
    var tokens = [];

    if (!TypesetBotUtils.isVisible(node)) {
      return [];
    }

    if (this._tsb.settings.unsupportedTags.includes(node.nodeName)) {
      this._tsb.logger.warn('Tokenizer found unsupported node type, typesetting might not work as intended.');

      this._tsb.logger.warn(node);

      return [];
    }

    var nodeIndex = this.appendToNodeMap(root, node); // Add start tag.

    tokens.push(new TypesetBotTag(nodeIndex, node.nodeName, false)); // Recursively add children.

    tokens = tokens.concat(this.tokenize(root, node)); // Add end tag.

    tokens.push(new TypesetBotTag(nodeIndex, node.nodeName, true));
    return tokens;
  };
  /**
   * Tokenize text node.
   *
   * @param root The root element node
   * @param node The node to tokenize
   * @returns    Array of tokens
   */


  this.tokenizeText = function (root, node) {
    var tokens = [];

    if (node.nodeType !== 3) {
      this._tsb.logger.warn('TokenizeText was called with wrong type: ' + node.nodeType);

      this._tsb.logger.warn(node);

      return [];
    }

    var nodeIndex = this.appendToNodeMap(root, node);
    var htmlNode = node;
    var text = this.replaceInvalidCharacters(htmlNode.nodeValue);
    var words = text.split(' ');

    if (text[0] === ' ') {
      tokens.push(new TypesetBotSpace(nodeIndex));
    }

    var _iteratorNormalCompletion10 = true;
    var _didIteratorError10 = false;
    var _iteratorError10 = undefined;

    try {
      for (var _iterator10 = words[Symbol.iterator](), _step10; !(_iteratorNormalCompletion10 = (_step10 = _iterator10.next()).done); _iteratorNormalCompletion10 = true) {
        var word = _step10.value;

        if (word === '') {
          continue;
        }

        tokens.push(new TypesetBotWord(nodeIndex, word)); // Assume all words are followed by a space.

        tokens.push(new TypesetBotSpace(nodeIndex));
      }
    } catch (err) {
      _didIteratorError10 = true;
      _iteratorError10 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion10 && _iterator10["return"] != null) {
          _iterator10["return"]();
        }
      } finally {
        if (_didIteratorError10) {
          throw _iteratorError10;
        }
      }
    }

    if (htmlNode.nodeValue[htmlNode.nodeValue.length - 1] !== ' ') {
      tokens.pop();
    }

    return tokens;
  };
  /**
   * Append node to map of nodes for the specific query element.
   *
   * @param root The root element node
   * @param node The node to append
   * @returns    The index of appended node
   */


  this.appendToNodeMap = function (root, node) {
    if (this._tsb.util.getElementIndex(root) == null) {
      this._tsb.logger.error('Root node is not indexed');

      this._tsb.logger.error(root);

      return null;
    }

    var index = this._tsb.util.getElementIndex(root);

    if (!(index in this._tsb.indexToNodes)) {
      this._tsb.indexToNodes[index] = [];
    }

    this._tsb.indexToNodes[index].push(node); // Return -1 as the array is zero indexed.


    return this._tsb.indexToNodes[index].length - 1;
  };
  /**
   * Replace various newlines characters with spaces.
   *
   * @param text The text to check
   * @returns    The new string with no newlines
   */


  this.replaceInvalidCharacters = function (text) {
    return text.replace(/(?:\r\n|\r|\n)/g, ' ');
  };

  this._tsb = tsb;
  this.typesetter = typesetter;
};
/**
 * Class for general token.
 */


var TypesetBotToken =
/**
 * @param type The type of token.
 */
function TypesetBotToken(nodeIndex, type) {
  _classCallCheck(this, TypesetBotToken);

  this.nodeIndex = nodeIndex;
  this.type = type;
};

TypesetBotToken.types = {
  WORD: 1,
  SPACE: 2,
  TAG: 3
};
/**
 * Class for word tokens.
 */

var TypesetBotWord =
/*#__PURE__*/
function (_TypesetBotToken) {
  _inherits(TypesetBotWord, _TypesetBotToken);

  /**
   * @param text The text of the word
   */
  function TypesetBotWord(nodeIndex, text) {
    var _this;

    _classCallCheck(this, TypesetBotWord);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(TypesetBotWord).call(this, nodeIndex, TypesetBotToken.types.WORD)); // Hyphen properties.

    _this.hasHyphen = false; // Example: hyphenation --> true

    /**
     * Initialize hyphen properties on words that need it.
     */

    _this.initHyphen = function () {
      this.hasHyphen = true;
      this.hyphenIndexPositions = [];
      this.hyphenIndexWidths = [];
      this.hyphenRemainWidth = 0;
      this.dashWidth = 0;
    };

    _this.text = text;
    return _this;
  }

  return TypesetBotWord;
}(TypesetBotToken);
/**
 * Class for space tokens.
 */


var TypesetBotSpace =
/*#__PURE__*/
function (_TypesetBotToken2) {
  _inherits(TypesetBotSpace, _TypesetBotToken2);

  function TypesetBotSpace(nodeIndex) {
    _classCallCheck(this, TypesetBotSpace);

    return _possibleConstructorReturn(this, _getPrototypeOf(TypesetBotSpace).call(this, nodeIndex, TypesetBotToken.types.SPACE));
  }

  return TypesetBotSpace;
}(TypesetBotToken);
/**
 * Class for tag tokens.
 */


var TypesetBotTag =
/*#__PURE__*/
function (_TypesetBotToken3) {
  _inherits(TypesetBotTag, _TypesetBotToken3);

  /**
   * @param tag      The name of the tag
   * @param isEndTag Is this token an end tag
   */
  function TypesetBotTag(nodeIndex, tag, isEndTag) {
    var _this2;

    _classCallCheck(this, TypesetBotTag);

    _this2 = _possibleConstructorReturn(this, _getPrototypeOf(TypesetBotTag).call(this, nodeIndex, TypesetBotToken.types.TAG));
    _this2.tag = tag;
    _this2.isEndTag = isEndTag;
    return _this2;
  }

  return TypesetBotTag;
}(TypesetBotToken);
/**
 * Typesetting class for a single element.
 */


var TypesetBotTypeset =
/**
 * @param tsb Instance of main class
 */
function TypesetBotTypeset(tsb) {
  _classCallCheck(this, TypesetBotTypeset);

  /**
   * Typeset single element.
   *
   * @param element
   */
  this.typeset = function (element) {
    // Reset HTML of node if the typesetting has run before.
    if (this.backupInnerHtml != null) {
      element.innerHTML = this.backupInnerHtml;
    } // Preprocess hyphenations and rendering dimensions.


    this.preprocessElement(element); // Calculate all feasible linebreak solutions.

    var finalBreakpoints = this.getFinalLineBreaks(element); // Get best solution.

    var solution = this.lowestDemerit(finalBreakpoints);

    if (solution == null) {
      this._tsb.logger.warn('No viable solution found during typesetting. Element is skipped.');

      return;
    } // Render solution to DOM.


    this.render.applyLineBreaks(element, solution, this.lineHeight);
  };
  /**
   * Reset typesetting by removing attributes and resetting to original html.
   * @param element The node to check
   */


  this.reset = function (element) {
    if (this.backupInnerHtml != null) {
      element.innerHTML = this.backupInnerHtml;
    }

    delete this.backupInnerHtml;
    this.render.reset(element);
  };
  /**
   * Get a set initial state properties of element.
   *
   * @param element
   */


  this.getElementProperties = function (element) {
    this._tsb.logger.start('---- Getting element properties');

    if (this.backupInnerHtml == null) {
      this.backupInnerHtml = element.innerHTML;
    } // Set space width based on settings.


    this.render.setMinimumWordSpacing(element); // Get element width.

    this.elemWidth = this.render.getNodeWidth(element);
    this.lineHeight = this.render.getLineHeight(element); // Get font size and calc real space properties.

    this.elemFontSize = this.render.getDefaultFontSize(element);
    this.spaceWidth = this.elemFontSize * this.settings.spaceWidth, this.spaceShrink = this.elemFontSize * this.settings.spaceShrinkability, this.spaceStretch = this.elemFontSize * this.settings.spaceStretchability;

    this._tsb.logger.end('---- Getting element properties');
  };
  /**
   * Calculate the hyphens on available tokens.
   *
   * @param element
   */


  this.setWordHyphens = function (element) {
    var tokenIndex = 0;
    var isFinished = false;

    while (!isFinished) {
      var wordData = this.hyphen.nextWord(element, tokenIndex);

      if (wordData == null) {
        isFinished = true;
        continue;
      }

      tokenIndex = wordData.tokenIndex;
      this.hyphen.calcWordHyphens(element, wordData);
    }
  };
  /**
   * Preprocess element
   *
   * @param element
   */


  this.preprocessElement = function (element) {
    this._tsb.logger.start('-- Preprocess'); // Analyse working element.


    this.getElementProperties(element); // Tokenize element for words, space and tags.

    this._tsb.logger.start('---- Tokenize text');

    this.tokens = this.tokenizer.tokenize(element);

    this._tsb.logger.end('---- Tokenize text');

    this._tsb.logger.start('---- other'); // Append tokens to map for quick access.


    this._tsb.util.appendToTokenMap(element, this.tokens);

    this._tsb.logger.end('---- other');

    this._tsb.logger.start('---- Get render size of words'); // Get render sizes of nodes.


    this.render.getWordProperties(element);

    this._tsb.logger.end('---- Get render size of words');

    this._tsb.logger.start('---- Hyphen calc'); // Calculate hyphens on tokens.


    this.setWordHyphens(element);

    this._tsb.logger.end('---- Hyphen calc');

    this._tsb.logger.start('---- Hyphen render'); // Calculate hyphens on tokens.


    this.render.getHyphenProperties(element, this.tokens);

    this._tsb.logger.end('---- Hyphen render');

    this._tsb.logger.end('-- Preprocess');
  };
  /**
   * Get the solution with lowest demerit from array of solutions.
   *
   * @param   finalBreakpoints
   * @returns                  The solution with lowest demerit
   */


  this.lowestDemerit = function (finalBreakpoints) {
    this._tsb.logger.start('-- Finding solution');

    var solution = null;
    var _iteratorNormalCompletion11 = true;
    var _didIteratorError11 = false;
    var _iteratorError11 = undefined;

    try {
      for (var _iterator11 = finalBreakpoints[Symbol.iterator](), _step11; !(_iteratorNormalCompletion11 = (_step11 = _iterator11.next()).done); _iteratorNormalCompletion11 = true) {
        var breakpoint = _step11.value;

        if (solution == null) {
          solution = breakpoint;
          continue;
        }

        if (solution.demerit > breakpoint.demerit) {
          solution = breakpoint;
        }
      }
    } catch (err) {
      _didIteratorError11 = true;
      _iteratorError11 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion11 && _iterator11["return"] != null) {
          _iterator11["return"]();
        }
      } finally {
        if (_didIteratorError11) {
          throw _iteratorError11;
        }
      }
    }

    this._tsb.logger.end('-- Finding solution');

    return solution;
  };
  /**
   * Reset linebreak variables.
   */


  this.resetLineBreak = function () {
    this.activeBreakpoints = new Queue();
    this.shortestPath = {};
    this.finalBreakpoints = [];
  };
  /**
   * Get all possible solutions to break the text.
   *
   * @param   element
   * @param   looseness The current lossness of the maximum allowed adjustment ratio
   * @returns           All possible final breakpoints
   */


  this.getFinalLineBreaks = function (element) {
    var looseness = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

    this._tsb.logger.start('-- Dynamic programming');

    this.resetLineBreak();
    this.activeBreakpoints.enqueue(new TypesetBotLinebreak(null, 0, null, 0, false, null, 0, 0, 0));
    var isFinished = false;

    while (!isFinished) {
      var originBreakpoint = this.activeBreakpoints.dequeue(); // Check if there is no more element to dequeue.

      if (originBreakpoint == null) {
        isFinished = true;
        continue;
      }

      if (!this.isShortestPath(originBreakpoint)) {
        continue;
      }

      var lineProperties = this.initLineProperties(originBreakpoint);
      var lineIsFinished = false;

      while (!lineIsFinished) {
        var oldLineWidth = lineProperties.curWidth;
        var wordData = this.hyphen.nextWord(element, lineProperties.tokenIndex, lineProperties.firstWordHyphenIndex);
        lineProperties.firstWordHyphenIndex = null; // Unset hyphenindex for next words.

        if (wordData == null) {
          // No more words are available in element, possible solution.
          this.pushFinalBreakpoint(originBreakpoint, lineProperties);
          lineIsFinished = true;
          continue;
        } // Update token index.


        lineProperties.tokenIndex = wordData.tokenIndex;
        lineProperties.curWidth += wordData.width;
        lineProperties.lineHeight = wordData.height;
        lineProperties.wordCount++;
        var ratio = this.math.getRatio(this.elemWidth, lineProperties.curWidth, lineProperties.wordCount, this.spaceShrink, this.spaceStretch);

        if (this.math.ratioIsLessThanMax(ratio, looseness)) {
          // Valid breakpoint
          // Loop all word parts in the word.
          var _iteratorNormalCompletion12 = true;
          var _didIteratorError12 = false;
          var _iteratorError12 = undefined;

          try {
            for (var _iterator12 = wordData.indexes[Symbol.iterator](), _step12; !(_iteratorNormalCompletion12 = (_step12 = _iterator12.next()).done); _iteratorNormalCompletion12 = true) {
              var tokenIndex = _step12.value;
              var token = this.tokens[tokenIndex];

              if (!token.hasHyphen) {
                continue;
              }

              for (var index = 0; index < token.hyphenIndexWidths.length; index++) {
                oldLineWidth += token.hyphenIndexWidths[index];
                var hyphenRatio = this.math.getRatio(this.elemWidth, oldLineWidth + token.dashWidth, // Add with of hyphen
                lineProperties.wordCount, this.spaceShrink, this.spaceStretch);

                if (!this.math.isValidRatio(hyphenRatio, looseness)) {
                  continue;
                } // Generate breakpoint.


                var hyphenBreakpoint = this.getBreakpoint(originBreakpoint, lineProperties, hyphenRatio, wordData.lastWordTokenIndex, // Offset one as the word token is not finished
                index, true);
                this.updateShortestPath(hyphenBreakpoint);
              }
            } // Check the ratio is still valid.

          } catch (err) {
            _didIteratorError12 = true;
            _iteratorError12 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion12 && _iterator12["return"] != null) {
                _iterator12["return"]();
              }
            } finally {
              if (_didIteratorError12) {
                throw _iteratorError12;
              }
            }
          }

          if (!this.math.ratioIsHigherThanMin(ratio)) {
            lineIsFinished = true;
            continue; // Don't add the last node.
          } // Generate breakpoint.


          var breakpoint = this.getBreakpoint(originBreakpoint, lineProperties, ratio, lineProperties.tokenIndex);
          this.updateShortestPath(breakpoint);
        }

        lineProperties.curWidth += this.spaceWidth;
      }
    }

    this._tsb.logger.end('-- Dynamic programming'); // Lossness is increased by 1 until a feasible solution if found.


    if (this.finalBreakpoints.length === 0 && looseness <= 4) {
      return this.getFinalLineBreaks(element, looseness + 1);
    }

    return this.finalBreakpoints;
  };
  /**
   * Push a breakpoint for a final solution.
   *
   * @param originBreakpoint
   * @param lineProperties
   */


  this.pushFinalBreakpoint = function (originBreakpoint, lineProperties) {
    this.finalBreakpoints.push(new TypesetBotLinebreak(originBreakpoint, null, null, originBreakpoint.demerit, false, null, originBreakpoint.lineNumber + 1, lineProperties.lineHeight, 0));
  };
  /**
   * Calculate demerit and return new linebreak object.
   *
   * @param   origin         The breakpoint of previous line
   * @param   lineProperties The properties of current line
   * @param   ratio          The current adjustment ratio
   * @param   tokenIndex     The current token index
   * @param   hyphenIndex    The current hyphenation index on token
   * @param   flag           Flag if there is some kind of penalty
   * @returns                The new linebreak
   */


  this.getBreakpoint = function (origin, lineProperties, ratio, tokenIndex) {
    var hyphenIndex = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : null;
    var flag = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : false;
    // Get fitness class
    var fitnessClass = this.math.getFitnessClass(ratio);
    var consecutiveFlag = origin.flag && flag;
    var hasHyphen = hyphenIndex != null;
    var skippingFitnessClass = origin.fitnessClass != null && Math.abs(origin.fitnessClass - fitnessClass) > 1;
    var demerit = this.math.getDemerit(ratio, consecutiveFlag, hasHyphen, skippingFitnessClass);
    return new TypesetBotLinebreak(origin, tokenIndex, hyphenIndex, origin.demerit + demerit, // Append demerit from previous line
    flag, fitnessClass, origin.lineNumber + 1, lineProperties.lineHeight, ratio);
  };
  /**
   * Check if a certain breakpoint is the current shortest path to the break.
   * - Checks on specific line number.
   * - Checks on specific token index.
   * - Checks on specific hyphenation point.
   *
   * @param   breakpoint
   * @returns            Return true if the breakpoint is the shortest path, otherwise return false
   */


  this.isShortestPath = function (breakpoint) {
    var hyphenIndex = breakpoint.hyphenIndex == null ? -1 : breakpoint.hyphenIndex;

    if (this.shortestPath == null) {
      this.shortestPath = {};
    } // Safety check.


    if (this.shortestPath[breakpoint.lineNumber] != null && this.shortestPath[breakpoint.lineNumber][breakpoint.tokenIndex] != null && this.shortestPath[breakpoint.lineNumber][breakpoint.tokenIndex][hyphenIndex] != null && this.shortestPath[breakpoint.lineNumber][breakpoint.tokenIndex][hyphenIndex] > breakpoint.demerit) {
      this._tsb.logger.error('Dynamic: Found shortest path with higher demerit than current breakpoint');
    } // Real check.


    return this.shortestPath[breakpoint.lineNumber] == null || this.shortestPath[breakpoint.lineNumber][breakpoint.tokenIndex] == null || this.shortestPath[breakpoint.lineNumber][breakpoint.tokenIndex][hyphenIndex] == null || this.shortestPath[breakpoint.lineNumber][breakpoint.tokenIndex][hyphenIndex] === breakpoint.demerit;
  };
  /**
   * Update demerit if the breakpoint is the current shortest path.
   * - Checks on specific line number.
   * - Checks on specific token index.
   * - Checks on specific hyphenation point.
   *
   * @param   breakpoint
   * @returns            Return true if the breakpoint is the shortest path, otherwise return false
   */


  this.updateShortestPath = function (breakpoint) {
    var hyphenIndex = breakpoint.hyphenIndex == null ? -1 : breakpoint.hyphenIndex;

    if (this.shortestPath == null) {
      this.shortestPath = {};
    }

    if (this.shortestPath[breakpoint.lineNumber] == null) {
      this.shortestPath[breakpoint.lineNumber] = {};
    }

    if (this.shortestPath[breakpoint.lineNumber][breakpoint.tokenIndex] == null) {
      this.shortestPath[breakpoint.lineNumber][breakpoint.tokenIndex] = {};
    }

    if (this.shortestPath[breakpoint.lineNumber][breakpoint.tokenIndex][hyphenIndex] == null || this.shortestPath[breakpoint.lineNumber][breakpoint.tokenIndex][hyphenIndex] > breakpoint.demerit) {
      this.shortestPath[breakpoint.lineNumber][breakpoint.tokenIndex][hyphenIndex] = breakpoint.demerit;
      this.activeBreakpoints.enqueue(breakpoint);
      return true;
    }

    return false;
  };
  /**
   * Get properties for a new line object.
   *
   * @param   origin
   * @returns        Line properties object
   */


  this.initLineProperties = function (origin) {
    return new TypesetBotLineProperties(origin, origin.tokenIndex, origin.hyphenIndex, origin.lineNumber, 0, 0, 0);
  };

  this._tsb = tsb;
  this.render = new TypesetBotRender(tsb);
  this.tokenizer = new TypesetBotTokenizer(tsb, this);
  this.hyphen = new TypesetBotHyphen(tsb);
  this.math = new TypesetBotMath(tsb);
  this.settings = tsb.settings;
};
/**
 * Class representing a possible linebreak.
 */


var TypesetBotLinebreak =
/**
 * @param origin        The linebreak object for previous line
 * @param tokenIndex    The index of token where the linebreak occured
 * @param hyphenIndex   The index where hyphenation occured, otherwise null
 * @param demerit       The demerit of solution
 * @param flag          Penalty flag of current line
 * @param fitnessClass  Fitness class of current line
 * @param lineNumber    Line number of current line
 * @param maxLineHeight Max line height of current solution
 */
function TypesetBotLinebreak(origin, tokenIndex, hyphenIndex, demerit, flag, fitnessClass, lineNumber, maxLineHeight, ratio) {
  _classCallCheck(this, TypesetBotLinebreak);

  this.origin = origin;
  this.tokenIndex = tokenIndex;
  this.hyphenIndex = hyphenIndex;
  this.demerit = demerit;
  this.flag = flag;
  this.fitnessClass = fitnessClass;
  this.lineNumber = lineNumber;
  this.maxLineHeight = maxLineHeight;
  this.ratio = ratio;
};
/**
 * Class representing properties for each line in the dynamic programming algorithm.
 */


var TypesetBotLineProperties =
/**
 * @param origin               The linebreak object for previous line
 * @param tokenIndex           The index of the next token to append
 * @param firstWordHyphenIndex The hyphenIndex of the first word in the line
 * @param lineNumber           The current line number
 * @param wordCount            The number of words in line
 * @param curWidth             The current line width
 * @param lineHeight           The current max line height
 */
function TypesetBotLineProperties(origin, tokenIndex, firstWordHyphenIndex, lineNumber, wordCount, curWidth, lineHeight) {
  _classCallCheck(this, TypesetBotLineProperties);

  this.origin = origin;
  this.tokenIndex = tokenIndex;
  this.firstWordHyphenIndex = firstWordHyphenIndex;
  this.lineNumber = lineNumber;
  this.wordCount = wordCount;
  this.curWidth = curWidth;
  this.lineHeight = lineHeight;
};
/**
 * Class that does complex DOM interactions.
 */


var TypesetBotRender = function TypesetBotRender(tsb) {
  _classCallCheck(this, TypesetBotRender);

  /**
   * Reset attributes on elements.
   *
   * @param   element The node to check
   */
  this.reset = function (element) {
    element.removeAttribute('data-tsb-indexed');
    element.removeAttribute('data-tsb-uuid');
    element.removeAttribute('data-tsb-word-spacing');
    this.removeJustificationClass(element);
    element.style.wordSpacing = '';
  };
  /**
   * Get default word space of node.
   *
   * @param   element The node to check
   * @returns         The default word spacing in pixels
   */


  this.getSpaceWidth = function (element) {
    var spanNode = document.createElement('TSB-NONE');
    var preTextNode = document.createTextNode('1');
    var postTextNode = document.createTextNode('1');
    var textNode = document.createTextNode(' ');
    var spaceContainer = document.createElement('TSB-NONE');
    spaceContainer.appendChild(textNode);
    spanNode.appendChild(preTextNode);
    spanNode.appendChild(spaceContainer);
    spanNode.appendChild(postTextNode);
    element.prepend(spanNode);
    var rect = spaceContainer.getBoundingClientRect();
    var width = rect.right - rect.left;
    spanNode.remove();
    return width;
  };
  /**
   * Get word spacing on node to the minimum allowed word spacing for typesetting.
   * This will setup the code for checking how many words can possibly be on a line.
   * This does not reflect how many words should be on any given line.
   *
   * @param element
   */


  this.setMinimumWordSpacing = function (element) {
    if (element.getAttribute('data-tsb-word-spacing')) {
      return;
    }

    var minSpaceSize = this._tsb.settings.spaceWidth - this._tsb.settings.spaceShrinkability;
    var defaultWidth = this.getSpaceWidth(element);
    element.setAttribute('data-tsb-word-spacing', 'true');
    element.style.wordSpacing = 'calc((1em * ' + minSpaceSize + ') - ' + defaultWidth + 'px)';
  };
  /**
   * Get default font size of element.
   *
   * @param   element
   * @returns         The font size in pixels as number
   */


  this.getDefaultFontSize = function (element) {
    return this.getNodeStyleNumber(element, 'font-size');
  };
  /**
   * Get width of node.
   *
   * @param   element
   * @returns         The width of node in pixels as number
   */


  this.getNodeWidth = function (element) {
    return element.getBoundingClientRect().width;
  };
  /**
   * Get style property of element.
   *
   * @param   element  The element
   * @param   property The property name
   * @returns          The rendered style property
   */


  this.getNodeStyle = function (element, property) {
    return window.getComputedStyle(element).getPropertyValue(property);
  };
  /**
   * Get style property of element as Number without px postfix.
   *
   * @param   element  The element
   * @param   property The property name
   * @returns          The rendered style property
   */


  this.getNodeStyleNumber = function (element, property) {
    return Number(this.getNodeStyle(element, property).replace('px', ''));
  };
  /**
   * Get line height of element.
   *
   * @param element
   */


  this.getLineHeight = function (element) {
    var lineHeight = this.getNodeStyle(element, 'line-height');

    if (lineHeight === 'normal') {
      // Make line height relative to font size.
      var fontSize = this.getNodeStyleNumber(element, 'font-size');
      lineHeight = 1.2 * fontSize; // 1.2 em
    } else {
      // Format number.
      lineHeight = Number(lineHeight.replace('px', ''));
    }

    return lineHeight;
  };
  /**
   * Add text justification class to element.
   *
   * @param element
   */


  this.setJustificationClass = function (element) {
    this.removeJustificationClass(element);

    switch (this._tsb.settings.alignment) {
      case 'justify':
        element.classList.add('typesetbot-justify');
        break;

      case 'left':
        element.classList.add('typesetbot-left');
        break;

      case 'right':
        element.classList.add('typesetbot-right');
        break;

      case 'center':
        element.classList.add('typesetbot-center');
        break;

      default:
        this._tsb.logger.warn('Unknown alignment type: ' + this._tsb.settings.alignment);

        break;
    }
  };
  /**
   * Remove all justification classes from element.
   *
   * @param element The element
   */


  this.removeJustificationClass = function (element) {
    element.classList.remove('typesetbot-justify', 'typesetbot-left', 'typesetbot-right', 'typesetbot-center');
  };
  /**
   * Get rendering dimensions of words in element.
   *
   * @param element
   */


  this.getWordProperties = function (element) {
    var tokens = this._tsb.util.getElementTokens(element);

    var backupHtml = element.innerHTML;
    var renderIndexToToken = {};
    var html = '';
    var currentIndex = 0;

    this._tsb.logger.start('------ Build HTML');

    var _iteratorNormalCompletion13 = true;
    var _didIteratorError13 = false;
    var _iteratorError13 = undefined;

    try {
      for (var _iterator13 = tokens[Symbol.iterator](), _step13; !(_iteratorNormalCompletion13 = (_step13 = _iterator13.next()).done); _iteratorNormalCompletion13 = true) {
        var token = _step13.value;

        switch (token.type) {
          case TypesetBotToken.types.WORD:
            var word = token;
            renderIndexToToken[currentIndex] = token;
            currentIndex += 1;
            html += '<tsb-none class="typeset-word-node">' + word.text + '</tsb-none>';
            break;

          case TypesetBotToken.types.TAG:
            var tag = token;
            html += this.htmlGenerator.createTagHtml(element, tag);
            break;

          case TypesetBotToken.types.SPACE:
            html += ' ';
            break;

          default:
            // Ignore the other node types.
            this._tsb.logger.error('Unknown token type found: ' + token.type);

            break;
        }
      }
    } catch (err) {
      _didIteratorError13 = true;
      _iteratorError13 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion13 && _iterator13["return"] != null) {
          _iterator13["return"]();
        }
      } finally {
        if (_didIteratorError13) {
          throw _iteratorError13;
        }
      }
    }

    this._tsb.logger.end('------ Build HTML');

    this._tsb.logger.start('------ Update DOM');

    element.innerHTML = html;

    this._tsb.logger.end('------ Update DOM');

    this._tsb.logger.start('------ Query DOM');

    var renderedWordNodes = element.querySelectorAll('.typeset-word-node');

    this._tsb.logger.end('------ Query DOM');

    this._tsb.logger.start('------ Get Properties');

    var renderIndex = 0;
    var _iteratorNormalCompletion14 = true;
    var _didIteratorError14 = false;
    var _iteratorError14 = undefined;

    try {
      for (var _iterator14 = renderedWordNodes[Symbol.iterator](), _step14; !(_iteratorNormalCompletion14 = (_step14 = _iterator14.next()).done); _iteratorNormalCompletion14 = true) {
        var renderedWordNode = _step14.value;
        var wordToken = renderIndexToToken[renderIndex];
        wordToken.width = renderedWordNode.getBoundingClientRect().width;
        wordToken.height = this.getLineHeight(renderedWordNode);
        renderIndex += 1;
      }
    } catch (err) {
      _didIteratorError14 = true;
      _iteratorError14 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion14 && _iterator14["return"] != null) {
          _iterator14["return"]();
        }
      } finally {
        if (_didIteratorError14) {
          throw _iteratorError14;
        }
      }
    }

    this._tsb.logger.end('------ Get Properties');

    this._tsb.logger.start('------ Update DOM');

    element.innerHTML = backupHtml;

    this._tsb.logger.end('------ Update DOM');
  };
  /**
   * Get rendering dimensions of words and word parts for hyphenation.
   *
   * @param element
   */


  this.getHyphenProperties = function (element) {
    var tokens = this._tsb.util.getElementTokens(element);

    var backupHtml = element.innerHTML;
    var html = ''; // Array of objects in dom to inspect.

    var renderRequest = []; // Loop tokens to build HTML.

    var _iteratorNormalCompletion15 = true;
    var _didIteratorError15 = false;
    var _iteratorError15 = undefined;

    try {
      for (var _iterator15 = tokens[Symbol.iterator](), _step15; !(_iteratorNormalCompletion15 = (_step15 = _iterator15.next()).done); _iteratorNormalCompletion15 = true) {
        var token = _step15.value;

        switch (token.type) {
          case TypesetBotToken.types.WORD:
            var word = token;
            var lastIndex = 0; // Skip if word has not hyphens

            if (!word.hasHyphen) {
              continue;
            } // Queue hyphenation parts or word.


            var _iteratorNormalCompletion17 = true;
            var _didIteratorError17 = false;
            var _iteratorError17 = undefined;

            try {
              for (var _iterator17 = word.hyphenIndexPositions[Symbol.iterator](), _step17; !(_iteratorNormalCompletion17 = (_step17 = _iterator17.next()).done); _iteratorNormalCompletion17 = true) {
                var hyphenIndex = _step17.value;

                var _cut = word.text.substring(lastIndex, hyphenIndex + 1);

                lastIndex = hyphenIndex + 1;
                html += '<tsb-none class="typeset-hyphen-check">' + _cut + '</tsb-none>';
                renderRequest.push({
                  token: token,
                  type: 'hyphen'
                });
              } // Queue remain (if any), fx 'phen'.

            } catch (err) {
              _didIteratorError17 = true;
              _iteratorError17 = err;
            } finally {
              try {
                if (!_iteratorNormalCompletion17 && _iterator17["return"] != null) {
                  _iterator17["return"]();
                }
              } finally {
                if (_didIteratorError17) {
                  throw _iteratorError17;
                }
              }
            }

            if (word.text.length !== lastIndex) {
              var cut = word.text.substr(lastIndex);
              html += '<tsb-none class="typeset-hyphen-check">' + cut + '</tsb-none>';
              renderRequest.push({
                token: token,
                type: 'remain'
              });
            } // Queue dash, '-'.


            html += '<tsb-none class="typeset-hyphen-check">-</tsb-none>';
            renderRequest.push({
              token: token,
              type: 'dash'
            });
            break;

          case TypesetBotToken.types.TAG:
            var tag = token;
            html += this.htmlGenerator.createTagHtml(element, tag);
            break;

          case TypesetBotToken.types.SPACE:
            html += ' ';
            break;

          default:
            // Ignore the other node types.
            this._tsb.logger.error('Unknown token type found: ' + token.type);

            break;
        }
      }
    } catch (err) {
      _didIteratorError15 = true;
      _iteratorError15 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion15 && _iterator15["return"] != null) {
          _iterator15["return"]();
        }
      } finally {
        if (_didIteratorError15) {
          throw _iteratorError15;
        }
      }
    }

    element.innerHTML = html;
    var renderedHyphenNodes = element.querySelectorAll('.typeset-hyphen-check'); // Loop elements from DOM.

    var renderIndex = 0;
    var _iteratorNormalCompletion16 = true;
    var _didIteratorError16 = false;
    var _iteratorError16 = undefined;

    try {
      for (var _iterator16 = renderedHyphenNodes[Symbol.iterator](), _step16; !(_iteratorNormalCompletion16 = (_step16 = _iterator16.next()).done); _iteratorNormalCompletion16 = true) {
        var renderedHyphenNode = _step16.value;
        var request = renderRequest[renderIndex++];
        var _token = request.token; // Get width of requested element and insert to correct type.

        var width = renderedHyphenNode.getBoundingClientRect().width;

        switch (request.type) {
          case 'hyphen':
            _token.hyphenIndexWidths.push(width);

            break;

          case 'remain':
            _token.hyphenRemainWidth = width;

          case 'dash':
            _token.dashWidth = width;
            break;

          default:
            this._tsb.logger.error('Unknown request object type found: ' + request.type);

            break;
        }
      }
    } catch (err) {
      _didIteratorError16 = true;
      _iteratorError16 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion16 && _iterator16["return"] != null) {
          _iterator16["return"]();
        }
      } finally {
        if (_didIteratorError16) {
          throw _iteratorError16;
        }
      }
    }

    element.innerHTML = backupHtml;
  };
  /**
   * Apply linebreaks of solution to element.
   *
   * @param element
   * @param finalBreakpoint   The breakpoint of the final line in solution
   * @param defaultLineHeight
   */


  this.applyLineBreaks = function (element, finalBreakpoint, defaultLineHeight) {
    this._tsb.logger.start('-- Apply breakpoints');

    var lines = [];
    var pointer = finalBreakpoint;
    var isFinished = false; // Construct array of all lines.

    while (!isFinished) {
      if (pointer == null) {
        isFinished = true;
        continue;
      }

      lines.push(pointer);
      pointer = pointer.origin;
    } // Ignore first line element, as it's always the same.


    lines.pop(); // Reverse lines, so first line appears first.

    lines.reverse();
    var html = '';
    var curTokenIndex = 0;
    var lastHyphenIndex = null; // Fifo stack of open html tags.

    var tagStack = []; // Construct the lines.

    for (var _i2 = 0, _lines = lines; _i2 < _lines.length; _i2++) {
      var line = _lines[_i2];
      var lineHtml = '';
      lineHtml += this.htmlGenerator.prependTagTokensOnLine(element, tagStack);
      lineHtml += this.htmlGenerator.getHtmlFromTokensRange(element, curTokenIndex, lastHyphenIndex, line.tokenIndex, line.hyphenIndex, tagStack);
      lineHtml += this.htmlGenerator.appendTagTokensOnLine(element, tagStack);
      curTokenIndex = line.tokenIndex;
      lastHyphenIndex = line.hyphenIndex;
      var lineHeight = line.maxLineHeight;

      if (lineHeight == null || lineHeight == 0) {
        lineHeight = defaultLineHeight;
      }

      var attr = '';

      if (this._tsb.settings.debug) {
        attr += 'typeset-bot-line="' + line.lineNumber + '" ';
        attr += 'typeset-bot-ratio="' + line.ratio + '" ';
      }

      html += '<tsb-line ' + attr + ' style="height:' + lineHeight + 'px">' + lineHtml + '</tsb-line>';
    }

    element.innerHTML = html;
    this.setJustificationClass(element);

    this._tsb.logger.end('-- Apply breakpoints');
  };

  this._tsb = tsb;
  this.htmlGenerator = new TypesetBotHtml(tsb);
};
/**
 * Class for constructing HTML code.
 */


var TypesetBotHtml = function TypesetBotHtml(tsb) {
  _classCallCheck(this, TypesetBotHtml);

  /**
   * Create HTML code from HTML tag object.
   *
   * @param   node        The element to typeset
   * @param   token       The token representing HTML tag
   * @param   forceEndTag Get HTML of end tag, disregarding any tag properties
   * @returns             The HTML string
   */
  this.createTagHtml = function (node, token) {
    var forceEndTag = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

    var elementNodes = this._tsb.util.getElementNodes(node);

    var tagNode = elementNodes[token.nodeIndex];

    if (token.isEndTag || forceEndTag) {
      return '</' + tagNode.tagName.toLowerCase() + '>';
    }

    var attrText = '';
    var _iteratorNormalCompletion18 = true;
    var _didIteratorError18 = false;
    var _iteratorError18 = undefined;

    try {
      for (var _iterator18 = tagNode.attributes[Symbol.iterator](), _step18; !(_iteratorNormalCompletion18 = (_step18 = _iterator18.next()).done); _iteratorNormalCompletion18 = true) {
        var attr = _step18.value;
        attrText += attr.name + '="' + attr.value + '" ';
      }
    } catch (err) {
      _didIteratorError18 = true;
      _iteratorError18 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion18 && _iterator18["return"] != null) {
          _iterator18["return"]();
        }
      } finally {
        if (_didIteratorError18) {
          throw _iteratorError18;
        }
      }
    }

    return '<' + tagNode.tagName.toLowerCase() + ' ' + attrText + '>';
  };
  /**
   * Get HTMl string of prepended tags on line.
   *
   * @param   element
   * @param   tagStack Array of open tags to repeat
   * @returns          The HTML of tag code
   */


  this.prependTagTokensOnLine = function (element, tagStack) {
    return this.getTagTokensOnLine(element, tagStack, false);
  };
  /**
   * Get HTML string of appended closing tags on line.
   *
   * @param   element
   * @param   tagStack Array of open tags to close
   * @returns          The HTML of closing tags
   */


  this.appendTagTokensOnLine = function (element, tagStack) {
    return this.getTagTokensOnLine(element, tagStack, true);
  };
  /**
   * Get HTML string of tags on line.
   *
   * @param   element
   * @param   tagStack     Array of open tags
   * @param   isClosingTag Get the HTML of the closing or opening tags
   * @returns              The HTML of tags
   */


  this.getTagTokensOnLine = function (element, tagStack, isClosingTag) {
    var html = '';
    var _iteratorNormalCompletion19 = true;
    var _didIteratorError19 = false;
    var _iteratorError19 = undefined;

    try {
      for (var _iterator19 = tagStack[Symbol.iterator](), _step19; !(_iteratorNormalCompletion19 = (_step19 = _iterator19.next()).done); _iteratorNormalCompletion19 = true) {
        var tag = _step19.value;
        html += this.createTagHtml(element, tag, isClosingTag);
      }
    } catch (err) {
      _didIteratorError19 = true;
      _iteratorError19 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion19 && _iterator19["return"] != null) {
          _iterator19["return"]();
        }
      } finally {
        if (_didIteratorError19) {
          throw _iteratorError19;
        }
      }
    }

    return html;
  };
  /**
   * Get HTML of token range.
   *
   * @param   element
   * @param   startIndex       Index of first token
   * @param   startHyphenIndex Hyphenation index for the first word token
   * @param   endIndex         Index of last token
   * @param   endHyphenIndex   Hyphenation index for the last word token
   * @param   tagStack         Stack of open tags
   * @returns                  The HTML string
   */


  this.getHtmlFromTokensRange = function (element, startIndex, startHyphenIndex, endIndex, endHyphenIndex, tagStack) {
    var tokens = this._tsb.util.getElementTokens(element);

    var html = '';

    if (endIndex == null) {
      endIndex = tokens.length;
    } // Only the first word token can be hyphenated.


    var isFirstToken = true; // Loop all tokens between start and end token.

    for (var index = startIndex; index < endIndex; index++) {
      var token = tokens[index];

      switch (token.type) {
        case TypesetBotToken.types.WORD:
          var word = token;

          if (isFirstToken && startHyphenIndex != null) {
            // Calculate the post-hyphen word string and width.
            var cutIndex = word.hyphenIndexPositions[startHyphenIndex];
            var cut = word.text.substr(cutIndex + 1); // Offset by 1, fx: hy[p]-hen

            html += cut;
            isFirstToken = false;
            continue;
          }

          html += word.text;
          break;

        case TypesetBotToken.types.TAG:
          var tag = token;

          if (!tag.isEndTag) {
            tagStack.push(tag);
          } else {
            tagStack.pop();
          }

          html += this.createTagHtml(element, tag);
          break;

        case TypesetBotToken.types.SPACE:
          html += ' ';
          break;

        default:
          // Ignore the other node types.
          this._tsb.logger.error('Unknown token type found: ' + token.type);

          break;
      }
    } // Calculate the pre-hyphen word string and width.


    if (endHyphenIndex != null) {
      var _word = tokens[endIndex];
      var _cutIndex = _word.hyphenIndexPositions[endHyphenIndex];

      var _cut2 = _word.text.substr(0, _cutIndex + 1);

      html += _cut2 + '-'; // Add dash to html
    }

    return html;
  };

  this._tsb = tsb;
};
/**
 * Class to handle text hyphenations.
 */


var TypesetBotHyphen = function TypesetBotHyphen(tsb) {
  _classCallCheck(this, TypesetBotHyphen);

  /**
   * Hyphenate word.
   *
   * @param   word The word to hyphen
   * @returns      Array of string parts
   */
  this.hyphenate = function (word) {
    var offset = this.getWordOffset(word);
    return this.getWordParts(word, offset);
  };
  /**
   * Try and get cached result of a word hyphenation.
   *
   * @param  word The hyphenated word
   * @returns     The hyphenations
   */


  this.getCachedHyphenation = function (word) {
    if (!(this._tsb.settings.hyphenLanguage in this._tsb.hyphenStore)) {
      this._tsb.hyphenStore[this._tsb.settings.hyphenLanguage] = {};
    }

    if (!(word in this._tsb.hyphenStore[this._tsb.settings.hyphenLanguage])) {
      return null;
    }

    return this._tsb.hyphenStore[this._tsb.settings.hyphenLanguage][word];
  };
  /**
   * Add hyphenation result to cache store.
   *
   * @param word   The hyphenated word
   * @param result The hyphenations
   */


  this.addCachedHyphenation = function (word, result) {
    if (!(this._tsb.settings.hyphenLanguage in this._tsb.hyphenStore)) {
      this._tsb.hyphenStore[this._tsb.settings.hyphenLanguage] = {};
    }

    this._tsb.hyphenStore[this._tsb.settings.hyphenLanguage][word] = result;
  };
  /**
   * Hyphen word with specific settings.
   * Return array of possible word hyphens.
   * Fx: hyphenation --> ["hyp", "hen", "ation"]
   *
   * @param   word   The word to hyphen
   * @param   offset Addition offset of word
   * @returns        Array of string parts
   */


  this.getWordParts = function (word) {
    var offset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

    if (offset == null) {
      offset = new TypesetBotWordOffset(0, 0);
    }

    if (this._tsb.settings.hyphenLanguage == null || this._tsb.settings.hyphenLanguage.trim() === '') {
      return [word];
    }

    var leftTotal = this._tsb.settings.hyphenLeftMin + offset.left;
    var rightTotal = this._tsb.settings.hyphenRightMin + offset.right; // Check if offset is less than total word length.

    if (word.length < leftTotal + rightTotal) {
      return [word];
    }

    var cacheResult = this.getCachedHyphenation(word);

    if (cacheResult != null) {
      return cacheResult;
    }

    if (window.Hypher == null || window.Hypher.languages == null) {
      this._tsb.logger.warn('Hyphenation library not found');

      return [word];
    }

    if (window.Hypher.languages[this._tsb.settings.hyphenLanguage] == null) {
      // Language not found
      this._tsb.logger.warn("Hyphenation language '%s' not found", this._tsb.settings.hyphenLanguage);

      return [word];
    }

    window.Hypher.languages[this._tsb.settings.hyphenLanguage].leftMin = leftTotal;
    window.Hypher.languages[this._tsb.settings.hyphenLanguage].rightMin = rightTotal;

    var result = window.Hypher.languages[this._tsb.settings.hyphenLanguage].hyphenate(word);

    this.addCachedHyphenation(word, result);
    return result;
  };
  /**
   * Get the right and left offset of non-word characters in string.
   * Fx: ,|Hello.$. --> { left: 2, right: 3 }
   *
   * @param   word The word to check
   * @returns      Additional word offset
   */


  this.getWordOffset = function (word) {
    var beginRegex = /^[\W]*/;
    var endRegex = /[\W]*$/;
    var left = 0;
    var right = 0;
    var matchesStart = word.match(beginRegex);

    if (matchesStart) {
      left = matchesStart[0].length;
    }

    var matchesEnd = word.match(endRegex);

    if (matchesEnd) {
      right = matchesEnd[0].length;
    }

    return new TypesetBotWordOffset(left, right);
  };
  /**
   * Next word tokens until word is finished.
   * Definition:
   * - A word is at least 1 word node.
   * - A word can have any number of tags tokens and tags don't have to end.
   * - A word ends after a space node.
   *
   * @param   element              The element to typeset
   * @param   tokenIndex           The node index to start constructing words
   * @param   firstWordHyphenIndex Optional hyphenIndex of first node to start from
   * @returns                      The next word represented as one or multiple tokens
   */


  this.nextWord = function (element, tokenIndex) {
    var firstWordHyphenIndex = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
    var str = '';
    var indexes = [];
    var width = 0;
    var maxHeight = 0;
    var lastWordTokenIndex = null;

    var tokens = this._tsb.util.getElementTokens(element);

    var isFinished = false;

    while (!isFinished) {
      var token = tokens[tokenIndex]; // Finish loop if there is no more tokens.

      if (token == null) {
        isFinished = true;
        continue;
      }

      switch (token.type) {
        case TypesetBotToken.types.WORD:
          var word = token; // Update last word token index.

          lastWordTokenIndex = tokenIndex;

          if (firstWordHyphenIndex == null) {
            str += word.text;

            if (word.width != null) {
              width += word.width;
            }
          } else {
            // Calculate the post-hyphen word string and width.
            var cutIndex = word.hyphenIndexPositions[firstWordHyphenIndex];
            var cut = word.text.substr(cutIndex + 1); // Offset by 1, fx: hy[p]-hen

            var cutWidth = this.getEndWidth(word.hyphenIndexWidths, firstWordHyphenIndex, word.hyphenRemainWidth);
            str += cut;
            width += cutWidth;
            firstWordHyphenIndex = null; // Reset hyphenIndex
          }

          indexes.push(tokenIndex);

          if (word.height != null && maxHeight < word.height) {
            maxHeight = word.height;
          }

          break;

        case TypesetBotToken.types.TAG:
          // Ignore.
          break;

        case TypesetBotToken.types.SPACE:
          // Only allow word to finish if it is not empty.
          if (str !== '') {
            isFinished = true;
          }

          break;

        default:
          // Ignore the other node types.
          this._tsb.logger.error('Unknown token type found: ' + token.type);

          break;
      }

      tokenIndex++;
    } // Return null if word is empty.


    if (str === '') {
      return null;
    }

    return new TypesetBotWordData(str, indexes, tokenIndex, width, maxHeight, lastWordTokenIndex);
  };
  /**
   * Get the width from hyphen index to end of word.
   *
   * Given [3,4], 0, 7    --> 11
   *
   * Fx: hyp-{hen-ation}   from first hyphen
   *     |3|  |4| | 7 |   --> 11
   *
   * @param   hyphenIndexWidths Array of width of the hyphen parts
   * @param   startIndex        Starting hyphen index to measure width from
   * @param   endOfWordWidth    Space between last hyphen position and end of word
   * @returns                   Width between hyphen starting position and end of word
   */


  this.getEndWidth = function (hyphenIndexWidths, startIndex, endOfWordWidth) {
    var width = 0;

    for (var index = startIndex + 1; index < hyphenIndexWidths.length; index++) {
      width += hyphenIndexWidths[index];
    }

    return width + endOfWordWidth;
  };
  /**
   * Calculate hyphens in word and attach hyphen properties to tokens.
   *
   * @param   element
   * @param   wordData Word string and token indexes
   */


  this.calcWordHyphens = function (element, wordData) {
    var hyphens = this.hyphenate(wordData.str); // If does not have any hyphens, stop execution.

    if (hyphens.length <= 1) {
      return;
    }

    var tokens = this._tsb.util.getElementTokens(element); // Set properties on tokens.


    var _iteratorNormalCompletion20 = true;
    var _didIteratorError20 = false;
    var _iteratorError20 = undefined;

    try {
      for (var _iterator20 = wordData.indexes[Symbol.iterator](), _step20; !(_iteratorNormalCompletion20 = (_step20 = _iterator20.next()).done); _iteratorNormalCompletion20 = true) {
        var tokenIndex = _step20.value;
        tokens[tokenIndex].initHyphen();
      }
    } catch (err) {
      _didIteratorError20 = true;
      _iteratorError20 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion20 && _iterator20["return"] != null) {
          _iterator20["return"]();
        }
      } finally {
        if (_didIteratorError20) {
          throw _iteratorError20;
        }
      }
    }

    var hyphenLengths = TypesetBotUtils.getArrayIndexes(hyphens); // First word token.

    var curTokenIndex = 0;
    var curToken = tokens[wordData.indexes[curTokenIndex++]];
    var curTokenLength = curToken.text.length;
    var prevLength = 0;
    var curHyphenLength = 0; // Add the accurate hyphen indexes to the nodes.
    // Fx: ['hyph', <tag>, 'e', <tag>, 'nation'] --> ['hyp(-)h', <tag>, 'e', </tag>, 'n(-)ation']

    var _iteratorNormalCompletion21 = true;
    var _didIteratorError21 = false;
    var _iteratorError21 = undefined;

    try {
      for (var _iterator21 = hyphenLengths[Symbol.iterator](), _step21; !(_iteratorNormalCompletion21 = (_step21 = _iterator21.next()).done); _iteratorNormalCompletion21 = true) {
        var hyphenLength = _step21.value;
        curHyphenLength += hyphenLength; // Go to next token until we find a token that contains a hyphen.

        while (curTokenLength < curHyphenLength) {
          prevLength = curTokenLength;
          curToken = tokens[wordData.indexes[curTokenIndex++]];
          curTokenLength += curToken.text.length;
        }

        var hyphenIndex = curHyphenLength - prevLength - 1; // 1 for index offset

        curToken.hyphenIndexPositions.push(hyphenIndex);
      }
    } catch (err) {
      _didIteratorError21 = true;
      _iteratorError21 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion21 && _iterator21["return"] != null) {
          _iterator21["return"]();
        }
      } finally {
        if (_didIteratorError21) {
          throw _iteratorError21;
        }
      }
    }
  };

  this._tsb = tsb;
};
/**
 * Class representing a word as one of multiple tokens.
 */


var TypesetBotWordData =
/**
 * @param str                The total string in word
 * @param indexes            Token indexes of word tokens involved in word
 * @param tokenIndex         Next token index
 * @param width              Width of the word with one or multiple tokens
 * @param height             Max height of all tokens involved
 * @param lastWordTokenIndex Index of the last word token in the full appended word, needed for hyphenation
 */
function TypesetBotWordData(str, indexes, tokenIndex, width, height, lastWordTokenIndex) {
  _classCallCheck(this, TypesetBotWordData);

  this.str = str;
  this.indexes = indexes;
  this.tokenIndex = tokenIndex;
  this.width = width;
  this.height = height;
  this.lastWordTokenIndex = lastWordTokenIndex;
};
/**
 * Class representing additional offset on either side of word for hyphenation.
 */


var TypesetBotWordOffset =
/**
 * @param left  Offset of left side of word
 * @param right Offset of right side of word
 */
function TypesetBotWordOffset(left, right) {
  _classCallCheck(this, TypesetBotWordOffset);

  this.left = left;
  this.right = right;
};