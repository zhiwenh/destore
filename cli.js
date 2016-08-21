'use strict';

const program = require('commander');
const Ethereum = require('./libs/ethereum/ethereum.js');
const Client = require('./libs/client.js');
const IPFS = require('./libs/ipfs/ipfs.js');
const ipfsAPI = require('ipfs-api');

const Datastore = require('nedb');
const db = new Datastore({ filename: './data/data.db', autoload: true });

program
  .version('0.0.1')
  .option('init', 'Initialize')
  .option('check', 'Check Ethereum Connection')
  .option('accounts', 'Get a list of Ethereum accounts')
  // .option('test', 'test command to test random things')
  .option('test', 'test command to test random things')
  .option('save', 'Save a contract with ether-pudding into .sol.js')
  .option('deploy', 'Deploy a pudding contract ')
  .option('exec', 'Execute a deployed pudding contract')
  .option('execAt', 'Execute a pudding contract at specifiied address')
  .option('delete', 'Deletes all entries in database')
  .option('test', 'Test all ipfs methods')
  .option('test2')
  .option('ipfsInit')
  .option('ipfsAdd')
  .option('ipfsGet')
  .option('ipfsTest')
  .option('ipfsDaemon')
  .parse(process.argv);

if (program.init) {
  console.log('Initialize');
  Ethereum._init();
  Ethereum.check();
}


if (program.shray) {
  Client.saveContracts('testContract')
}

if (program.check) {
  console.log('check');
  Ethereum.check();
}

if (program.accounts) {
  console.log('accounts');
  Ethereum.getAccounts();
}

if (program.save) {
  console.log('save');
  Client.saveContracts('MasterList');
}

if (program.deploy) {
  console.log('deploy');
  Ethereum.deploy('MasterList')
    .then(function(res) {
      console.log(res.address);
      db.insert({
        address: res.address,
        file: 'Test'
      }, function(err, res) {
        if (!err) {
          console.log('address successfully saved');
          console.log(res);
        }
      });
    })
    .catch(function(err) {
      console.log(err);
    });
}

if (program.exec) {
  console.log('exec');
  Ethereum.exec('Test').getValue()
    .then((res) => {
      console.log(res);
    });
}

if (program.execAt) {
  console.log('execAt');
  Ethereum.execAt('Test', '0x450773ce2d51219078a5ee2639d90f3df1ae61d6')
    .getValue()
    .then((res) => {
      console.log(res);
    });
}

if (program.delete) {
  console.log('delete all entries from database');
  db.remove({}, { multi: true }, function (err, numRemoved) {

  });
}

if (program.test) {
  console.log('test ipfs');
  IPFS.init();
}

if (program.test2) {

}

if (program.ipfsInit) {
  console.log('===== ipfsInit ====');
  IPFS.init();
}

if (program.ipfsDaemon) {
  console.log('===== ipfs deamon====');
  IPFS.daemon();
}
if (program.ipfsTest) {
  console.log('===== init =====');
  IPFS.init();

  console.log('===== ipfsAdd =====');
  const happy = './user/files/happy';
  const test = './user/files/files';
  const png = './user/files/kb.png';
  const download = './user/download/download';
  const taylor = './user/files/together.mp3';

  IPFS.addFiles([happy, test, png, download])
    .then(res => {
      console.log(res);
    })
    .catch(err => {
      console.log(err);
    });

  console.log('===== ipfsGet =====');
  const writePath = __dirname + '/kb-logo.png';
  IPFS.download('QmPz54CotK8DLCjsLVMHUfFpGD293qE4tRfEHgtcZoQMAc', writePath)
    .then((res) => {
      console.log(res[0]);
    })
    .catch((err) => {
      console.log(err);
    });
}
