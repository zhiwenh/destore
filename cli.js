'use strict';

const program = require('commander');
const ethereum = require('./libs/ethereum/ethereum.js');

program
  .version('0.0.1')
  .option('init', 'Initialize')
  .option('push', 'Push File to IPFS')
  .option('check', 'Check Ethereum Connection')
  .option('test', 'test command to test random things')
  .parse(process.argv);

if (program.init) {
  console.log('Initialize');
  ethereum.init();
  ethereum.check();
}

if (program.push) {
  console.log('push');
}

if (program.check) {
  console.log('check');
  ethereum.check();
}

if (program.test) {
  console.log('test');
  ethereum.deploy(['testContract']);
}
