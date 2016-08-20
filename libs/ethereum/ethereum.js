'use strict';

const Embark = require('embark-framework');
const EmbarkSpec = Embark.Tests;
const Web3 = require('web3');
const readYaml = require('read-yaml');
const Promise = require('bluebird');

const init = require('./init.js');
const compile = require('./compile.js');

const rpcConfig = require('./../config/rpc.js');

// const TestContract = require('./../contracts/Test.sol.js');

function Ethereum() {
  this._web3 = init();
  this._accounts = this._web3.eth.accounts;
  this.contractAddress = {};
  // this._contractsCompiled = null;

  // initializes the RPC connection with the local Ethereum node
  // call before every method
  this._init = () => {
    this._web3 = init();

    // not sure if necesary
    if (this.check) {
      this._accounts = this._web3.eth.accounts;
    }
  };

  // checks what accounts node controls
  // returns an array of accounts
  this.accounts = () => {
    this._init();
    console.log(this._web3.eth.accounts);
    return this._web3.eth.accounts;
  };

  // checks connection to RPC
  // probably won't need to be used
  this.check = () => {
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
  // currently deploys contract
  this.deploy = (contractName, contractFiles, directoryPath) => {
    this._init();
    const contractsCompiled = compile(contractFiles, directoryPath);
    const NewContract = this._web3.eth.contract(contractsCompiled[contractName].info.abiDefinition);
    const options = {
      from: this._accounts[0],
      data: contractsCompiled[contractName].code,
      gas: 1000000
      // probably another options
    };

    // const callback = (err, contract) => {
    //   console.log('callback for contract');
    //   if (!err) {
    //     if (contract.address) {
    //       console.log('contract');
    //       // console.log(contract);
    //       this.contractAddress[contractName] = contract.address;
    //       console.log(contract.getValue());
    //     }
    //   } else {
    //     console.log(err);
    //   }
    // };
    //
    // const contract = NewContract.new(1, options, callback);

  };

  this.deploy2 = () => {
    this._init();
    TestContract.setProvider(rpcConfig.provider);
    const meta = TestContract.new(50, 50)
      .then(function(res) {
        console.log(res);
      })
      .catch(function(err) {
        console.log(err);
      });
  };

  this.run = () => {
    this._init();
    TestContract.setProvider(rpcConfig.provider);
    const contractAddress = '0xc4357136d1a7ef04886d3902a9d3b42acaadaf34';

    var Test = TestContract.at('0xc4357136d1a7ef04886d3902a9d3b42acaadaf34');
    // console.log(Test.getValue.call());
    // Test.setValue(10, {from: this._accounts[0]})
    //   .then((tx) => {
    //     console.log('set value ' + tx);
    //     Test.getValue()
    //       .then((tx) => {
    //         console.log(tx);
    //       })
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //   });

    Test.getValue()
      .then((tx) => {
        console.log(tx);
      });

    console.log();
  };
}

module.exports = new Ethereum();
