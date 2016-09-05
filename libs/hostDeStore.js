'use strict';
const IPFS = require('./ipfs/ipfs.js');
const Ethereum = require('./ethereum/ethereum.js');
const path = require('path');
const Host = require('./../models/Host.js');
const promisfy = require('es6-promisify');

const web3 = Ethereum.init();

const nestedHexToAscii = require('./ethereum/nestedHexToAscii');

const filesConfig = require('./config/config.js').files;
const contractConfig = require('./config/config.js').contracts;

const lol = console.log.bind(console);
/*
  Gets hash addresses from reciever contract and downlaods the files from IPFS
  @ receiverAddress - string - reciever contract address
  @ callback - function - returns the doc created from the Host.db storage
*/
module.exports = promisfy((callback) => {
  const deStoreAddress = contractConfig.deStore;
  lol(deStoreAddress);
  Promise.all([Ethereum.deStore().receiverGetHashes(), Ethereum.deStore().receiverGetSenders()])
    .then((hexHashes) => { // hashes are in format [ [hash1, hash2], [hash1, hash2] .... ]
      const hashes = nestedHexToAscii(hexHashes);
      const promises = [];
      for (let i = 0; i < hashes.length; i++) {
        const writePath = path.join(filesConfig.storage + hashes[i]);
        promises.push(IPFS.download(hashes[i], writePath));

        Promise.all(promises)
          .then(res => {
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
});
