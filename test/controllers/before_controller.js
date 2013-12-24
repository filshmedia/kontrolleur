'use strict';

var Controller = require('../../').Controller;

var successFilter = function (next) {
  next();
};
var failFilter = function () {
  return this.send('fail');
};

var BeforeController = Controller.extend({
  constructor: function () {
    Controller.apply(this, arguments);

    this.beforeFilter('success', successFilter, { only: ['success'] });
    this.beforeFilter('fail', failFilter, { only: ['fail'] });
  },

  success: function () {
    this.send('ok');
  },

  fail: function () {
    this.send('ok');
  }
});

module.exports = BeforeController;
