/*global require, casper, Facade*/

require('../polyfills/requestAnimationFrame-polyfill');
require('../facade');

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

casper.test.begin('Running _configOptions on polygon options.', function suite(test) {

    'use strict';

    var object = new Facade.Polygon({ x: 10, y: 10, opacity: 50 });

    test.assertEquals(object._configOptions(object.getAllOptions()), {
        x: 10,
        y: 10,
        shadowBlur: 0,
        shadowColor: '#000',
        shadowOffsetX: 0,
        shadowOffsetY: 0,
        opacity: 50,
        points: [],
        fillStyle: '',
        strokeStyle: '',
        lineWidth: 1,
        lineCap: 'default',
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

    test.assertEquals(object._setMetrics(), {
        x: 10,
        y: 10,
        width: 200,
        height: 200
    }, 'Polygon metrics have been set correctly.');

    object.setOptions({ lineWidth: 10 });

    test.assertEquals(object._setMetrics(), {
        x: 5,
        y: 5,
        width: 210,
        height: 210
    }, 'Polygon metrics have been set correctly.');

    test.done();

});