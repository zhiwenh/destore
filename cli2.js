'use strict';

const program = require('commander');
// const Ethereum = require('./libs/ethereum/ethereum.js');
// const Client = require('./libs/client.js');
const Host = require('./libs/rMethods.js');
const User = require('./libs/sMethods.js');
const Watch = require('./libs/watchMethods.js');
const path = require('path');

program
  .version('0.0.1')
  .option('init', 'Initialize')
  .option('makeWatch', 'Make Watch Folder')
  .option('push', 'Push File to IPFS')
  .option('check', 'Check Ethereum Connection')
  .option('test', 'test command to test random things')
  .option('deploy', 'deploy')
  .option('accounts', 'accounts')
  .option('run', 'running')
  .parse(process.argv);

if (program.init) {
  console.log('Initialize');
  Ethereum._init();
  Ethereum.check();
}

//path.basename -- to grab user filename
if (program.makeWatch) {
  // console.log('')
  User.makeWatchFolder();
  //get file path
  var dirPath = path.join(__dirname, './DeStoreWatch');
  console.log(dirPath);
  Watch.startWatch(dirPath);
}

if (program.push) {
  console.log('push');
  User.commitToIpfs();
}

if (program.check) {
  console.log('check');
  Ethereum.check();
}

if (program.test) {
  console.log('test');
  console.log(Client.saveContracts('testContract'));
}

if (program.accounts) {
  console.log('accounts');
  Ethereum.accounts();
}

if (program.deploy) {
  console.log('deploy');
  // Ethereum.deploy('Test', 'testContract2');
  Ethereum.deploy2();
  // Ethereum.embarkDeploy();
}

if (program.run) {
  console.log('run');
  Ethereum.run();
}
