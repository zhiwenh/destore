'use strict';
// hostFile2 - FOR THE NEW DESTORE CONTRACT
const IPFS = require('./ipfs/ipfs.js');
const Ethereum = require('./ethereum/ethereum.js');
const path = require('path');
const Host = require('./../models/Host.js');

const web3 = Ethereum.init();

const nestedHexToAscii = require('./nestedHexToAscii');

const filesConfig = require('./config/config.js').files;
const contractConfig = require('./config/config.js').contracts;

const lol = console.log.bind(console);
/*
  Gets hash addresses from reciever contract and downlaods the files from IPFS
  @ receiverAddress - string - reciever contract address
  @ callback - function - returns the doc created from the Host.db storage
*/
module.exports = (receiverAddress, callback) => {
  const deStoreAddress = contractConfig.deStore;
  lol(deStoreAddress);
  const options = {
    from: receiverAddress
  };
  Ethereum.execAt('DeStore', deStoreAddress)
    .receiverGetHashes(options)
    .then((hexHashes) => { // hashes are in format [ [hash1, hash2], [hash1, hash2] .... ]
      const hashes = nestedHexToAscii(hexHashes);
      for (let i = 0; i < hashes.length; i++) {
        const writePath = path.join(filesConfig.storage + hashes[i]);
        IPFS.download(hashes[i], writePath)
          .then(function(res) {
            console.log('File sucessfully hosted');
            console.log('writePath');
            const host = {
              // fileSize: '',
              hashAddress: hashes[i],
              // senderAddress: 'will need to get later',
              hostTime: new Date()
            };
            Host.db.insert(host, function(err, res) {
              if (err) {
                if (callback) callback(err);
                else throw(err);
              } else {
                console.log('Host file data sucessfully saved');
                if (callback) callback(null, res);
                else console.log(res);
              }
            });
          })
          .catch(err => {
            if (callback) callback(err);
            else throw(err);
          });
      }
    })
    .catch(err => {
      if (callback) callback(err);
      else throw(err);
    });
};
