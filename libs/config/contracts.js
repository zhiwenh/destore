'use strict';

// configuration for contract files
// ex. Solidity or Serprent? default contract location

// @ path - path to the default contracts directory from root
// @ type - default contract type
// @ built - path where contracts are built
const contractsConfig = {
  path: __dirname + '/../../contracts/',
  type: 'Solidity',
  built: __dirname + '/../contracts/' 
};

module.exports = contractsConfig;
