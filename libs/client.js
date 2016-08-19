'use strict';

const Pudding = require('ether-pudding');
const fs = require('fs');

const compile = require('./ethereum/compile.js');

function Client() {
  this.builtContracts =
  this.saveContracts = function(contractFiles, directoryPath) {
    const contractsCompiled = compile(contractFiles, directoryPath);
    return Pudding.saveAll(contractsCompiled, './libs/contracts')
      .then(() => {
        console.log('saved');
      })
      .catch((err) => {
        console.log(err);
      });
  };
}

module.exports = new Client();
