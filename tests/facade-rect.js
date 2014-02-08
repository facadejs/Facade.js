/*global require, casper, Facade*/

require('../polyfills/requestAnimationFrame-polyfill');
require('../facade');

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
        width: 0,
        height: 0
    }, 'Object default options have been set correctly.');

    test.assertEquals(object.setOptions({ width: 200, height: 200 }), {
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
        shadowBlur: 0,
        shadowColor: '#000',
        shadowOffsetX: 0,
        shadowOffsetY: 0,
        opacity: 50,
        points: [ [ 0, 0 ], [ 200, 0 ], [ 200, 200 ], [ 0, 200 ] ],
        fillStyle: '',
        strokeStyle: '',
        lineWidth: 1,
        lineCap: 'default',
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

    test.assertEquals(object._setMetrics(), {
        x: 10,
        y: 10,
        width: 200,
        height: 200
    }, 'Rect metrics have been set correctly.');

    object.setOptions({ lineWidth: 10 });

    test.assertEquals(object._setMetrics(), {
        x: 10,
        y: 10,
        width: 210,
        height: 210
    }, 'Rect metrics have been set correctly.');

    test.done();

});
