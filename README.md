# Facade.js 0.3.0-beta

> Drawing shapes, images and text in HTML5 canvas made easy.

[![](https://api.travis-ci.org/facadejs/Facade.js.svg)](https://travis-ci.org/facadejs/Facade.js) [![](https://david-dm.org/facadejs/Facade.js/dev-status.svg)](https://david-dm.org/facadejs/Facade.js/#info=devDependencies)
[![Greenkeeper badge](https://badges.greenkeeper.io/facadejs/Facade.js.svg)](https://greenkeeper.io/)

## Demos

Editable demos are available at <http://play.facadejs.com/>.

## Documentation

The documentation for version 0.3.0-beta can be found at <http://docs.facadejs.com/0.3.0-beta/>.

## Getting Started

First include the Facade.js script (15kb minified, 3kb gzipped):

```html
<script src="facade.min.js"></script>
```

Then create a new Facade.js object using an existing canvas element or a unique ID.

```javascript
var stage = new Facade(document.querySelector('canvas'));
```

```javascript
var stage = new Facade('stage', 400, 300);
```

Then you can start creating and adding objects like rectangle, lines, circle, text and images.

```javascript
var stage = new Facade(document.querySelector('canvas')),
    rect = new Facade.Rect({ width: 100, height: 100, fillStyle: 'red' });

stage.addToStage(rect);
```

To make an animation place all draw logic within an callback function using `Facade.draw`.

```javascript
var stage = new Facade(document.querySelector('canvas')),
    rect = new Facade.Rect({ width: 100, height: 100, fillStyle: 'red' });

stage.draw(function () {

    this.clear();

    rect.setOptions({ x: '+=1' });

    this.addToStage(rect);

});
```

## Install

Facade.js can be installed using [bower](http://bower.io):

```bash
$ bower install facade.js
```

or with [npm](https://www.npmjs.org):

```bash
$ npm install facade.js
```

## Build

To build Facade.js first install dependencies.

```bash
$ npm install
```

Then run grunt.

```bash
$ grunt
```

More specifically if you would like to run each grunt command separately they are as follows:

```bash
$ grunt jslint # Runs jslint tests
$ grunt uglify # Uglifys facade.js and stores the result in facade.min.js
$ grunt shell:docs # Rebuild documentation
$ grunt shell:gzip # Gzip facade.min.js and stores the result in facade.min.js.gzip
```

## Run Tests

Tests are built in [casperjs](http://casperjs.org/) and validates the values used to render entities on the canvas.

```bash
$ npm test
```

## CDN

<http://cdn.facadejs.com/0.3.0-beta/facade.min.js>

## Browser Support

Facade.js works in Chrome 10+, Safari 6+, Firefox 4+, Opera 15+, and Internet Explorer 10+. By way of an additional [polyfill](https://gist.github.com/paulirish/1579671) for [requestAnimationFrame](https://developer.mozilla.org/en-US/docs/DOM/window.requestAnimationFrame) support can be added for Internet Explorer 9 and older versions of Safari, Firefox, and Opera.
