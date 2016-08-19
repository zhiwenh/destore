'use strict';

const Pudding = require('ether-pudding');
const fs = require('fs');

const compile = require('./ethereum/compile.js');

const Datastore = require('nedb');
const db = new Datastore({ filename: './../data/data.db', autoload: true });


function Client() {
  this.saveContracts = function(contractFiles, directoryPath) {
    const contractsCompiled = compile(contractFiles, directoryPath);
    return Pudding.saveAll(contractsCompiled, './libs/contracts')
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
}

module.exports = new Client();
