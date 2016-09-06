'use strict';
const IPFS = require('./../ipfs/ipfs.js');
const Host = require('./../../models/Host.js');
const promisify = require('es6-promisify');
const config = require('./../config/config.js');
const path = require('path');
const fs = require('fs');

/**
* Deletes a hash address file, changes db status, then unpins file from ipfs node
* @hashAddress {String}
* @returns {Promise} - response contains the path of the file that was deleted
**/
module.exports = promisify((hashAddress, callback) => {
  Host.db.findOne({hashAddress: hashAddress}, (err, doc) => {
    if (err || doc === null) {
      callback(new Error('File not found'), null);
      return;
    }
    promisify(fs.stat)(doc.filePath)
      .then(stats => {
        if (!stats.isFile()) {
          callback(new Error('Not a file'), null);
          return;
        }
        fs.unlink(doc.filePath, err => {
          if (err) {
            callback(err, null);
            return;
          }
          Host.db.update({hashAddress: hashAddress}, {$set: {isHosted: false, hostTime: null}}, (err, num) => {
            if (err) {
              callback(err, null);
              return;
            }
            IPFS.unpin(hashAddress).then().catch();
            callback(null, doc.filePath);
          });
        });
      })
      .catch(err => {
        callback(err, null);
      });
  });
});
