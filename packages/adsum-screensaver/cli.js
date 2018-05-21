#!/usr/bin/env node

const chalk = require('chalk');
const fs = require('fs-extra');
const path = require('path');

let cmdValue = '';
const program = require('commander');

program
    .usage('npx @adactive/arc-screensaver copy')
    .option('--no-install', 'npx option')
    .option('--less-only', 'just copy the style')
    .action((cmd) => {
        cmdValue = cmd;
    })
    .parse(process.argv);

if (cmdValue === 'copy') {
    if (program.lessOnly) {
        fs.copy(`${__dirname}/src/screenSaver.less`, path.resolve('src/components/adsum-screensaver/screenSaver.less'))
            .then(() => console.log(chalk.green('Success!')))
            .catch(console.error);
    } else {
        fs.copy(`${__dirname}/index.js`, path.resolve('src/components/adsum-screensaver/index.js'))
            .then(() => fs.copy(`${__dirname}/src`, path.resolve('src/components/adsum-screensaver/src')))
            .then(() => console.log(chalk.green('Success!')))
            .catch(console.error);
    }
}
