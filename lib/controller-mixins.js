'use strict';

var utils = require('./utils');
var path = require('path');
var ControllerMixins = {
  /**
   * Sends a JSON(P) response
   * @param  {Object} value
   * @param  {Number} statusCode
   * @public
   */
  json: function (value, statusCode) {
    var json;
    if (!statusCode) statusCode = 200;

    try {
      json = JSON.stringify(value);
    } catch (e) {
      throw new Error('Unable to stringify response using JSON');
    }

    if (this.req.query.jsoncallback) {
      json = this.req.query.jsoncallback + '(' + json + ')';
    }

    this.res.writeHead(statusCode, { 'Content-Type': 'application/json' });
    this.res.end(json);
  },

  /**
   * If the value is text, it simply renders it.
   * If not, it tries to JSON.stringify it
   * @public
   */
  send: function (value, headers) {
    var response;

    if (typeof value === 'string') {
      response = value;
    } else {
      try {
        response = JSON.stringify(value);
      } catch (e) {
        throw new Error('Unable to stringify response using JSON');
      }
    }

    this.res.end(response, headers);
  },

  /**
   * Renders the given view. If no view is given,
   * it automatically generates a view name from the
   * controller and action name.
   * @param  {String} view
   * @param  {Object} customLocals
   * @param  {Number} statusCode
   * @public
   */
  render: function (view, locals, statusCode) {
    var helperPath, helper;
    var self = this;
    var locals;

    if (!statusCode) statusCode = 200;

    if (typeof view === 'object') {
      locals = view;
      view = this._buildTemplateName();
    } else {
      locals = locals || {};
      view = this._buildTemplateName(view);
    }

    // Extend helper functions to locals
    ['application', this.req.controller].forEach(function (controller) {
      helperPath = path.resolve(
        self._options.helperPath,
        controller + self._options.helperSuffix
      );
      try {
        helper = require(helperPath);

        for (var key in helper) {
          locals[key] = helper[key];
        }
      } catch (e) {
        if (e.code !== 'MODULE_NOT_FOUND') throw e;
      }
    });

    // Render the template
    this.res
      .status(statusCode)
      .render(view, locals);
  },

  /**
   * Generates a template name.
   * @param  {String} templateName
   * @return {String}
   * @private
   */
  _buildTemplateName: function (templateName) {
    if (!templateName) {
      // No view name given, generate one from controller and action name
      return this.req.controller + '/' + utils.underscored(this.req.action);
    } else {
      // View name given
      if (templateName.indexOf('/') === -1) {
        // No path given, prepend path
        templateName = this.req.controller + '/' + templateName;
      }

      return templateName;
    }
  }
};

module.exports = ControllerMixins;
