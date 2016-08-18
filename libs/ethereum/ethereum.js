'use strict';

const Embark = require('embark-framework');
const Web3 = require('web3');

const init = require('./init.js');
const compile = require('./compile.js');

function Ethereum() {
  this._web3 = init();
  this._accounts = this._web3.eth.accounts;

  // this._contractsCompiled = null;

  // initializes the RPC connection with the local Ethereum node
  // call before every method
  this._init = function() {
    this._web3 = init();

    // not sure if necesary
    if (this.check) {
      this._accounts = this._web3.eth.accounts;
    }
  };

  // checks what accounts node controls
  // returns an array of accounts
  this.accounts = function() {
    this._init();
    console.log(this._web3.eth.accounts);
    return this._web3.eth.accounts;
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

  // @ contractName - string - contract name to be deployed
  // @ contractFiles - string or array - array of string contract file names
  // will contain the dependencies of contract
  // @ directoryPath - string - directory path to where contract is contained
  //   optional. if not given will be taken from config
  this.deploy = function(contractName, contractFiles, directoryPath) {
    this._init();
    const contractsCompiled = compile(contractFiles, directoryPath);
    // console.log(contractsCompiled);
    const NewContract = this._web3.eth.contract(contractsCompiled[contractName].info.abiDefinition);

    const options = {
      from: this._accounts[0],
      data: contractsCompiled[contractName].code,
      gas: 0
      // probably another options
    };

    const callback = function(err, contract) {
      console.log('callback for contract');
      if (!err) {
        console.log('no error');
        console.log('contract address');
        console.log(contract.address);
        console.log(contract);
      } else {
        console.log(err);
      }
    };
    const contract = NewContract.new(1, options, callback);

    // const contractReturn = contract.getValue();
    // console.log('contract return ' + contractReturn);
    // console.log(this._contractsCompiled);
  };
}

module.exports = new Ethereum();
