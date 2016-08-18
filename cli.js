'use strict';

const program = require('commander');
const DeStore = require('./libs/index.js');

program
  .version('0.0.1')
  .option('init', 'Initialize')
  .option('push', 'Push File to IPFS')
  .option('check', 'Check Ethereum Connection')
  .option('test', 'test command to test random things')
  .parse(process.argv);

if (program.init) {
  console.log('Initialize');
  DeStore.init();
  DeStore.check();
}

if (program.push) {
  console.log('push');
}

if (program.check) {
  console.log('check');
  DeStore.check();
}

if (program.test) {
  console.log('Sender');
  DeStore.deploy(['Test', 'Test0']);
}
