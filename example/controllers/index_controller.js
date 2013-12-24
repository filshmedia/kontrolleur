'use strict';

var Controller = require('kontrolleur').Controller;
var IndexController = Controller.extend({
  index: function () {
    this.render();
  }
});

module.exports = IndexController;
