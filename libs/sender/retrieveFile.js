'use strict';
const Upload = require('./../../models/Upload.js');
const promisify = require('es6-promisify');
const IPFS = require('./../ipfs/ipfs.js');
const path = require('path');
const config = require('./../config/config.js');
const mkdir = require('./../sender/mkdir.js');

/**
* Retrieves hash based on its file name and downloads it into a folder
* @fileName {String}
* @returns {Promise} - location of where file was saved
**/
module.exports = promisify((fileName, callback) => {
  Upload.db.findOne({fileName: fileName}, (err, doc) => {
    if (err || doc === null) {
      callback(new Error('File was not found'), null);
      return;
    }
    const writePath = path.join(config.files.download, fileName);
    mkdir(config.files.download);
    IPFS.download(doc.hashAddress, writePath)
      .then(buffer => {
        callback(null, writePath);
      })
      .catch(err => {
        callback(err, null);
      });
  });

});
