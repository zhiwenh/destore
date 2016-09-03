'use strict';

const tape = require('tape');
const tapes = require('tapes');
const tapSpec = require('tap-spec');
const Ethereum = require('../libs/ethereum/ethereum.js');
const IPFS = require('./../libs/ipfs/ipfs.js');
const path = require('path');

const DeStoreAddress = require('./../models/DeStoreAddress.js');

const config = require('./../libs/config/config.js');

const mountFile = require('./../libs/mountFile.js');

tape.createStream()
  .pipe(tapSpec())
  .pipe(process.stdout);

const test = tapes(tape);

const lol = console.log.bind(console);

const Upload = require('./../models/Upload.js');

const web3 = Ethereum.init();

Upload.reset();

test('Deploying new DeStore contract and adding a sender and receiver', t => {
  Ethereum.changeAccount(0);
  const deployOptions = {
    from: Ethereum.account
  };
  Ethereum.deploy('DeStore', [], deployOptions)
    .then(instance => {
      console.log(instance.address);
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

test('Testing mountFile', t => {
  mountFile(__dirname + '/kb.png', 1000)
    .then(res => {
      t.equal(res.hashAddress, 'QmdMpNvXNKz5AswQ16D2vTFspLBbhsBADXENJnQ7tvDZWs', 'Expect hash uploaded to equal');
      t.end();
    })
    .catch(err => {
      console.error(err);
      t.fail(err);
    });
});

const uploadDeStore = require('./../libs/uploadDeStore.js');

test('Testing uploadDeStore success', t => {
  uploadDeStore('kb.png')
    .then(res => {
      t.equal(res[0], 'QmdMpNvXNKz5AswQ16D2vTFspLBbhsBADXENJnQ7tvDZWs', 'Expect has uploaded to equal has in');
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
  distribute('kb.png', 1)
    .then(addresses => {
      t.equal(addresses[0], Ethereum.accounts[1], 'Expect address returned to equal to Ethereum.accounts[1]');
      t.end();
    })
    .catch(err => {
      console.error(err);
      t.fail();
    });
});


test('Deploying new DeStore contract', t => {
  Ethereum.changeAccount(0);
  const deployOptions = {
    from: Ethereum.account
  };
  Ethereum.deploy('DeStore', [], deployOptions)
    .then(instance => {
      config.contracts.deStore = instance.address;
      t.ok('ok');
      t.end();
    })
    .catch(err => {
      console.error(err);
      t.fail();
    });
});

// test('Test creating new Ethereum account', t => {
//   const numAccounts = Ethereum.accounts.length;
//   Ethereum.createAccount('password');
//   Ethereum.unlock('password');
//
// });
