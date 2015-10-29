#!/usr/bin/env node

var lintFileGroup = require('./lib/lintFileGroup');
var lintGitFiles = require('./lib/lintGitFiles');
var opt = require('node-getopt').create([
    ['w', 'warnings', 'enable warnings'],
    ['e', 'es6', 'allow es6 in .js files'],
    ['', 'git', 'lint only staged git files'],
    ['', 'root[=path]', 'look for js files in this directory'],
    ['h', 'help', 'display this help']
])
.bindHelp()
.parseSystem();

if (opt.options.git) {
    process.exit(lintGitFiles(opt));
} else {
    process.exit(lintFileGroup(opt));
}
