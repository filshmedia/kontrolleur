'use strict';

module.exports = function (map) {
  map.get('/', 'index#index');

  map.get('/view', 'index#view');
  map.get('/view2', 'index#view2');
  map.get('/view3', 'index#view3');
  map.get('/view3-500', 'index#view3error');

  map.get('/before/success', 'before#success');
  map.get('/before/fail', 'before#fail');

  map.get('/multiple-before', 'multiple_before#test');

  map.get('/json', 'json#jsontest');
  map.get('/json500', 'json#json500test');

  map.get('/helpers/application', 'helpers#application');
  map.get('/helpers/helpers', 'helpers#helpers');

  map.get('/missing-action', 'index#missing-action');

  map.controller('test');

  map.namespace('/api', function (map) {
    map.namespace('/v1', function (map) {
      map.get('/view', 'api/v1/index#view')
    });
  });
};

