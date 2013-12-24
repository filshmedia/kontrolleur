'use strict';

var Controller = require('../../').Controller;
var IndexController = Controller.extend({
  index: function () {
    this.send('test response');
  },

  view: function () {
    this.render();
  },

  view2: function () {
    this.render('index/view-two');
  },

  view3: function () {
    this.render('view-three');
  }
});

module.exports = IndexController;
