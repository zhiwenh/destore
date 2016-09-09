'use strict';

// For Mac and only with default Ethereum block
const ipcConfig = {
  host: process.env.HOME + '/Library/Ethereum/geth.ipc'
};

console.log(ipcConfig);
// Users/zhiwen/Desktop/geth.ipc' this chosen by me

module.exports = ipcConfig;
