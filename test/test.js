/*global describe, it */
'use strict';
var assert = require('assert');
var sazPlayer = require('../');

describe('saz-player', function () {
    it('must throw an exception when using bad arguments', function () {
        sazPlayer();
        assert(false, 'I was too lazy to write any tests. Shame on me.');
    });
});
