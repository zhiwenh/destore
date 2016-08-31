'use strict';
/*
IMPORTANT: testrpc must be running during these tests,
at least for now. 8/25/2016 4:48pm
*/

const tape = require('tape');
const tapes = require('tapes');
const tapSpec = require('tap-spec');
const Ethereum = require('../libs/ethereum/ethereum.js');

const DeStoreAddress = require('./../models/DeStoreAddress.js');

tape.createStream()
  .pipe(tapSpec())
  .pipe(process.stdout);

const test = tapes(tape);

const lol = console.log.bind(console);

const helper = {
  fromBytes: (byteArray) => {
    const hashes = [];
    const web3 = Ethereum.init();
    for (var i = 0; i < byteArray.length; i += 2) {
      let hashAddress = (web3.toAscii(byteArray[i]) + web3.toAscii(byteArray[i + 1]));
      hashAddress = hashAddress.split('').filter(char => {
        return char.match(/[A-Za-z0-9]/);
      }).join('');
      hashes.push(hashAddress);
    }
    return hashes;
  },
  split: (inputHash) => {
    const half1 = inputHash.substring(0, 23);
    const half2 = inputHash.substring(23, 46);
    return [half1, half2];
  }
};

const hashObjs = {
  hash1: 'QmUNLLsPACCz1vLxQVkXqqLX5R1X345qqfHbsf67hvA3Nn',
  hash2: 'QmcSwTAwqbtGTt1MBobEjKb8rPwJJzfCLorLMs5m97axDW',
  hash3: 'QmRtDCqYUyJGWhGRhk1Bbk4PvE9mbCS1HKkDAo6xUAqN4H',
  hash4: 'QmbFMke1KXqnYyBBWxB74N4c5SBnJMVAiMNRcGu6x1AwQH',
};

test('web3.isConnected test true/false', t => {
  t.plan(1);
  const status = Ethereum.check();
  t.equal(status, true, 'successful connection should return true');
  t.end();
});

test('web3.eth.accounts should return an array', t => {
  t.plan(1);

  const acctArr = Ethereum.accounts;
  const typeOfAcctArr = Array.isArray(acctArr);

  t.equal(typeOfAcctArr, true, 'Ethereum.accounts should return an array');
});


test('DeStore Contract', t => {
  lol('\tNested tests: ');
  Ethereum.init();
  let DeStore;

  t.test('Deploying', t => {
    const deployOptions = {
      from: Ethereum.account,
      value: 10
    };
    Ethereum.deploy('DeStore', [helper.split(hashObjs.hash1), 10], deployOptions)
      .then(instance => {
        DeStore = instance;
        DeStoreAddress.save(DeStore.address);
        t.equal(DeStore.address.length, 42, 'Contract address should have a length of 42');
        t.end();
      })
      .catch(err => {
        t.end(err);
      });
  });

  t.test('Add receivers to DeStore Contract', t => {
    DeStore.receiverAdd(500)
      .then(tx => {
        return DeStore.receiverGetStorage();
      })
      .then(tx => {
        t.equal(tx.c[0], 500, 'receiverGetStorage should return the available storage parameter passed to receiverAdd');
        t.end();
      })
      .catch(err => {
        console.error(err);
        t.end(err);
      });
  });

  t.test('Add receivers to DeStore Contract', t => {
    DeStore.receiverAdd(500)
      .then(tx => {
        return DeStore.receiverGetStorage();
      })
      .then(tx => {
        lol(tx);
        t.equal(tx.c[0], 500, 'receiverGetStorage should return the available storage parameter passed to receiverAdd');
        t.end();
      })
      .catch(err => {
        console.error(err);
        t.end(err);
      });
  });

  t.test('Check functionality of receiverGetStatus', t => {
    DeStore.receiverGetStatus(Ethereum.account)
      .then(acctStatus => {
        lol(acctStatus);
        t.equal(acctStatus, true, 'receiverGetStatus should equal false if the receiver is unavailable');
        t.end();
      })
      .catch(err => {
        console.error(err);
        t.end(err);
      });
  });

  t.test('Check AddReceiver Event', t => {
    const filter = {
      address: DeStore.address
    };
    Ethereum.getEventLogs('DeStore', DeStore.address, 'AddReceiver', filter)
      .then(logs => {
        const log = logs[logs.length - 1];
        lol(log);
        t.equal(log.init, true, 'Expect AddReceiver init to equal true');
        t.equal(log.status, true, 'Expect AddReceiver status to equal true');
        t.equal(log.index.c[0], 1, 'Expect AddReceiver index to equal 1');
        t.equal(log.availStorage.c[0], 500, 'Expect AddReceiver availStorage to equal storage parameter passed to receiverAdd');

        t.end();
      })
      .catch(err => {
        t.end(err);
      });
  });


  t.end();
});
