'use strict';
const chokidar = require('chokidar');
const path = require('path');
const fs = require('fs');
const log = console.log.bind(console);

class Watcher {
	constructor() {
		this.fileList = {};
	}
	
	startWatcher(dir) {
		const watcher = chokidar.watch(dir, {
			ignored: /[\/\\]\./,
			persistent: true,
		});

		watcher
			.on('add', pathDir => {
				log(`File ${pathDir} has been added`, getFilesizeInBytes(pathDir));
				this.fileList[path.basename(pathDir)] = pathDir;
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

module.exports = new Watcher();