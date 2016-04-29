# [facade.js](http://facadejs.com/) *0.3.0-beta.7*

>Drawing shapes, images and text in HTML5 canvas made easy.



## Facade([canvas, width, height]) 

Creates a new Facade.js object with either a preexisting canvas tag or a unique name, width, and height.




### Parameters

- **canvas** `Object` `String`  *Optional* Reference to an HTML canvas element or a unique name.
- **width** `Integer`  *Optional* Width of the canvas.
- **height** `Integer`  *Optional* Height of the canvas.



### Properties

- **canvas** `Object`   Reference to the canvas element.
- **context** `Object`   Reference to the <a href="https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D" target="_blank">CanvasRenderingContext2D</a> object.
- **dt** `Integer`   Current time in milliseconds since last canvas draw.
- **fps** `Integer`   Current frames per second.
- **ftime** `Integer`   Time of last canvas draw.



### Examples

```javascript
var stage = new Facade(document.querySelector('canvas'));
```
```javascript
var stage = new Facade('stage', 500, 300);
```


### Returns


- `Object`   New Facade.js object.




## Facade.addToStage(obj[, options]) 

Draws a Facade.js entity (or multiple entities) to the stage.




### Parameters

- **obj** `Object` `Array`   Facade.js entity or an array of entities.
- **options** `Object`  *Optional* Temporary options for rendering a Facade.js entity (or multiple entities).




### Examples

```javascript
stage.addToStage(circle);
```
```javascript
stage.addToStage(circle, { x: 100, y: 100 });
```


### Returns


- `Object`   Facade.js object.




## Facade.clear() 

Clears the canvas.






### Examples

```javascript
stage.clear();
```


### Returns


- `Object`   Facade.js object.




## Facade.draw(callback) 

Sets a callback function to run in a loop using <a href="https://developer.mozilla.org/en-US/docs/Web/API/window.requestAnimationFrame" target="_blank">requestAnimationFrame</a> or available polyfill.

```
stage.draw(function () {

    this.clear();

    this.addToStage(circle, { x: 100, y: 100 });

});
```


### Parameters

- **callback** `Function`   Function callback.




### Returns


- `Object`   Facade.js object.




## Facade.exportBase64([type, quality]) 

Exports a base64 encoded representation of the current rendered canvas.




### Parameters

- **type** `String`  *Optional* Image format: <code>image/png</code> (Default), <code>image/jpeg</code>, <code>image/webp</code> (Google Chrome Only)
- **quality** `Integer`  *Optional* Number between 0 and 100.




### Examples

```javascript
console.log(stage.exportBase64('image/png', 100));
```


### Returns


- `String`   Base64 encoded string.




## Facade.height([height]) 

Gets and sets the canvas height.




### Parameters

- **height** `Integer`  *Optional* Height in pixels.




### Examples

```javascript
console.log(stage.height()); // 300
```
```javascript
console.log(stage.height(600)); // 600
```


### Returns


- `Integer`   Height in pixels.




## Facade.renderWithContext(options[, callback]) 

Applies key-value pairs to appropriate <a href="https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D" target="_blank">CanvasRenderingContext2D</a> properties and methods.




### Parameters

- **options** `Object`   Object containing context property and/or method names with corresponding values.
- **callback** `Function`  *Optional* Function to be called when context options have been rendered to the canvas.




### Examples

```javascript
stage.renderWithContext({ fillStyle: '#f00', globalAlpha: 0.5, fillRect: [ 0, 0, 100, 100 ]});
```


### Returns


- `Void`   




## Facade.resizeForHDPI([ratio]) 

Resizes the canvas width and height to be multiplied by the pixel ratio of the device to allow for sub-pixel aliasing. Canvas tag maintains original width and height through CSS. Must be called before creating/adding any Facade entities as scaling is applied to the canvas context.




### Parameters

- **ratio** `Integer`  *Optional* Ratio to scale the canvas.




### Examples

```javascript
stage.resizeForHDPI();
```
```javascript
stage.resizeForHDPI(2);
```


### Returns


- `Object`   Facade.js object.




## Facade.start() 

Starts the callback supplied in <code>Facade.draw</code>.






### Examples

```javascript
stage.start();
```


### Returns


- `Object`   Facade.js object.




## Facade.stop() 

Stops the callback supplied in <code>Facade.draw</code>.






### Examples

```javascript
stage.stop();
```


### Returns


- `Object`   Facade.js object.




## Facade.width([width]) 

Gets and sets the canvas width.




### Parameters

- **width** `Integer`  *Optional* Width in pixels.




### Examples

```javascript
console.log(stage.width()); // 400
```
```javascript
console.log(stage.width(800)); // 800
```


### Returns


- `Integer`   Width in pixels.




## Facade._animate(time)  *private method*

Method called by <a href="https://developer.mozilla.org/en-US/docs/Web/API/window.requestAnimationFrame" target="_blank">requestAnimationFrame</a>. Sets <code>Facade.dt</code>, <code>Facade.fps</code> and  <code>Facade.ftime</code>.




### Parameters

- **time** `Integer`   <a href="https://developer.mozilla.org/en-US/docs/Web/API/DOMTimeStamp" target="_blank">DOMTimeStamp</a> or <a href="https://developer.mozilla.org/en-US/docs/Web/API/DOMHighResTimeStamp" target="_blank">DOMHighResTimeStamp</a> (Google Chrome Only)




### Examples

```javascript
this._requestAnimation = _requestAnimationFrame(this._animate.bind(this));
```


### Returns


- `Object`   Facade.js object.




## Facade.Entity() 

The constructor for all Facade.js shape, image and text objects.






### Returns


- `Object`   New Facade.Entity object.




## Facade.Entity._defaultOptions(updated)  *private method*

Returns a default set of options common to all Facade.js entities.




### Parameters

- **updated** `Object`   Additional options as key-value pairs.




### Examples

```javascript
console.log(Facade.Entity.prototype._defaultOptions());
```
```javascript
console.log(Facade.Entity.prototype._defaultOptions({ lineWidth: 0 }));
```


### Returns


- `Object`   Default set of options.




## Facade.Entity._defaultMetrics(updated)  *private method*

Returns a default set of metrics common to all Facade.js entities.




### Parameters

- **updated** `Object`   Additional metrics as key-value pairs.




### Examples

```javascript
console.log(Facade.Entity.prototype._defaultMetrics());
```
```javascript
console.log(Facade.Entity.prototype._defaultMetrics({ scale: null }));
```


### Returns


- `Object`   Default set of metrics.




## Facade.Entity._getAnchorPoint(options, metrics)  *private method*

Returns an array of the x and y anchor positions based on given options and metrics.




### Parameters

- **options** `Object`   Facade.Entity options.
- **metrics** `Object`   Facade.Entity metrics.




### Examples

```javascript
console.log(rect._getAnchorPoint(options, metrics));
```


### Returns


- `Array`   Array with the x and y anchor positions.




## Facade.Entity._getStrokeWidthOffset(options)  *private method*

Returns an integer for the stroke width offset. Used to calculate metrics.




### Parameters

- **options** `Object`   Facade.Entity options.




### Examples

```javascript
console.log(rect._getStrokeWidthOffset(options));
```


### Returns


- `Integer`   Integer representing the stroke width offset.




## Facade.Entity._applyTransforms(context, options, metrics)  *private method*

Applies transforms (translate, rotate and scale) to an entity.




### Parameters

- **context** `Object`   Reference to the <a href="https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D" target="_blank">CanvasRenderingContext2D</a> object.
- **options** `Object`   Facade.Entity options.
- **metrics** `Object`   Facade.Entity metrics.




### Examples

```javascript
console.log(rect._applyTransforms(context, options, metrics));
```


### Returns


- `Void`   




## Facade.Entity.getOption(key) 

Retrieves the value of a given option. Only retrieves options set when creating a new Facade.js entity or using <a href="#facade.entity.prototype.setoptions"><code>setOptions</code></a> not through temporary options set when using <a href="#facade.addtostage"><code>Facade.addToStage</code></a>.




### Parameters

- **key** `String`   The name of the option.




### Examples

```javascript
console.log(text.getOption('value'));
```


### Returns


- `Object` `Function` `String` `Integer`   Value of the option requested.




## Facade.Entity.getAllOptions() 

Retrieves the value of all options. Only retrieves options set when creating a new Facade.js entity or using <a href="#facade.entity.prototype.setoptions"><code>setOptions</code></a> not through temporary options set when using <a href="#facade.addtostage"><code>Facade.addToStage</code></a>.






### Examples

```javascript
console.log(text.getAllOptions());
```


### Returns


- `Object`   Object containing all options.




## Facade.Entity._setOption(key, value, test)  *private method*

Sets an option for a given entity.




### Parameters

- **key** `String`   The option to update.
- **value** `Object` `Function` `String` `Integer`   The new value of the specified option.
- **test** `Boolean`   Flag to determine if options are to be persisted in the entity or just returned.




### Examples

```javascript
console.log(text._setOption('value', 'Hello world!'));
```


### Returns


- `Object` `Function` `String` `Integer`   Returns value of the updated option.




## Facade.Entity.setOptions([updated, test]) 

Sets a group of options as key-value pairs to an entity.




### Parameters

- **updated** `Object`  *Optional* The options to update. Does not need to be entire set of options.
- **test** `Boolean`  *Optional* Flag to determine if options are to be persisted in the entity or just returned.




### Examples

```javascript
console.log(text.setOptions({ fontFamily: 'Georgia', fontSize: 20 }));
```


### Returns


- `Object`   Updated options.




## Facade.Entity.getMetric(key) 

Retrieves the value of a given metric. Only retrieves metrics set when creating a new Facade.js entity or using <a href="#facade.entity.prototype.setoptions"><code>setOptions</code></a> not through temporary options set when using <a href="#facade.addtostage"><code>Facade.addToStage</code></a>.




### Parameters

- **key** `String`   The name of the metric.




### Examples

```javascript
console.log(text.getMetric('width'));
```


### Returns


- `Integer`   Value of the metric requested.




## Facade.Entity.getAllMetrics() 

Retrieves the value of all metrics. Only retrieves metrics set when creating a new Facade.js entity or using <a href="#facade.entity.prototype.setoptions"><code>setOptions</code></a> not through temporary options set when using <a href="#facade.addtostage"><code>Facade.addToStage</code></a>.






### Examples

```javascript
console.log(text.getAllMetrics());
```


### Returns


- `Object`   Object containing all metrics.




## Facade.Entity.draw(facade, updated) 

Renders an entity to a canvas.




### Parameters

- **facade** `Object`   Facade.js object.
- **updated** `Object`   Temporary options for rendering a Facade.js entity.




### Examples

```javascript
entity.draw(stage);
```
```javascript
entity.draw(stage, { x: 100, y: 100 });
```


### Returns


- `Void`   




## Facade.Polygon([options]) 

Create a polygon object. Inherits all methods from <b>Facade.Entity</b>.

```
var polygon = new Facade.Polygon({
    x: 0,
    y: 0,
    points: [ [100, 0], [200, 100], [100, 200], [0, 100] ],
    lineWidth: 10,
    strokeStyle: '#333E4B',
    fillStyle: '#1C73A8',
    anchor: 'top/left'
});
```


### Parameters

- **options** `Object`  *Optional* Options to create the polygon with.
- **options.anchor** `String`  *Optional* Position to anchor the polygon. <i>Default:</i> "top/left"<br><ul><li>top/left</li><li>top/center</li><li>top/right</li><li>center/left</li><li>center</li><li>center/right</li><li>bottom/left</li><li>bottom/center</li><li>bottom/right</li></ul>
- **options.closePath** `Boolean`  *Optional* Boolean to determine if the polygon should be self closing or not. <i>Default:</i> true
- **options.fillStyle** `String`  *Optional* Fill color for the polygon. Can be a text representation of a color, HEX, RGB(a), HSL(a). <i>Default:</i> "#000"<br><ul><li>HTML Colors: red, green, blue, etc.</li><li>HEX: #f00, #ff0000</li><li>RGB(a): rgb(255, 0, 0), rgba(0, 255, 0, 0.5)</li><li>HSL(a): hsl(100, 100%, 50%), hsla(100, 100%, 50%, 0.5)</li></ul>
- **options.lineCap** `String`  *Optional* The style of line cap. <i>Default:</i> "butt"<br><ul><li>butt</li><li>round</li><li>square</li></ul>
- **options.lineJoin** `String`  *Optional* The style of line join. <i>Default:</i> "miter"<br><ul><li>miter</li><li>round</li><li>bevel</li></ul>
- **options.lineWidth** `Integer`  *Optional* Width of the stroke. <i>Default:</i> 0
- **options.opacity** `Integer`  *Optional* Opacity of the polygon. Integer between 0 and 100. <i>Default:</i> 100
- **options.points** `Array`  *Optional* Multi-dimensional array of points used to render a polygon. Point arrays with 2 values is rendered as a line, 5 values is rendered as an arc and 6 values is rendered as a bezier curve.
- **options.rotate** `Integer`  *Optional* Degrees to rotate the polygon. <i>Default:</i> 0
- **options.scale** `Integer`  *Optional* A float representing the scale of a polygon. <i>Default:</i> 1
- **options.strokeStyle** `String`  *Optional* Color of a polygon's stroke. Can be a text representation of a color, HEX, RGB(a), HSL(a). <i>Default:</i> "#000"<br><ul><li>HTML Colors: red, green, blue, etc.</li><li>HEX: #f00, #ff0000</li><li>RGB(a): rgb(255, 0, 0), rgba(0, 255, 0, 0.5)</li><li>HSL(a): hsl(100, 100%, 50%), hsla(100, 100%, 50%, 0.5)</li></ul>
- **options.x** `Integer`  *Optional* X coordinate to position the polygon. <i>Default:</i> 0
- **options.y** `Integer`  *Optional* Y coordinate to position the polygon. <i>Default:</i> 0




### Returns


- `Object`   New Facade.Polygon object.




## Facade.Polygon._defaultOptions(updated)  *private method*

Returns a default set of options common to all Facade.js polygon entities.




### Parameters

- **updated** `Object`   Additional options as key-value pairs.




### Examples

```javascript
console.log(Facade.Polygon.prototype._defaultOptions());
```


### Returns


- `Object`   Default set of options.




## Facade.Polygon._draw(facade, options, metrics)  *private method*

Renders a polygon entity to a canvas.




### Parameters

- **facade** `Object`   Facade.js object.
- **options** `Object`   Options used to render the polygon.
- **metrics** `Object`   Metrics used to render the polygon.




### Examples

```javascript
polygon._draw(facade, options, metrics);
```


### Returns


- `Void`   




## Facade.Polygon._configOptions(options)  *private method*

Custom configuration for options specific to a polygon entity.




### Parameters

- **options** `Object`   Complete set of polygon specific options.




### Examples

```javascript
console.log(polygon._configOptions(options));
```


### Returns


- `Object`   Converted options.




## Facade.Polygon._setMetrics([updated])  *private method*

Set metrics based on the polygon's options.




### Parameters

- **updated** `Object`  *Optional* Custom options used to render the polygon.




### Examples

```javascript
console.log(polygon._setMetrics());
```
```javascript
console.log(polygon._setMetrics(options));
```


### Returns


- `Object`   Object with metrics as key-value pairs.




## Facade.Circle([options]) 

Create a circle object. Inherits all methods from <b>Facade.Polygon</b>.

```
var circle = new Facade.Circle({
    x: 0,
    y: 0,
    radius: 100,
    lineWidth: 10,
    strokeStyle: '#333E4B',
    fillStyle: '#1C73A8',
    anchor: 'top/left'
});
```


### Parameters

- **options** `Object`  *Optional* Options to create the circle with.
- **options.anchor** `String`  *Optional* Position to anchor the circle. <i>Default:</i> "top/left"<br><ul><li>top/left</li><li>top/center</li><li>top/right</li><li>center/left</li><li>center</li><li>center/right</li><li>bottom/left</li><li>bottom/center</li><li>bottom/right</li></ul>
- **options.counterclockwise** `Boolean`  *Optional* Boolean determining if the circle will be drawn in a counter clockwise direction. <i>Default:</i> false
- **options.end** `Integer`  *Optional* Degree at which the circle ends. <i>Default:</i> 360
- **options.fillStyle** `String`  *Optional* Fill color for the circle. Can be a text representation of a color, HEX, RGB(a), HSL(a). <i>Default:</i> "#000"<br><ul><li>HTML Colors: red, green, blue, etc.</li><li>HEX: #f00, #ff0000</li><li>RGB(a): rgb(255, 0, 0), rgba(0, 255, 0, 0.5)</li><li>HSL(a): hsl(100, 100%, 50%), hsla(100, 100%, 50%, 0.5)</li></ul>
- **options.lineCap** `String`  *Optional* The style of line cap. <i>Default:</i> "butt"<br><ul><li>butt</li><li>round</li><li>square</li></ul>
- **options.lineJoin** `String`  *Optional* The style of line join. <i>Default:</i> "miter"<br><ul><li>miter</li><li>round</li><li>bevel</li></ul>
- **options.lineWidth** `Integer`  *Optional* Width of the stroke. <i>Default:</i> 0
- **options.opacity** `Integer`  *Optional* Opacity of the circle. Integer between 0 and 100. <i>Default:</i> 100
- **options.radius** `Integer`  *Optional* Radius of the circle. <i>Default:</i> 0
- **options.rotate** `Integer`  *Optional* Degrees to rotate the circle. <i>Default:</i> 0
- **options.scale** `Integer`  *Optional* A float representing the scale of a circle. <i>Default:</i> 1
- **options.start** `Integer`  *Optional* Degree at which the circle begins. <i>Default:</i> 0
- **options.strokeStyle** `String`  *Optional* Color of a circle's stroke. Can be a text representation of a color, HEX, RGB(a), HSL(a). <i>Default:</i> "#000"<br><ul><li>HTML Colors: red, green, blue, etc.</li><li>HEX: #f00, #ff0000</li><li>RGB(a): rgb(255, 0, 0), rgba(0, 255, 0, 0.5)</li><li>HSL(a): hsl(100, 100%, 50%), hsla(100, 100%, 50%, 0.5)</li></ul>
- **options.x** `Integer`  *Optional* X coordinate to position the circle. <i>Default:</i> 0
- **options.y** `Integer`  *Optional* Y coordinate to position the circle. <i>Default:</i> 0




### Returns


- `Object`   New Facade.Circle object.




## Facade.Circle._configOptions(options)  *private method*

Custom configuration for options specific to a circle entity.




### Parameters

- **options** `Object`   Complete set of circle specific options.




### Examples

```javascript
console.log(circle._configOptions(options));
```


### Returns


- `Object`   Converted options.




## Facade.Circle._getAnchorPoint(options, metrics)  *private method*

Returns an array of the x and y anchor positions based on given options and metrics.




### Parameters

- **options** `Object`   Facade.Circle options.
- **metrics** `Object`   Facade.Circle metrics.




### Examples

```javascript
console.log(circle._getAnchorPoint(options, metrics));
```


### Returns


- `Array`   Array with the x and y anchor positions.




## Facade.Circle._setMetrics([updated])  *private method*

Set metrics based on the circle's options.




### Parameters

- **updated** `Object`  *Optional* Custom options used to render the circle.




### Examples

```javascript
console.log(circle._setMetrics());
```
```javascript
console.log(circle._setMetrics(options));
```


### Returns


- `Object`   Object with metrics as key-value pairs.




## Facade.Line([options]) 

Create a line object. Inherits all methods from <b>Facade.Polygon</b>.

    var line = new Facade.Line({
        x: 0,
        y: 0,
        x1: 0,
        x2: 200,
        lineWidth: 10,
        strokeStyle: '#333E4B',
        anchor: 'top/left'
    });


### Parameters

- **options** `Object`  *Optional* Options to create the line with.
- **options.anchor** `String`  *Optional* Position to anchor the line. <i>Default:</i> "top/left"<br><ul><li>top/left</li><li>top/center</li><li>top/right</li><li>center/left</li><li>center</li><li>center/right</li><li>bottom/left</li><li>bottom/center</li><li>bottom/right</li></ul>
- **options.lineCap** `String`  *Optional* The style of line cap. <i>Default:</i> "butt"<br><ul><li>butt</li><li>round</li><li>square</li></ul>
- **options.lineWidth** `Integer`  *Optional* Width of the stroke. <i>Default:</i> 0
- **options.opacity** `Integer`  *Optional* Opacity of the line. Integer between 0 and 100. <i>Default:</i> 100
- **options.rotate** `Integer`  *Optional* Degrees to rotate the line. <i>Default:</i> 0
- **options.scale** `Integer`  *Optional* A float representing the scale of a line. <i>Default:</i> 1
- **options.strokeStyle** `String`  *Optional* Color of a line. Can be a text representation of a color, HEX, RGB(a), HSL(a). <i>Default:</i> "#000"<br><ul><li>HTML Colors: red, green, blue, etc.</li><li>HEX: #f00, #ff0000</li><li>RGB(a): rgb(255, 0, 0), rgba(0, 255, 0, 0.5)</li><li>HSL(a): hsl(100, 100%, 50%), hsla(100, 100%, 50%, 0.5)</li></ul>
- **options.x1** `Integer`  *Optional* X coordinate where line begins. <i>Default:</i> 0
- **options.x2** `Integer`  *Optional* X coordinate where line ends. <i>Default:</i> 0
- **options.x** `Integer`  *Optional* X coordinate to position the line. <i>Default:</i> 0
- **options.y1** `Integer`  *Optional* Y coordinate where line begins. <i>Default:</i> 0
- **options.y2** `Integer`  *Optional* Y coordinate where line ends. <i>Default:</i> 0
- **options.y** `Integer`  *Optional* Y coordinate to position the line. <i>Default:</i> 0




### Returns


- `Object`   New Facade.Line object.




## Facade.Line._configOptions(options)  *private method*

Custom configuration for options specific to a line entity.




### Parameters

- **options** `Object`   Complete set of line specific options.




### Examples

```javascript
console.log(line._configOptions(options));
```


### Returns


- `Object`   Converted options.




## Facade.Line._getAnchorPoint(options, metrics)  *private method*

Returns an array of the x and y anchor positions based on given options and metrics.




### Parameters

- **options** `Object`   Facade.Line options.
- **metrics** `Object`   Facade.Line metrics.




### Examples

```javascript
console.log(line._getAnchorPoint(options, metrics));
```


### Returns


- `Array`   Array with the x and y anchor positions.




## Facade.Rect([options]) 

Create a rectangle object. Inherits all methods from <b>Facade.Polygon</b>.

    var rect = new Facade.Rect({
        x: 0,
        y: 0,
        width: 200,
        height: 200,
        lineWidth: 10,
        strokeStyle: '#333E4B',
        fillStyle: '#1C73A8',
        anchor: 'top/left'
    });


### Parameters

- **options** `Object`  *Optional* Options to create the rectangle with.
- **options.anchor** `String`  *Optional* Position to anchor the rectangle. <i>Default:</i> "top/left"<br><ul><li>top/left</li><li>top/center</li><li>top/right</li><li>center/left</li><li>center</li><li>center/right</li><li>bottom/left</li><li>bottom/center</li><li>bottom/right</li></ul>
- **options.fillStyle** `String`  *Optional* Fill color for the rectangle. Can be a text representation of a color, HEX, RGB(a), HSL(a). <i>Default:</i> "#000"<br><ul><li>HTML Colors: red, green, blue, etc.</li><li>HEX: #f00, #ff0000</li><li>RGB(a): rgb(255, 0, 0), rgba(0, 255, 0, 0.5)</li><li>HSL(a): hsl(100, 100%, 50%), hsla(100, 100%, 50%, 0.5)</li></ul>
- **options.height** `Integer`  *Optional* Height of the rectangle. <i>Default:</i> 0
- **options.lineJoin** `String`  *Optional* The style of rectangle join. <i>Default:</i> "miter"<br><ul><li>miter</li><li>round</li><li>bevel</li></ul>
- **options.lineWidth** `Integer`  *Optional* Width of the stroke. <i>Default:</i> 0
- **options.opacity** `Integer`  *Optional* Opacity of the rectangle. Integer between 0 and 100. <i>Default:</i> 100
- **options.rotate** `Integer`  *Optional* Degrees to rotate the rectangle. <i>Default:</i> 0
- **options.scale** `Integer`  *Optional* A float representing the scale of a rectangle. <i>Default:</i> 1
- **options.strokeStyle** `String`  *Optional* Color of a rectangle's stroke. Can be a text representation of a color, HEX, RGB(a), HSL(a). <i>Default:</i> "#000"<br><ul><li>HTML Colors: red, green, blue, etc.</li><li>HEX: #f00, #ff0000</li><li>RGB(a): rgb(255, 0, 0), rgba(0, 255, 0, 0.5)</li><li>HSL(a): hsl(100, 100%, 50%), hsla(100, 100%, 50%, 0.5)</li></ul>
- **options.width** `Integer`  *Optional* Width of the rectangle. <i>Default:</i> 0
- **options.x** `Integer`  *Optional* X coordinate to position the rectangle. <i>Default:</i> 0
- **options.y** `Integer`  *Optional* Y coordinate to position the rectangle. <i>Default:</i> 0




### Returns


- `Object`   New Facade.Rect object.




## Facade.Rect._configOptions(options)  *private method*

Custom configuration for options specific to a rectangle entity.




### Parameters

- **options** `Object`   Complete set of rectangle specific options.




### Examples

```javascript
console.log(rect._configOptions(options));
```


### Returns


- `Object`   Converted options.




## Facade.Image(source[, options]) 

Create an image object. Inherits all methods from <b>Facade.Entity</b>.

    var image = new Facade.Image('images/sprite.png', {
        x: 0,
        y: 0,
        width: 100,
        height: 200,
        anchor: 'top/left'
    });


### Parameters

- **source** `Object` `String`   Local image file or reference to an HTML image element.
- **options** `Object`  *Optional* Options to create the image with.
- **options.anchor** `String`  *Optional* Position to anchor the image. <i>Default:</i> "top/left"<br><ul><li>top/left</li><li>top/center</li><li>top/right</li><li>center/left</li><li>center</li><li>center/right</li><li>bottom/left</li><li>bottom/center</li><li>bottom/right</li></ul>
- **options.callback** `Function`  *Optional* Function called for every frame of a sprite animation. <i>Default:</i> `function (frame) { };`
- **options.frames** `Array`  *Optional* Array of frame numbers (integers starting at 0) for sprite animation. <i>Default:</i> [0]
- **options.height** `Integer`  *Optional* Height of the image. <i>Default:</i> 0
- **options.loop** `Boolean`  *Optional* Determines if the animation should loop. <i>Default:</i> true
- **options.offsetX** `Integer`  *Optional* Starting X coordinate within the image. <i>Default:</i> 0
- **options.offsetY** `Integer`  *Optional* Starting Y coordinate within the image. <i>Default:</i> 0
- **options.rotate** `Integer`  *Optional* Degrees to rotate the image. <i>Default:</i> 0
- **options.scale** `Integer`  *Optional* A float representing the scale of an image. <i>Default:</i> 1
- **options.speed** `Integer`  *Optional* Speed of sprite animation. <i>Default:</i> 120
- **options.tileX** `Integer`  *Optional* Number of times to tile the image horizontally. <i>Default:</i> 1
- **options.tileY** `Integer`  *Optional* Number of times to tile the image vertically. <i>Default:</i> 1
- **options.width** `Integer`  *Optional* Width of the image. <i>Default:</i> 0
- **options.x** `Integer`  *Optional* X coordinate to position an image. <i>Default:</i> 0
- **options.y** `Integer`  *Optional* Y coordinate to position an image. <i>Default:</i> 0



### Properties

- **image** `Object`   Reference to the image element.
- **animating** `Boolean`   Boolean state of the animation.
- **currentFrame** `Integer`   Current frame of animation.



### Returns


- `Object`   New Facade.Image object.




## Facade.Image.load(source) 

Loads either a reference to an image tag or an image URL into a Facade.Image entity.




### Parameters

- **source** `Object` `String`   A reference to an image tag or an image URL.




### Examples

```javascript
console.log(image.load(document.querySelector('img')));
```
```javascript
console.log(image.load('images/sprite.png'));
```


### Returns


- `Void`   




## Facade.Image.play() 

Starts an image sprite animation.






### Examples

```javascript
image.play();
```


### Returns


- `Object`   Facade.js image object.




## Facade.Image.pause() 

Pauses an image sprite animation.






### Examples

```javascript
image.pause();
```


### Returns


- `Object`   Facade.js image object.




## Facade.Image.reset() 

Resets an image sprite animation to the first frame.






### Examples

```javascript
image.reset();
```


### Returns


- `Object`   Facade.js image object.




## Facade.Image.stop() 

Stops and resets an image sprite animation.






### Examples

```javascript
image.stop();
```


### Returns


- `Object`   Facade.js image object.




## Facade.Image._configOptions(options)  *private method*

Custom configuration for options specific to a image entity.




### Parameters

- **options** `Object`   Complete set of image specific options.




### Examples

```javascript
console.log(image._configOptions(options));
```


### Returns


- `Object`   Converted options.




## Facade.Image._setMetrics([updated])  *private method*

Set metrics based on the image's options.




### Parameters

- **updated** `Object`  *Optional* Custom options used to render the image.




### Examples

```javascript
console.log(image._setMetrics());
```
```javascript
console.log(image._setMetrics(updated));
```


### Returns


- `Object`   Object with metrics as key-value pairs.




## Facade.Image._draw(facade, options, metrics)  *private method*

Renders an image entity to a canvas.




### Parameters

- **facade** `Object`   Facade.js object.
- **options** `Object`   Options used to render the image.
- **metrics** `Object`   Metrics used to render the image.




### Examples

```javascript
image._draw(facade, options, metrics);
```


### Returns


- `Void`   




## Facade.Text([value, options]) 

Create a text object. Inherits all methods from <b>Facade.Entity</b>.

    var text = new Facade.Text('Hello World!', {
        x: 0,
        y: 0,
        fontFamily: 'Helvetica',
        fontSize: 40,
        fillStyle: '#333',
        anchor: 'top/left'
    });


### Parameters

- **value** `Object`  *Optional* Value of the text object.
- **options** `Object`  *Optional* Options to create the text entity with.
- **options.anchor** `String`  *Optional* Position to anchor the text object. <i>Default:</i> "top/left"<br><ul><li>top/left</li><li>top/center</li><li>top/right</li><li>center/left</li><li>center</li><li>center/right</li><li>bottom/left</li><li>bottom/center</li><li>bottom/right</li></ul>
- **options.fillStyle** `String`  *Optional* Fill color for the text object. Can be a text representation of a color, HEX, RGB(a), HSL(a). <i>Default:</i> "#000"<br><ul><li>HTML Colors: red, green, blue, etc.</li><li>HEX: #f00, #ff0000</li><li>RGB(a): rgb(255, 0, 0), rgba(0, 255, 0, 0.5)</li><li>HSL(a): hsl(100, 100%, 50%), hsla(100, 100%, 50%, 0.5)</li></ul>
- **options.fontFamily** `String`  *Optional* Sets the font family of the text. Only one font can be specified at a time. <i>Default:</i> "Arial"
- **options.fontSize** `Integer`  *Optional* Font size in pixels. <i>Default:</i> 30
- **options.fontStyle** `String`  *Optional* Font style of the text. <i>Default:</i> "normal"<br><ul><li>normal</li><li>bold</li><li>italic</li></ul>
- **options.lineHeight** `String`  *Optional* Line height of the text. <i>Default:</i> 1
- **options.lineWidth** `Integer`  *Optional* Width of the stroke. <i>Default:</i> 0
- **options.opacity** `Integer`  *Optional* Opacity of the text object. Integer between 0 and 100. <i>Default:</i> 100
- **options.rotate** `Integer`  *Optional* Degrees to rotate the text object. <i>Default:</i> 0
- **options.scale** `Integer`  *Optional* A float representing the scale of a text object. <i>Default:</i> 1
- **options.strokeStyle** `String`  *Optional* Color of a text object's stroke. Can be a text representation of a color, HEX, RGB(a), HSL(a). <i>Default:</i> "#000"<br><ul><li>HTML Colors: red, green, blue, etc.</li><li>HEX: #f00, #ff0000</li><li>RGB(a): rgb(255, 0, 0), rgba(0, 255, 0, 0.5)</li><li>HSL(a): hsl(100, 100%, 50%), hsla(100, 100%, 50%, 0.5)</li></ul>
- **options.textAlignment** `String`  *Optional* Horizontal alignment of the text. <i>Default:</i> "left"<br><ul><li>left</li><li>center</li><li>right</li></ul>
- **options.textBaseline** `String`  *Optional* Baseline to set the vertical alignment of the text drawn. <i>Default:</i> "top"<br><ul><li>top</li><li>hanging</li><li>middle</li><li>alphabetic</li><li>ideographic</li><li>bottom</li></ul>
- **options.width** `Integer`  *Optional* Max width of the text object. Will cause text to wrap onto a new line if necessary. No wrapping will occur if the value is set to 0. <i>Default:</i> 0
- **options.x** `Integer`  *Optional* X coordinate to position a text object. <i>Default:</i> 0
- **options.y** `Integer`  *Optional* Y coordinate to position a text object. <i>Default:</i> 0



### Properties

- **value** `String`   Current value of the text object.



### Returns


- `Object`   New Facade.Text object.




## Facade.Text.setText(value) 

Sets the text entities value.




### Parameters

- **value** `String`   The new value of the text entity.




### Examples

```javascript
console.log(text.setText('Lorem ipsum dolor sit amet'));
```


### Returns


- `Array`   An array of lines and the position to render using <a href="https://developer.mozilla.org/en-US/docs/Drawing_text_using_a_canvas#fillText()">fillText()</a> and <a href="https://developer.mozilla.org/en-US/docs/Drawing_text_using_a_canvas#strokeText()">strokeText()</a>.




## Facade.Text._draw(facade, options, metrics)  *private method*

Renders a text entity to a canvas.




### Parameters

- **facade** `Object`   Facade.js object.
- **options** `Object`   Options used to render the text entity.
- **metrics** `Object`   Metrics used to render the text entity.




### Examples

```javascript
text._draw(facade, options, metrics);
```


### Returns


- `Void`   




## Facade.Text._configOptions(options)  *private method*

Custom configuration for options specific to a text entity.




### Parameters

- **options** `Object`   Complete set of text specific options.




### Examples

```javascript
console.log(text._configOptions(options));
```


### Returns


- `Object`   Converted options.




## Facade.Text._setMetrics([updated])  *private method*

Set metrics based on the text's options.




### Parameters

- **updated** `Object`  *Optional* Custom options used to render the text entity.




### Examples

```javascript
console.log(text._setMetrics());
```
```javascript
console.log(text._setMetrics(updated));
```


### Returns


- `Object`   Object with metrics as key-value pairs.




## Facade.Group([options]) 

Create a group object. Inherits all methods from <b>Facade.Entity</b>.

    var group = new Facade.Group({ x: 100, y: 100 });

    group.addToGroup(polygon);
    group.addToGroup(circle);
    group.addToGroup(line);
    group.addToGroup(rect);


### Parameters

- **options** `Object`  *Optional* Options to create the group with.
- **options.anchor** `String`  *Optional* Position to anchor the group. <i>Default:</i> "top/left"<br><ul><li>top/left</li><li>top/center</li><li>top/right</li><li>center/left</li><li>center</li><li>center/right</li><li>bottom/left</li><li>bottom/center</li><li>bottom/right</li></ul>
- **options.rotate** `Integer`  *Optional* Degrees to rotate the group. <i>Default:</i> 0
- **options.scale** `Integer`  *Optional* A float representing the scale of a group. <i>Default:</i> 1
- **options.x** `Integer`  *Optional* X coordinate to position a group. <i>Default:</i> 0
- **options.y** `Integer`  *Optional* Y coordinate to position a group. <i>Default:</i> 0




### Returns


- `Object`   New Facade.Group object.




## Facade.Group._draw(facade, options, metrics)  *private method*

Renders a group of entities to a canvas.




### Parameters

- **facade** `Object`   Facade.js object.
- **options** `Object`   Options used to render the group.
- **metrics** `Object`   Metrics used to render the group.




### Examples

```javascript
group._draw(stage, options, metrics);
```


### Returns


- `Void`   




## Facade.Group._configOptions(options)  *private method*

Custom configuration for options specific to a group entity.




### Parameters

- **options** `Object`   Complete set of group specific options.




### Examples

```javascript
console.log(group._configOptions(options));
```


### Returns


- `Object`   Converted options.




## Facade.Group.addToGroup(obj) 

Adds a Facade.js entity to a group.




### Parameters

- **obj** `Object` `Array`   Facade.js entity or an array of entities.




### Examples

```javascript
group.addToGroup(circle);
```


### Returns


- `Void`   




## Facade.Group.hasEntity(obj) 

Tests the existence of an entity within a group.




### Parameters

- **obj** `Object`   Facade.js entity.




### Examples

```javascript
group.addToGroup(circle);
```


### Returns


- `Boolean`   Boolean result of the test.




## Facade.Group.removeFromGroup(obj) 

Removes a Facade.js entity from a group.




### Parameters

- **obj** `Object`   Facade.js entity.




### Examples

```javascript
group.removeFromGroup(circle);
```


### Returns


- `Void`   




## Facade.Group._setMetrics([updated])  *private method*

Set metrics based on the groups's entities and options.




### Parameters

- **updated** `Object`  *Optional* Custom options used to render the group.




### Examples

```javascript
console.log(group._setMetrics());
```
```javascript
console.log(group._setMetrics(updated));
```


### Returns


- `Object`   Object with metrics as key-value pairs.




*Documentation generated with [doxdox](https://github.com/neogeek/doxdox).*
