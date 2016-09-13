'use strict';
const Ethereum = require('./../ethereum/ethereum.js');
const Upload = require('./../../models/Upload.js');
const promisify = require('es6-promisify');

/**
* Pay all receivers associated with a file
* @fileName {String}
* @return {Number} - remaining ether balance
**/
module.exports = promisify((fileName, callback) => {
  const options = Ethereum.defaults;

  Upload.db.findOne({account: Ethereum.account, fileName: fileName}, (err, doc) => {
    if (err || doc === null) {
      callback(new Error('File name not found'), null);
      return;
    }
    const receiverCount = doc.receivers.length;
    let value = doc.value;
    const size = doc.fileSize;
    value = value * size * receiverCount;
    if (Ethereum.getBalanceEther() < value) {
      callback(new Error('Not enough funds'), null);
      return;
    }
    options.value = Ethereum.toWei(value);
    const promises = [];
    doc.receivers.forEach(address => {
      promises.push(Ethereum.deStore().senderSendMoney(address, fileName, options));
    });
    Promise.all(promises)
      .then(tx => {
        callback(null, Ethereum.getBalanceEther());
      })
      .catch(err => {
        callback(err, null);
      });
  });
});
