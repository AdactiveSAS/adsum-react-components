#!/usr/bin/env node

const chalk = require('chalk');
const fs = require('fs-extra');
const path = require('path');
const program = require('commander');

let cmdValue = '';

program
    .usage('npx @adactive/az-scroller copy')
    .option('--no-install', 'npx option')
    .action((cmd) => {
        cmdValue = cmd;
    })
    .parse(process.argv);

if (cmdValue === 'copy') {
    fs.copy(`${__dirname}/index.js`, path.resolve('src/components/adsum-az-scroller/index.js'))
        .then(() => fs.copy(`${__dirname}/src`, path.resolve('src/components/adsum-az-scroller/src')))
        .then(() => console.log(chalk.green('Success!')))
        .catch(err => console.error(err));
}
