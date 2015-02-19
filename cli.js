#!/usr/bin/env node
'use strict';
var meow = require('meow');
var sazPlayer = require('./');

var cli = meow({
  help: [
    'Usage',
    '  saz-player <input>',
    '',
    'Example',
    '  saz-player Unicorn'
  ].join('\n')
});

sazPlayer(cli.input[0]);
