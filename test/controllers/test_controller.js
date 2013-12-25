'use strict';

var Controller = require('../../').Controller;
var TestController = Controller.extend({
  index: function () {
    this.send('index');
  },

  test: function () {
    this.send('test');
  }
});

module.exports = TestController;
