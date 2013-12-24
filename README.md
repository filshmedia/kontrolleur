kontrolleur
===========

`kontrolleur` provides better routing and controllers for express 3.x

### Installation

Inside your express project, do:

`$ npm install kontrolleur --save`

Then, instantiate `kontrolleur` like this:

```js
  var kontrolleur = require('kontrolleur');
  var express = require('express');
  var app = express();

  new kontrolleur(app, {
    routes: __dirname + '/routes',
    controllerPath: __dirname + '/controllers',
    controllerSuffix: '_controller'
  });

  app.listen(3030);
```

## Routes

Your routes file should export a function with one parameter, the map. The map has functions for all http methods. The first parameter defines the route, the second
defines the controller and action:

```js
module.exports = function (map) {
  map.get('/', 'index#index');
};
```

## Controllers

Your custom controllers should extend `kontrolleur.Controller` by using `Controller.extend()`. Each prototype function becomes a controller action in the end.

```js
var Controller = require('kontrolleur').Controller;
var IndexController = Controller.extend({
  index: function () {
    this.res.send('test response');
  }
});

module.exports = IndexController;
```

## License

The MIT License (MIT)

Copyright (c) 2013 Sascha Gehlich and FILSH Media GmbH

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.