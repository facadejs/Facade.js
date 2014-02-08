/*global require, casper, Facade*/

require('../polyfills/requestAnimationFrame-polyfill');
require('../facade');

casper.test.info('Facade.Group');

casper.test.begin('Group entity object created.', function suite(test) {

    'use strict';

    test.assertType(Facade.Group, 'function', 'Group entity object extists.');
    test.assertInstanceOf(Facade.Group, Facade.Entity, 'Group is an instance of Facade.Entity.');
    test.assertEquals(Facade.Group.constructor, Facade.Entity, 'Group\'s constructor is Facade.Entity.');

    test.done();

});

casper.test.begin('Setting/getting group options.', function suite(test) {

    'use strict';

    var object = new Facade.Group();

    test.assertEquals(object.getAllOptions(), {
        x: 0,
        y: 0,
        anchor: 'top/left'
    }, 'Group default options.');

    test.assertEquals(object.getAllMetrics(), {
        x: null,
        y: null,
        width: null,
        height: null
    }, 'Group default metrics.');

    test.done();

});

casper.test.begin('Running _configOptions on group options.', function suite(test) {

    'use strict';

    var object = new Facade.Group({ x: 10, y: 10 });

    test.assertEquals(object._configOptions(object.getAllOptions()), {
        x: 10,
        y: 10,
        anchor: 'top/left',
        translate: [ 10, 10 ]
    }, 'Custom config options have been set correctly.');

    test.done();

});

casper.test.begin('Add Facade.js entity to Group.', function suite(test) {

    'use strict';

    var group = new Facade.Group(),
        object = new Facade.Entity();

    group.addToGroup(object);

    test.assertEquals(group._objects[0], object, 'Object successfully added to group.');

    test.done();

});

casper.test.begin('Remove Facade.js entity to Group.', function suite(test) {
    'use strict';

    var group = new Facade.Group(),
        object = new Facade.Entity();

    group.addToGroup(object);

    test.assertEquals(group._objects[0], object, 'Object successfully added to group.');

    group.removeFromGroup(object);

    test.assertNotEquals(group._objects[0], object, 'Object successfully removed from group.');

    test.done();

});

casper.test.begin('Setting metrics for a group.', function suite(test) {

    'use strict';

    var group = new Facade.Group(),
        polygon1 = new Facade.Polygon({ points: [ [0, 0], [100, 0], [100, 100], [0, 100] ], lineWidth: 0 }),
        polygon2 = new Facade.Polygon({ x: 100, y: 100, points: [ [0, 0], [100, 0], [100, 100], [0, 100] ], lineWidth: 0 });

    group.addToGroup(polygon1);
    group.addToGroup(polygon2);

    test.assertEquals(group._setMetrics(), {
        x: 0,
        y: 0,
        width: 200,
        height: 200
    }, 'Group metrics have been set correctly.');

    test.done();

});