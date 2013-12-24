'use strict';

var Utils = {
  // https://github.com/epeli/underscore.string/blob/master/lib/underscore.string.js#L343
  underscored: function (str) {
    return str
      .trim()
      .replace(/([a-z\d])([A-Z]+)/g, '$1_$2')
      .replace(/[-\s]+/g, '_')
      .toLowerCase();
  }
};

module.exports = Utils;
