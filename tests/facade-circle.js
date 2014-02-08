/*global require, casper, Facade*/

require('../polyfills/requestAnimationFrame-polyfill');
require('../facade');

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

    test.assertEquals(object.getAllOptions(), {
        x: 0,
        y: 0,
        anchor: 'top/left',
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
        anchor: 'top/left',
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

casper.test.begin('Running _configOptions on circle options.', function suite(test) {

    'use strict';

    var object = new Facade.Circle({ x: 10, y: 10, radius: 20, opacity: 50 });

    test.assertEquals(object._configOptions(object.getAllOptions()), {
        x: 10,
        y: 10,
        anchor: 'top/left',
        shadowBlur: 0,
        shadowColor: '#000',
        shadowOffsetX: 0,
        shadowOffsetY: 0,
        opacity: 50,
        points: [ [ 0, 0, 20, 0, 6.283185307179586 ] ],
        fillStyle: '',
        strokeStyle: '',
        lineWidth: 1,
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