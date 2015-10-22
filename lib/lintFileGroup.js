/**
 * User: Rob Richard
 * Date: 10/21/15
 * Time: 11:48 AM
 */

'use strict';
var reduce = require('lodash.reduce');
var configHelpers = require('./configHelpers');
var glob = require('glob');
var spawnSync = require('spawn-sync');

module.exports = function (opt) {
    var files;
    var root = opt.options.root || '.';
    var fileGroups = {};

    if (opt.argv.length) {
        files = opt.argv;
    } else {
        files = glob.sync(root + '/**/*.@(js|jsx)');
    }

    files.forEach(function (filePath) {
        var configKey = configHelpers.getConfigKey(filePath, opt);
        fileGroups[configKey] = fileGroups[configKey] || '';
        fileGroups[configKey] += filePath + '\0';
    });

    return reduce(fileGroups, function (result, input, key) {
        var args = [
            '-0',
            '-P8', // max 8 concurrent eslint processes
            '-n200' // max 200 files per process. Feel free to optimize if you can
        ];

        var lintResult = spawnSync(
            "xargs",
            args.concat(
                [configHelpers.getLinterExecutable()],
                configHelpers.getLinterOptions(configHelpers.configMap[key], opt)
            ),
            {
                input: input,
                encoding: 'utf8'
            }
        );

        process.stdout.write(lintResult.stdout);
        process.stderr.write(lintResult.stderr);

        if (lintResult.status !== 0) {
            result = 1;
        }

        return result;
    }, 0);
};
