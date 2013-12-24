'use strict';

var Controller = require('../../').Controller;
var HelpersController = Controller.extend({
  application: function () {
    this.render();
  },

  helpers: function () {
    this.render();
  }
});

module.exports = HelpersController;
