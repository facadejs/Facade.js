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

casper.test.begin('Setting/getting entity options.', function suite(test) {

    'use strict';

    var object = new Facade.Entity();

    test.assertEquals(object._options, undefined, 'Object options have not been set.');

    object._options = object._defaultOptions();

    test.assertEquals(object._options, {
        x: 0,
        y: 0,
        anchor: 'top/left',
        rotate: 0,
        scale: 1
    }, 'Object options have been set correctly.');

    test.assertEquals(object.getOption('x'), 0, 'Getting object option (single key).');

    test.assertEquals(object.getOption('z'), undefined, 'Getting an object option that doesn\'t exist (single key).');

    test.assertEquals(object.getAllOptions(), {
        x: 0,
        y: 0,
        anchor: 'top/left',
        rotate: 0,
        scale: 1
    }, 'Getting object options (mulitple keys).');

    test.assertEquals(object.setOption('x', 100), 100, 'Setting and getting an object option (single key, integer).');
    test.assertEquals(object.setOption('anchor', 'top/right'), 'top/right', 'Setting and getting an object option (single key, string).');

    test.assertEquals(object.setOption('z', 9000), undefined, 'Setting an object option that doesn\'t exist (single key).');

    try {

        object.setOption('x', '100');

        test.fail('Testing the validity of an invalid option value.');

    } catch (e) { test.pass(e); }

    object.setOption('x', 200);

    test.assertEquals(object.getOption('x'), 200, 'Saving option values to an entity (integer).');

    object.setOption('anchor', 'top/left');

    test.assertEquals(object.getOption('x'), 200, 'Saving option values to an entity (string).');

    object.setOption('x', 400, true);

    test.assertEquals(object.getOption('x'), 200, 'Not saving option values to an entity.');

    test.assertEquals(object.setOptions({ x: 500, y: 500 }), {
        x: 500,
        y: 500,
        anchor: 'top/left',
        rotate: 0,
        scale: 1
    }, 'Setting and getting an object option (multiple keys).');

    object.setOptions({ x: 0, y: 0 });

    test.assertEquals(object.getAllOptions(), {
        x: 0,
        y: 0,
        anchor: 'top/left',
        rotate: 0,
        scale: 1
    }, 'Saving multiple options to an entity.');

    object.setOptions({ x: 100, y: 100 }, true);

    test.assertEquals(object.getAllOptions(), {
        x: 0,
        y: 0,
        anchor: 'top/left',
        rotate: 0,
        scale: 1
    }, 'Not saving multiple options to an entity.');

    try {

        test.assertEquals(object.setOptions({ x: '9000' }), {
            x: 500,
            y: 500,
            anchor: 'top/left',
            rotate: 0,
            scale: 1
        }, 'Testing the validity of an invalid option value (multiple keys).');

        test.fail();

    } catch (e) { test.pass(e); }

    object._options = object._defaultOptions({ z: null });

    test.assertEquals(object.getOption('z'), null, 'Getting a custom object option that was added through _defaultOptions.');

    test.done();

});

casper.test.begin('Setting/getting entity metrics.', function suite(test) {

    'use strict';

    var object = new Facade.Entity();

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

    test.assertEquals(object.getMetric('z'), null, 'Getting a custom object metric that was added through _defaultMetrics.');

    object._metrics = { x: 100, y: 100, width: 200, height: 200 };

    test.assertEquals(object.getAllMetrics(), {
        x: 100,
        y: 100,
        width: 200,
        height: 200
    }, 'Getting all object metrics.');

    test.done();

});
