'use strict';
const Ethereum = require('./../ethereum/ethereum.js');
const Host = require('./../../models/Host.js');
const promisfy = require('es6-promisify');

/**
* Withdraws the entire balance
* @return {Number} - amount withdraw in Ether
**/
module.exports = promisfy((callback) => {
  let withdrawAmount;
  const options = {
    from: Ethereum.account
  };
  Ethereum.deStore().receiverGetBalance(options)
    .then(amount => {
      withdrawAmount = amount;
      return Ethereum.deStore().receiverWithdraw(amount.toString(10), options);
    })
    .then(tx => {
      callback(null, withdrawAmount);
    })
    .catch(err => {
      callback(err, null);
    });
});
