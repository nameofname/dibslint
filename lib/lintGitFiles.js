/**
 * User: Rob Richard
 * Date: 10/21/15
 * Time: 12:06 PM
 */

'use strict';

var configHelpers = require('./configHelpers');
var spawnSync = require('spawn-sync');
var omit = require('lodash.omit');
var assign = require('lodash.assign');
var os = require('os');

module.exports = function (opt) {
    var gitOptions = {
        env: omit(process.env, 'GIT_DIR', 'GIT_INDEX_FILE', 'GIT_WORK_TREE'),
        encoding: 'utf8'
    };
    var gitRoot = spawnSync(
        'git',
        ['rev-parse', '--show-toplevel'],
        gitOptions
    ).stdout.trim();

    gitOptions.cwd = gitRoot;

    var files = spawnSync(
        'git',
        ['diff', '--cached', '--name-only', '--diff-filter=ACMR'],
        gitOptions
    ).stdout.trim().split(os.EOL);

    return files.reduce(function (result, fileName) {
        var config = configHelpers.getConfig(fileName, opt);
        var args = configHelpers.getLinterOptions(config, opt);
        var lintResult;
        var fileContents;

        if (!config) {
            return result;
        }

        fileContents = spawnSync('git', ['show', ':' + fileName], gitOptions).stdout;

        if (!fileContents) {
            return result;
        }

        lintResult = spawnSync(
            configHelpers.linterExecutable,
            args.concat(['--stdin', '--stdin-filename', fileName]),
            assign({
                input: fileContents
            }, gitOptions)
        );

        process.stdout.write(lintResult.stdout);
        process.stderr.write(lintResult.stderr);

        if (lintResult.status !== 0 || lintResult.stdout || lintResult.stderr) {
            result = 1;
        }

        return result;
    }, 0);
};
