"use strict";

var TypesetBot =
/** @class */
function () {
  function TypesetBot(query, settings) {
    this.getQuery = function () {
      return this.query;
    };

    this.query = query;
    this.settings = settings;
  }

  ;
  return TypesetBot;
}();