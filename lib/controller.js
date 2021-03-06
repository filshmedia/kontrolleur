'use strict';

var async = require('async');
var ControllerMixins = require('./controller-mixins');
var Controller = function (app, options) {
  this._app = app;
  this._options = options;
  this._beforeFilters = [];
};

/**
 * Checks whether the action does exist, runs
 * the filters and finally calls the action
 * @param  {HTTP.ClientRequest} req
 * @param  {HTTP.ServerResponse} res
 * @param  {Object} options
 * @public
 */
Controller.prototype.dispatch = function(req, res, next, options) {
  var controller = options.controller;
  var action = options.action;
  var self = this;

  this.req = req;
  this.res = res;

  // We store the controller and action strings in
  // the request object for convenience
  this.req.controller = options.controller;
  this.req.action = action;

  // Throw an error and render a 500 error if the
  // action does not exist for this controller
  if (typeof this[action] !== 'function') {
    console.log('Controller "' + controller +
      '" has no action "' + action + '"');
    return this.res.send(500, 'Internal Server Error');
  }

  // Run before filters
  return Promise.resolve(this._runFilters('before', options))
    .then(() => self[action](next));
};

/**
 * Adds a new before filter
 * @param  {String} name
 * @param  {Function} filter
 * @param  {Object} options
 * @public
 */
Controller.prototype.beforeFilter = function(name, fn, options) {
  options = options || {};
  var filter = options;

  filter.name = name;
  filter.fn = fn;

  this._beforeFilters.push(filter);
};

/**
 * Run the filters of the given type that apply
 * to the action that is currently being dispatched
 * @param  {String}   which
 * @param  {Object}   options
 * @param  {Function} callback [description]
 * @returns {Promise}
 * @private
 */
Controller.prototype._runFilters = function(which, options) {
  var filters = this['_' + which + 'Filters'];
  var action = options.action;
  var self = this;
  var matchingFilters;

  if (filters) {
    matchingFilters = [];
    filters.forEach(function (filter) {
      // Do conditions avoid the execution of this filter?
      // `only` condition
      if (filter.only && filter.only.indexOf(action) === -1) {
        return;
      }

      // `except` condition
      if (filter.except && filter.except.indexOf(action) >= 0) {
        return;
      }

      var fn = filter.fn;
      matchingFilters.push(fn.apply(self, arguments));
    });

    // Run through the selected filters, finish
    // off with calling the callback
    return Promise.all(matchingFilters);
  } else {
    return Promise.resolve()
  }
};

// Add the controller mixins for rendering
for (var key in ControllerMixins) {
  Controller.prototype[key] = ControllerMixins[key];
}

module.exports = Controller;
