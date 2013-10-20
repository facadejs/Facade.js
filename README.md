#Facade.js

>Drawing shapes, images and text in HTML5 canvas made easy.

##Documentation

The documentation can be found at <http://docs.facadejs.com/>.

##Getting Started

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

## Browser Support

Currently Facade.js works in Chrome 10+, Safari 6+, Firefox 4+ and Internet Explorer 10. By way of an additional [polyfill](https://gist.github.com/paulirish/1579671) for [requestAnimationFrame](https://developer.mozilla.org/en-US/docs/DOM/window.requestAnimationFrame) support can be added for Opera, Internet Explorer 9 and older versions of both Safari and Firefox.