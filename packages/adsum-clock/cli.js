#!/usr/bin/env node

'use strict';

const chalk = require('chalk');
const fs = require('fs-extra');

/*fs.copy(`${__dirname}/src/adsumClock.less`, path.resolve('src/components/adsum-clock/adsumClock.less'))
  .then(() => console.log(chalk.green("Success!")) )
  .catch(err => console.error(err))*/


  fs.copy(`${__dirname}/index.js`, path.resolve('src/components/adsum-clock/index.js'))
  .then(() => fs.copy(`${__dirname}/src`, path.resolve('src/components/adsum-clock/src')))
  .then(() => console.log(chalk.green("Success!")) )
  .catch(err => console.error(err))