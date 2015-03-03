#!/usr/bin/env node
'use strict';
var program = require('commander'),
    async = require('async'),
    sazPlayer = require('./sazPlayer'),
    args = require('./args');

process.on('SIGINT', function () {
    process.exit();
});

function applicationEnd(err, result) {
    if (err) {
        return console.error(err);
    }
    console.log(result);
}

function waterfallStart(callback) {
    callback(null, program);
}

program
    .version(require('../package.json').version)
    .usage('[options] <sazFile ...>')
    .option('-d, --duration <n>', 'Playing duration in seconds', parseInt)
    .option('-r, --parallelRequestCount [n]', 'Parallel request count', parseInt)
    .option('-t, --totalRequestCount [n]', 'Total request count', parseInt)
    .parse(process.argv);

async.waterfall([
        waterfallStart,
        args.check,
        sazPlayer
    ],
    applicationEnd);

