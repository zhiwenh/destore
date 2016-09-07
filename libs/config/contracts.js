'use strict';

// configuration for contract files
// ex. Solidity or Serprent? default contract location

// @ path - path to the default contracts directory from root
// @ type - default contract type
// @ built - path where contracts are built
/**
*
* @deStore - contract address for deStore
**/
const contractsConfig = {
  path: __dirname + '/../../contracts/',
  testPath: __dirname + '/../../contracts-test/',
  type: 'Solidity',
  built: __dirname + '/../contracts/',
  abiPath: __dirname + '/../../contracts-abi/',
  abiFormat: '.json',
  deStore: '0x25c7eada9031854f23762d8e88b131b8d7b8f3d8'
};

module.exports = contractsConfig;
