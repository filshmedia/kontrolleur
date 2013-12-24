'use strict';

var utils = require('./utils');
var ControllerMixins = {
  /**
   * Renders the given view. If no view is given,
   * it automatically generates a view name from the
   * controller and action name.
   * @param  {String} view
   * @param  {Object} locals
   * @public
   */
  render: function (view, locals) {
    if (typeof view === 'object') {
      locals = view;
      view = this._buildTemplateName();
    } else {
      locals = locals || {};
      view = this._buildTemplateName(view);
    }

    this.res.status(locals.status || 200).render(view, locals);
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
