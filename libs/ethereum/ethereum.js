'use strict';
const init = require('./init.js');
const rpcConfig = require('./../config/config.js').rpc;
const contractsConfig = require('./../config/config.js').contracts;

class Ethereum {
  constructor() {
    this._web3 = init();
    this.account = null;
    this.accounts = [];
  }

  // initializes the RPC connection with the local Ethereum node
  // call before every method
  init() {
    this._web3 = init();
    if (this.check() === false) {
      throw ('Not connected to RPC');
    } else {
      this.accounts = this._web3.eth.accounts;
      this.account = this.accounts[0];
      return this._web3;
    }
  }

  // checks connection to RPC
  check() {
    if (!this._web3) {
      return false;
    } else {
      return this._web3.isConnected();
    }
  }

  // @ index - index of the account in web3.eth.accounts to change to
  // returns the currently used account
  changeAccount(index) {
    if (index < 0 || index >= this.accounts.length) {
      return this.account;
    } else {
      this.account = this.accounts[index];
      return this.account;
    }
  }

  unlock(address, password) {
    this.init();
    this._web3.personal.unlockAccount(address, password);
  }

  // @ contractName - name of contract
  // @ args - array of initial parameters
  // @ options - contract config options
  // returns a Promise with the res as the contract instance
  deploy(contractName, args, options) {
    this.init();
    let puddingContract;
    try {
      puddingContract = require(contractsConfig.built + contractName + '.sol.js');
    }
    catch(e) {
      throw ('Invalid contract in deploy');
    }
    // need to add more default options
    if (!options) {
      options = {
        from: this.account
      };
    }
    puddingContract.defaults(options);
    puddingContract.setProvider(rpcConfig.provider);
    const contract = puddingContract.new.apply(puddingContract, args);
    return contract;
  }

  // executes contract with it's deployed address
  // returns Promise of the transaction or call
  exec(contractName) {
    this.init();
    let puddingContract;
    try {
      puddingContract = require(contractsConfig.built + contractName + '.sol.js');
    }
    catch(e) {
      throw ('Invalid contract in exec');
    }
    puddingContract.setProvider(rpcConfig.provider);
    const contract = puddingContract.deployed();
    return contract;
  }

  // execute contract at a specific address
  // returns Promise of the transaction or call
  execAt(contractName, contractAddress){
    this.init();
    let puddingContract;
    try {
      puddingContract = require(contractsConfig.built + contractName + '.sol.js');
    }
    catch(e) {
      throw('Invalid contract in execAt');
    }
    puddingContract.setProvider(rpcConfig.provider);

    const contract = puddingContract.at(contractAddress);
    return contract;
  }
}

module.exports = new Ethereum();
