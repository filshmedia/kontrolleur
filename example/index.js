'use strict';

var kontrolleur = require('kontrolleur');
var express = require('express');
var app = express();

app.use(new kontrolleur({
  routes: __dirname + '/routes',
  controllerPath: __dirname + '/controllers',
  controllerSuffix: '_controller'
}));

app.listen(3030);
