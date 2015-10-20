var path = require('path');
var spawn = require('child_process').spawn;

module.exports = function (eslintrc, options) {
    var child;
    var args = [
        '-P8', // max 8 concurrent eslint processes
        '-n200', // max 200 files per process. Feel free to optimize if you can
        path.resolve(__dirname, './node_modules/.bin/eslint'),
        '--no-eslintrc',
        '-c',
        eslintrc
    ];

    if (!options.warnings) {
        args.push('--quiet');
    }

    child = spawn("xargs", args, {stdio: ['pipe', process.stdout, process.stderr]});
    return child;
};
