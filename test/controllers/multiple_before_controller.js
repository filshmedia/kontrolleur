'use strict';

var Controller = require('../../').Controller;

var filterOne = function () {
  this.res.send('ok');
  return Promise.resolve();
};

var filterTwo = function () {
  return Promise.resolve();
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
