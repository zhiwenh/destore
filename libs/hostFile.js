'use strict';
const IPFS = require('./ipfs/ipfs.js');
const Ethereum = require('./ethereum/ethereum.js');
const path = require('path');
const Host = require('./../models/Host.js');

const web3 = Ethereum.init();

const filesConfig = require('./config/config.js').files;

/*
  Gets hash addresses from reciever contract and downlaods the files from IPFS
  @ receiverAddress - string - reciever contract address
  @ callback - function - returns the doc created from the Host.db storage
*/
module.exports = (receiverAddress, callback) => {
  Ethereum.execAt('Receiver', receiverAddress)
    .retrieveStorage()
    .then((res) => {
      for (var i = 0; i < res.length; i += 2) {
        let hashAddress = (web3.toAscii(res[i]) + web3.toAscii(res[i + 1]));
        hashAddress = hashAddress.split('').filter(char => {
          return char.match(/[A-Za-z0-9]/);
        }).join('');
        const writePath = path.join(filesConfig.host + hashAddress);
        IPFS.download(hashAddress, writePath)
          .then(function(res) {
            console.log('File sucessfully hosted');
            console.log('writePath');
            const host = {
              // fileSize: '',
              hashAddress: hashAddress,
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
