/*global require, casper, setTimeout*/

require('../polyfills/requestAnimationFrame-polyfill');

var Facade = require('../facade');


var image = document.createElement('img');
image.setAttribute('src', 'data:image/gif;base64,R0lGODdhAQABAPAAAP///wAAACwAAAAAAQABAEACAkQBADs=');

setTimeout(function () { // Wait for test image (35 byte spacer.gif)

    'use strict';

    casper.test.info('Facade.Image');

    casper.test.begin('Image entity object created.', function suite(test) {

        // 'use strict';

        var object = new Facade.Image();

        test.assertType(Facade.Image, 'function', 'Image entity object extists.');
        test.assertInstanceOf(Facade.Image, Facade.Entity, 'Image is an instance of Facade.Entity.');
        test.assertEquals(Facade.Image.constructor, Facade.Entity, 'Image\'s constructor is Facade.Entity.');
        test.assertInstanceOf(object, Facade.Image, 'Object is an instance of Facade.Image.');

        test.assertEquals(object.getAllOptions(), {
            x: 0,
            y: 0,
            anchor: 'top/left',
            rotate: 0,
            scale: 1,
            width: 0,
            height: 0,
            tileX: 1,
            tileY: 1,
            offsetX: 0,
            offsetY: 0,
            frames: [0],
            speed: 120,
            loop: true,
            callback: function () { return undefined; }
        }, 'Default options have been set correctly.');

        test.assertEquals(object.getAllMetrics(), {
            x: null,
            y: null,
            width: null,
            height: null
        }, 'Default metrics have been set correctly.');

        test.assertEquals(object.animating, false, 'Intial animating status.');
        test.assertEquals(object.currentFrame, 0, 'Intial current frame.');

        test.done();

    });

    casper.test.begin('Loading an Image into a Facade.Image object', function suite(test) {

        // 'use strict';

        var object = new Facade.Image(image);

        test.assertEquals(object.image.complete, true, 'Image was loaded correctly.');

        test.done();

    });

    casper.test.begin('Animation methods.', function suite(test) {

        // 'use strict';

        var object = new Facade.Image(image, { frames: [ 0, 1, 2, 3, 4, 5 ]});

        test.assertEquals(object.animating, false, 'Initial animating status.');
        test.assertEquals(object.currentFrame, 0, 'Initial current frame.');

        object.play();

        test.assertEquals(object.animating, true, 'Animating status (playing).');

        object.reset();

        test.assertEquals(object.currentFrame, 0, 'Current frame (reset).');

        object.pause();

        test.assertEquals(object.animating, false, 'Animating status (paused).');

        object.stop();

        test.assertEquals(object.animating, false, 'Animating status (stopped).');
        test.assertEquals(object.currentFrame, 0, 'Current frame (stopped).');

        test.done();

    });

    casper.test.begin('Running _configOptions on image options.', function suite(test) {

        // 'use strict';

        var object = new Facade.Image(image);

        test.assertEquals(object._configOptions(object.getAllOptions()), {
            x: 0,
            y: 0,
            anchor: 'top/left',
            rotate: 0,
            scale: 1,
            width: 1,
            height: 1,
            tileX: 1,
            tileY: 1,
            offsetX: 0,
            offsetY: 0,
            frames: [0],
            speed: 120,
            loop: true,
            callback: function () { return undefined; },
            translate: [ 0, 0 ]
        }, 'Custom config options have been set correctly.');

        test.done();

    });

    casper.test.begin('Setting metrics for an image.', function suite(test) {

        // 'use strict';

        var object = new Facade.Image(image);

        test.assertEquals(object.getAllMetrics(), {
            x: 0,
            y: 0,
            width: 1,
            height: 1
        }, 'Image metrics have been set correctly.');

        test.assertEquals(object._setMetrics(object.setOptions({ tileX: 100 }, true)), {
            x: 0,
            y: 0,
            width: 100,
            height: 1
        }, 'Image metrics have been set correctly.');

        test.done();

    });

    // Facade.Image.prototype._draw can't be tested as it makes context changes to the canvas only.

}, 100);
