#!/usr/bin/env node
const spawnSync = require('child_process').spawnSync;

const lintFileGroup = require('./lib/lintFileGroup');
const lintGitFiles = require('./lib/lintGitFiles');
const opt = require('node-getopt').create([
    ['w', 'warnings', 'enable warnings'],
    ['e', 'es6', 'allow es6 in .js files'],
    ['', 'git', 'lint only staged git files'],
    ['', 'root[=path]', 'look for js files in this directory'],
    ['h', 'help', 'display this help'],
    ['f', 'format=format', 'set output format'],
    ['v', 'version', 'display eslint version info']
])
.bindHelp()
.parseSystem();

if (opt.options.version) {
    const esLintVer = spawnSync('eslint', ['-v']);
    process.stdout.write(esLintVer.stdout);
    process.exit();
} else if (opt.options.git) {
    process.exit(lintGitFiles(opt));
} else {
    process.exit(lintFileGroup(opt));
}
