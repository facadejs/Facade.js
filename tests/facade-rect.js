/*global require, casper*/

require('../polyfills/requestAnimationFrame-polyfill');

var Facade = require('../facade');


casper.test.info('Facade.Rect');

casper.test.begin('Rect entity object created.', function suite(test) {

    'use strict';

    var object = new Facade.Rect();

    test.assertType(Facade.Rect, 'function', 'Rect entity object exists.');
    test.assertInstanceOf(Facade.Rect, Facade.Entity, 'Rect is an instance of Facade.Entity.');
    test.assertInstanceOf(Facade.Rect, Facade.Polygon, 'Rect is an instance of Facade.Polygon.');
    test.assertEquals(Facade.Rect.constructor, Facade.Polygon, 'Rect\'s constructor is Facade.Polygon.');
    test.assertInstanceOf(object, Facade.Rect, 'Object is an instance of Facade.Rect.');

    test.assertEquals(object.getAllOptions(), {
        x: 0,
        y: 0,
        anchor: 'top/left',
        rotate: 0,
        scale: 1,
        opacity: 100,
        points: [],
        fillStyle: '#000',
        strokeStyle: '',
        lineWidth: 0,
        lineCap: 'butt',
        lineJoin: 'miter',
        closePath: true,
        width: 0,
        height: 0
    }, 'Default options have been set correctly.');

    test.assertEquals(object.getAllMetrics(), {
        x: null,
        y: null,
        width: null,
        height: null
    }, 'Default metrics have been set correctly.');

    test.done();

});

casper.test.begin('Setting/getting rect entity default options.', function suite(test) {

    'use strict';

    var object = new Facade.Rect();

    test.assertEquals(object.getAllOptions(), {
        x: 0,
        y: 0,
        anchor: 'top/left',
        rotate: 0,
        scale: 1,
        opacity: 100,
        points: [],
        fillStyle: '#000',
        strokeStyle: '',
        lineWidth: 0,
        lineCap: 'butt',
        lineJoin: 'miter',
        closePath: true,
        width: 0,
        height: 0
    }, 'Object default options have been set correctly.');

    test.assertEquals(object.setOptions({ width: 200, height: 200 }), {
        x: 0,
        y: 0,
        anchor: 'top/left',
        rotate: 0,
        scale: 1,
        opacity: 100,
        points: [],
        fillStyle: '#000',
        strokeStyle: '',
        lineWidth: 0,
        lineCap: 'butt',
        lineJoin: 'miter',
        closePath: true,
        width: 200,
        height: 200
    }, 'Object custom options have been set correctly.');

    test.done();

});

casper.test.begin('Running _configOptions on rect options.', function suite(test) {

    'use strict';

    var object = new Facade.Rect({ x: 10, y: 10, width: 200, height: 200, opacity: 50 });

    test.assertEquals(object._configOptions(object.getAllOptions()), {
        x: 10,
        y: 10,
        anchor: 'top/left',
        rotate: 0,
        scale: 1,
        opacity: 50,
        points: [ [ 0, 0 ], [ 200, 0 ], [ 200, 200 ], [ 0, 200 ] ],
        fillStyle: '#000',
        strokeStyle: '',
        lineWidth: 0,
        lineCap: 'butt',
        lineJoin: 'miter',
        closePath: true,
        width: 200,
        height: 200,
        translate: [ 10, 10 ],
        globalAlpha: 0.5
    }, 'Custom config options have been set correctly.');

    test.done();

});

casper.test.begin('Setting metrics for a rect.', function suite(test) {

    'use strict';

    var object = new Facade.Rect({ x: 10, y: 10, width: 200, height: 200, lineWidth: 0 });

    test.assertEquals(object.getAllMetrics(), {
        x: 10,
        y: 10,
        width: 200,
        height: 200
    }, 'Rect metrics have been set correctly.');

    object.setOptions({ lineWidth: 10 });

    test.assertEquals(object.getAllMetrics(), {
        x: 10,
        y: 10,
        width: 210,
        height: 210
    }, 'Rect metrics have been set correctly.');

    test.done();

});

casper.test.begin('Setting/getting rect anchor.', function suite(test) {

    'use strict';

    var object = new Facade.Rect({ x: 0, y: 0, width: 100, height: 100, lineWidth: 10 });

    object.setOptions({ anchor: 'top/left' });

    test.assertEquals(object._getAnchorPoint(object.getAllOptions(), object.getAllMetrics()), [
        5,
        5
    ], 'Rect anchor top/left has been set correctly.');

    object.setOptions({ anchor: 'top/center' });

    test.assertEquals(object._getAnchorPoint(object.getAllOptions(), object.getAllMetrics()), [
        -50,
        5
    ], 'Rect anchor top/center has been set correctly.');

    object.setOptions({ anchor: 'top/right' });

    test.assertEquals(object._getAnchorPoint(object.getAllOptions(), object.getAllMetrics()), [
        -105,
        5
    ], 'Rect anchor top/right has been set correctly.');


    object.setOptions({ anchor: 'center/left' });

    test.assertEquals(object._getAnchorPoint(object.getAllOptions(), object.getAllMetrics()), [
        5,
        -50
    ], 'Rect anchor center/left has been set correctly.');

    object.setOptions({ anchor: 'center' });

    test.assertEquals(object._getAnchorPoint(object.getAllOptions(), object.getAllMetrics()), [
        -50,
        -50
    ], 'Rect anchor center has been set correctly.');

    object.setOptions({ anchor: 'center/right' });

    test.assertEquals(object._getAnchorPoint(object.getAllOptions(), object.getAllMetrics()), [
        -105,
        -50
    ], 'Rect anchor center/right has been set correctly.');


    object.setOptions({ anchor: 'bottom/left' });

    test.assertEquals(object._getAnchorPoint(object.getAllOptions(), object.getAllMetrics()), [
        5,
        -105
    ], 'Rect anchor bottom/left has been set correctly.');

    object.setOptions({ anchor: 'bottom/center' });

    test.assertEquals(object._getAnchorPoint(object.getAllOptions(), object.getAllMetrics()), [
        -50,
        -105
    ], 'Rect anchor bottom/center has been set correctly.');

    object.setOptions({ anchor: 'bottom/right' });

    test.assertEquals(object._getAnchorPoint(object.getAllOptions(), object.getAllMetrics()), [
        -105,
        -105
    ], 'Rect anchor bottom/right has been set correctly.');

    test.done();

});
