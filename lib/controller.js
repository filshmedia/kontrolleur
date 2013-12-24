'use strict';

var async = require('async');
var Controller = function () {

};

/**
 * Checks whether the action does exist, runs
 * the filters and finally calls the action
 * @param  {HTTP.ClientRequest} req
 * @param  {HTTP.ServerResponse} res
 * @param  {Object} options
 * @public
 */
Controller.prototype.dispatch = function(req, res, options) {
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
  this._runFilters('before', options, function () {
    // Perform the action
    self[action]();
  });
};

/**
 * Run the filters of the given type that apply
 * to the action that is currently being dispatched
 * @param  {String}   which
 * @param  {Object}   options
 * @param  {Function} callback [description]
 * @private
 */
Controller.prototype._runFilters = function(which, options, callback) {
  var filters = this[which + 'Filters'];
  var action = options.action;
  var self = this;
  var matchingFilters, fn;

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

      fn = filter.filter;
      matchingFilters.push(function () {
        fn.apply(self, arguments);
      });
    });

    // Run through the selected filters, finish
    // off with calling the callback
    async.series(matchingFilters, callback);
  } else {
    callback();
  }
};

module.exports = Controller;
