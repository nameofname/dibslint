/**
 * User: Rob Richard
 * Date: 10/21/15
 * Time: 12:06 PM
 */

'use strict';

var configHelpers = require('./configHelpers');
var spawnSync = require('spawn-sync');
var os = require('os');

module.exports = function (opt) {
    var files = spawnSync(
        'git',
        ['diff', '--cached', '--name-only', '--diff-filter=ACMR'],
        {encoding: 'utf8'}
    ).stdout.trim().split(os.EOL);

    return files.reduce(function (result, fileName) {
        var fileContents = spawnSync('git', ['show', ':' + fileName], {encoding: 'utf8'});
        var config = configHelpers.getConfig(fileName, opt);
        var args = configHelpers.getLinterOptions(config, opt);
        var lintResult = spawnSync(
            configHelpers.linterExecutable,
            args.concat(['--stdin', '--stdin-filename', fileName]),
            {
                input: fileContents.stdout,
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
