/*global casper*/

casper.test.info('Error');

casper.test.begin('Testing Travis-CI', function suite(test) {

    'use strict';

    test.assertEquals(true, false, 'Error');

    test.done();

});
