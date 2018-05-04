'use strict';

var Controller = require('../../../../').Controller;
var IndexController = Controller.extend({
  view: function () {
    this.render('api/v1/index/view')
  }
});

module.exports = IndexController;
