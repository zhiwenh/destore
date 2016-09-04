'use strict';
const IPFS = require('./ipfs/ipfs.js');
const Ethereum = require('./ethereum/ethereum.js');
const path = require('path');
const Upload = require('./../models/Upload.js');
const promisify = require('es6-promisify');
const nestedHexToAscii = require('./nestedHexToAscii.js');

const config = require('./config/config.js');


/*
  Adds file to IPFS, deploys sender contract with IPFS hash address, then uploads data to the Upload database
  @ filePath - string - only does a single file in the electron app
  @ fileName {String} name that user wants file to be callled in contract
  @ callback - function - returns the doc created from the Upload.db storage
*/

/**
* gets hashAdddress of a file based on either filepath or name from db and uploads to DeStore
* @fileName {String} - name of file that has been mounted ex 'kb.png'
* @returns {Array} - the hashes added to the contract
**/

module.exports = promisify((fileName, callback) => {
  Upload.db.findOne({fileName: fileName}, (err, doc) => {
    if (doc === null) {
      callback(new Error('No Upload document was found of name ' + fileName), null);
      return;
    }
    let hashArr;
    let sizeArr;
    // for doc blocs to have existed would have needed to used method to break them up
    if (doc.blocks.length >= 1) {
      hashArr = doc.blocks;
      sizeArr = doc.blockSizes;
    } else {
      hashArr = [doc.hashAddress];
      sizeArr = [doc.fileSize];
    }

    const splitArr = [];
    for (let i = 0; i < hashArr.length; i++) {
      const half1 = hashArr[i].substring(0, 23);
      const half2 = hashArr[i].substring(23, 46);
      splitArr.push([half1, half2]);
    }

    Ethereum.deStore().senderAddFile(splitArr, fileName, 1, sizeArr)
      .then(tx => {
        return Ethereum.deStore().senderGetFileHashes(fileName);
      })
      .then(hexHashes => {
        const asciiHashes = nestedHexToAscii(hexHashes);
        callback(null, asciiHashes);
      })
      .catch(err => {
        callback(err, null);
      });
  });
});
