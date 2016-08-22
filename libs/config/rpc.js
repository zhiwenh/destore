'use strict';
const Web3 = require('web3');

// configuration for RPC
// ex: localhost? port?
// maybe ipfs configurations as well

const rpcConfig = {
  host: 'localhost',
  port: 8545,
  provider: new Web3.providers.HttpProvider('http://' + 'localhost' + ':' + '8545')
};

if (rpcConfig.host !== 'localhost') {
  const host = rpcConfig.host;
  const port = rpcConfig.port;
  rpcConfig.provider = new Web3.providers.HttpProvider('http://' + host + ':' + port);
}

module.exports = rpcConfig;
