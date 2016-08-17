// the file that will be required with all the application methods

const Embark = require('embark-framework');
const Web3 = require('web3');

var web3 = new Web3();

const DeStore = {
  // initializes the RPC connection with the local Ethereum node
  init: function(port) {
    if (port) {
      web3.setProvider(new web3.providers.HttpProvider('http://localhost:' + port));
    } else {
      web3.setProvider(new web3.providers.HttpProvider('http://localhost:8545'));
    }
  },

  check: function() {
    console.log(web3.isConnected());
  }
};

module.exports = DeStore;
