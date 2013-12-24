'use strict';

module.exports = function (map) {
  map.get('/', 'index#index');
  map.get('/missing-action', 'index#missing-action');
};
