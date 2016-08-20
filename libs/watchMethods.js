'use strict';
const chokidar = require('chokidar');
const path = require('path');

const log = console.log.bind(console);

class Watch {
  constructor() {
    this.fileList = {};
  }
  
  startWatch(dir) {
    const watcher = chokidar.watch(dir, {
      ignored: /[\/\\]\./,
      persistent: true,
    });

    watcher
      .on('add', pathDir => {
        log(`File ${pathDir} has been added`);
        this.fileList[path.basename(pathDir)] = pathDir;
        console.log(this.fileList)
      })
      .on('change', pathDir => {
        log(`File ${pathDir} has been changed`);
      })
      .on('unlink', pathDir => {
        log(`File ${pathDir} has been removed`);
        delete this.fileList[path.basename(pathDir)];
      });
  }
};

var watch = new Watch();

module.exports = watch;