'use strict';

var kontrolleur = require('../lib/');
var supertest = require('supertest');
var express = require('express');
var app;

before(function () {
  app = express();

  new kontrolleur(app, {
    routes: __dirname + '/routes.js',
    controllerPath: __dirname + '/controllers',
    controllerSuffix: '_controller'
  });

  app.listen(3030);
});

describe('kontrolleur', function () {
  describe('router', function () {
    it('should correctly read routes from the routes files', function () {
      app.routes.get.length.should.equal(2);
      app.routes.get[0].path.should.equal('/');
      app.routes.get[1].path.should.equal('/missing-action');
    });
  });

  describe('dispatcher', function () {
    it('should render an error if the action is missing', function (done) {
      supertest(app)
        .get('/missing-action')
        .expect(500)
        .end(done);
    });

    it('should correctly dispatch an action', function (done) {
      supertest(app)
        .get('/')
        .expect(200)
        .expect('test response')
        .end(done);
    });
  });
});
