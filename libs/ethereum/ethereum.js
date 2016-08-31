'use strict';
const init = require('./init.js');
const rpcConfig = require('./../config/config.js').rpc;
const contractsConfig = require('./../config/config.js').contracts;
const promisify = require('es6-promisify');
const path = require('path');
const fs = require('fs');

class Ethereum {
  constructor() {
    this._web3 = init();
    this.account = null;
    this.accounts = [];
    // deploy defaults
    this.defaults = {
      from: this.account,
      value: 0,
      gas: 500000
    };
  }

  /**
  * initializes the RPC connection with the local Ethereum node
  * call before every Ethereum method
  * @returns connected web3 object
  **/
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

  /**
  * checks connection to RPC
  * @index {Number} index of the account in web3.eth.accounts to change to
  * @returns connection status
  **/
  check() {
    if (!this._web3) {
      return false;
    } else {
      return this._web3.isConnected();
    }
  }

  /**
  * @index {Number} index of the account in web3.eth.accounts to change to
  * @returns account
  **/
  changeAccount(index) {
    if (index < 0 || index >= this.accounts.length) {
      return this.account;
    } else {
      this.account = this.accounts[index];
      return this.account;
    }
  }

  /**
  * @address {String}
  * @password {String}
  **/
  unlock(address, password) {
    this.init();
    this._web3.personal.unlockAccount(address, password);
  }

  /**
  * @contractName {String} name of contract in contractConfig.build
  * @returns {Object} built contract
  **/
  getBuiltContract(contractName) {
    let contract;
    try {
      contract = require(contractsConfig.built + contractName + '.sol.js');
    }
    catch(e) {
      throw ('Invalid contract in deploy');
    }
    return contract;
  }

  /**
  * @contractName {String} name of contract in contractConfig.build
  * @args {Array} passed into new contract as initial parameters
  * @options {Object} {from: address, value: {Number}, gas: {Number}, gasValue: {Number}}
  * @returns {Object} Promise with the res as the contract instance
  **/
  deploy(contractName, args, options) {
    this.init();

    const contract = this.getBuiltContract(contractName);
    // need to add more default options
    if (!options) {
      options = this.defaults;
    }
    contract.defaults(options);
    contract.setProvider(rpcConfig.provider);
    const contractInstance = contract.new.apply(contract, args);
    // const address = '0x200cd7a869642959b39cc7844cc6787d598ffc63';
    //
    // this.execAt2('DeStore', address, 'receiverAdd');
    return contractInstance;
  }

  /**
  * Pudding Contract needs to have been deployed first
  * @contractName {String} name of contract in contractConfig.build
  * @returns {Object} contract instance. Calling methods on it will return a Promise
  **/
  // executes contract with it's deployed address
  // returns Promise of the transaction or call
  exec(contractName) {
    this.init();
    const contract = this.getBuiltContract(contractName);
    contract.setProvider(rpcConfig.provider);
    const contractInstance = contract.deployed();
    return contractInstance;
  }

  /**
  * @contractName {String} name of contract in contractConfig.build
  * @contractAddress {String} '0x3d...' length of 42
  * @returns {Object} contract instance. Calling methods on it will return a Promise
  **/
  execAt(contractName, contractAddress) {
    this.init();
    const contract = this.getBuiltContract(contractName);
    contract.setProvider(rpcConfig.provider);
    const contractInstance = contract.at(contractAddress);
    return contractInstance;
  }

  /**
  *
  * @return {Object} instance you can call watch(), get(), stopWatching()
  **/
  watchAt(contractName, contractAddress, method, filter) {
    const contractInstance = this.execAt(contractName, contractAddress);
    let event = contractInstance[method];
    event = event({}, filter);
    return event;
  }

  /**
  * @contractName {String} name of contract in contractConfig.build
  * @contractAddress {String} '0x3d...' length of 42
  * @method {String}
  # @filter {Object}
  * @returns Promise with response as filtered logs
  **/
  getEventLogs(contractName, contractAddress, method, filter) {
    const contractInstance = this.execAt(contractName, contractAddress);
    let methodEvent = contractInstance[method];
    methodEvent = methodEvent({}, {fromBlock: 0});
    return promisify((event, callback) => {
      event.get((err, logs) => {
        if (err) callback(err, null);
        else {
          const filteredLogs = {};
          logs = logs.filter((element) => {
            for (let key in filter) {
              if (filter[key] !== element[key] && element[key] !== undefined) {
                return false;
              }
            }
            return true;
          });
          logs = logs.map(element => {
            return element.args;
          });
          callback(null, logs);
        }
      });
    })(methodEvent);
  }
}

module.exports = new Ethereum();
