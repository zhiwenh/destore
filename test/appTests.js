'use strict';

const tape = require('tape');
const tapes = require('tapes');
const tapSpec = require('tap-spec');
const Ethereum = require('../libs/ethereum/ethereum.js');
const IPFS = require('./../libs/ipfs/ipfs.js');
const path = require('path');

const DeStoreAddress = require('./../models/DeStoreAddress.js');

const config = require('./../libs/config/config.js');


tape.createStream()
  .pipe(tapSpec())
  .pipe(process.stdout);

const test = tapes(tape);

const lol = console.log.bind(console);

const Upload = require('./../models/Upload.js');
const Host = require('./../models/Host.js');

const web3 = Ethereum.init();

Upload.reset();
Host.reset();
test('Deploying new DeStore contract and adding a sender and receiver', t => {
  Ethereum.changeAccount(0);
  const deployOptions = {
    from: Ethereum.account
  };
  Ethereum.deploy('DeStore', [], deployOptions)
    .then(instance => {
      config.contracts.deStore = instance.address;
      t.equal(instance.address.length, 42, 'Contract address should have a length of 42');
      return Ethereum.deStore().senderAdd();
    })
    .then(tx => {
      return Ethereum.deStore().receiverAdd(10000000000, {from: Ethereum.accounts[1]});
    })
    .then(tx => {
      t.end();
    })
    .catch(err => {
      console.error(err);
      t.fail();
    });
});

const mountFile = require('./../libs/mountFile.js');

test('Testing mountFile', t => {
  mountFile(__dirname + '/lemon.gif', 1000)
    .then(res => {
      t.equal(res.hashAddress, 'QmcSwTAwqbtGTt1MBobEjKb8rPwJJzfCLorLMs5m97axDW', 'Expect hash uploaded to equal');
      t.end();
    })
    .catch(err => {
      console.error(err);
      t.fail(err);
    });
});

const chunkFile = require('./../libs/chunkFile.js');
test('Testing chunkFile', t => {
  chunkFile('lemon.gif')
    .then(links => {
      t.end();
    })
    .catch(err => {
      console.error(err);
      t.fail();
    });
});

const uploadDeStore = require('./../libs/uploadDeStore.js');

test('Testing uploadDeStore success', t => {
  uploadDeStore('lemon.gif')
    .then(res => {
      t.equal(res[0], 'QmT6aQLRNWbDf38qHGmaUUw8Q4E3fCnn7wKec2haVrQoSS', 'Expect has uploaded to equal first link address of sender file');
      t.end();
    })
    .catch(err => {
      console.error(err);
      t.fail();
    });
});

test('Testing uploadDeStore fail with invalid file name', t => {
  uploadDeStore('does not exist')
    .then(res => {
      t.fail();
    })
    .catch(err => {
      t.ok('There was an error');
      t.end();
    });
});

const distribute = require('./../libs/distribute');

test('Testing distribute' , t => {
  distribute('lemon.gif', 1)
    .then(addresses => {
      t.equal(addresses[0], Ethereum.accounts[1], 'Expect address returned to equal to Ethereum.accounts[1]');
      t.end();
    })
    .catch(err => {
      console.error(err);
      t.fail();
    });
});

const hostFileInfo = require('./../libs/hostFileInfo.js');

test('Testing hostFileInfo', t => {
  Ethereum.changeAccount(1);
  hostFileInfo()
    .then(infos => {
      t.equal(infos[0].hashAddress, 'QmT6aQLRNWbDf38qHGmaUUw8Q4E3fCnn7wKec2haVrQoSS', 'Expect hashAddress of 1st link to equal 1st link of added file');
      t.equal(infos[0].senderAddress, Ethereum.accounts[0], 'Expect Ethereum account to equal account used to send file');
      t.end();
    })
    .catch(err => {
      console.error(err);
      t.fail();
    });
});




// test('Deploying new DeStore contract', t => {
//   Ethereum.changeAccount(0);
//   const deployOptions = {
//     from: Ethereum.account
//   };
//   Ethereum.deploy('DeStore', [], deployOptions)
//     .then(instance => {
//       config.contracts.deStore = instance.address;
//       t.ok('ok');
//       t.end();
//     })
//     .catch(err => {
//       console.error(err);
//       t.fail();
//     });
// });

// test('Test creating new Ethereum account', t => {
//   const numAccounts = Ethereum.accounts.length;
//   Ethereum.createAccount('password');
//   Ethereum.unlock('password');
//
// });
