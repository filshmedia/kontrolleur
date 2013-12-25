'use strict';

module.exports = function (map) {
  map.get('/', 'index#index');

  map.get('/view', 'index#view');
  map.get('/view2', 'index#view2');
  map.get('/view3', 'index#view3');

  map.get('/before/success', 'before#success');
  map.get('/before/fail', 'before#fail');

  map.get('/json', 'json#jsontest');

  map.get('/helpers/application', 'helpers#application');
  map.get('/helpers/helpers', 'helpers#helpers');

  map.controller('test');

  map.get('/missing-action', 'index#missing-action');
};
