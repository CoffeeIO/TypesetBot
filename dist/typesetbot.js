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
    this.logger.diff('---- other');
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
  // Tags inside element that might break the typesetting algorithm

  this.unsupportedTags = ['BR', 'IMG']; // Settings functions. ----------------------------------------------------

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

  this.ratio = function (idealW, actualW, wordCount, shrink, stretch) {
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


  this.badness = function (ratio) {
    if (ratio == null || ratio < this.minRatio) {
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

  this.getElementNodes = function (node) {
    var index = this.getElementIndex(node);

    if (isNaN(index)) {
      this._tsb.logger.error('Could not find nodes to element.');
    }

    return this._tsb.indexToNodes[index];
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


    var _iteratorNormalCompletion5 = true;
    var _didIteratorError5 = false;
    var _iteratorError5 = undefined;

    try {
      for (var _iterator5 = node.childNodes[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
        var child = _step5.value;

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

    var _iteratorNormalCompletion6 = true;
    var _didIteratorError6 = false;
    var _iteratorError6 = undefined;

    try {
      for (var _iterator6 = words[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
        var word = _step6.value;

        if (word === '') {
          continue;
        }

        tokens.push(new TypesetBotWord(nodeIndex, word)); // Assume all words are followed by a space.

        tokens.push(new TypesetBotSpace(nodeIndex));
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

    _this = _possibleConstructorReturn(this, _getPrototypeOf(TypesetBotWord).call(this, nodeIndex, TypesetBotToken.types.WORD));
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

    this._tsb.settings.loosenessParam = 0; // Check if node has changed content (inner nodes) since last typesetting.
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

  this.getElementProperties = function (node) {
    this._tsb.logger.start('---- other');

    this.originalHTML = node.outerHTML; // Set space width based on settings.

    this.render.setMinimumWordSpacing(node);
    this.elemWidth = this.render.getNodeWidth(node); // Get font size and calc real space properties.

    this.elemFontSize = this.render.getDefaultFontSize(node);
    this.spaceWidth = this.elemFontSizeSize * this._tsb.settings.spaceWidth, this.spaceShrink = this.elemFontSize * this._tsb.settings.spaceShrinkability, this.spaceStretch = this.elemFontSize * this._tsb.settings.spaceStretchability;

    this._tsb.logger.end('---- other');
  };
  /**
   * Calculate the valid linebreaks
   */


  this.calcLinebreaks = function (node) {
    this._tsb.logger.start('-- Preprocess'); // Get element width.
    // Init paragraph variables.
    // Copy content.


    this.getElementProperties(node); // Tokenize nodes and store them.

    this._tsb.logger.start('---- Tokenize text');

    this.tokens = this.tokenizer.tokenize(node);

    this._tsb.logger.end('---- Tokenize text');

    this._tsb.logger.start('---- other'); // Append tokens to map for quick access.


    this.appendToTokenMap(node, this.tokens);

    this._tsb.logger.end('---- other');

    this._tsb.logger.start('---- Get render size of words'); // Get render sizes of nodes.


    this.render.getWordProperties(node, this.tokens);

    this._tsb.logger.end('---- Get render size of words');

    this._tsb.logger.end('-- Preprocess');

    this.activeBreakpoints = new Queue();
    this.shortestPath = [];
    this.finalBreakpoints = []; // Counter for last rendered node.
    // Preprocess all hyphens.
    // Loop all nodes.
    // Find hyphens in word.
    // Get hyphen properties of that word.
    // Create starting node.
    // Loop until queue is empty.
    // Init line variables.
    // Check if shortest path is found.
    // Get active node index.
    // Get active hyphen index of node.
    // Calculate adjustment ratio.
    // Check if this is a valid breakpoint (not within min ratio).
    // Loop hyphen breakpoints.
    // Get hyphen adjustment ratio.
    // If "valid" breaking point, generate break.
    // Check if adjustment ratio is within the minimum ratio.
    // Generate break.
    // Add space width to current line with.
    // Reset node content.
    // Run linebreaking algorithm again if no solution was found.
    // Increase looseness.
    // Return calculated nodes and valid linebreak solutions.

    return [];
  };

  this.addBreakpoint = function () {// Get fitness class
    // Check flagDemerit
    // Calc demerit
    // Check fitness class change.
    // Create breakpoint object.
    // Update shorted path.
  };

  this.checkShortestPath = function () {
    // Check if breakpoint if the lowest demerit on:
    // "specific line, with specific nodex, with specific hyphen index".
    return false;
  };

  this.updateShortestPath = function () {// If breakpoint has better demerit on "specific line, with specific nodex, with specific hyphen index".
    // Then update the breakpoint.
    // Append to active breakpoints queue.
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

  this._tsb = tsb;
  this.render = new TypesetBotRender(tsb);
  this.tokenizer = new TypesetBotTokenizer(tsb, this);
};
/**
 * Linebreak
 */


var TypesetBotLinebreak = function TypesetBotLinebreak(tsb) {
  _classCallCheck(this, TypesetBotLinebreak);

  this._tsb = tsb;
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
    node.style.wordSpacing = 'calc((1px * ' + minSpaceSize + ') - ' + defaultWidth + 'px)';
  };

  this.getWordProperties = function (node, tokens) {
    var elementNodes = this._tsb.util.getElementNodes(node);

    var backupHtml = node.innerHTML;
    var renderIndexToToken = {};
    var html = '';
    var currentIndex = 0;

    this._tsb.logger.start('------ Build HTML');

    var _iteratorNormalCompletion7 = true;
    var _didIteratorError7 = false;
    var _iteratorError7 = undefined;

    try {
      for (var _iterator7 = tokens[Symbol.iterator](), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
        var token = _step7.value;

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

    this._tsb.logger.end('------ Build HTML');

    this._tsb.logger.start('------ Update DOM');

    node.innerHTML = html;

    this._tsb.logger.end('------ Update DOM');

    this._tsb.logger.start('------ Query DOM');

    var renderedWordNodes = node.querySelectorAll('.typeset-word-node');

    this._tsb.logger.end('------ Query DOM');

    this._tsb.logger.start('------ Get Properties');

    var renderIndex = 0;
    var _iteratorNormalCompletion8 = true;
    var _didIteratorError8 = false;
    var _iteratorError8 = undefined;

    try {
      for (var _iterator8 = renderedWordNodes[Symbol.iterator](), _step8; !(_iteratorNormalCompletion8 = (_step8 = _iterator8.next()).done); _iteratorNormalCompletion8 = true) {
        var renderedWordNode = _step8.value;
        var wordToken = renderIndexToToken[renderIndex];
        wordToken.width = renderedWordNode.getBoundingClientRect().width;
        wordToken.height = renderedWordNode.getBoundingClientRect().height;
        renderIndex += 1;
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
      var _iteratorNormalCompletion9 = true;
      var _didIteratorError9 = false;
      var _iteratorError9 = undefined;

      try {
        for (var _iterator9 = tagNode.attributes[Symbol.iterator](), _step9; !(_iteratorNormalCompletion9 = (_step9 = _iterator9.next()).done); _iteratorNormalCompletion9 = true) {
          var attr = _step9.value;
          attrText += attr.name + '=' + attr.value + ' ';
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

      return '<' + tagNode.tagName.toLowerCase() + ' ' + attrText + '>';
    }
  };

  this._tsb = tsb;
};