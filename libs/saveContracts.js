'use strict';
const Pudding = require('ether-pudding');
const fs = require('fs');
const compile = require('./ethereum/compile.js');
const contractsConfig = require('./config/config.js').contracts;

/*
  @ contractFiles - array - an array of contract.sol
  @ directoryPath - string - path where contract files are located. Optional. Will be taken from config
*/
module.exports = (contractFiles, directoryPath) => {
  const contractsCompiled = compile(contractFiles, directoryPath);
  return Pudding.saveAll(contractsCompiled, contractsConfig.built)
    .then(() => {
      console.log('Pudding Contracts Saved');
      for (let contractName in contractsCompiled) {
        console.log(contractName);
      }
    })
    .catch((err) => {
      console.log('Pudding Save Error');
      console.log(err);
    });
};
