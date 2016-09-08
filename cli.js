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

program
  .command('save <file>')
  .action(function (file) {
    console.log('save');
    saveContracts(file);
  });

program.parse(process.argv);


if (program.destore) {
  Ethereum.changeAccount(0);
  const deployOptions = {
    from: Ethereum.account
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
    Ethereum.deStore().receiverAdd(1000000000, {from: Ethereum.accounts[2]}),
    Ethereum.deStore().receiverAdd(1000000000, {from: Ethereum.accounts[3]}),
    Ethereum.deStore().receiverAdd(1000000000, {from: Ethereum.accounts[4]}),
    Ethereum.deStore().receiverAdd(1000000000, {from: Ethereum.accounts[5]})
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
