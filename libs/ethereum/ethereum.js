'use strict';

const Embark = require('embark-framework');
const Web3 = require('web3');

const init = require('./init.js');
const compile = require('./compile.js');

function Ethereum() {
  this._web3 = init();

  // initializes the RPC connection with the local Ethereum node
  // call before every method
  this.init = function() {
    this._web3 = init();
  };

  // checks connection to RPC
  // probably won't need to be used
  this.check = function() {
    if (this._web3) {
      console.log(this._web3.isConnected());
      return this._web3.isConnected();
    } else {
      console.log('not initialized');
      return false;
    }
  };

  // @ contracts - string or array - array of string contract names
  // @ directoryPath - string - directory path to where contract is contained
  //   optional. if not given will be taken from config
  this.deploy = function(contract, directoryPath) {
    this.init();
    const contractsCompiled = compile(contract, directoryPath);
    console.log(contractsCompiled);
  };
}

module.exports = new Ethereum();
