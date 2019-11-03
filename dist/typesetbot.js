"use strict";

var __extends = void 0 && (void 0).__extends || function () {
  var _extendStatics = function extendStatics(d, b) {
    _extendStatics = Object.setPrototypeOf || {
      __proto__: []
    } instanceof Array && function (d, b) {
      d.__proto__ = b;
    } || function (d, b) {
      for (var p in b) {
        if (b.hasOwnProperty(p)) d[p] = b[p];
      }
    };

    return _extendStatics(d, b);
  };

  return function (d, b) {
    _extendStatics(d, b);

    function __() {
      this.constructor = d;
    }

    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
}();

var TypesetHyphen =
/** @class */
function () {
  function TypesetHyphen() {
    this.line = "hello world";

    this.test = function () {
      console.log('test2');
    };

    this.hello = function () {
      return 10;
    };
  }

  return TypesetHyphen;
}();

var Typeset =
/** @class */
function (_super) {
  __extends(Typeset, _super);

  function Typeset() {
    var _this = _super !== null && _super.apply(this, arguments) || this;

    _this.other = [1, 2, 3];

    _this.test2 = function () {
      console.log('test');
    };

    return _this;
  }

  return Typeset;
}(TypesetHyphen);