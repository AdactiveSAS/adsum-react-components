#!/usr/bin/env node

const chalk = require('chalk');
const fs = require('fs-extra');
const path = require('path');
const program = require('commander');

let cmdValue = '';

program
    .usage('npx @adactive/az-scroller copy')
    .option('--no-install', 'npx option')
    .option('--less-only', 'just copy the style')
    .action((cmd) => {
        cmdValue = cmd;
    })
    .parse(process.argv);

if (cmdValue === 'copy') {
    if (program.lessOnly) {
        fs.copy(`${__dirname}/src/azScroller.less`, path.resolve('src/components/adsum-az-scroller/azScroller.less'))
            .then(() => console.log(chalk.green('Success!')))
            .catch(err => console.error(err));
    } else {
        fs.copy(`${__dirname}/index.js`, path.resolve('src/components/adsum-az-scroller/index.js'))
            .then(() => fs.copy(`${__dirname}/src`, path.resolve('src/components/adsum-az-scroller/src')))
            .then(() => console.log(chalk.green('Success!')))
            .catch(err => console.error(err));
    }
}
