'use strict';

const Web3 = require('web3');
const rpcConfig = require('./../config/rpc.js');

let web3;

module.exports = function() {
  console.log(typeof web3);
  const host = rpcConfig.host;
  const port = rpcConfig.port;
  if (typeof web3 !== 'undefined') {
    web3 = new Web3(web3.currentProvider);
  } else {
    web3 = new Web3(new Web3.providers.HttpProvider('http://' + host + ':' + port));
  }
  return web3;
};
