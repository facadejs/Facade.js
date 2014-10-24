/*global require, casper*/

require('../polyfills/requestAnimationFrame-polyfill');

var Facade = require('../facade');


casper.test.info('Facade.Line');

casper.test.begin('Line entity object created.', function suite(test) {

    'use strict';

    var object = new Facade.Line();

    test.assertType(Facade.Line, 'function', 'Line entity object exists.');
    test.assertInstanceOf(Facade.Line, Facade.Entity, 'Line is an instance of Facade.Entity.');
    test.assertInstanceOf(Facade.Line, Facade.Polygon, 'Line is an instance of Facade.Polygon.');
    test.assertEquals(Facade.Line.constructor, Facade.Polygon, 'Line\'s constructor is Facade.Polygon.');
    test.assertInstanceOf(object, Facade.Line, 'Object is an instance of Facade.Line.');

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
        lineWidth: 1,
        lineCap: 'butt',
        lineJoin: 'miter',
        closePath: true,
        x1: 0,
        y1: 0,
        x2: 0,
        y2: 0
    }, 'Default options have been set correctly.');

    test.assertEquals(object.getAllMetrics(), {
        x: null,
        y: null,
        width: null,
        height: null
    }, 'Default metrics have been set correctly.');

    test.done();

});

casper.test.begin('Setting/getting line entity default options.', function suite(test) {

    'use strict';

    var object = new Facade.Line();

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
        lineWidth: 1,
        lineCap: 'butt',
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
        anchor: 'top/left',
        rotate: 0,
        scale: 1,
        opacity: 100,
        points: [],
        fillStyle: '#000',
        strokeStyle: '',
        lineWidth: 1,
        lineCap: 'butt',
        lineJoin: 'miter',
        closePath: true,
        x1: 100,
        y1: 100,
        x2: 200,
        y2: 200
    }, 'Object custom options have been set correctly.');

    test.done();

});

casper.test.begin('Running _configOptions on line options.', function suite(test) {

    'use strict';

    var object = new Facade.Line({ x: 10, y: 10, x1: 100, y1: 100, x2: 200, y2: 200, opacity: 50 });

    test.assertEquals(object._configOptions(object.getAllOptions()), {
        x: 10,
        y: 10,
        anchor: 'top/left',
        rotate: 0,
        scale: 1,
        opacity: 50,
        points: [ [ 100, 100 ], [ 200, 200 ] ],
        fillStyle: '#000',
        strokeStyle: '',
        lineWidth: 1,
        lineCap: 'butt',
        lineJoin: 'miter',
        closePath: false,
        translate: [ 10, 10 ],
        globalAlpha: 0.5,
        x1: 100,
        y1: 100,
        x2: 200,
        y2: 200
    }, 'Custom config options have been set correctly.');

    test.done();

});

casper.test.begin('Setting metrics for a line.', function suite(test) {

    'use strict';

    var object = new Facade.Line({ x: 10, y: 10, x1: 100, y1: 100, x2: 200, y2: 200, lineWidth: 1 });

    test.assertEquals(object.getAllMetrics(), {
        x: 109.5,
        y: 109.5,
        width: 101,
        height: 101
    }, 'Line metrics have been set correctly.');

    object.setOptions({ lineWidth: 10 });

    test.assertEquals(object.getAllMetrics(), {
        x: 105,
        y: 105,
        width: 110,
        height: 110
    }, 'Line metrics have been set correctly.');

    test.done();

});

casper.test.begin('Setting/getting line anchor.', function suite(test) {

    'use strict';

    var object = new Facade.Line({ x: 0, y: 0, x2: 100, lineWidth: 10 });

    object.setOptions({ anchor: 'top/left' });

    test.assertEquals(object._getAnchorPoint(object.getAllOptions(), object.getAllMetrics()), [
        0,
        0
    ], 'Line anchor top/left has been set correctly.');

    object.setOptions({ anchor: 'top/center' });

    test.assertEquals(object._getAnchorPoint(object.getAllOptions(), object.getAllMetrics()), [
        -50,
        0
    ], 'Line anchor top/center has been set correctly.');

    object.setOptions({ anchor: 'top/right' });

    test.assertEquals(object._getAnchorPoint(object.getAllOptions(), object.getAllMetrics()), [
        -100,
        0
    ], 'Line anchor top/right has been set correctly.');


    object.setOptions({ anchor: 'center/left' });

    test.assertEquals(object._getAnchorPoint(object.getAllOptions(), object.getAllMetrics()), [
        0,
        0
    ], 'Line anchor center/left has been set correctly.');

    object.setOptions({ anchor: 'center' });

    test.assertEquals(object._getAnchorPoint(object.getAllOptions(), object.getAllMetrics()), [
        -50,
        0
    ], 'Line anchor center has been set correctly.');

    object.setOptions({ anchor: 'center/right' });

    test.assertEquals(object._getAnchorPoint(object.getAllOptions(), object.getAllMetrics()), [
        -100,
        0
    ], 'Line anchor center/right has been set correctly.');


    object.setOptions({ anchor: 'bottom/left' });

    test.assertEquals(object._getAnchorPoint(object.getAllOptions(), object.getAllMetrics()), [
        0,
        0
    ], 'Line anchor bottom/left has been set correctly.');

    object.setOptions({ anchor: 'bottom/center' });

    test.assertEquals(object._getAnchorPoint(object.getAllOptions(), object.getAllMetrics()), [
        -50,
        0
    ], 'Line anchor bottom/center has been set correctly.');

    object.setOptions({ anchor: 'bottom/right' });

    test.assertEquals(object._getAnchorPoint(object.getAllOptions(), object.getAllMetrics()), [
        -100,
        0
    ], 'Line anchor bottom/right has been set correctly.');

    test.done();

});
