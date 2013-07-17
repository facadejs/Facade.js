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

## Usage

### Facade

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

Reference to the canvas' 2d context.

```javascript
console.log(stage.context);
```

#### Facade.fps

Current frames per second.

```javascript
console.log(stage.fps);
```

#### Facade.ftime

Current time in milliseconds since last canvas draw.

```javascript
console.log(stage.ftime);
```

### Methods

#### Facade.addToStage(obj [, options]);

Adds a Facade object to the stage. Also allows for temporary modification of that object's options.

```javascript
stage.addToStage(circle, { scale: 2 });
```

#### Facade.clear();

Clears the canvas.

```javascript
stage.clear();
```

#### Facade.draw(callback);

Sets a function to run in an endless loop using `requestAnimateFrame`.

```javascript
stage.draw(function () {

	this.clear();

	this.addToStage(circle, { x: 100, y: 100 });

});
```

#### Facade.exportBase64([type, quality]);

Exports a base64 encoded string in the type (options) and quality specified. The types of image exports are as follows:

- image/png
- image/jpeg

Quality is an float between 0 and 1.

#### Facade.start();

Starts the callback specified in `Facade.draw`.

#### Facade.stop();

Stops the callback specified in `Facade.draw`.

### Facade.Circle

```javascript
new Facade.Circle([options]);
```

#### Options

- [`x`](#x-integer) : X coordinate.
- [`y`](#y-integer) : Y coordinate.
- [`radius`](#radius-integer) : Radius of the circle.
- [`start`](#start-integer) : Degree at which the circle begins.
- [`end`](#end-integer) : Degree at which the circle ends.
- [`counterclockwise`](#counterclockwise-boolean) : Draw the circle in a counter clockwise direction.
- [`fillStyle`](#fillstyle-string) : Color of the circle.
- [`strokeStyle`](#strokestyle-string) : Color of the stroke on the circle.
- [`strokePosition`](#strokeposition-string) : Position of the stroke on the circle.
- [`lineWidth`](#linewidth-integer) : Width of the stroke.
- [`shadowBlur`](#shadowblur-integer) : Blur level for drop shadow.
- [`shadowColor`](#shadowcolor-string) : Color of drop shadow.
- [`shadowOffsetX`](#shadowoffsetx-integer) : X offset of drop shadow.
- [`shadowOffsetY`](#shadowoffsety-integer) : Y offset of drop shadow.
- [`anchor`](#anchor-string) : Anchor to draw the circle from.
- [`opacity`](#opacity-integer) : Opacity of the circle.
- [`rotate`](#rotate-integer) : Degrees to rotate the circle.
- [`scale`](#scale-integer) : Scale of the circle.

#### Methods

```javascript
Facade.Circle.setOptions([options]);
```

### Facade.Image

```javascript
new Facade.Image(file, [options]);
```

**Note:** Images must first be loaded before being drawn to the canvas. Because of this it is best to wrap the `addToStage` call in a function set through `Facade.draw`.

#### Options

- [`x`](#x-integer) : X coordinate.
- [`y`](#y-integer) : Y coordinate.
- [`width`](#width-integer) : Width of the image. Can be used to crop the visible area of the image.
- [`height`](#height-integer) : Height of the image. Can be used to crop the visible area of the image.
- [`offsetX`](#offsetx-integer) : X coordinate within the image to begin drawing image.
- [`offsetY`](#offsety-integer) : Y coordinate within the image to begin drawing image.
- [`tileX`](#tilex-integer) : Number of times to tile the image horizontally.
- [`tileY`](#tiley-integer) : Number of times to tile the image vertically.
- [`frame`](#frame-array) : Array of frames for sprite animation.
- [`speed`](#speed-integer) : Speed of sprite animation.
- [`loop`](#loop-boolean) : Loop the sprite animation.
- [`shadowBlur`](#shadowblur-integer) : Blur level for drop shadow.
- [`shadowColor`](#shadowcolor-string) : Color of drop shadow.
- [`shadowOffsetX`](#shadowoffsetx-integer) : X offset of drop shadow.
- [`shadowOffsetY`](#shadowoffsety-integer) : Y offset of drop shadow.
- [`anchor`](#anchor-string) : Anchor to draw the image from.
- [`opacity`](#opacity-integer) : Opacity of the image.
- [`rotate`](#rotate-integer) : Degrees to rotate the image.
- [`scale`](#scale-integer) : Scale of the image.

#### Properties

- `frame` : Current frame of animation.
- `ftime` : Last `Date.now()` frame animation incremented.
- `isLoaded` : Returns true if the image has finished loaded.
- `size.width` : Width of the image. Calculated after image has finished loading.
- `size.height` : Height of the image. Calculated after image has finished loading.
- `elem` : Reference to the image element.

#### Methods

```javascript
Facade.Image.setOptions([options]);
```

### Facade.Line

```javascript
new Facade.Line([options]);
```

#### Options

- [`x`](#x-integer) : X coordinate.
- [`y`](#y-integer) : Y coordinate.
- [`startX`](#startx-integer) : Start x position.
- [`startY`](#starty-integer) : Start y position.
- [`endX`](#endx-integer) : End x position.
- [`endY`](#endy-integer) : End y position.
- [`strokeStyle`](#strokestyle-string) : Color of the line.
- [`lineWidth`](#linewidth-integer) : Width of the line.
- [`lineCap`](#linecap-string) : Cap style on the line.
- [`shadowBlur`](#shadowblur-integer) : Blur level for drop shadow.
- [`shadowColor`](#shadowcolor-string) : Color of drop shadow.
- [`shadowOffsetX`](#shadowoffsetx-integer) : X offset of drop shadow.
- [`shadowOffsetY`](#shadowoffsety-integer) : Y offset of drop shadow.
- [`anchor`](#anchor-string) : Anchor to draw the line from.
- [`opacity`](#opacity-integer) : Opacity of the line.
- [`rotate`](#rotate-integer) : Degrees to rotate the line.
- [`scale`](#scale-integer) : Scale of the line.

#### Methods

```javascript
Facade.Line.setOptions([options]);
```

### Facade.Rect

```javascript
new Facade.Rect([options]);
```

#### Options

- [`x`](#x-integer) : X coordinate.
- [`y`](#y-integer) : Y coordinate.
- [`width`](#width-integer) : Width of the rectangle.
- [`height`](#height-integer) : Height of the rectangle.
- [`fillStyle`](#fillstyle-string) : Color of the rectangle.
- [`strokeStyle`](#strokestyle-string) : Color of the stroke on the rectangle.
- [`strokePosition`](#strokeposition-string) : Position of the stroke on the rectangle.
- [`lineWidth`](#linewidth-integer) : Width of the stroke.
- [`borderRadius`](#borderradius-integer) : Border radius of the rectangle.
- [`shadowBlur`](#shadowblur-integer) : Blur level for drop shadow.
- [`shadowColor`](#shadowcolor-string) : Color of drop shadow.
- [`shadowOffsetX`](#shadowoffsetx-integer) : X offset of drop shadow.
- [`shadowOffsetY`](#shadowoffsety-integer) : Y offset of drop shadow.
- [`anchor`](#anchor-string) : Anchor to draw the rectangle from.
- [`opacity`](#opacity-integer) : Opacity of the rectangle.
- [`rotate`](#rotate-integer) : Degrees to rotate the rectangle.
- [`scale`](#scale-integer) : Scale of the rectangle.

#### Methods

```javascript
Facade.Rect.setOptions([options]);
```

### Facade.Text

```javascript
new Facade.Text([options]);
```

#### Options

- [`x`](#x-integer) : X coordinate.
- [`y`](#y-integer) : Y coordinate.
- [`value`](#value-string) : Value of the text object.
- [`fontFamily`](#fontfamily-string) : Font family of the text.
- [`fontSize`](#fontsize-integer) : Font size of the text.
- [`fontStyle`](#fontstyle-string) : Font style of the text.
- [`textBaseline`](#textbaseline-string) : Baseline of the text.
- [`fillStyle`](#fillstyle-string) : Color of the text.
- [`strokeStyle`](#strokestyle-string) : Color of the stroke on the text.
- [`lineWidth`](#linewidth-integer) : Stroke width.
- [`shadowBlur`](#shadowblur-integer) : Blur level for drop shadow.
- [`shadowColor`](#shadowcolor-string) : Color of drop shadow.
- [`shadowOffsetX`](#shadowoffsetx-integer) : X offset of drop shadow.
- [`shadowOffsetY`](#shadowoffsety-integer) : Y offset of drop shadow.
- [`anchor`](#anchor-string) : Anchor to draw the text from.
- [`opacity`](#opacity-integer) : Opacity of the text.
- [`rotate`](#rotate-integer) : Degrees to rotate the text.
- [`scale`](#scale-integer) : Scale of the text.

#### Methods

```javascript
Facade.Text.setOptions([options]);
```

## Options

#### anchor _(String)_

_Default: `top/right`_

Position to anchor the object at.

- center
- center/right
- bottom/right
- bottom/center
- bottom/left
- center/left
- top/left
- top/center
- top/right

#### borderRadius _(Integer)_

_Default: `0`_

Radius of the rectangle's corners.

#### counterclockwise _(Boolean)_

_Default: `false`_

Determines if the circle will be drawn in a counter clockwise direction.

#### endX _(Integer)_

_Default: `0`_

X coordinate where line ends.

#### endY _(Integer)_

_Default: `0`_

Y coordinate where line ends.

#### end _(Integer)_

_Default: `360`_

Degree at which the circle ends.

#### fillStyle _(String)_

_Default: `#000`_

Fill color for the object. Can be a text representation of a color, a HEX value or RBG(A).

- `red`
- `#F00`
- `rgb(255, 0, 0);`
- `rgba(255, 0, 0, 1);`

#### fontFamily _(String)_

_Default: `Arial`_

Sets the font family of the text. Only one font can be specified at a time.

#### fontSize _(Integer)_

_Default: `30`_

Font size in pixels.

#### fontStyle _(String)_

_Default: `normal`_

Font style of the text.

- `normal`
- `bold`
- `italic`

#### frame _(Array)_

_Default: `[]`_

Array of numbers representing the frames in a sprite animation. Can determine in which order frames are drawn in.

- [1, 2, 3, 4, 5, 6, 7]
- [1, 2, 3, 4, 3, 2, 1]

#### height _(Integer)_

_Default (Image): `null`_
_Default (Rect): `100`_

Height of the object. If an image, can be used to crop the visible area of the loaded image.

#### lineCap _(String)_

_Default: `null`_

The style of line cap (end of line).

- butt
- round
- square

#### lineWidth _(Integer)_

_Default: `0`_

Width of the stroke on an object.

#### loop _(Boolean)_

_Default: `true`_

Determines if a sprite animation should loop when it has reached the end of the frame array.

#### offsetX _(Integer)_

_Default: `0`_

X coordinate within the image to begin drawing image. Used for cropping out the middle of an image.

#### offsetY _(Integer)_

_Default: `0`_

Y coordinate within the image to begin drawing image. Used for cropping out the middle of an image.

#### opacity _(Integer)_

_Default: `100`_

Opacity of the object. Integer between 0 and 100.

#### radius _(Integer)_

_Default: `10`_

Radius value of a circle.

#### rotate _(Integer)_

_Default: `0`_

Degrees to rotate the object.

#### scale _(Integer)_

_Default: `1`_

Scaling of the object.

#### shadowBlur _(Integer)_

_Default: `0`_

Blur level for drop shadow.

#### shadowColor _(String)_

_Default: `#000`_

Color of drop shadow. Can be a text representation of a color, a HEX value or RBG(A).

- `red`
- `#F00`
- `rgb(255, 0, 0);`
- `rgba(255, 0, 0, 1);`

#### shadowOffsetX _(Integer)_

_Default: `0`_

X offset of drop shadow.

#### shadowOffsetY _(Integer)_

_Default: `0`_

Y offset of drop shadow.

#### speed _(Integer)_

_Default: `120`_

Speed in which frames change in a sprite animation.

#### start _(Integer)_

_Default: `0`_

Degree at which the circle begins.

#### startX _(Integer)_

_Default: `100`_

X coordinate where line starts.

#### startY _(Integer)_

_Default: `0`_

Y coordinate where line starts.

#### strokePosition _(String)_

_Default: `default`_

Position to draw the stroke. Works for circles and rectangles without a radius.

- default
- inset
- outset

#### strokeStyle _(String)_

_Default: `#000`_

Color of an object's stroke. Can be a text representation of a color, a HEX value or RBG(A).

- `red`
- `#F00`
- `rgb(255, 0, 0);`
- `rgba(255, 0, 0, 1);`

#### textBaseline _(String)_

_Default: `top`_

Baseline to set the vertical alignment of the text drawn.

- top
- hanging
- middle
- alphabetic
- ideographic
- bottom

#### tileX _(Integer)_

_Default: `1`_

Number of times to tile an image horizontally.

#### tileY _(Integer)_

_Default: `1`_

Number of times to tile an image vertically.

#### value _(String)_

_Default: `(empty)`_

Value of the text object.

#### width _(Integer)_

_Default (Image): `null`_
_Default (Rect): `100`_

Width of the object. If an image, can be used to crop the visible area of the loaded image.

#### x _(Integer)_

_Default: `0`_

X coordinate to begin drawing an object.

#### y _(Integer)_

_Default: `0`_

Y coordinate to begin drawing an object.


## Browser Support

Currently Facade.js works in Chrome 10+, Safari 6+, Firefox 4+ and Internet Explorer 10. By way of an additional [polyfill](https://gist.github.com/paulirish/1579671) for [requestAnimateFrame](https://developer.mozilla.org/en-US/docs/DOM/window.requestAnimationFrame) support can be added for Opera, Internet Explorer 9 and older versions of both Safari and Firefox.

## Build

### Minify

[Uglifyjs2](https://github.com/mishoo/UglifyJS2) is used to minify Facade.js. The below command and corresponding flags should be used.

```shell
uglifyjs facade.js -o facade.min.js --mangle --comments all
```