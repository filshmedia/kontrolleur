'use strict';

var Controller = require('../../').Controller;
var IndexController = Controller.extend({
  index: function () {
    this.res.send('test response');
  }
});

module.exports = IndexController;
