#!/usr/bin/env node


const chalk = require('chalk');
const fs = require('fs-extra');
const path = require('path');

let cmdValue = '';
const program = require('commander');

program
    .usage('npx @adactive/arc-keyboard copy')
    .option('--no-install', 'npx option')
    .option('--less-only', 'just copy the style')
    .action((cmd) => {
        cmdValue = cmd;
    })
    .parse(process.argv);

if (cmdValue === 'copy') {
    if (program.lessOnly) {
        fs.copy(`${__dirname}/src/adsumKeyboard.less`, path.resolve('src/components/adsum-keyboard/adsumKeyboard.less'))
            .then(() => console.log(chalk.green('Success!')))
            .catch(err => console.error(err));
    } else {
        fs.copy(`${__dirname}/index.js`, path.resolve('src/components/adsum-keyboard/index.js'))
            .then(() => fs.copy(`${__dirname}/src`, path.resolve('src/components/adsum-keyboard/src')))
            .then(() => console.log(chalk.green('Success!')))
            .catch(err => console.error(err));
    }
}
