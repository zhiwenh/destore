'use strict';

const IPFS = require('./../ipfs/ipfs.js');
const Upload = require('./../../models/Upload.js');
const promisify = require('es6-promisify');
const config = require('./../config/config.js');
const fs = require('fs');
const path = require('path');

/**
 * Mounts a single file
 * @filePath {String} or {Array} - path to file
 * @fileSize {String} - the size of file
 * @returns Promise - res is an Object of the doc added to nedb
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
        hashAddress: hashArr[0].hash, // the main hash
        blocks: [], // hashes to the blocks
        blockSizes: [],
        receivers: [],
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
