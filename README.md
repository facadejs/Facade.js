#Facade.js

>Drawing shapes, images and text in HTML5 canvas made easy.

## Getting Started

Using Facade.js is simple. Check out the code below for an example where you use Facade.js to create a new canvas tag, add it to the body, then draw a circle.

```html
<script src="facade.min.js"></script>
<script>

// Create a new Facade.js object.
var stage = new Facade('stage', 200, 200);

// Append the canvas tag to the body.
document.body.appendChild(stage.canvas);

// Create a new Circle object.
var circle = new Facade.Circle({ x: 100, y: 100, radius: 100, anchor: 'center' });

// Draw circle on the canvas.
stage.addToStage(circle);

</script>
```

## Facade

To create a new Facade.js object you can either start with a preexisting canvas tag or create a new one.

```html
<script src="facade.min.js"></script>
<script>

if (document.getElementById('stage')) {

	// Create a new Facade.js object.
	var stage = new Facade(document.getElementById('stage'));

} else {

	// Create a new Facade.js object. (Also created a new canvas tag.)
	var stage = new Facade('stage', 200, 200);

	// Append the new canvas tag to the body.
	document.body.appendChild(stage.canvas);

}

// Create a new Circle object.
var circle = new Facade.Circle({ x: 100, y: 100, radius: 100, anchor: 'center' });

// Draw circle on the canvas.
stage.addToStage(circle);

</script>
```

### Properties

#### Facade.canvas

Reference to the canvas element.

```javascript
document.body.appendChild(stage.canvas);
```

#### Facade.context

Reference to the canvas 2d context.

```javascript
console.log(stage.context);
```

#### Facade.dt

Current time in milliseconds since last canvas draw.

```javascript
console.log(stage.dt);
```

#### Facade.fps

Current frames per second.

```javascript
console.log(stage.fps);
```

#### Facade.ftime

Current time of last canvas draw.

```javascript
console.log(stage.ftime);
```

### Methods

#### Facade.addToStage(obj [, options]);

Draws a Facade object to the stage. Allows for temporary modification of drawn object's options.

```javascript
stage.addToStage(circle, { scale: 2 });
```

#### Facade.clear();

Clears the canvas.

```javascript
stage.clear();
```

#### Facade.draw(callback);

Sets a callback function to run in a loop using `requestAnimationFrame`.

```javascript
stage.draw(function () {

	this.clear();

	this.addToStage(circle, { x: 100, y: 100 });

});
```

#### Facade.exportBase64([type, quality]);

Exports a base64 encoded representation of the current rendered canvas.

Types:

- image/png (Default)
- image/jpeg
- image/webp (Google Chrome Only)

Quality is an integer between 1 and 100.

#### Facade.start();

Starts the callback supplied in `Facade.draw`.

#### Facade.stop();

Stops the callback supplied in `Facade.draw`.

## Facade.Circle

```javascript
var circle = new Facade.Circle([options]);
```

### Options

- [`x`](#x-integer) : X coordinate to begin drawing an object.
- [`y`](#y-integer) : Y coordinate to begin drawing an object.
- [`radius`](#radius-integer) : Radius of the circle.
- [`start`](#start-integer) : Degree at which the circle begins.
- [`end`](#end-integer) : Degree at which the circle ends.
- [`counterclockwise`](#counterclockwise-boolean) : Determines if the circle will be drawn in a counter clockwise direction.
- [`fillStyle`](#fillstyle-string) : Fill color for the object.
- [`strokeStyle`](#strokestyle-string) : Color of an object's stroke.
- [`strokePosition`](#strokeposition-string) : Position to draw the stroke.
- [`lineWidth`](#linewidth-integer) : Width of the stroke.
- [`shadowBlur`](#shadowblur-integer) : Blur level for drop shadow.
- [`shadowColor`](#shadowcolor-string) : Color of drop shadow.
- [`shadowOffsetX`](#shadowoffsetx-integer) : X offset of drop shadow.
- [`shadowOffsetY`](#shadowoffsety-integer) : Y offset of drop shadow.
- [`anchor`](#anchor-string) : Anchor to draw the circle from.
- [`opacity`](#opacity-integer) : Opacity of the circle.
- [`flip`](#flip-string) : Direction to flip the circle.
- [`rotate`](#rotate-integer) : Degrees to rotate the circle.
- [`scale`](#scale-integer) : Scale of the circle.

### Methods

#### Facade.Circle.getOption(key);

Retrieves the value for a specific option.

```javascript
console.log(circle.getOption('radius'));
```

#### Facade.Circle.getAllOptions();

Return all options.

```javascript
console.log(circle.getAllOptions());
```

#### Facade.Circle.setOptions([options]);

Sets options.

```javascript
circle.setOptions({ x: 100, y: 100 });
```

#### Facade.Circle.isVisible(canvas);

Returns a boolean based on the position of the object within the given canvas.

```javascript
console.log(circle.isVisible(stage.canvas));
```

## Facade.Image

```javascript
var image = new Facade.Image(source, [options]);
```

**Note:** Images must first be loaded before being drawn to the canvas. Because of this it is best to wrap the `addToStage` call in a callback function set through `Facade.draw`.

### Options

- [`x`](#x-integer) : X coordinate to begin drawing an object.
- [`y`](#y-integer) : Y coordinate to begin drawing an object.
- [`width`](#width-integer) : Width of the object.
- [`height`](#height-integer) : Height of the object.
- [`offsetX`](#offsetx-integer) : X coordinate within the image where rendering begins.
- [`offsetY`](#offsety-integer) : Y coordinate within the image where rendering begins.
- [`tileX`](#tilex-integer) : Number of times to tile the image horizontally.
- [`tileY`](#tiley-integer) : Number of times to tile the image vertically.
- [`frame`](#frame-array) : Array of frames for sprite animation.
- [`speed`](#speed-integer) : Speed of sprite animation.
- [`loop`](#loop-boolean) : Determines if the animation should loop.
- [`callback`](#callback-function) : Function called for every frame of a sprite animation.
- [`shadowBlur`](#shadowblur-integer) : Blur level for drop shadow.
- [`shadowColor`](#shadowcolor-string) : Color of drop shadow.
- [`shadowOffsetX`](#shadowoffsetx-integer) : X offset of drop shadow.
- [`shadowOffsetY`](#shadowoffsety-integer) : Y offset of drop shadow.
- [`anchor`](#anchor-string) : Anchor to draw the image from.
- [`opacity`](#opacity-integer) : Opacity of the image.
- [`flip`](#flip-string) : Direction to flip the image.
- [`rotate`](#rotate-integer) : Degrees to rotate the image.
- [`scale`](#scale-integer) : Scale of the image.

### Properties

- `image` : Reference to the image element.
- `currentFrame` : Current frame of animation.
- `isAnimating` : If the sprite is animating.

### Methods

#### Facade.Image.getOption(key);

Retrieves the value for a specific option.

```javascript
console.log(image.getOption('radius'));
```

#### Facade.Image.getAllOptions();

Return all options.

```javascript
console.log(image.getAllOptions());
```

#### Facade.Image.setOptions([options]);

Sets options.

```javascript
image.setOptions({ x: 100, y: 100 });
```

#### Facade.Image.isVisible(canvas);

Returns a boolean based on the position of the object within the given canvas.

```javascript
console.log(image.isVisible(stage.canvas));
```

#### Facade.Image.play();

Starts a sprite animation.

```javascript
console.log(image.play());
```

#### Facade.Image.pause();

Pauses a sprite animation.

```javascript
console.log(image.pause());
```

#### Facade.Image.reset();

Resets a sprite animation.

```javascript
console.log(image.reset());
```

#### Facade.Image.stop();

Stops and resets a sprite animation.

```javascript
console.log(image.stop());
```

## Facade.Line

```javascript
var line = new Facade.Line([options]);
```

### Options

- [`x`](#x-integer) : X coordinate to begin drawing an object.
- [`y`](#y-integer) : Y coordinate to begin drawing an object.
- [`startX`](#startx-integer) : X coordinate where line starts.
- [`startY`](#starty-integer) : Y coordinate where line starts.
- [`endX`](#endx-integer) : X coordinate where line ends.
- [`endY`](#endy-integer) : Y coordinate where line ends.
- [`strokeStyle`](#strokestyle-string) : Color of an object's stroke.
- [`lineWidth`](#linewidth-integer) :Width of the stroke.
- [`lineCap`](#linecap-string) : The style of line cap (end of line).
- [`shadowBlur`](#shadowblur-integer) : Blur level for drop shadow.
- [`shadowColor`](#shadowcolor-string) : Color of drop shadow.
- [`shadowOffsetX`](#shadowoffsetx-integer) : X offset of drop shadow.
- [`shadowOffsetY`](#shadowoffsety-integer) : Y offset of drop shadow.
- [`anchor`](#anchor-string) : Anchor to draw the line from.
- [`opacity`](#opacity-integer) : Opacity of the line.
- [`flip`](#flip-string) : Direction to flip the line.
- [`rotate`](#rotate-integer) : Degrees to rotate the line.
- [`scale`](#scale-integer) : Scale of the line.

### Methods

#### Facade.Line.getOption(key);

Retrieves the value for a specific option.

```javascript
console.log(line.getOption('radius'));
```

#### Facade.Line.getAllOptions();

Return all options.

```javascript
console.log(line.getAllOptions());
```

#### Facade.Line.setOptions([options]);

Sets options.

```javascript
line.setOptions({ x: 100, y: 100 });
```

#### Facade.Line.isVisible(canvas);

Returns a boolean based on the position of the object within the given canvas.

```javascript
console.log(line.isVisible(stage.canvas));
```

## Facade.Rect

```javascript
var rect = new Facade.Rect([options]);
```

### Options

- [`x`](#x-integer) : X coordinate to begin drawing an object.
- [`y`](#y-integer) : Y coordinate to begin drawing an object.
- [`width`](#width-integer) : Width of the object.
- [`height`](#height-integer) : Height of the object.
- [`fillStyle`](#fillstyle-string) : Fill color for the object.
- [`strokeStyle`](#strokestyle-string) : Color of an object's stroke.
- [`strokePosition`](#strokeposition-string) : Position to draw the stroke.
- [`lineWidth`](#linewidth-integer) : Width of the stroke
- [`borderRadius`](#borderradius-integer) : Radius of the rectangle's corners.
- [`shadowBlur`](#shadowblur-integer) : Blur level for drop shadow.
- [`shadowColor`](#shadowcolor-string) : Color of drop shadow.
- [`shadowOffsetX`](#shadowoffsetx-integer) : X offset of drop shadow.
- [`shadowOffsetY`](#shadowoffsety-integer) : Y offset of drop shadow.
- [`anchor`](#anchor-string) : Anchor to draw the rectangle from.
- [`opacity`](#opacity-integer) : Opacity of the rectangle.
- [`flip`](#flip-string) : Direction to flip the rectangle.
- [`rotate`](#rotate-integer) : Degrees to rotate the rectangle.
- [`scale`](#scale-integer) : Scale of the rectangle.

### Methods

#### Facade.Rect.getOption(key);

Retrieves the value for a specific option.

```javascript
console.log(rect.getOption('radius'));
```

#### Facade.Rect.getAllOptions();

Return all options.

```javascript
console.log(rect.getAllOptions());
```

#### Facade.Rect.setOptions([options]);

Sets options.

```javascript
rect.setOptions({ x: 100, y: 100 });
```

#### Facade.Rect.isVisible(canvas);

Returns a boolean based on the position of the object within the given canvas.

```javascript
console.log(rect.isVisible(stage.canvas));
```

## Facade.Text

```javascript
var text = new Facade.Text([options]);
```

### Options

- [`x`](#x-integer) : X coordinate to begin drawing an object.
- [`y`](#y-integer) : Y coordinate to begin drawing an object.
- [`width`](#width-integer) : Width of the object.
- [`value`](#value-string) : Value of the text object.
- [`fontFamily`](#fontfamily-string) : Sets the font family of the text.
- [`fontSize`](#fontsize-integer) : Font size in pixels.
- [`fontStyle`](#fontstyle-string) : Font style of the text.
- [`lineHeight`](#lineheight-integer) : Line height of the text drawn on multiple lines.
- [`textAlign`](#textalign-string) : Horizontal alignment of the text.
- [`textBaseline`](#textbaseline-string) : Baseline to set the vertical alignment of the text drawn.
- [`fillStyle`](#fillstyle-string) : Fill color for the object.
- [`strokeStyle`](#strokestyle-string) : Color of an object's stroke.
- [`lineWidth`](#linewidth-integer) : Width of the stroke.
- [`shadowBlur`](#shadowblur-integer) : Blur level for drop shadow.
- [`shadowColor`](#shadowcolor-string) : Color of drop shadow.
- [`shadowOffsetX`](#shadowoffsetx-integer) : X offset of drop shadow.
- [`shadowOffsetY`](#shadowoffsety-integer) : Y offset of drop shadow.
- [`anchor`](#anchor-string) : Anchor to draw the text from.
- [`opacity`](#opacity-integer) : Opacity of the text.
- [`flip`](#flip-string) : Direction to flip the text.
- [`rotate`](#rotate-integer) : Degrees to rotate the text.
- [`scale`](#scale-integer) : Scale of the text.

### Methods

#### Facade.Text.getOption(key);

Retrieves the value for a specific option.

```javascript
console.log(text.getOption('radius'));
```

#### Facade.Text.getAllOptions();

Return all options.

```javascript
console.log(text.getAllOptions());
```

#### Facade.Text.setOptions([options]);

Sets options.

```javascript
text.setOptions({ x: 100, y: 100 });
```

#### Facade.Text.isVisible(canvas);

Returns a boolean based on the position of the object within the given canvas.

```javascript
console.log(text.isVisible(stage.canvas));
```

## Options

### anchor _(String)_

_Default: `top/right`_

Position to anchor the object.

- center
- center/right
- bottom/right
- bottom/center
- bottom/left
- center/left
- top/left
- top/center
- top/right

### borderRadius _(Integer)_

_Default: `0`_

Radius of the rectangle's corners.

### callback _(Function)_

_Default: `function (frame) { }`_

Function called for every frame of a sprite animation. Parameter passed to callback is the value of the current frame.

### counterclockwise _(Boolean)_

_Default: `false`_

Determines if the circle will be drawn in a counter clockwise direction.

### endX _(Integer)_

_Default: `0`_

X coordinate where line ends.

### endY _(Integer)_

_Default: `0`_

Y coordinate where line ends.

### end _(Integer)_

_Default: `360`_

Degree at which the circle ends.

### flip _(String)_

_Default: `""`_

Direction to flip the object. Can be either one or both of the following options. Delimited by a `/`.

- `horizontal`
- `vertical`

### fillStyle _(String)_

_Default: `#000`_

Fill color for the object. Can be a text representation of a color, a HEX value or RBG(A).

- `red`
- `#F00`
- `rgb(255, 0, 0);`
- `rgba(255, 0, 0, 1);`

### fontFamily _(String)_

_Default: `Arial`_

Sets the font family of the text. Only one font can be specified at a time.

### fontSize _(Integer)_

_Default: `30`_

Font size in pixels.

### fontStyle _(String)_

_Default: `normal`_

Font style of the text.

- `normal`
- `bold`
- `italic`

### frame _(Array)_

_Default: `[]`_

Array of frames for sprite animation.

- [1, 2, 3, 4, 5, 6, 7]
- [1, 2, 3, 4, 3, 2, 1]

### height _(Integer)_

_Default (Image): `null`_
_Default (Rect): `100`_

Height of the object. If an image, can be used to crop the visible area of the loaded image.

### lineCap _(String)_

_Default: `butt`_

The style of line cap (end of line).

- butt
- round
- square

### lineHeight _(Integer)_

_Default: `null`_

Line height of the text drawn on multiple lines. New lines are delimited with `\n`.

### lineWidth _(Integer)_

_Default: `0`_

Width of the stroke.

### loop _(Boolean)_

_Default: `true`_

Determines if the animation should loop.

### offsetX _(Integer)_

_Default: `0`_

X coordinate within the image where rendering begins.

### offsetY _(Integer)_

_Default: `0`_

Y coordinate within the image where rendering begins.

### opacity _(Integer)_

_Default: `100`_

Opacity of the object. Integer between 0 and 100.

### radius _(Integer)_

_Default: `10`_

Radius of the circle.

### rotate _(Integer)_

_Default: `0`_

Degrees to rotate the object.

### scale _(Integer)_

_Default: `1`_

Scaling of the object. A float starting at 1.

### shadowBlur _(Integer)_

_Default: `0`_

Blur level for drop shadow.

### shadowColor _(String)_

_Default: `#000`_

Color of drop shadow. Can be a text representation of a color, a HEX value or RBG(A).

- `red`
- `#F00`
- `rgb(255, 0, 0);`
- `rgba(255, 0, 0, 1);`

### shadowOffsetX _(Integer)_

_Default: `0`_

X offset of drop shadow.

### shadowOffsetY _(Integer)_

_Default: `0`_

Y offset of drop shadow.

### speed _(Integer)_

_Default: `120`_

Speed of sprite animation.

### start _(Integer)_

_Default: `0`_

Degree at which the circle begins.

### startX _(Integer)_

_Default: `100`_

X coordinate where line starts.

### startY _(Integer)_

_Default: `0`_

Y coordinate where line starts.

### strokePosition _(String)_

_Default: `default`_

Position to draw the stroke. Works for circles and rectangles without a radius.

- default
- inset
- outset

### strokeStyle _(String)_

_Default: `#000`_

Color of an object's stroke. Can be a text representation of a color, a HEX value or RBG(A).

- `red`
- `#F00`
- `rgb(255, 0, 0);`
- `rgba(255, 0, 0, 1);`

### textAlign _(String)_

_Default: `left`_

Horizontal alignment of the text.

- left
- center
- right

### textBaseline _(String)_

_Default: `top`_

Baseline to set the vertical alignment of the text drawn.

- top
- hanging
- middle
- alphabetic
- ideographic
- bottom

### tileX _(Integer)_

_Default: `1`_

Number of times to tile the image horizontally.

### tileY _(Integer)_

_Default: `1`_

Number of times to tile the image vertically.

### value _(String)_

_Default: `(empty)`_

Value of the text object.

### width _(Integer)_

_Default (Image): `null`_
_Default (Rect): `100`_

Width of the object. If an image, can be used to crop the visible area of the image.

### x _(Integer)_

_Default: `0`_

X coordinate to begin drawing an object.

### y _(Integer)_

_Default: `0`_

Y coordinate to begin drawing an object.

## Browser Support

Currently Facade.js works in Chrome 10+, Safari 6+, Firefox 4+ and Internet Explorer 10. By way of an additional [polyfill](https://gist.github.com/paulirish/1579671) for [requestAnimationFrame](https://developer.mozilla.org/en-US/docs/DOM/window.requestAnimationFrame) support can be added for Opera, Internet Explorer 9 and older versions of both Safari and Firefox.

## Build

### Minify

[UglifyJS2](https://github.com/mishoo/UglifyJS2) is used to minify Facade.js. The below command and corresponding flags should be used.

```shell
uglifyjs facade.js -o facade.min.js --mangle --comments all
```