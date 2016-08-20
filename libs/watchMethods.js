'use strict';
const chokidar = require('chokidar');
// const path = require('path');

const log = console.log.bind(console);

var Watch = {
  startWatch: (dirPath) => {
    const watcher = chokidar.watch(dirPath, {
      ignored: /[\/\\]\./,
      persistent: true,
    });
    watcher
      .on('add', path => log(`File ${path} has been added`))
      .on('change', path => log(`File ${path} has been changed`))
      .on('unlink', path => log(`File ${path} has been removed`));
  }
};

module.exports = Watch;