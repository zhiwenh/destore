'use strict';

const Upload = require('./../../models/Upload.js');
const promisify = require('es6-promisify');
const config = require('./../config/config.js');
const fs = require('fs');
const path = require('path');
const IPFS = require('./../ipfs/ipfs.js');

// user decides to break up file into the pieces that ipfs supplies

/**
* Breaks up an ipfs hash link into its DAG links. Then saves the hashes into the db
* @fileName {String}
* @returns {Promise} - the DAGLink objects returned from ipfs. {name: String, size: Number, hash: base58 Buffer, hashAddress: String}
**/

module.exports = promisify((fileName, callback) => {
  Upload.db.findOne({fileName: fileName}, (err, doc) => {
    if (err || doc === null) {
      callback(err, doc);
      return;
    }
    IPFS.links(doc.hashAddress)
      .then(links => {
        const blocks = [];
        const blockSizes = [];
        links.forEach(link => {
          blocks.push(link.hashAddress);
          blockSizes.push(link.size);
        });
        Upload.db.update({fileName: fileName}, { $set: { blocks: blocks, blockSizes: blockSizes}}, (err, num) => {
          if (err) callback(err, null);
          else {
            callback(null, links);
          }
        });
      })
      .catch(err => {
        callback(err);
      });
  });
});
