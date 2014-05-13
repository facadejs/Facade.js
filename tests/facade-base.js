/*global require, casper, Facade*/

require('../polyfills/requestAnimationFrame-polyfill');
require('../facade');

casper.test.info('Facade');

casper.test.begin('Facade object creation', function suite(test) {

    'use strict';

    var stage = new Facade('stage', 500, 500);

    test.assertEquals(stage.canvas.nodeName, 'CANVAS', 'Canvas HTML tag.');
    test.assertEquals(stage.context.toString(), '[object CanvasRenderingContext2D]', 'CanvasRenderingContext2D reference.');

    test.assertEquals(stage.canvas.getAttribute('id'), 'stage', 'ID of the canvas tag.');

    test.assertEquals(stage.canvas.width, 500, 'Width of the canvas tag.');
    test.assertEquals(stage.canvas.height, 500, 'Height of the canvas tag.');

    test.assertEquals(stage.dt, null, 'Intial "time since last render" value. (delta time)');
    test.assertEquals(stage.fps, null, 'Initial FPS value. (frames per second)');
    test.assertEquals(stage.ftime, null, 'Initial "time of last render" value. (frame render time)');

    test.assertEquals(stage._callback, null, 'Private property for custom callback.');
    test.assertEquals(stage._requestAnimation, null, 'Private property to reference requestAnimation callback.');

    test.done();

});

casper.test.begin('Add entity to stage', function suite(test) {

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

casper.test.begin('Add multiple entities to stage', function suite(test) {

    'use strict';

    var stage = new Facade('stage', 500, 500),
        object1 = new Facade.Polygon(),
        object2 = new Facade.Polygon();

    try {

        stage.addToStage([object1, object2]);

        test.pass('Entities list was recognized by Facade.addToStage as an array and rendered.');

    } catch (e) { test.fail(e); }

    test.done();

});

casper.test.begin('Clear canvas', function suite(test) {

    'use strict';

    var stage = new Facade('stage', 500, 500);

    stage.context.fillStyle = 'rgb(255, 0, 0)';
    stage.context.fillRect(0, 0, 500, 500);

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

    test.assertEquals(stage._requestAnimation, null, '_requestAnimation has not been set yet.');

    try {

        stage.draw(null);

        test.pass('Null was recognized by Facade.draw as a valid function.');

    } catch (e) { test.pass(e); }

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

    test.assertEquals(stage.height(1000), 1000, 'Height changed to 1000.');

    test.assertEquals(stage.height(), 1000, 'Height equals 1000.');

    test.done();

});

// Facade.prototype.renderWithContext can't be tested as it makes context changes to the canvas only.

casper.test.begin('Facade HDPI support.', function suite(test) {

    'use strict';

    var stage = new Facade('stage', 500, 300);

    test.assertEquals(stage.width(), 500, 'Width equals 500.');
    test.assertEquals(stage.height(), 300, 'Height equals 300.');

    stage.resizeForHDPI();

    test.assertEquals(stage.width(), 500, 'Width still equals 500.');
    test.assertEquals(stage.height(), 300, 'Height still equals 300.');

    test.assertEquals(stage.canvas.style.length, 0, 'Styles have not been set.');

    window.devicePixelRatio = 2;

    stage.resizeForHDPI();

    test.assertEquals(stage.width(), 500, 'Wdth (@2x) equals 500.');
    test.assertEquals(stage.height(), 300, 'Height (@2x) equals 300.');

    test.assertEquals(stage.canvas.getAttribute('width'), '1000', 'Actual width (@2x) equals 1000.');
    test.assertEquals(stage.canvas.getAttribute('height'), '600', 'Actual height (@2x) equals 600.');

    test.assertEquals(stage.canvas.style.width, '500px', 'Style width set to original width (500).');
    test.assertEquals(stage.canvas.style.height, '300px', 'Style height set to original height (300).');

    test.done();

});

casper.test.begin('Facade start animation.', function suite(test) {

    'use strict';

    var stage = new Facade('stage', 500, 500);

    test.assertEquals(stage._requestAnimation, null, '_requestAnimation has not been set yet.');

    stage._callback = function () { return undefined; }; // Should be set by running Facade.draw, used for testing only.

    stage.start();

    test.assertType(stage._requestAnimation, 'number', '_requestAnimation has been set.');

    test.done();

});

casper.test.begin('Facade stop animation.', function suite(test) {

    'use strict';

    var stage = new Facade('stage', 500, 500);

    stage._callback = function () { return undefined; }; // Should be set by running Facade.draw, used for testing only.

    stage.start();

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

    stage._callback = function () { return undefined; }; // Should be set by running Facade.draw, used for testing only.

    stage._animate(Date.now());

    test.assertEquals(stage.ftime > 0, true, 'Frame time was set.');
    test.assertEquals(stage.dt, null, 'Delta time not set as _animate has only been called once.');
    test.assertEquals(stage.fps, null, 'FPS not set as _animate has only been called once.');

    stage._animate(Date.now() + 1);

    test.assertEquals(stage.dt > 0, true, 'Delta time set based on the previously set frame time.');
    test.assertEquals(stage.fps > 0, true, 'FPS set based on the previously set frame time and delta time.');

    test.done();

});

casper.test.info('AMD');

casper.test.begin('Facade AMD Support', function suite(test) {

    'use strict';

    test.assertEquals(window.Facade, Facade, 'Global Facade object.');

    test.done();

});
