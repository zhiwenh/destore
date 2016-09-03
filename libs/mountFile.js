'use strict';

// user puts in file path, user assigns a name to the file, it gets added to IPFS and the
// hash returned is put into nedb, a promise of the nedb database is returned
// this will allow the creation of a method that uses ipfs to break the object up
// according to its merkle dag
// have this happen when they drag the file into the box

const IPFS = require('./ipfs/ipfs.js');
const Upload = require('./../models/Upload.js');
const promisify = require('es6-promisify');
const config = require('./config/config.js');
const fs = require('fs');
const path = require('path');

/**
 * mounts a single file
 * @filePath {String} or {Array} - path to file
 * @returns Promise - res is an array of the doc added to nedb
 **/
module.exports = promisify((filePath, fileSize, callback) => {
  const fileName = path.basename(filePath);
  promisify(fs.stat)(filePath)
    .then(stats => {
      if (!stats.isFile()) callback(new Error('Not a file'), null);
      fileSize = stats.size;
      return IPFS.addFiles(filePath);
    })
    .then(hashArr => {
      const upload = {
        fileName: fileName,
        filePath: filePath,
        fileSize: fileSize,
        hashAddress: hashArr[0].hash,
        blocks: [],
        blockSizes: [],
        uploadTime: new Date()
      };
      Upload.db.insert(upload, (err, res) => {
        if (err) {
          callback(err, null);
        } else {
          callback(null, res);
        }
      });
    })
    .catch(err => {
      callback(err, null);
    });
});
