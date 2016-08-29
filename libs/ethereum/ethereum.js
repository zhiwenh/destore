'use strict';
const init = require('./init.js');
const rpcConfig = require('./../config/config.js').rpc;
const contractsConfig = require('./../config/config.js').contracts;

class Ethereum {
  constructor() {
    this._web3 = init();
    this._accounts = null;
  }

  // initializes the RPC connection with the local Ethereum node
  // call before every method
  init() {
    this._web3 = init();
    if (this.check() === false) {
      throw ('Not connected to RPC');
    } else {
      this._accounts = this._web3.eth.accounts;
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

  // checks what accounts node controls
  // returns an array of accounts
  getAccounts() {
    this.init();
    console.log(this._web3.eth.accounts);
    return this._web3.eth.accounts;
  }

  unlock(address, password) {
    this.init();
    this._web3.personal.unlockAccount(address, password);
  }

  // @ contractName - name of contract
  // @ args - array of initial parameters
  // @ options - contract config options
  // returns a Promise
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
        from: this._accounts[0]
      };
    }
    puddingContract.defaults(options);
    puddingContract.setProvider(rpcConfig.provider);
    const contract = puddingContract.new.apply(puddingContract, args);
    return contract;
  }

  // executes contract with it's deployed address
  // returns Promise
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
  // returns Promise
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
