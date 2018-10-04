#!/usr/bin/env node


const chalk = require('chalk');
const fs = require('fs-extra');
const path = require('path');

let cmdValue = '';
const program = require('commander');

program
    .usage('npx @adactive/arc-clock copy')
    .option('--no-install', 'npx option')
    .option('--less-only', 'just copy the style')
    .action((cmd) => {
        cmdValue = cmd;
    })
    .parse(process.argv);

if (cmdValue === 'copy') {
    if (program.lessOnly) {
        fs.copy(`${__dirname}/src/adsumCarousel.less`, path.resolve('src/components/adsum-carousel/adsumCarousel.less'))
            .then(() => fs.copy(
                `${__dirname}/src/subComponents/imageSlide/imageSlide.less`,
                path.resolve('src/components/adsum-carousel/subComponents/imageSlide/imageSlide.less'),
            ))
            .then(() => fs.copy(
                `${__dirname}/src/subComponents/slideWrapper/slideWrapper.less`,
                path.resolve('src/components/adsum-carousel/subComponents/slideWrapper/slideWrapper.less'),
            ))
            .then(() => fs.copy(
                `${__dirname}/src/subComponents/videoPlayer/videoPlayer.less`,
                path.resolve('src/components/adsum-carousel/subComponents/videoPlayer/videoPlayer.less'),
            ))
            .then(() => fs.copy(
                `${__dirname}/src/subComponents/videoSlide/videoSlide.less`,
                path.resolve('src/components/adsum-carousel/subComponents/videoSlide/videoSlide.less'),
            ))
            .then(() => console.log(chalk.green('Success!')))
            .catch(err => console.error(err));
    } else {
        fs.copy(`${__dirname}/index.js`, path.resolve('src/components/adsum-carousel/index.js'))
            .then(() => fs.copy(`${__dirname}/src`, path.resolve('src/components/adsum-carousel/src')))
            .then(() => console.log(chalk.green('Success!')))
            .catch(err => console.error(err));
    }
}
