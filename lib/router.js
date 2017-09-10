'use strict';

var path = require('path');
var Router = function (app, routes, options) {
  this.app = app;
  this.options = options;
  this.routes = routes;

  this._parseRoutes();
};

Router.prototype.verbs = ['get', 'post', 'head', 'put', 'delete', 'trace', 'options', 'connect'];

/**
 * Generates a map object that will be passed
 * to the method exported by the routes file
 * @private
 */
Router.prototype._parseRoutes = function() {
  var map = {};
  var self = this;
  var splitActionString, actions, routeOptions;

  // Prepare the map object that will be called
  // from the routes file
  this.verbs.forEach(function (verb) {
    map[verb] = function (route, actionString, options) {
      if (typeof options === 'undefined') options = {};

      // Parse the action string
      splitActionString = actionString.split('#');
      options.controller = splitActionString[0];
      options.action = splitActionString[1];

      self._registerRoute(verb, route, options);
    };
  });

  // Add a controller helper that simply finds all
  // available actions for the given controller and
  // automatically registers routes for it
  map.controller = function (controllerName, options) {
    if (typeof options === 'undefined') options = {};

    // Options defaults
    if (!options.method) options.method = 'get';
    if (!options.prefix) options.prefix = '/' + controllerName + '/';

    actions = self._getControllerActions(controllerName);
    actions.forEach(function (action) {
      routeOptions = {
        controller: controllerName,
        action: action
      };

      self._registerRoute(options.method, options.prefix + action, routeOptions);
    });
  };

  // Call the routes function with the map
  // we just generated
  this.routes(map);
};

/**
 * Register the route on our app which dispatches
 * an action on an controller
 * @param  {String} method
 * @param  {String} route
 * @param  {Object} options
 * @private
 */
Router.prototype._registerRoute = function(method, route, options) {
  var self = this;
  var controllerPath, ControllerClass, controller;

  this.app[method](route, function (req, res, next) {
    controllerPath = path.resolve(
      self.options.controllerPath,
      options.controller + self.options.controllerSuffix
    );
    ControllerClass = require(controllerPath);
    ControllerClass = ControllerClass.default || ControllerClass

    controller = new ControllerClass(self.app, self.options);
    controller.dispatch(req, res, next, options);
  });
};

Router.prototype._getControllerActions = function(controllerName) {
  var controllerPath = path.resolve(
    this.options.controllerPath,
    controllerName + this.options.controllerSuffix
  );
  var ControllerClass = require(controllerPath);
  ControllerClass = ControllerClass.default || ControllerClass
  var actions = [];
  var actionName;

  for (actionName in ControllerClass.prototype) {
    if (ControllerClass.prototype.hasOwnProperty(actionName) &&
      actionName !== 'constructor') {
        actions.push(actionName);
    }
  }

  return actions;
};

module.exports = Router;
