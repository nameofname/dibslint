require('es6-promise').polyfill();

var opt = require('node-getopt').create([
    ['w', 'warnings', 'enable warnings'],
    ['e', 'es6', 'allow es6 in .js files'],
    ['', 'root[=path]', 'look for js files in this directory'],
    ['h', 'help', 'display this help']
])
.bindHelp()
.parseSystem();

var path = require('path');
var glob = require('glob');
var fs = require('fs');
var getLinter = require('./getLinter');
var promiseChild = require('./promiseChild');
var reactLinter = getLinter(path.resolve(__dirname, './configs/react.js'), opt.options);
var es6Linter = getLinter(path.resolve(__dirname, './configs/es6.js'), opt.options);
var es5Linter = getLinter(path.resolve(__dirname, './configs/es5.js'), opt.options);
var root = opt.options.root || '.';
var files;

if (opt.argv.length) {
    files = opt.argv;
} else {
    files = glob.sync(root + '/**/*.@(js|jsx)');
}

files.forEach(function (filePath) {
    if (filePath.match(/.jsx$/)) {
        reactLinter.stdin.write(filePath + '\0');
    } else if (filePath.match(/.es.js$/) || (opt.options.es6 && filePath.match(/.js$/))) {
        es6Linter.stdin.write(filePath + '\0');
    } else if (filePath.match(/.js$/)) {
        es5Linter.stdin.write(filePath + '\0');
    }
});
reactLinter.stdin.end();
es6Linter.stdin.end();
es5Linter.stdin.end();

Promise.all([
    promiseChild(reactLinter),
    promiseChild(es6Linter),
    promiseChild(es5Linter)
]).then(function (args) {
    if (!(args[0] === args[1] === args[2] === 0)) {
        process.exit(1);
    }
});
