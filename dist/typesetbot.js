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
  /**
   * Typeset all elements in query.
   */

  this.typeset = function () {
    console.log('typesettings init');
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
  };
  /**
   * Typeset multiple nodes.
   *
   * @parma nodes
   */


  this.typesetNodes = function (nodes) {
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = nodes[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var node = _step.value;
        var typesetter = new TypesetBotTypeset(this);
        typesetter.typeset(node);
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
  };

  this.util = new TypesetBotUtils(this);
  this.settings = new TypesetBotSettings(this, settings);
  this.logger = new TypesetBotLog(this);
  this.uuid = TypesetBotUtils.createUUID();
  this.query = new TypesetBotElementQuery(this, query);
  this.typesetter = new TypesetBotTypeset(this);
  this.typeset();
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
   * @returns   Formatted string in ms and number of calls.
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

  this._tsb = tsb;
  this._performanceMap = {};
  this.debug = this._tsb.settings.debug;
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
      var elems = document.querySelectorAll(query);

      if (elems == null) {
        return;
      }

      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = elems[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var elem = _step2.value;

          this._nodesTemp.push(elem);
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
    } else if (_typeof(query) === 'object') {
      if (NodeList.prototype.isPrototypeOf(query)) {
        var _iteratorNormalCompletion3 = true;
        var _didIteratorError3 = false;
        var _iteratorError3 = undefined;

        try {
          for (var _iterator3 = query[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
            var _elem = _step3.value;

            this._nodesTemp.push(_elem);
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
      } else if (Node.prototype.isPrototypeOf(query)) {
        this._nodesTemp.push(query);

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


  this.indexNodes = function (nodes) {
    var _iteratorNormalCompletion4 = true;
    var _didIteratorError4 = false;
    var _iteratorError4 = undefined;

    try {
      for (var _iterator4 = nodes[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
        var node = _step4.value;
        this.indexNode(node);
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
 * @param settings Optional settings object.
 */
function TypesetBotSettings(tsb) {
  var settings = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

  _classCallCheck(this, TypesetBotSettings);

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

      if (this[key] === undefined) {
        this._tsb.logger.warn('Unknown settings key "' + key + '"');
      }

      this[key] = value;
    }
  }; // ------------------------------------------------------------------------
  // SETTINGS ---------------------------------------------------------------
  // ------------------------------------------------------------------------
  // Debug mode: prints performance stats.


  this.debug = true; // Algorithm. -------------------------------------------------------------

  this.alignment = 'justify'; // Other options are 'ragged-right', 'ragged-left' and 'ragged-center'

  this.hyphenPenalty = 50; // Penalty for line-breaking on a hyphen

  this.hyphenPenaltyRagged = 500; // Penalty for line-breaking on a hyphen when using ragged text

  this.flagPenalty = 3000; // Penalty when current and last line had flag value 1. Reffered to as 'α'

  this.fitnessClassDemerit = 3000; // Penalty when switching between ratio classes. Reffered to as 'γ'

  this.demeritOffset = 1; // Offset to prefer fewer lines by increasing demerit of "~zero badness lines"
  // "the value of q is increased by 1 (if q < 0) or decreased by 1 (if q > 0) until a feasible solution is
  //  found." - DT p.114
  // loosenessParam  : number = 0; // If zero we find to solution with fewest total demerits. Reffered to as 'q'

  this.absoluteMaxRatio = 5; // Max adjustment ratio before we give up on finding solutions

  this.maxRatio = 2; // Maximum acceptable adjustment ratio. Referred to as 'p'

  this.minRatio = -1; // Minimum acceptable adjustment ratio. Less than -1 will make the text too closely spaced.
  // Hyphen. ----------------------------------------------------------------

  this.hyphenLanguage = 'en-us'; // Language of hyphenation patterns to use

  this.hyphenLeftMin = 2; // Minimum number of letters to keep on the left side of word

  this.hyphenRightMin = 2; // Minimum number of letters to keep on the right side of word
  // 4 classes of adjustment ratios.

  this.fitnessClasses = [-1, -0.5, 0.5, 1, Infinity]; // Font. ------------------------------------------------------------------

  this.spaceUnit = 'em'; // Space width unit, em is relative to font-size

  this.spaceWidth = 1 / 3; // Ideal space width

  this.spaceStretchability = 1 / 6; // How much can the space width stretch

  this.spaceShrinkability = 1 / 9; // How much can the space width shrink
  // Tags inside element that might break the typesetting algorithm

  this.unsupportedTags = ['BR', 'IMG'];
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
   * Set index on node.
   *
   * @param node  The node to set index on
   * @param index The index to set
   */


  this.setElementIndex = function (node, index) {
    node.setAttribute('data-tsb-indexed', '' + index);
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
    }

    return this._tsb.indexToTokens[index];
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
 */


TypesetBotUtils.getArrayIndexes = function (arr) {
  var indexes = [];

  for (var i = 0; i < arr.length - 1; i++) {
    indexes.push(arr[i].length);
  }

  return indexes;
};

var TypesetBotMath = function TypesetBotMath(tsb) {
  _classCallCheck(this, TypesetBotMath);

  /**
   * Calculate adjustment ratio.
   *
   * @param idealW
   * @param actualW
   * @param wordCount
   * @param shrink
   * @param stretch
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
   * @param badness
   * @param penalty
   * @param flag
   * @returns       The line demerit
   */


  this.getDemeritFromBadness = function (badness, penalty, flag) {
    var flagPenalty = flag ? this.settings.flagPenalty : 0;

    if (penalty >= 0) {
      return Math.pow(this.settings.demeritOffset + badness + penalty, 2) + flagPenalty;
    } else if (penalty === -Infinity) {
      return Math.pow(this.settings.demeritOffset + badness, 2) + flagPenalty;
    } else {
      return Math.pow(this.settings.demeritOffset + badness, 2) - Math.pow(penalty, 2) + flagPenalty;
    }
  };

  this.getDemerit = function (ratio, flag, hasHyphen, skippingFitnessClass) {
    var badness = this.getBadness(ratio);
    var additionalPenalty = 0;

    if (hasHyphen) {
      if (this.settings.alignment == 'justify') {
        additionalPenalty += this.settings.hyphenPenalty;
      } else {
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
   * @param   ratio
   * @returns       The fitness class
   */


  this.getFitnessClass = function (ratio) {
    var _iteratorNormalCompletion5 = true;
    var _didIteratorError5 = false;
    var _iteratorError5 = undefined;

    try {
      for (var _iterator5 = this.settings.fitnessClasses[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
        var fitnessClass = _step5.value;

        if (ratio < fitnessClass) {
          return fitnessClass;
        }
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

    return this.settings.fitnessClasses[this.settings.fitnessClasses.length - 1]; // Default for infinite ratio
  };
  /**
   * Check if adjustment ratio is within a valid range.
   *
   * @param   ratio
   * @returns       Return true if ratio is valid for breakpoint, otherwise false
   */


  this.isValidRatio = function (ratio, looseness) {
    return this.ratioIsLessThanMax(ratio, looseness) && this.ratioIsHigherThanMin(ratio);
  };
  /**
   * Check if ratio is less or equal to allowed maximum ratio.
   *
   * @param   ratio
   * @returns       Return true if ratio is less than max. ratio
   */


  this.ratioIsLessThanMax = function (ratio, looseness) {
    return ratio <= this.settings.maxRatio + looseness;
  };
  /**
   * Check if ratio is higher or equal to allowed minimum ratio.
   *
   * @param   ratio
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


    var _iteratorNormalCompletion6 = true;
    var _didIteratorError6 = false;
    var _iteratorError6 = undefined;

    try {
      for (var _iterator6 = node.childNodes[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
        var child = _step6.value;

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

    if (node.nodeName in this._tsb.settings.unsupportedTags) {
      this._tsb.logger.warn('Tokenizer found unsupported node type, typesetting might not work as intended.');

      this._tsb.logger.warn(node);
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

    var _iteratorNormalCompletion7 = true;
    var _didIteratorError7 = false;
    var _iteratorError7 = undefined;

    try {
      for (var _iterator7 = words[Symbol.iterator](), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
        var word = _step7.value;

        if (word === '') {
          continue;
        }

        tokens.push(new TypesetBotWord(nodeIndex, word)); // Assume all words are followed by a space.

        tokens.push(new TypesetBotSpace(nodeIndex));
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

    _this.hasHyphen = false;

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
   * Typeset single node.
   *
   * @param node
   */
  this.typeset = function (node) {
    console.log('Typesetting:');
    console.log(node); // Apply basic reset CSS styles.
    // (ignore for now)
    // Check if node has changed content (inner nodes) since last typesetting.
    // (ignored for now)
    // Make a copy of node which can be worked on without breaking webpage.

    this._tsb.logger.start('---- Clone working node');

    var cloneNode = node.cloneNode(true);

    this._tsb.logger.end('---- Clone working node'); // Calculate linebreaks.


    var linebreaks = this.calcLinebreaks(node); // Visually apply linebreaks to original element.
    // Loop final solutions and find the one with lowest demerit.
    // Construct lines.
    // Word, Tag Space
    // Close tags after each line.
    // Start unfinished tags at the beginning of each line.
    // Convert to HTML.
  };
  /**
   * Get a set initial state properties of element.
   *
   * @param node
   */


  this.getElementProperties = function (node) {
    this._tsb.logger.start('---- Getting element properties');

    this.originalHTML = node.outerHTML; // Set space width based on settings.

    this.render.setMinimumWordSpacing(node);
    this.elemWidth = this.render.getNodeWidth(node); // Get font size and calc real space properties.

    this.elemFontSize = this.render.getDefaultFontSize(node);
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
    this._tsb.logger.start('-- Preprocess'); // Get element width.
    // Init paragraph variables.
    // Copy content.


    this.getElementProperties(element); // Tokenize nodes and store them.

    this._tsb.logger.start('---- Tokenize text');

    this.tokens = this.tokenizer.tokenize(element);

    this._tsb.logger.end('---- Tokenize text');

    this._tsb.logger.start('---- other'); // Append tokens to map for quick access.


    this.appendToTokenMap(element, this.tokens);

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
   * Calculate the valid linebreaks
   */


  this.calcLinebreaks = function (element) {
    this.preprocessElement(element);
    var finalBreakpoints = this.getFinalLineBreaks(element);
    var solution = this.lowestDemerit(finalBreakpoints);

    if (solution == null) {
      this._tsb.logger.notice('No viable solution found during typesetting. Element is skipped.');

      return;
    }

    this.render.applyLineBreaks(element, solution);
  };

  this.lowestDemerit = function (finalBreakpoints) {
    this._tsb.logger.start('-- Finding solution');

    var solution = null;
    var _iteratorNormalCompletion8 = true;
    var _didIteratorError8 = false;
    var _iteratorError8 = undefined;

    try {
      for (var _iterator8 = finalBreakpoints[Symbol.iterator](), _step8; !(_iteratorNormalCompletion8 = (_step8 = _iterator8.next()).done); _iteratorNormalCompletion8 = true) {
        var breakpoint = _step8.value;

        if (solution == null) {
          solution = breakpoint;
          continue;
        }

        if (solution.demerit > breakpoint.demerit) {
          solution = breakpoint;
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

    this._tsb.logger.end('-- Finding solution');

    return solution;
  };

  this.getFinalLineBreaks = function (element) {
    var looseness = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

    this._tsb.logger.start('-- Dynamic programming');

    this.activeBreakpoints = new Queue();
    this.shortestPath = {};
    var finalBreakpoints = [];
    this.activeBreakpoints.enqueue(new TypesetBotLinebreak(null, 0, null, 0, false, null, 0, 0));
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
        var wordData = this.hyphen.nextWord(element, lineProperties.tokenIndex);

        if (wordData == null) {
          // Push final break.
          finalBreakpoints.push(new TypesetBotLinebreak(originBreakpoint, null, null, originBreakpoint.demerit, false, null, originBreakpoint.lineNumber + 1, lineProperties.lineHeight));
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
          var _iteratorNormalCompletion9 = true;
          var _didIteratorError9 = false;
          var _iteratorError9 = undefined;

          try {
            for (var _iterator9 = wordData.indexes[Symbol.iterator](), _step9; !(_iteratorNormalCompletion9 = (_step9 = _iterator9.next()).done); _iteratorNormalCompletion9 = true) {
              var tokenIndex = _step9.value;
              var token = this.tokens[tokenIndex]; // const hyphenRatio = this.math.getRatio(
              //     this.elemWidth,
              //     lineProperties.curWidth,
              //     lineProperties.wordCount,
              //     this.spaceShrink,
              //     this.spaceStretch,
              // );
            } // Check the ratio is still valid.

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

          if (!this.math.ratioIsHigherThanMin(ratio)) {
            lineIsFinished = true;
            continue; // Don't add the last node.
          } // Generate breakpoint.


          var breakpoint = this.getBreakpoint(originBreakpoint, lineProperties, ratio, lineProperties.tokenIndex);
          var isUpdatedPath = this.updateShortestPath(breakpoint);
        }

        lineProperties.curWidth += this.spaceWidth;
      }
    }

    this._tsb.logger.end('-- Dynamic programming'); // Run again more loose if no solution was found.


    if (finalBreakpoints.length === 0 && looseness <= 4) {
      console.log('recall linebreak');
      return this.getFinalLineBreaks(element, looseness + 1);
    }

    return finalBreakpoints;
  };

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
    flag, fitnessClass, origin.lineNumber + 1, lineProperties.lineHeight);
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
    var hyphenIndex = breakpoint.hyphenIndex == null ? -1 : breakpoint.hyphenIndex; // Safety check.

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
   * Add tokens to map for specific node.
   *
   * @param root
   * @param tokens
   */


  this.appendToTokenMap = function (root, tokens) {
    if (this._tsb.util.getElementIndex(root) == null) {
      this._tsb.logger.error('Root node is not indexed');

      this._tsb.logger.error(root);

      return;
    }

    var index = this._tsb.util.getElementIndex(root);

    this._tsb.indexToTokens[index] = tokens;
  };

  this.initLineProperties = function (origin) {
    // Check if origin is the current shortest path.
    // @todo
    return new TypesetBotLineProperties(origin, origin.tokenIndex, origin.lineNumber, 0, 0, 0);
  };

  this._tsb = tsb;
  this.render = new TypesetBotRender(tsb);
  this.tokenizer = new TypesetBotTokenizer(tsb, this);
  this.hyphen = new TypesetBotHyphen(tsb);
  this.math = new TypesetBotMath(tsb);
  this.settings = tsb.settings;
};
/**
 * Linebreak
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
 * @param curLineHeight Current height of line
 */
function TypesetBotLinebreak(origin, tokenIndex, hyphenIndex, demerit, flag, fitnessClass, lineNumber, maxLineHeight) {
  _classCallCheck(this, TypesetBotLinebreak);

  this.origin = origin;
  this.tokenIndex = tokenIndex;
  this.hyphenIndex = hyphenIndex;
  this.demerit = demerit;
  this.flag = flag;
  this.fitnessClass = fitnessClass;
  this.lineNumber = lineNumber;
  this.maxLineHeight = maxLineHeight;
};

var TypesetBotLineProperties =
/**
 * @param origin     The linebreak object for previous line
 * @param tokenIndex The index of the next token to append
 * @param lineNumber The current line number
 * @param wordCount  The number of words in line
 * @param curWidth   The current line width
 * @param lineHeight The current max line height
 */
function TypesetBotLineProperties(origin, tokenIndex, lineNumber, wordCount, curWidth, lineHeight) {
  _classCallCheck(this, TypesetBotLineProperties);

  this.origin = origin;
  this.tokenIndex = tokenIndex;
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
   * Get default word space of node.
   *
   * @param node The node to check
   * @returns    The default word spacing in pixels
   */
  this.getSpaceWidth = function (node) {
    var spanNode = document.createElement('SPAN');
    var preTextNode = document.createTextNode('1');
    var postTextNode = document.createTextNode('1');
    var textNode = document.createTextNode(' ');
    var spaceContainer = document.createElement('SPAN');
    spaceContainer.appendChild(textNode);
    spanNode.appendChild(preTextNode);
    spanNode.appendChild(spaceContainer);
    spanNode.appendChild(postTextNode);
    node.appendChild(spanNode);
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
   * @param node
   */


  this.setMinimumWordSpacing = function (node) {
    var minSpaceSize = this._tsb.settings.spaceWidth - this._tsb.settings.spaceShrinkability;
    var defaultWidth = this.getSpaceWidth(node);
    node.style.wordSpacing = 'calc((1em * ' + minSpaceSize + ') - ' + defaultWidth + 'px)';
  };

  this.getWordProperties = function (node) {
    var tokens = this._tsb.util.getElementTokens(node);

    var backupHtml = node.innerHTML;
    var renderIndexToToken = {};
    var html = '';
    var currentIndex = 0;

    this._tsb.logger.start('------ Build HTML');

    var _iteratorNormalCompletion10 = true;
    var _didIteratorError10 = false;
    var _iteratorError10 = undefined;

    try {
      for (var _iterator10 = tokens[Symbol.iterator](), _step10; !(_iteratorNormalCompletion10 = (_step10 = _iterator10.next()).done); _iteratorNormalCompletion10 = true) {
        var token = _step10.value;

        switch (token.type) {
          case TypesetBotToken.types.WORD:
            var word = token; // const wordNode = elementNodes[token.nodeIndex];

            renderIndexToToken[currentIndex] = token;
            currentIndex += 1;
            html += '<span class="typeset-word-node">' + word.text + '</span>';
            break;

          case TypesetBotToken.types.TAG:
            var tag = token;
            html += this.htmlGenerator.createTagHtml(node, tag);
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

    this._tsb.logger.end('------ Build HTML');

    this._tsb.logger.start('------ Update DOM');

    node.innerHTML = html;

    this._tsb.logger.end('------ Update DOM');

    this._tsb.logger.start('------ Query DOM');

    var renderedWordNodes = node.querySelectorAll('.typeset-word-node');

    this._tsb.logger.end('------ Query DOM');

    this._tsb.logger.start('------ Get Properties');

    var renderIndex = 0;
    var _iteratorNormalCompletion11 = true;
    var _didIteratorError11 = false;
    var _iteratorError11 = undefined;

    try {
      for (var _iterator11 = renderedWordNodes[Symbol.iterator](), _step11; !(_iteratorNormalCompletion11 = (_step11 = _iterator11.next()).done); _iteratorNormalCompletion11 = true) {
        var renderedWordNode = _step11.value;
        var wordToken = renderIndexToToken[renderIndex];
        wordToken.width = renderedWordNode.getBoundingClientRect().width;
        wordToken.height = renderedWordNode.getBoundingClientRect().height;
        renderIndex += 1;
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

    this._tsb.logger.end('------ Get Properties');

    this._tsb.logger.start('------ Update DOM');

    node.innerHTML = backupHtml;

    this._tsb.logger.end('------ Update DOM');
  };
  /**
   * Get default font size of element.
   *
   * @param   node
   * @returns      The font size in pixels as number
   */


  this.getDefaultFontSize = function (node) {
    var fontSize = window.getComputedStyle(node).fontSize; // Remove pixels from output and convert to number.

    return Number(fontSize.replace('px', ''));
  };
  /**
   * Get width of node.
   *
   * @param   node
   * @returns      The width of node in pixels as number
   */


  this.getNodeWidth = function (node) {
    return node.getBoundingClientRect().width;
  };
  /**
   *
   */


  this.getHyphenProperties = function (element) {
    var tokens = this._tsb.util.getElementTokens(element);

    var backupHtml = element.innerHTML;
    var html = ''; // Array of objects in dom to inspect.

    var renderRequest = []; // Loop tokens to build HTML.

    var _iteratorNormalCompletion12 = true;
    var _didIteratorError12 = false;
    var _iteratorError12 = undefined;

    try {
      for (var _iterator12 = tokens[Symbol.iterator](), _step12; !(_iteratorNormalCompletion12 = (_step12 = _iterator12.next()).done); _iteratorNormalCompletion12 = true) {
        var token = _step12.value;

        switch (token.type) {
          case TypesetBotToken.types.WORD:
            var word = token;
            var lastIndex = 0; // Skip if word has not hyphens

            if (!word.hasHyphen) {
              continue;
            } // Queue hyphenation parts or word.


            var _iteratorNormalCompletion14 = true;
            var _didIteratorError14 = false;
            var _iteratorError14 = undefined;

            try {
              for (var _iterator14 = word.hyphenIndexPositions[Symbol.iterator](), _step14; !(_iteratorNormalCompletion14 = (_step14 = _iterator14.next()).done); _iteratorNormalCompletion14 = true) {
                var hyphenIndex = _step14.value;

                var _cut = word.text.substring(lastIndex, hyphenIndex + 1);

                lastIndex = hyphenIndex + 1;
                html += '<span class="typeset-hyphen-check">' + _cut + '</span>';
                renderRequest.push({
                  token: token,
                  type: 'hyphen'
                });
              } // Queue remain (if any), fx 'phen'.

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

            if (word.text.length !== lastIndex) {
              var cut = word.text.substr(lastIndex);
              html += '<span class="typeset-hyphen-check">' + cut + '</span>';
              renderRequest.push({
                token: token,
                type: 'remain'
              });
            } // Queue dash, '-'.


            html += '<span class="typeset-hyphen-check">-</span>';
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

    element.innerHTML = html;
    var renderedHyphenNodes = element.querySelectorAll('.typeset-hyphen-check'); // Loop elements from DOM.

    var renderIndex = 0;
    var _iteratorNormalCompletion13 = true;
    var _didIteratorError13 = false;
    var _iteratorError13 = undefined;

    try {
      for (var _iterator13 = renderedHyphenNodes[Symbol.iterator](), _step13; !(_iteratorNormalCompletion13 = (_step13 = _iterator13.next()).done); _iteratorNormalCompletion13 = true) {
        var renderedHyphenNode = _step13.value;
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

    element.innerHTML = backupHtml;
  };

  this.applyLineBreaks = function (element, finalBreakpoint) {
    this._tsb.logger.start('-- Apply breakpoints');

    var lines = [];
    var isFinished = false;
    var pointer = finalBreakpoint;

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

    for (var _i2 = 0, _lines = lines; _i2 < _lines.length; _i2++) {
      var line = _lines[_i2];
      var lineHtml = '';
      lineHtml += this.getHtmlFromTokensRange(element, curTokenIndex, line.tokenIndex);
      curTokenIndex = line.tokenIndex;
      html += '<span class="typesetbot-line" line="' + line.lineNumber + '" style="height:' + line.maxLineHeight + 'px">' + lineHtml + '</span>';
    }

    element.innerHTML = html;
    element.classList.add('typesetbot-justify');

    this._tsb.logger.end('-- Apply breakpoints');
  };

  this.getHtmlFromTokensRange = function (element, startIndex, endIndex) {
    var hyphenIndex = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;

    var tokens = this._tsb.util.getElementTokens(element);

    var html = '';

    if (endIndex == null) {
      endIndex = tokens.length - 1;
    }

    for (var index = startIndex; index < endIndex; index++) {
      var token = tokens[index];

      switch (token.type) {
        case TypesetBotToken.types.WORD:
          var word = token;
          html += word.text;
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

    return html;
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
   * @param   node  The element to typeset
   * @param   token The token representing HTML tag
   * @returns       The HTML string
   */
  this.createTagHtml = function (node, token) {
    var elementNodes = this._tsb.util.getElementNodes(node);

    var tagNode = elementNodes[token.nodeIndex];

    if (token.isEndTag) {
      return '</' + tagNode.tagName.toLowerCase() + '>';
    } else {
      var attrText = '';
      var _iteratorNormalCompletion15 = true;
      var _didIteratorError15 = false;
      var _iteratorError15 = undefined;

      try {
        for (var _iterator15 = tagNode.attributes[Symbol.iterator](), _step15; !(_iteratorNormalCompletion15 = (_step15 = _iterator15.next()).done); _iteratorNormalCompletion15 = true) {
          var attr = _step15.value;
          attrText += attr.name + '=' + attr.value + ' ';
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

      return '<' + tagNode.tagName.toLowerCase() + ' ' + attrText + '>';
    }
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

    if (this._tsb.settings.hyphenLanguage.trim() === '') {
      return [word];
    }

    if (window.Hypher == null || window.Hypher.languages == null) {
      console.warn('Hyphenation library not found');
      return [word];
    }

    if (window.Hypher.languages[this._tsb.settings.hyphenLanguage] == null) {
      // Language not found
      var h = new window.Hypher(module.exports);

      if (typeof module.exports.id === 'string') {
        module.exports.id = [module.exports.id];
      }

      for (var i = 0; i < module.exports.id.length; i += 1) {
        window.Hypher.languages[module.exports.id[i]] = h;
      }

      if (window.Hypher.languages[this._tsb.settings.hyphenLanguage] != null) {
        return this.getWordParts(word);
      }

      console.warn("Hyphenation language '%s' not found", this._tsb.settings.hyphenLanguage);
      return [word];
    }

    window.Hypher.languages[this._tsb.settings.hyphenLanguage].leftMin = this._tsb.settings.hyphenLeftMin + offset.left;
    window.Hypher.languages[this._tsb.settings.hyphenLanguage].rightMin = this._tsb.settings.hyphenRightMin + offset.right;
    return window.Hypher.languages[this._tsb.settings.hyphenLanguage].hyphenate(word);
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
   * - A word can have any number of tags nodes and tags don't have to end.
   * - A word ends after a space node.
   *
   * @param   element     The element to typeset
   * @param   tokenIndex  The node index to start constructing words
   * @param   hyphenIndex Optional hyphenIndex of first node to start from
   * @returns             The next word represented as one or multiple nodes
   */


  this.nextWord = function (element, tokenIndex) {
    var hyphenIndex = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
    var str = '';
    var indexes = [];
    var width = 0;
    var maxHeight = 0;

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
          var word = token;
          str += word.text;
          indexes.push(tokenIndex); // @todo add complex hyphen cut calculation.

          if (token.width != null) {
            width += token.width;
          }

          if (token.height != null && maxHeight < token.height) {
            maxHeight = token.height;
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

    return new TypesetBotWordData(str, indexes, tokenIndex, width, maxHeight);
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


    var _iteratorNormalCompletion16 = true;
    var _didIteratorError16 = false;
    var _iteratorError16 = undefined;

    try {
      for (var _iterator16 = wordData.indexes[Symbol.iterator](), _step16; !(_iteratorNormalCompletion16 = (_step16 = _iterator16.next()).done); _iteratorNormalCompletion16 = true) {
        var tokenIndex = _step16.value;
        tokens[tokenIndex].initHyphen();
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

    var hyphenLengths = TypesetBotUtils.getArrayIndexes(hyphens); // First word token.

    var curTokenIndex = 0;
    var curToken = tokens[wordData.indexes[curTokenIndex++]];
    var curTokenLength = curToken.text.length;
    var prevLength = 0;
    var curHyphenLength = 0; // Add the accurate hyphen indexes to the nodes.
    // Fx: ['hyph', <tag>, 'e', <tag>, 'nation'] --> ['hyp(-)h', <tag>, 'e', </tag>, 'n(-)ation']

    var _iteratorNormalCompletion17 = true;
    var _didIteratorError17 = false;
    var _iteratorError17 = undefined;

    try {
      for (var _iterator17 = hyphenLengths[Symbol.iterator](), _step17; !(_iteratorNormalCompletion17 = (_step17 = _iterator17.next()).done); _iteratorNormalCompletion17 = true) {
        var hyphenLength = _step17.value;
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
  };

  this._tsb = tsb;
};
/**
 * Class representing a word as one of multiple tokens.
 */


var TypesetBotWordData =
/**
 * @param str         The total string in word
 * @param indexes     Token indexes of word tokens involved in word
 * @param tokenIndex  Next token index
 */
function TypesetBotWordData(str, indexes, tokenIndex, width, height) {
  _classCallCheck(this, TypesetBotWordData);

  this.str = str;
  this.indexes = indexes;
  this.tokenIndex = tokenIndex;
  this.width = width;
  this.height = height;
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