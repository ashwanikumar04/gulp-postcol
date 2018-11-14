var through = require('through2');
var PluginError = require('plugin-error');
var readLines = require('n-readlines');
var _ = require("lodash");

module.exports = function (config) {
    'use strict';

    function getData(file) {
        var liner = new readLines(file);
        var lines = [];
        var next;
        while (next = liner.next()) {
            lines.push(next.toString('ascii'));
        }
        return lines;
    }

    return through.obj(function (file, encoding, callback) {
        if (file.isNull()) {
            this.push(file);
            return callback();
        }

        if (file.isStream()) {
            this.emit('error', new PluginError('modify-json', 'Streaming not supported'));
            return callback();
        }

        try {
            var json = JSON.parse(file.contents.toString());
            _.forEach(json.item, function (item) {
                if (_.has(config, item.name)) {
                    var itemConfig = config[item.name];
                    _.forEach(item.event, function (processEvent) {
                        if (_.has(itemConfig, processEvent.listen)) {
                            if (_.has(processEvent, "script")) {
                                var fileName = itemConfig[processEvent.listen];
                                var lines = getData(fileName);
                                processEvent.script.exec = lines;
                            }
                        }
                    });
                }
            });
            file.contents = new Buffer(JSON.stringify(json, null, 4));
        } catch (err) {
            this.emit('error', new PluginError('modify-json', err));
        }
        this.push(file);
        callback();
    });
};