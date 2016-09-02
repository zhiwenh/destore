'use strict';
const IPFS = require('./ipfs/ipfs.js');
const Ethereum = require('./ethereum/ethereum.js');
const path = require('path');
const Upload = require('./../models/Upload.js');

const config = require('./config/config.js');
/*
  Adds file to IPFS, deploys sender contract with IPFS hash address, then uploads data to the Upload database
  @ filePath - string - only does a single file in the electron app
  @ masterAddress - string - the address of the MasterList
  @ callback - function - returns the doc created from the Upload.db storage
*/

module.exports = (filePath, fileName, callback) => {

  if (typeof filePath === 'string') {
    filePath = [filePath];
  }
  IPFS.addFiles(filePath)
    .then(hashArr => {

      // this file only sends out one file. if possible refactor it
      const hashAddresses = [];
      const fileSizes = [];
      const promiseArr = [];
      const splitArr = [];

      for (let i = 0; i < hashArr.length; i++) {
        const hashAddress = hashArr[0].hash;
        const half1 = hashAddress.substring(0, 23);
        const half2 = hashAddress.substring(23, 46);
        const fileSize = hashArr[0].size;
        fileSizes.push(fileSize);
        hashAddresses.push(hashAddress);
        splitArr.push([half1, half2]);
      }
      Ethereum.execAt('DeStore', config.contracts.deStore)
        .senderAddFile(splitArr, fileName, 0, fileSizes)
        .then(tx => {
          console.log('File contract sucessfully deployed');
          const upload = {
            fileName: path.basename(filePath),
            filePath: filePath,
            fileSize: fileSizes[0],
            hashAddress: hashAddresses[0],
            uploadTime : new Date()
          };
          Upload.db.insert(upload, (err, res) => {
            if (err) {
              if (callback) callback(err);
              else throw ('Error saving contract in upload file ' + err);
            } else {
              console.log('All files contracts sucessfully saved');
              if (callback) callback(null, res);
              else console.log(res);
            }
          });
        })
        .catch(err => {
          if (callback) callback(err);
          else throw ('Error deploying contract in upload file: ' + err);
        });
    })
    .catch(err => {
      if (callback) callback(err);
      else throw ('Error deploying contract in upload file: ' + err);
    });
};
