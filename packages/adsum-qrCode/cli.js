#!/usr/bin/env node


const chalk = require('chalk');
const fs = require('fs-extra');
const path = require('path');

const commander = require('commander');

let cmdValue = '';
const program = require('commander');

program
    .usage('npx @adactive/arc-qrCode copy')
    .option('--no-install', 'npx option')
    .option('--less-only', 'just copy the style')
    .action((cmd) => {
        cmdValue = cmd;
    })
    .parse(process.argv);

if (cmdValue === 'copy') {
    if (program.lessOnly) {
        fs.copy(`${__dirname}/src/adsumQrCode.less`, path.resolve('src/components/adsum-qrCode/adsumQrCode.less'))
            .then(() => console.log(chalk.green('Success!')))
            .catch(err => console.error(err));
    } else {
        fs.copy(`${__dirname}/index.js`, path.resolve('src/components/adsum-qrCode/index.js'))
            .then(() => fs.copy(`${__dirname}/src`, path.resolve('src/components/adsum-qrCode/src')))
            .then(() => console.log(chalk.green('Success!')))
            .catch(err => console.error(err));
    }
}
