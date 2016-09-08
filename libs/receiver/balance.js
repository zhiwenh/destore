'use strict';
const Ethereum = require('./../ethereum/ethereum.js');
const Host = require('./../../models/Host.js');
const promisfy = require('es6-promisify');

/**
* Shows the current balance
* @return {Number} - balance in wei
**/
module.exports = promisfy((callback) => {
  let withdrawAmount;
  const options = {
    from: Ethereum.account
  };
  Ethereum.deStore().receiverGetBalance(options)
    .then(amount => {
      amount = Ethereum.toWei(amount);
      callback(null, amount);
    })
    .catch(err => {
      callback(err, null);
    });
});
