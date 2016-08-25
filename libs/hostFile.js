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
*/
module.exports = (receiverAddress) => {
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
              if (err) throw (err);
              else {
                console.log('Host file data sucessfully saved');
                console.log(res);
              }
            });
          })
          .catch(err => {
            throw(err);
          });
      }
    })
    .catch(err => {
      throw (err);
    });
};
