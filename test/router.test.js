'use strict';

var kontrolleur = require('../lib/');
var supertest = require('supertest');
var express = require('express');
var app;

before(function () {
  app = express();
  app.set('view engine', 'jade');
  app.set('views', __dirname + '/views');

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
      app.routes.get.length.should.be.above(0);
      app.routes.get[0].path.should.equal('/');
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

  describe('controller', function () {
    it('should render views properly without view name given', function (done) {
      supertest(app)
        .get('/view')
        .expect(200)
        .expect('view content')
        .end(done);
    });

    it('should render views properly with controller and view name given', function (done) {
      supertest(app)
        .get('/view2')
        .expect(200)
        .expect('view content 2')
        .end(done);
    });

    it('should render views properly with only the view name given', function (done) {
      supertest(app)
        .get('/view3')
        .expect(200)
        .expect('view content 3')
        .end(done);
    });
  });
});
