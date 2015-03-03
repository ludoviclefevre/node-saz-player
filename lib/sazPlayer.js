'use strict';

var async = require('async'),
    _ = require('lodash'),
    request = require('request'),
    sazParser = require('saz-parser');

module.exports = function (options, callback) {
    var parallelRequestCount = options.parallelRequestCount,
        totalRequestCount = options.totalRequestCount,
        durationInMs = options.duration * 1000,
        sazFile = options.args[0],
        q,
        result = {
            totalResponseTimeInMs: 0,
            totalRequestCount: 0
        };

    function computeAverageResponseTime() {
        result.averageResponseTimeInMs = parseInt(result.totalResponseTimeInMs / result.totalRequestCount, 10);
    }

    function stopQueueExecution(err) {
        q.kill();
        computeAverageResponseTime();
        callback(err, result);
    }

    function computeRequests(err, sessions) {
        if (err) {
            return callback(err);
        }

        if (_.isEmpty(sessions)) {
            return callback("No session in saz file.");
        }

        // For the moment, if SAZ file has more than one session we take the first one
        var firstSessionId = Object.keys(sessions)[0];

        function pushNewTaskInQueue(sessionId) {
            q.push(sessionId, function (err) {
                if (!err) {
                    return;
                }
                stopQueueExecution(err);
            });
        }

        function execRequest(sessionId, callback) {
            pushNewTaskInQueue(sessionId);
            console.log(sessionId);
            var session = sessions[sessionId],
                reqOptions = {
                    url: session.request.url,
                    headers: session.request.headers
                },
                startTime = process.hrtime();

            function reqCallback(err) {
                if (err) {
                    return callback(err);
                }

                var elapsedTimeInMs = process.hrtime(startTime)[1] / 1000000;
                result.totalResponseTimeInMs += elapsedTimeInMs;
                result.totalRequestCount++;

                callback();
            }

            request(reqOptions, reqCallback);
        }

        setTimeout(stopQueueExecution, durationInMs);

        q = async.queue(execRequest, parallelRequestCount);
        for (var i = 0; i < parallelRequestCount; i++) {
            pushNewTaskInQueue(firstSessionId);
        }
    }

    // SAZ file parsing
    sazParser(sazFile, computeRequests);
};
