'use strict';

var Controller = require('../../').Controller;

var filterOne = function (next) {
  this.res.send('ok');
};

var filterTwo = function (next) {
  next()
};

var BeforeController = Controller.extend({
  constructor: function () {
    Controller.apply(this, arguments);

    this.beforeFilter('one', filterOne);
    this.beforeFilter('two', filterTwo);
  },

  test: function () {
    this.send('should not happen');
  }
});

module.exports = BeforeController;
