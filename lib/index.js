'use strict';

function kontrolleur(app, options) {
  this.app = app;

  // Default options
  if (typeof options === 'undefined') options = {};
  options.routes = options.routes || process.cwd() + '/routes.js';

  options.controllerPath = options.controllerPath || process.cwd() + '/controllers';
  options.controllerSuffix = options.controllerSuffix || '_controller';

  options.helperPath = options.helperPath || process.cwd() + '/helpers';
  options.helperSuffix = options.helperSuffix || '_helper';

  // Initialize the router
  var routes = require(options.routes);
  this.router = new kontrolleur.Router(this.app, routes, options);
}

kontrolleur.Controller = require('./controller');
kontrolleur.Router = require('./router');

var extend = function (prototypeProperties) {
  var parent = this;
  var Surrogate, name, child;

  // Create a new class
  if (prototypeProperties && prototypeProperties.hasOwnProperty('constructor')) {
    child = prototypeProperties.constructor;
  } else {
    child = function () {
      parent.apply(this, arguments);
    };
  }

  // Copy static properties
  for (name in parent) {
    child[name] = parent[name];
  }

  // Inherit from parent while avoiding
  // that the parent's constructor is called
  Surrogate = function () {
    this.constructor = child;
  };

  Surrogate.prototype = parent.prototype;
  child.prototype = new Surrogate();

  // Copy prototype properties
  for (name in prototypeProperties) {
    child.prototype[name] = prototypeProperties[name];
  }

  return child;
};

kontrolleur.Controller.extend = kontrolleur.Router.extend = extend;

module.exports = kontrolleur;
