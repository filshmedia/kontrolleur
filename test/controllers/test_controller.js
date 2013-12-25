'use strict';

var Controller = require('../../').Controller;
var TestController = Controller.extend({
  index: function () {
    this.send('index');
  },

  test: function () {
    this.send('test');
  },

  "render-locals": function () {
    this.render({
      local: "render locals"
    });
  },

  "response-locals": function () {
    this.res.locals.local = "response locals";
    this.render();
  }
});

module.exports = TestController;
