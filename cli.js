'use strict';

const program = require('commander');
const Ethereum = require('./libs/ethereum/ethereum.js');
const IPFS = require('./libs/ipfs/ipfs.js');
const saveContracts = require('./libs/saveContracts.js');

const Upload = require('./models/Upload.js');
const Host = require('./models/Host.js');
const DeStoreAddress = require('./models/DeStoreAddress.js');

const config = require('./libs/config/config.js');

const lol = console.log.bind(console);

program
  .version('0.0.1')
  .option('destore', 'Deploy DeStore Contract ')
  .option('receivers')
  .option('reset-db')
  .option('reset-host')
  .option('reset-upload')
  .option('create-account')
  .option('unlock')

program
  .command('save <file>')
  .action(function (file) {
    console.log('save');
    saveContracts(file);
  });

program.parse(process.argv);
Ethereum.init();


if (program.destore) {
  Ethereum.init();
  Ethereum.changeAccount(0);
  console.log(Ethereum.account);
  console.log(Ethereum.getBalanceEther());
  const deployOptions = {
    from: Ethereum.account,
    gas: 3000000
  };
  Ethereum.deploy('DeStore', [], deployOptions)
    .then(instance => {
      config.contracts.deStore = instance.address;
      console.log(instance.address);
      DeStoreAddress.save(instance.address);
    })
    .catch(err => {
      console.error(err);
    });
}

if (program.receivers) {
  Ethereum.init();
  config.contracts.deStore = DeStoreAddress.get();

  Promise.all([
    Ethereum.deStore().receiverAdd(1000000000, {from: Ethereum.accounts[2], gas: 1000000}),
    Ethereum.deStore().receiverAdd(1000000000, {from: Ethereum.accounts[3], gas: 1000000}),
    Ethereum.deStore().receiverAdd(1000000000, {from: Ethereum.accounts[4], gas: 1000000}),
    Ethereum.deStore().receiverAdd(1000000000, {from: Ethereum.accounts[5], gas: 1000000})
  ])
    .then(arr => {
      console.log(arr);
    })
    .catch(err => {
      console.error(err);
    });
}
if (program.resetDb) {
  Upload.reset();
  Host.reset();
}

if (program.resetHost) {
  Host.reset();
}

if (program.resetUpload) {
  Upload.reset();
}

if (program.createAccount) {
  Ethereum.createAccount('hello')
    .then(res => {
      console.log('created new account');
      console.log(res);
      process.exit();
    })
    .catch(err => {
      console.error(err);
      process.exit();
    });
}

if (program.unlock) {
  for (let i = 1; i < Ethereum.accounts.length; i++) {
    const web3 = Ethereum.init();
    web3.eth.sendTransaction({from: Ethereum.accounts[0], to: Ethereum.accounts[i], value: Ethereum.toWei(50)});
    console.log(Ethereum.getBalanceEther(i));
  }
}
