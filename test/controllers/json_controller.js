'use strict';

var Controller = require('../../').Controller;
var JSONController = Controller.extend({
  jsontest: function () {
    this.json({
      hello: 'world'
    });
  },

  json500test: function () {
    this.json({
      hello: 'world'
    }, 500);
  }
});

module.exports = JSONController;
