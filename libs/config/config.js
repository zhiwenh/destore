const contractsConfig = require('./contracts.js');
const rpcConfig = require('./rpc.js');
const networkConfig = require('./network.js');
const filesConfig = require('./files.js');
const ipcConfig = require('./ipc.js');

module.exports = {
  contracts: contractsConfig,
  rpc: rpcConfig,
  network: networkConfig,
  files: filesConfig,
  ipc: ipcConfig
};
