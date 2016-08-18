'use strict';

// the file that will be required with all the application methods

const Embark = require('embark-framework');
const Web3 = require('web3');

//
const init = require('./ethereum/init.js');
const compile = require('./ethereum/compile.js');

const DeStore = {
  // initializes the RPC connection with the local Ethereum node
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

  // @ directoryPath - string - from root folder
  deploy: function(contract, directoryPath) {
    // test compile

    const contractString = compile(contract, directoryPath);
  },

  pushFile: function(hashAddress) {
    if (!hashAddress) hashAddress = 'testhash';

    if (this.check()) {
      //
    }
  }


};

module.exports = DeStore;
