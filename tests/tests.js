/*global require, casper, Facade*/

require('../polyfills/requestAnimationFrame-polyfill');
require('../facade');

casper.test.info('Facade');

casper.test.begin('Facade object creation', function suite(test) {

    'use strict';

    var stage = new Facade('stage', 500, 500);

    test.assertEquals(stage.canvas.nodeName, 'CANVAS', 'Canvas HTML tag.');
    test.assertEquals(stage.context.toString(), '[object CanvasRenderingContext2D]', 'CanvasRenderingContext2D reference.');

    test.assertEquals(stage.dt, null, 'Intial "time since last render" value. (delta time)');
    test.assertEquals(stage.fps, null, 'Initial FPS value. (frames per second)');
    test.assertEquals(stage.ftime, null, 'Initial "time of last render" value. (frame render time)');

    test.assertEquals(stage._callback, null, 'Private property for custom callback.');
    test.assertEquals(stage._requestAnimation, null, 'Private property to reference requestAnimation callback.');

    test.assertEquals(stage.canvas.getAttribute('id'), 'stage', 'ID of the canvas tag.');

    test.assertEquals(stage.canvas.width, 500, 'Width of the canvas tag.');
    test.assertEquals(stage.canvas.height, 500, 'Height of the canvas tag.');

    test.done();

});

casper.test.begin('Add to stage', function suite(test) {

    'use strict';

    var stage = new Facade('stage', 500, 500),
        object = new Facade.Polygon();

    try {

        stage.addToStage(null);

        test.fail('Null was recognized by Facade.addToStage as a valid entity.');

    } catch (e) { test.pass(e); }

    try {

        stage.addToStage(object);

        test.pass('Entity was recognized by Facade.addToStage.');

    } catch (e) { test.fail(e); }

    test.done();

});

casper.test.begin('Clear canvas', function suite(test) {

    'use strict';

    var stage = new Facade('stage', 500, 500);

    stage.context.fillStyle = 'rgb(255, 0, 0)';
    stage.context.fillRect(0, 0, 500, 300);

    test.assertEquals(stage.context.getImageData(0, 0, 1, 1).data[0], 255, 'Fill color is red.');

    stage.clear();

    test.assertEquals(stage.context.getImageData(0, 0, 1, 1).data[0], 0, 'Canvas was cleared.');

    test.done();

});

casper.test.begin('Facade draw.', function suite(test) {

    'use strict';

    var stage = new Facade('stage', 500, 500),
        callback = function () { return undefined; };

    test.assertEquals(stage._callback, null, 'Draw callback is null.');

    stage.draw(callback);

    test.assertType(stage._requestAnimation, 'number', '_requestAnimation has been set.');

    test.assertEquals(stage._callback, callback, 'Draw callback equals test function.');

    test.done();

});

casper.test.begin('Export base64 value.', function suite(test) {

    'use strict';

    var stage = new Facade('stage', 1, 1);

    test.assertEquals(stage.exportBase64(), 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAALEwAACxMBAJqcGAAAABBJREFUCB0BBQD6/wAAAAAAAAUAAbqJEIoAAAAASUVORK5CYII=', 'Base64 encoded value of a 1x1 image.');

    test.assertEquals(stage.exportBase64('image/png'), 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAALEwAACxMBAJqcGAAAABBJREFUCB0BBQD6/wAAAAAAAAUAAbqJEIoAAAAASUVORK5CYII=', 'Base64 encoded value of a 1x1 image as a PNG.');

    test.assertEquals(stage.exportBase64('image/png', 50), 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAALEwAACxMBAJqcGAAAAA1JREFUCFtjYGBgYAAAAAUAATs+CFsAAAAASUVORK5CYII=', 'Base64 encoded value of a 1x1 image as a PNG at 50% quality.');

    test.assertEquals(stage.exportBase64('image/jpeg'), 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAAEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/2wBDAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/wAARCAABAAEDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD/AD/6KKKAP//Z', 'Base64 encoded value of a 1x1 image as a JPEG.');

    test.assertEquals(stage.exportBase64('image/jpeg', 50), 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/2wBDABALDA4MChAODQ4SERATGCgaGBYWGDEjJR0oOjM9PDkzODdASFxOQERXRTc4UG1RV19iZ2hnPk1xeXBkeFxlZ2P/2wBDARESEhgVGC8aGi9jQjhCY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2P/wAARCAABAAEDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwDz+iiigD//2Q==', 'Base64 encoded value of a 1x1 image as a JPEG at quality 50%.');

    test.done();

});

casper.test.begin('Canvas height', function suite(test) {

    'use strict';

    var stage = new Facade('stage', 500, 500);

    test.assertEquals(stage.height(), 500, 'Height equals 500.');

    test.assertEquals(stage.height(1000), 1000, 'Height gets changed to 1000.');

    test.assertEquals(stage.height(), 1000, 'Height equals 1000.');

    test.done();

});

// Facade.prototype.renderWithContext

casper.test.begin('Facade renderWithContext.', function suite(test) {

    'use strict';

    // var stage = new Facade('stage', 500, 500);

    test.done();

});

casper.test.begin('Facade start animation.', function suite(test) {

    'use strict';

    var stage = new Facade('stage', 500, 500);

    test.assertEquals(stage._requestAnimation, null, '_requestAnimation has not been set yet.');

    stage.draw(function () { return undefined; });

    stage.start(); // Redundant as Facade.draw calls this when setting the callback.

    test.assertType(stage._requestAnimation, 'number', '_requestAnimation has been set.');

    test.done();

});

casper.test.begin('Facade stop animation.', function suite(test) {

    'use strict';

    var stage = new Facade('stage', 500, 500);

    stage.draw(function () { return undefined; });

    stage.start(); // Redundant as Facade.draw calls this when setting the callback.

    test.assertType(stage._requestAnimation, 'number', '_requestAnimation has been set.');

    stage.stop();

    test.assertEquals(stage._requestAnimation, null, '_requestAnimation has been nullified.');

    test.assertEquals(stage.dt, null, 'Delta time was reset.');
    test.assertEquals(stage.fps, null, 'FPS was reset.');
    test.assertEquals(stage.ftime, null, 'Frame time was reset.');

    test.done();

});

casper.test.begin('Canvas width', function suite(test) {

    'use strict';

    var stage = new Facade('stage', 500, 500);

    test.assertEquals(stage.width(), 500, 'Width equals 500.');

    test.assertEquals(stage.width(1000), 1000, 'Width gets changed to 1000.');

    test.assertEquals(stage.width(), 1000, 'Width equals 1000.');

    test.done();

});

casper.test.begin('Facade _animate.', function suite(test) {

    'use strict';

    var stage = new Facade('stage', 500, 500);

    stage._animate(Date.now());

    test.assertEquals(stage.dt, null, 'Delta time was not set as there is not callback to animate with.');
    test.assertEquals(stage.fps, null, 'FPS was not set as there is not callback to animate with.');
    test.assertEquals(stage.ftime, null, 'Frame time was not set as there is not callback to animate with.');

    stage.draw(function () { return undefined; });

    stage._animate(Date.now());

    test.assertEquals(stage.ftime > 0, true, 'Frame time was set.');

    stage._animate(Date.now() + 1);

    test.assertEquals(stage.dt > 0, true, 'Delta time set based on the previously set frame time.');
    test.assertEquals(stage.fps > 0, true, 'FPS set based on the previously set frame time and delta time.');

    test.done();

});

casper.test.info('Facade.Entity');

casper.test.begin('Entity object created.', function suite(test) {

    'use strict';

    test.assertType(Facade.Entity, 'function', 'Entity object extists.');

    test.assertEquals(Facade.Entity.prototype._defaultOptions(), {
        x: 0,
        y: 0
    }, 'Entity default options.');

    test.assertEquals(Facade.Entity.prototype._defaultMetrics(), {
        x: null,
        y: null,
        width: null,
        height: null
    }, 'Entity default metrics.');

    test.done();

});

casper.test.begin('Setting/getting entity options.', function suite(test) {

    'use strict';

    var object = new Facade.Entity();

    test.assertInstanceOf(object, Facade.Entity, 'Object is an instance of Facade.Entity.');

    test.assertEquals(object._options, undefined, 'Object options have not been set.');

    object._options = object._defaultOptions();

    test.assertEquals(object._options, {
        x: 0,
        y: 0
    }, 'Object options have been set correctly.');

    test.assertEquals(object.getOption('x'), 0, 'Getting object option (single key).');

    test.assertEquals(object.getOption('z'), undefined, 'Getting an object option that doesn\'t exist (single key).');

    test.assertEquals(object.getAllOptions('x'), {
        x: 0,
        y: 0
    }, 'Getting object options (mulitple keys).');

    test.assertEquals(object.setOption('x', 100), 100, 'Setting and getting an object option (single key).');

    test.assertEquals(object.setOption('z', 9000), undefined, 'Setting an object option that doesn\'t exist (single key).');

    test.assertEquals(object.setOption('x', 200, true), 200, 'Testing the validity of an option value (single key).');

    try {

        object.setOption('x', '100');

        test.fail();

    } catch (e) { test.pass(e); }

    test.assertEquals(object.setOptions({ x: 500, y: 500 }), {
        x: 500,
        y: 500
    }, 'Setting and getting an object option (multiple keys).');

    test.assertEquals(object.setOptions({ x: 0, y: 0 }, true), {
        x: 0,
        y: 0
    }, 'Setting and getting an object option (multiple keys).');

    test.assertEquals(object.getAllOptions(), {
        x: 500,
        y: 500
    }, 'Getting object options after testing validation (mulitple keys).');

    try {

        test.assertEquals(object.setOptions({ x: '9000' }), {
            x: 500,
            y: 500
        }, 'Testing the validity of an option value (multiple keys).');

        test.fail();

    } catch (e) { test.pass(e); }

    object._options = object._defaultOptions({ z: null });

    test.assertEquals(object.getOption('z'), null, 'Getting an object option was added through _defaultOptions.');

    test.done();

});

casper.test.begin('Setting/getting entity metrics.', function suite(test) {

    'use strict';

    var object = new Facade.Entity();

    test.assertInstanceOf(object, Facade.Entity, 'Object is an instance of Facade.Entity.');

    test.assertEquals(object._metrics, undefined, 'Object metrics have not been set.');

    object._metrics = object._defaultMetrics();

    test.assertEquals(object._metrics, {
        x: null,
        y: null,
        width: null,
        height: null
    }, 'Object metrics have been set correctly.');

    test.assertEquals(object.getMetric('x'), null, 'Getting object metric (single key).');

    test.assertEquals(object.getMetric('z'), undefined, 'Getting an object metric that doesn\'t exist (single key).');

    object._metrics = object._defaultMetrics({ z: null });

    test.assertEquals(object.getMetric('z'), null, 'Getting an object metric was added through _defaultMetrics.');

    test.done();

});

casper.test.info('Facade.Polygon');

casper.test.begin('Polygon entity object created.', function suite(test) {

    'use strict';

    test.assertType(Facade.Polygon, 'function', 'Polygon entity object extists.');
    test.assertInstanceOf(Facade.Polygon, Facade.Entity, 'Polygon is an instance of Facade.Entity.');
    test.assertEquals(Facade.Polygon.constructor, Facade.Entity, 'Polygon\'s constructor is Facade.Entity.');

    test.done();

});

casper.test.begin('Setting/getting polygon entity options.', function suite(test) {

    'use strict';

    var object = new Facade.Polygon();

    test.assertInstanceOf(object, Facade.Entity, 'Object is an instance of Facade.Entity.');

    test.assertEquals(object.getAllOptions(), {
        x: 0,
        y: 0,
        shadowBlur: 0,
        shadowColor: '#000',
        shadowOffsetX: 0,
        shadowOffsetY: 0,
        opacity: 100,
        points: [],
        fillStyle: '',
        strokeStyle: '',
        lineWidth: 1,
        lineCap: 'default',
        lineJoin: 'miter',
        closePath: true
    }, 'Object options have been set correctly.');

    test.done();

});

casper.test.begin('Polygon _draw.', function suite(test) {

    'use strict';

    test.done();

});

casper.test.info('Facade.Circle');

casper.test.begin('Circle entity object created.', function suite(test) {

    'use strict';

    test.assertType(Facade.Circle, 'function', 'Circle entity object extists.');
    test.assertInstanceOf(Facade.Circle, Facade.Entity, 'Circle is an instance of Facade.Entity.');
    test.assertInstanceOf(Facade.Circle, Facade.Polygon, 'Circle is an instance of Facade.Polygon.');
    test.assertEquals(Facade.Circle.constructor, Facade.Polygon, 'Circle\'s constructor is Facade.Polygon.');

    test.done();

});

casper.test.begin('Setting/getting circle entity options.', function suite(test) {

    'use strict';

    var object = new Facade.Circle();

    test.assertInstanceOf(object, Facade.Circle, 'Object is an instance of Facade.Circle.');

    test.assertEquals(object.getAllOptions(), {
        x: 0,
        y: 0,
        shadowBlur: 0,
        shadowColor: '#000',
        shadowOffsetX: 0,
        shadowOffsetY: 0,
        opacity: 100,
        points: [],
        fillStyle: '',
        strokeStyle: '',
        lineWidth: 1,
        lineCap: 'default',
        lineJoin: 'miter',
        closePath: true,
        radius: 0,
        begin: 0,
        end: 360
    }, 'Object default options have been set correctly.');

    test.assertEquals(object.setOptions({ radius: 20 }), {
        x: 0,
        y: 0,
        shadowBlur: 0,
        shadowColor: '#000',
        shadowOffsetX: 0,
        shadowOffsetY: 0,
        opacity: 100,
        points: [],
        fillStyle: '',
        strokeStyle: '',
        lineWidth: 1,
        lineCap: 'default',
        lineJoin: 'miter',
        closePath: true,
        radius: 20,
        begin: 0,
        end: 360
    }, 'Object custom options have been set correctly.');

    test.assertEquals(object._configOptions(object.getAllOptions()).points, [
        [ 0, 0, 20, 0, 360 * Math.PI / 180 ]
    ], 'Object config options have been set correctly.');

    test.done();

});

casper.test.info('Facade.Line');

casper.test.begin('Line entity object created.', function suite(test) {

    'use strict';

    test.assertType(Facade.Line, 'function', 'Line entity object extists.');
    test.assertInstanceOf(Facade.Line, Facade.Entity, 'Line is an instance of Facade.Entity.');
    test.assertInstanceOf(Facade.Line, Facade.Polygon, 'Line is an instance of Facade.Polygon.');
    test.assertEquals(Facade.Line.constructor, Facade.Polygon, 'Line\'s constructor is Facade.Polygon.');

    test.done();

});

casper.test.begin('Setting/getting line entity options.', function suite(test) {

    'use strict';

    var object = new Facade.Line();

    test.assertInstanceOf(object, Facade.Line, 'Object is an instance of Facade.Line.');

    test.assertEquals(object.getAllOptions(), {
        x: 0,
        y: 0,
        shadowBlur: 0,
        shadowColor: '#000',
        shadowOffsetX: 0,
        shadowOffsetY: 0,
        opacity: 100,
        points: [],
        fillStyle: '',
        strokeStyle: '',
        lineWidth: 1,
        lineCap: 'default',
        lineJoin: 'miter',
        closePath: true,
        x1: 0,
        y1: 0,
        x2: 0,
        y2: 0
    }, 'Object default options have been set correctly.');

    test.assertEquals(object.setOptions({ x1: 100, y1: 100, x2: 200, y2: 200 }), {
        x: 0,
        y: 0,
        shadowBlur: 0,
        shadowColor: '#000',
        shadowOffsetX: 0,
        shadowOffsetY: 0,
        opacity: 100,
        points: [],
        fillStyle: '',
        strokeStyle: '',
        lineWidth: 1,
        lineCap: 'default',
        lineJoin: 'miter',
        closePath: true,
        x1: 100,
        y1: 100,
        x2: 200,
        y2: 200
    }, 'Object custom options have been set correctly.');

    test.assertEquals(object._configOptions(object.getAllOptions()).points, [
        [ 100, 100 ], [ 200, 200 ]
    ], 'Object config options have been set correctly.');

    test.done();

});

casper.test.info('Facade.Rect');

casper.test.begin('Rect entity object created.', function suite(test) {

    'use strict';

    test.assertType(Facade.Rect, 'function', 'Rect entity object extists.');
    test.assertInstanceOf(Facade.Rect, Facade.Entity, 'Rect is an instance of Facade.Entity.');
    test.assertInstanceOf(Facade.Rect, Facade.Polygon, 'Rect is an instance of Facade.Polygon.');
    test.assertEquals(Facade.Rect.constructor, Facade.Polygon, 'Rect\'s constructor is Facade.Polygon.');

    test.done();

});

casper.test.begin('Setting/getting rect entity options.', function suite(test) {

    'use strict';

    var object = new Facade.Rect();

    test.assertInstanceOf(object, Facade.Rect, 'Object is an instance of Facade.Rect.');

    test.assertEquals(object.getAllOptions(), {
        x: 0,
        y: 0,
        shadowBlur: 0,
        shadowColor: '#000',
        shadowOffsetX: 0,
        shadowOffsetY: 0,
        opacity: 100,
        points: [],
        fillStyle: '',
        strokeStyle: '',
        lineWidth: 1,
        lineCap: 'default',
        lineJoin: 'miter',
        closePath: true,
        width: 0,
        height: 0
    }, 'Object default options have been set correctly.');

    test.assertEquals(object.setOptions({ width: 200, height: 200 }), {
        x: 0,
        y: 0,
        shadowBlur: 0,
        shadowColor: '#000',
        shadowOffsetX: 0,
        shadowOffsetY: 0,
        opacity: 100,
        points: [],
        fillStyle: '',
        strokeStyle: '',
        lineWidth: 1,
        lineCap: 'default',
        lineJoin: 'miter',
        closePath: true,
        width: 200,
        height: 200
    }, 'Object custom options have been set correctly.');

    test.assertEquals(object._configOptions(object.getAllOptions()).points, [
        [ 0, 0 ], [ 200, 0 ], [ 200, 200 ], [ 0, 200 ]
    ], 'Object config options have been set correctly.');

    test.done();

});

casper.test.info('AMD');

casper.test.begin('Facade AMD Support', function suite(test) {

    'use strict';

    test.assertEquals(window.Facade, Facade, 'Global Facade object.');

    test.done();

});