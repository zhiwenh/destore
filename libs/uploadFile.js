'use strict';
const IPFS = require('./ipfs/ipfs.js');
const Ethereum = require('./ethereum/ethereum.js');
const path = require('path');
const Upload = require('./../models/Host.js');

/*
  @ filePath - string - only does a single file in the electron app
  @ masterAddress - string - the address of the MasterList
  @ callback - function - returns the doc created from the Upload.db storage
*/

module.exports = (filePath, masterAddress, callback) => {
  if (typeof filePath === 'string') {
    filePath = [filePath];
  }
  IPFS.addFiles(filePath)
    .then(res => {
      const hashAddresses = [];
      const fileSizes = [];
      const promiseArr = [];
      for (let i = 0; i < res.length; i++) {
        const hashAddress = res[0].hash;
        const hash1 = hashAddress.substring(0,23);
        const hash2 = hashAddress.substring(23,46);
        const fileSize = res[0].size;

        hashAddresses.push(hashAddress);
        fileSizes.push(fileSize);

        const args = [hash1, hash2, fileSize, masterAddress];
        promiseArr.push(Ethereum.deploy('Sender', args));
      }
      Promise.all(promiseArr)
        .then(instances => {
          console.log('All files contracts sucessfully deployed');
          for (let i = 0; i < instances.length; i++) {
            const upload = {
              fileName: path.basename(filePath[i]),
              filePath: filePath[i],
              fileSize: fileSizes[i],
              hashAddressU: hashAddresses[i],
              contractAddress: instances[i].address,
              uploadTime : new Date()
            };
            Upload.db.insert(upload, (err, res) => {
              console.log('All files contracts sucessfully saved');
              console.log(res);
              callback(null, res);
            });
          }
        })
        .catch(err => {
          callback(err);
          throw ('Error deploying contract in upload file: ' + err);
        });
    })
    .catch(err => {
      callback(err);
      throw('Error adding files ot IPFS in upload file: ' + err);
    });
};
