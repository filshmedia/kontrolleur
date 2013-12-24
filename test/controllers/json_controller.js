'use strict';

var Controller = require('../../').Controller;
var JSONController = Controller.extend({
  jsontest: function () {
    this.json({
      hello: 'world'
    });
  }
});

module.exports = JSONController;
