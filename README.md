# dibslint

A wrapper around eslint that is smart enough to flag es6 code in files that do not end with .es.js. It is also a central location for 1stdibs eslint configs.

## Usage in PHPStorm

Make your eslint configuration settings look like this. Note that the IDE will not be able to show errors for es6 code in files without an .es.js extenstion.
<img src="http://i.imgur.com/tSn6dPP.png">

## Precommit hook
Use the `--git` flag with the `pre-commit` package on npm to lint changed files on each commit.
