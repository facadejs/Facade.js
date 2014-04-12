/*global require, casper, Facade*/

require('../polyfills/requestAnimationFrame-polyfill');
require('../facade');

casper.test.info('Facade.Circle');

casper.test.begin('Circle entity object created.', function suite(test) {

    'use strict';

    var object = new Facade.Circle();

    test.assertType(Facade.Circle, 'function', 'Circle entity object extists.');
    test.assertInstanceOf(Facade.Circle, Facade.Entity, 'Circle is an instance of Facade.Entity.');
    test.assertInstanceOf(Facade.Circle, Facade.Polygon, 'Circle is an instance of Facade.Polygon.');
    test.assertEquals(Facade.Circle.constructor, Facade.Polygon, 'Circle\'s constructor is Facade.Polygon.');
    test.assertInstanceOf(object, Facade.Circle, 'Object is an instance of Facade.Circle.');

    test.assertEquals(object.getAllOptions(), {
        x: 0,
        y: 0,
        anchor: 'top/left',
        rotate: 0,
        scale: 1,
        shadowBlur: 0,
        shadowColor: '#000',
        shadowOffsetX: 0,
        shadowOffsetY: 0,
        opacity: 100,
        points: [],
        fillStyle: '#000',
        strokeStyle: '',
        lineWidth: 0,
        lineCap: 'default',
        lineJoin: 'miter',
        closePath: true,
        radius: 0,
        begin: 0,
        end: 360
    }, 'Default options have been set correctly.');

    test.assertEquals(object.getAllMetrics(), {
        x: null,
        y: null,
        width: null,
        height: null
    }, 'Default metrics have been set correctly.');

    test.done();

});

casper.test.begin('Setting/getting circle entity default options.', function suite(test) {

    'use strict';

    var object = new Facade.Circle();

    test.assertEquals(object.getAllOptions(), {
        x: 0,
        y: 0,
        anchor: 'top/left',
        rotate: 0,
        scale: 1,
        shadowBlur: 0,
        shadowColor: '#000',
        shadowOffsetX: 0,
        shadowOffsetY: 0,
        opacity: 100,
        points: [],
        fillStyle: '#000',
        strokeStyle: '',
        lineWidth: 0,
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
        anchor: 'top/left',
        rotate: 0,
        scale: 1,
        shadowBlur: 0,
        shadowColor: '#000',
        shadowOffsetX: 0,
        shadowOffsetY: 0,
        opacity: 100,
        points: [],
        fillStyle: '#000',
        strokeStyle: '',
        lineWidth: 0,
        lineCap: 'default',
        lineJoin: 'miter',
        closePath: true,
        radius: 20,
        begin: 0,
        end: 360
    }, 'Object custom options have been set correctly.');

    test.done();

});

casper.test.begin('Running _configOptions on circle options.', function suite(test) {

    'use strict';

    var object = new Facade.Circle({ x: 10, y: 10, radius: 20, opacity: 50, rotate: 45 });

    test.assertEquals(object._configOptions(object.getAllOptions()), {
        x: 10,
        y: 10,
        anchor: 'top/left',
        rotate: 0,
        scale: 1,
        shadowBlur: 0,
        shadowColor: '#000',
        shadowOffsetX: 0,
        shadowOffsetY: 0,
        opacity: 50,
        points: [ [ 0, 0, 20, 0, 6.283185307179586 ] ],
        fillStyle: '#000',
        strokeStyle: '',
        lineWidth: 0,
        lineCap: 'default',
        lineJoin: 'miter',
        closePath: true,
        translate: [ 10 + 20, 10 + 20 ],
        globalAlpha: 0.5,
        radius: 20,
        begin: 0,
        end: 360
    }, 'Custom config options have been set correctly.');

    test.done();

});

casper.test.begin('Setting metrics for a circle.', function suite(test) {

    'use strict';

    var object = new Facade.Circle({ x: 10, y: 10, radius: 100, lineWidth: 0 });

    test.assertEquals(object._setMetrics(), {
        x: 10,
        y: 10,
        width: 200,
        height: 200
    }, 'Circle metrics have been set correctly.');

    object.setOptions({ lineWidth: 10 });

    test.assertEquals(object._setMetrics(), {
        x: 10,
        y: 10,
        width: 210,
        height: 210
    }, 'Circle metrics have been set correctly.');

    test.done();

});

casper.test.begin('Setting/getting circle anchor.', function suite(test) {

    'use strict';

    var object = new Facade.Circle({ x: 0, y: 0, radius: 50, lineWidth: 10 });

    object.setOption('anchor', 'top/left');

    test.assertEquals(object._getAnchorPoint(object.getAllOptions(), object._setMetrics()), [
        5,
        5
    ], 'Circle anchor top/left has been set correctly.');

    object.setOption('anchor', 'top/center');

    test.assertEquals(object._getAnchorPoint(object.getAllOptions(), object._setMetrics()), [
        -50,
        5
    ], 'Circle anchor top/center has been set correctly.');

    object.setOption('anchor', 'top/right');

    test.assertEquals(object._getAnchorPoint(object.getAllOptions(), object._setMetrics()), [
        -105,
        5
    ], 'Circle anchor top/right has been set correctly.');


    object.setOption('anchor', 'center/left');

    test.assertEquals(object._getAnchorPoint(object.getAllOptions(), object._setMetrics()), [
        5,
        -50
    ], 'Circle anchor center/left has been set correctly.');

    object.setOption('anchor', 'center');

    test.assertEquals(object._getAnchorPoint(object.getAllOptions(), object._setMetrics()), [
        -50,
        -50
    ], 'Circle anchor center has been set correctly.');

    object.setOption('anchor', 'center/right');

    test.assertEquals(object._getAnchorPoint(object.getAllOptions(), object._setMetrics()), [
        -105,
        -50
    ], 'Circle anchor center/right has been set correctly.');


    object.setOption('anchor', 'bottom/left');

    test.assertEquals(object._getAnchorPoint(object.getAllOptions(), object._setMetrics()), [
        5,
        -105
    ], 'Circle anchor bottom/left has been set correctly.');

    object.setOption('anchor', 'bottom/center');

    test.assertEquals(object._getAnchorPoint(object.getAllOptions(), object._setMetrics()), [
        -50,
        -105
    ], 'Circle anchor bottom/center has been set correctly.');

    object.setOption('anchor', 'bottom/right');

    test.assertEquals(object._getAnchorPoint(object.getAllOptions(), object._setMetrics()), [
        -105,
        -105
    ], 'Circle anchor bottom/right has been set correctly.');

    test.done();

});
