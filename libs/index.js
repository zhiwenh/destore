'use strict';

// the file that will be required with all the application methods

const Embark = require('embark-framework');
const Web3 = require('web3');

//
const init = require('./ethereum/init.js');
const compile = require('./ethereum/compile.js');

const DeStore = {
  // initializes the RPC connection with the local Ethereum node
  // call before every method
  init: function() {
    this._web3 = init();
  },

  // checks connection to RPC
  check: function() {
    if (this._web3) {
      console.log(this._web3.isConnected());
      return this._web3.isConnected();
    } else {
      console.log('not initialized');
      return false;
    }
  },

  // @ contracts - string or array - array of string contract names
  // @ directoryPath - string - directory path to where contract is contained
  //   optional. if not given will be taken from config
  deploy: function(contract, directoryPath) {
    this.init();
    const contractsCompiled = compile(contract, directoryPath);
    const
  },

  pushFile: function(hashAddress) {
    if (!hashAddress) hashAddress = 'testhash';
    if (this.check()) {
      //
    }
  }




};

module.exports = DeStore;
