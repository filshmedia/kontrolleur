'use strict';

var Kontrolleur = require('kontrolleur');
var express = require('express');
var app = express();

new Kontrolleur(app, {
  routes: __dirname + '/routes',
  controllerPath: __dirname + '/controllers',
  controllerSuffix: '_controller'
});

app.listen(3030);
