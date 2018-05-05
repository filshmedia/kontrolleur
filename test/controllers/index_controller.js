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
  },

  view3error: function () {
    this.render('view-three', {}, 500);
  },

  asyncerror: function () {
    return Promise.reject(new Error('This is an error'));
  }
});

module.exports = IndexController;
