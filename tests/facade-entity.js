/*global require, casper, Facade*/

require('../polyfills/requestAnimationFrame-polyfill');
require('../facade');

casper.test.info('Facade.Entity');

casper.test.begin('Entity object created.', function suite(test) {

    'use strict';

    var object = new Facade.Entity();

    test.assertType(Facade.Entity, 'function', 'Entity object extists.');
    test.assertInstanceOf(object, Facade.Entity, 'Object is an instance of Facade.Entity.');

    test.done();

});

casper.test.begin('Setting/getting entity default options.', function suite(test) {

    'use strict';

    var object = new Facade.Entity();

    test.assertEquals(object._options, undefined, 'Default options have not been set.');

    test.assertEquals(object._defaultOptions(), {
        x: 0,
        y: 0,
        anchor: 'top/left',
        rotate: 0,
        scale: 1
    }, 'Default options have been set correctly.');

    test.assertEquals(object._defaultOptions({ test: true }), {
        x: 0,
        y: 0,
        anchor: 'top/left',
        rotate: 0,
        scale: 1,
        test: true
    }, 'Custom default options have been set correctly.');

    test.done();

});

casper.test.begin('Setting/getting entity metrics.', function suite(test) {

    'use strict';

    var object = new Facade.Entity();

    test.assertEquals(object._metrics, undefined, 'Default metrics have not been set.');

    test.assertEquals(object._defaultMetrics(), {
        x: null,
        y: null,
        width: null,
        height: null
    }, 'Default metrics have been set correctly.');

    test.assertEquals(object._defaultMetrics({ scale: null }), {
        x: null,
        y: null,
        width: null,
        height: null,
        scale: null
    }, 'Custom default metrics have been set correctly.');

    test.done();

});

casper.test.begin('Getting anchor position with Entity._getAnchorPoint (no border)', function suite(test) {

    'use strict';

    var rect = new Facade.Rect({ width: 100, height: 100 });

    test.assertEquals(rect._getAnchorPoint(
        rect.setOptions({ anchor: 'top/left' }),
        rect.getAllMetrics()
    ), [ 0, 0 ], 'Anchor for top/left set correctly.');

    test.assertEquals(rect._getAnchorPoint(
        rect.setOptions({ anchor: 'top/center' }),
        rect.getAllMetrics()
    ), [ -50, 0 ], 'Anchor for top/center set correctly.');

    test.assertEquals(rect._getAnchorPoint(
        rect.setOptions({ anchor: 'top/right' }),
        rect.getAllMetrics()
    ), [ -100, 0 ], 'Anchor for top/right set correctly.');

    test.assertEquals(rect._getAnchorPoint(
        rect.setOptions({ anchor: 'center/left' }),
        rect.getAllMetrics()
    ), [ 0, -50 ], 'Anchor for center/left set correctly.');

    test.assertEquals(rect._getAnchorPoint(
        rect.setOptions({ anchor: 'center' }),
        rect.getAllMetrics()
    ), [ -50, -50 ], 'Anchor for center set correctly.');

    test.assertEquals(rect._getAnchorPoint(
        rect.setOptions({ anchor: 'center/right' }),
        rect.getAllMetrics()
    ), [ -100, -50 ], 'Anchor for center/right set correctly.');

    test.assertEquals(rect._getAnchorPoint(
        rect.setOptions({ anchor: 'bottom/left' }),
        rect.getAllMetrics()
    ), [ 0, -100 ], 'Anchor for bottom/left set correctly.');

    test.assertEquals(rect._getAnchorPoint(
        rect.setOptions({ anchor: 'bottom/center' }),
        rect.getAllMetrics()
    ), [ -50, -100 ], 'Anchor for bottom/center set correctly.');

    test.assertEquals(rect._getAnchorPoint(
        rect.setOptions({ anchor: 'bottom/right' }),
        rect.getAllMetrics()
    ), [ -100, -100 ], 'Anchor for bottom/right set correctly.');

    test.done();

});

casper.test.begin('Getting anchor position with Entity._getAnchorPoint (10px border)', function suite(test) {

    'use strict';

    var rect = new Facade.Rect({ width: 100, height: 100, lineWidth: 10 });

    test.assertEquals(rect._getAnchorPoint(
        rect.setOptions({ anchor: 'top/left' }),
        rect.getAllMetrics()
    ), [ 5, 5 ], 'Anchor for top/left set correctly.');

    test.assertEquals(rect._getAnchorPoint(
        rect.setOptions({ anchor: 'top/center' }),
        rect.getAllMetrics()
    ), [ -50, 5 ], 'Anchor for top/center set correctly.');

    test.assertEquals(rect._getAnchorPoint(
        rect.setOptions({ anchor: 'top/right' }),
        rect.getAllMetrics()
    ), [ -105, 5 ], 'Anchor for top/right set correctly.');

    test.assertEquals(rect._getAnchorPoint(
        rect.setOptions({ anchor: 'center/left' }),
        rect.getAllMetrics()
    ), [ 5, -50 ], 'Anchor for center/left set correctly.');

    test.assertEquals(rect._getAnchorPoint(
        rect.setOptions({ anchor: 'center' }),
        rect.getAllMetrics()
    ), [ -50, -50 ], 'Anchor for center set correctly.');

    test.assertEquals(rect._getAnchorPoint(
        rect.setOptions({ anchor: 'center/right' }),
        rect.getAllMetrics()
    ), [ -105, -50 ], 'Anchor for center/right set correctly.');

    test.assertEquals(rect._getAnchorPoint(
        rect.setOptions({ anchor: 'bottom/left' }),
        rect.getAllMetrics()
    ), [ 5, -105 ], 'Anchor for bottom/left set correctly.');

    test.assertEquals(rect._getAnchorPoint(
        rect.setOptions({ anchor: 'bottom/center' }),
        rect.getAllMetrics()
    ), [ -50, -105 ], 'Anchor for bottom/center set correctly.');

    test.assertEquals(rect._getAnchorPoint(
        rect.setOptions({ anchor: 'bottom/right' }),
        rect.getAllMetrics()
    ), [ -105, -105 ], 'Anchor for bottom/right set correctly.');

    test.done();

});

casper.test.begin('Getting stroke offset with Entity._getStrokeWidthOffset', function suite(test) {

    'use strict';

    var rect = new Facade.Rect({ width: 100, height: 100 });

    test.assertEquals(rect._getStrokeWidthOffset(
        rect.setOptions()
    ), 0, 'No stroke offset was returned as lineWidth was not specified.');

    test.assertEquals(rect._getStrokeWidthOffset(
        rect.setOptions({ lineWidth: 10 })
    ), 5, 'Stroke offset calculated correctly.');

    test.done();

});

// Facade.Entity.prototype._applyTransforms can't be tested as it makes context changes to the canvas only.

casper.test.begin('Getting entity options with Entity.getOption', function suite(test) {

    'use strict';

    var rect = new Facade.Rect({ width: 100, height: 100 });

    test.assertEquals(rect.getOption('width'), 100, 'Option was set correctly.');

    rect.setOptions({ width: 200 });

    test.assertEquals(rect.getOption('width'), 200, 'Option was set correctly.');

    test.done();

});

casper.test.begin('Getting all entity options with Entity.getAllOptions', function suite(test) {

    'use strict';

    var rect = new Facade.Rect({ width: 100, height: 100 });

    test.assertEquals(rect.getAllOptions(),
        {
            x: 0,
            y: 0,
            anchor: 'top/left',
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
            width: 100,
            height: 100,
            rotate: 0,
            scale: 1
        }, 'Options were set correctly.');

    rect.setOptions({ width: 200 });

    test.assertEquals(rect.getAllOptions(),
        {
            x: 0,
            y: 0,
            anchor: 'top/left',
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
            width: 200,
            height: 100,
            rotate: 0,
            scale: 1
        }, 'Options were set correctly.');

    test.done();

});

casper.test.begin('Setting an entity option with Entity.setOption', function suite(test) {

    'use strict';

    var rect = new Facade.Rect({ width: 100, height: 100 });

    test.assertEquals(rect.setOptions({ width: 200 }).width, 200, 'Option was set correctly.');

    try {

        test.assertEquals(rect.setOptions({ width: '400' }).width, '400', 'Testing the validity of an invalid option value.');

        test.fail();

    } catch (e) { test.pass(e); }

    test.done();

});

casper.test.begin('Setting entity options with Entity.setOptions', function suite(test) {

    'use strict';

    var rect = new Facade.Rect({ width: 100, height: 100 });

    test.assertEquals(rect.setOptions({ width: 200, height: 200 }),
        {
            x: 0,
            y: 0,
            anchor: 'top/left',
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
            width: 200,
            height: 200,
            rotate: 0,
            scale: 1
        }, 'Options were set correctly.');

    try {

        test.assertEquals(rect.setOptions({ width: '400', height: '400' }),
            {
                x: 0,
                y: 0,
                anchor: 'top/left',
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
                width: '400',
                height: '400',
                rotate: 0,
                scale: 1
            }, 'Testing the validity of invalid option values.');

        test.fail();

    } catch (e) { test.pass(e); }

    test.done();

});

casper.test.begin('Setting entity options with Entity.setOptions and interger operators', function suite(test) {

    'use strict';

    var rect = new Facade.Rect({ x: 100, y: 100, width: 100, height: 100 });

    test.assertEquals(rect.setOptions({ x: '+=5', y: '+=5' }),
        {
            x: 105,
            y: 105,
            anchor: 'top/left',
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
            width: 100,
            height: 100,
            rotate: 0,
            scale: 1
        }, 'Options were set correctly.');

    test.assertEquals(rect.setOptions({ x: '-=5', y: '-=5' }),
        {
            x: 100,
            y: 100,
            anchor: 'top/left',
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
            width: 100,
            height: 100,
            rotate: 0,
            scale: 1
        }, 'Options were set correctly.');

    test.done();

});

casper.test.begin('Getting entity metrics with Entity.getMetric', function suite(test) {

    'use strict';

    var rect = new Facade.Rect({ width: 100, height: 100 });

    test.assertEquals(rect.getMetric('width'), 100, 'Metric was set correctly.');

    test.done();

});

casper.test.begin('Getting all entity metrics with Entity.getAllMetrics', function suite(test) {

    'use strict';

    var rect = new Facade.Rect({ width: 100, height: 100 });

    test.assertEquals(rect.getAllMetrics(), {
        x: 0,
        y: 0,
        width: 100,
        height: 100
    }, 'Metrics were set correctly.');

    test.done();

});

// Facade.Entity.prototype.draw can't be tested as it makes context changes to the canvas only.
