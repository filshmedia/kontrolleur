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
    describe('plain text rendering', function () {
      it('should properly render plain text', function (done) {
        supertest(app)
          .get('/')
          .expect(200)
          .expect('test response')
          .end(done);
      });
    });

    describe('view rendering', function () {
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

    describe('json rendering', function () {
      it('should render json with the right content type', function (done) {
        supertest(app)
          .get('/json')
          .expect('Content-Type', 'application/json')
          .expect(200)
          .expect('{"hello":"world"}')
          .end(done);
      });

      it('should render jsonp with a callback', function (done) {
        supertest(app)
          .get('/json?jsoncallback=test')
          .expect('Content-Type', 'application/json')
          .expect(200)
          .expect('test({"hello":"world"})')
          .end(done);
      });
    });
  });
});
