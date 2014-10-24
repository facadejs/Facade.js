/*global require, casper*/

require('../polyfills/requestAnimationFrame-polyfill');

var Facade = require('../facade');


casper.test.info('Facade.Polygon');

casper.test.begin('Polygon entity object created.', function suite(test) {

    'use strict';

    var object = new Facade.Polygon();

    test.assertType(Facade.Polygon, 'function', 'Polygon entity object exists.');
    test.assertInstanceOf(Facade.Polygon, Facade.Entity, 'Polygon is an instance of Facade.Entity.');
    test.assertEquals(Facade.Polygon.constructor, Facade.Entity, 'Polygon\'s constructor is Facade.Entity.');
    test.assertInstanceOf(object, Facade.Polygon, 'Object is an instance of Facade.Polygon.');

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
        closePath: true
    }, 'Default options have been set correctly.');

    test.assertEquals(object.getAllMetrics(), {
        x: null,
        y: null,
        width: null,
        height: null
    }, 'Default metrics have been set correctly.');

    test.done();

});

casper.test.begin('Setting/getting polygon entity default options.', function suite(test) {

    'use strict';

    var object = new Facade.Polygon();

    test.assertEquals(object._defaultOptions(), {
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
        closePath: true
    }, 'Default options have been set correctly.');

    test.assertEquals(object._defaultOptions({ test: true }), {
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
        test: true
    }, 'Custom default options have been set correctly.');

    test.done();

});

// Facade.Polygon.prototype.draw can't be tested as it makes context changes to the canvas only.

casper.test.begin('Running _configOptions on polygon options.', function suite(test) {

    'use strict';

    var object = new Facade.Polygon({ x: 10, y: 10, opacity: 50 });

    test.assertEquals(object._configOptions(object.getAllOptions()), {
        x: 10,
        y: 10,
        anchor: 'top/left',
        rotate: 0,
        scale: 1,
        opacity: 50,
        points: [],
        fillStyle: '#000',
        strokeStyle: '',
        lineWidth: 0,
        lineCap: 'butt',
        lineJoin: 'miter',
        closePath: true,
        translate: [ 10, 10 ],
        globalAlpha: 0.5
    }, 'Custom config options have been set correctly.');

    test.done();

});

casper.test.begin('Setting metrics for a polygon.', function suite(test) {

    'use strict';

    var object = new Facade.Polygon({ x: 10, y: 10, points: [ [0, 0], [200, 0], [100, 200], [0, 150] ], lineWidth: 0 });

    test.assertEquals(object.getAllMetrics(), {
        x: 10,
        y: 10,
        width: 200,
        height: 200
    }, 'Polygon metrics have been set correctly.');

    object.setOptions({ lineWidth: 10 });

    test.assertEquals(object.getAllMetrics(), {
        x: 10,
        y: 10,
        width: 210,
        height: 210
    }, 'Polygon metrics have been set correctly.');

    test.done();

});

casper.test.begin('Setting/getting polygon anchor.', function suite(test) {

    'use strict';

    var object = new Facade.Polygon({ x: 0, y: 0, points: [ [0, 0], [100, 0], [100, 100], [0, 100] ], lineWidth: 10 });

    object.setOptions({ anchor: 'top/left' });

    test.assertEquals(object._getAnchorPoint(object.getAllOptions(), object.getAllMetrics()), [
        5,
        5
    ], 'Polygon anchor top/left has been set correctly.');

    object.setOptions({ anchor: 'top/center' });

    test.assertEquals(object._getAnchorPoint(object.getAllOptions(), object.getAllMetrics()), [
        -50,
        5
    ], 'Polygon anchor top/center has been set correctly.');

    object.setOptions({ anchor: 'top/right' });

    test.assertEquals(object._getAnchorPoint(object.getAllOptions(), object.getAllMetrics()), [
        -105,
        5
    ], 'Polygon anchor top/right has been set correctly.');


    object.setOptions({ anchor: 'center/left' });

    test.assertEquals(object._getAnchorPoint(object.getAllOptions(), object.getAllMetrics()), [
        5,
        -50
    ], 'Polygon anchor center/left has been set correctly.');

    object.setOptions({ anchor: 'center' });

    test.assertEquals(object._getAnchorPoint(object.getAllOptions(), object.getAllMetrics()), [
        -50,
        -50
    ], 'Polygon anchor center has been set correctly.');

    object.setOptions({ anchor: 'center/right' });

    test.assertEquals(object._getAnchorPoint(object.getAllOptions(), object.getAllMetrics()), [
        -105,
        -50
    ], 'Polygon anchor center/right has been set correctly.');


    object.setOptions({ anchor: 'bottom/left' });

    test.assertEquals(object._getAnchorPoint(object.getAllOptions(), object.getAllMetrics()), [
        5,
        -105
    ], 'Polygon anchor bottom/left has been set correctly.');

    object.setOptions({ anchor: 'bottom/center' });

    test.assertEquals(object._getAnchorPoint(object.getAllOptions(), object.getAllMetrics()), [
        -50,
        -105
    ], 'Polygon anchor bottom/center has been set correctly.');

    object.setOptions({ anchor: 'bottom/right' });

    test.assertEquals(object._getAnchorPoint(object.getAllOptions(), object.getAllMetrics()), [
        -105,
        -105
    ], 'Polygon anchor bottom/right has been set correctly.');

    test.done();

});
