'use strict';

// gives eslint correct permissions since yarn installs it without executable
// rights
const { spawn } = require('child_process');

spawn('chmod', [
    '655',
    require.resolve('eslint/bin/eslint')
]);
