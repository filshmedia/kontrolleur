'use strict';

var Kontrolleur = require('kontrolleur');
var express = require('express');
var app = express();

new Kontrolleur(app, {
  routes: __dirname + '/routes',

  controllerPath: __dirname + '/controllers',
  controllerSuffix: '_controller',

  helperPath: __dirname + '/helpers',
  helperSuffix: '_helper'
});

app.listen(3030);
