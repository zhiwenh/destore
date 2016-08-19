'use strict';

// configuration for contract files
// ex. Solidity or Serprent? default contract location

// @ path - path to the default contracts directory from root
// @ type - default contract type
const contractsConfig = {
  path: './contracts/',
  type: 'Solidity',
  built: '././../contracts/' // directory path from etherum.js to built
};

module.exports = contractsConfig;
