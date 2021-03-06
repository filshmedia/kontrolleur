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
    controllerSuffix: '_controller',
    helperPath: __dirname + '/helpers',
    helperSuffix: '_helper'
  });

  app.listen(3030);
});

describe('kontrolleur', function () {
  describe('router', function () {
    it('should correctly read routes from the routes files', function () {
      app.routes.get.length.should.be.above(0);
      app.routes.get[0].path.should.equal('/');
    });

    it('should correctly resolve map.controller directives', function () {
      var getRoutes = app.routes.get;
      getRoutes[getRoutes.length - 5].path.should.equal('/test/index');
      getRoutes[getRoutes.length - 4].path.should.equal('/test/test');
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

  describe('controllers', function () {
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

      it('should render the correct status code', function (done) {
        supertest(app)
          .get('/view3-500')
          .expect(500)
          .expect('view content 3')
          .end(done);
      });
    });

    describe('async actions', function () {
      describe('when throwing errors', function () {
        it('should render a 500 error', function (done) {
          supertest(app)
            .get('/async-error')
            .expect(500)
            .expect(/^Error: This is an error/i)
            .end(done);
        })
      })
    })

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

      it('should render the correct status code', function (done) {
        supertest(app)
          .get('/json500?jsoncallback=test')
          .expect('Content-Type', 'application/json')
          .expect(500)
          .expect('test({"hello":"world"})')
          .end(done);
      });
    });

    describe('before filters', function () {
      it('should not succeed', function (done) {
        supertest(app)
          .get('/before/fail')
          .expect(200)
          .expect('fail')
          .end(done);
      });

      it('should succeed', function (done) {
        supertest(app)
          .get('/before/success')
          .expect(200)
          .expect('ok')
          .end(done);
      });

      it('should run before filters in the right order', function (done) {
        supertest(app)
          .get('/multiple-before')
          .expect(200)
          .expect('ok')
          .end(done);
      });
    });

    describe('namespaces', function () {
      it('should correctly map routes and render view', function (done) {
        supertest(app)
          .get('/api/v1/view')
          .expect(200)
          .expect('nested namespace stuff')
          .end(done);
      })
    })

    describe('helpers', function () {
      it('should be able to use application helpers', function (done) {
        supertest(app)
          .get('/helpers/application')
          .expect(200)
          .expect('application helper generated content')
          .end(done);
      });

      it('should be able to use controller-specific helpers', function (done) {
        supertest(app)
          .get('/helpers/helpers')
          .expect(200)
          .expect('controller-specific helper generated content')
          .end(done);
      });
    });

    describe('locals', function () {
      it('should be able to access locals passed to the render method', function (done) {
        supertest(app)
          .get('/test/render-locals')
          .expect(200)
          .expect('render locals')
          .end(done);
      });

      it('should be able to access response locals when rendering', function (done) {
        supertest(app)
          .get('/test/response-locals')
          .expect(200)
          .expect('response locals')
          .end(done);
      });
    });
  });
});
