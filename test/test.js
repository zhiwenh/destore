'use strict';
/*
IMPORTANT: testrpc must be running during these tests,
at least for now. 8/25/2016 4:48pm
*/

const tape = require('tape');
const tapes = require('tapes');
const tapSpec = require('tap-spec');
const Ethereum = require('../libs/ethereum/ethereum.js');
const IPFS = require('./../libs/ipfs/ipfs.js');

const DeStoreAddress = require('./../models/DeStoreAddress.js');

const config = require('./../libs/config/config.js');

tape.createStream()
  .pipe(tapSpec())
  .pipe(process.stdout);

const test = tapes(tape);

const lol = console.log.bind(console);

const web3 = Ethereum.init();

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
  },
  asciiHash: (byteArray) => {
    let hashAddress;
    for (var i = 0; i < byteArray.length; i += 2) {
      hashAddress = (web3.toAscii(byteArray[i]) + web3.toAscii(byteArray[i + 1]));
      hashAddress = hashAddress.split('').filter(char => {
        return char.match(/[A-Za-z0-9]/);
      }).join('');
    }
    return hashAddress;
  }
};

const hashObjs = {
  hash1: 'QmUNLLsPACCz1vLxQVkXqqLX5R1X345qqfHbsf67hvA3Nn',
  hash2: 'QmcSwTAwqbtGTt1MBobEjKb8rPwJJzfCLorLMs5m97axDW',
  hash3: 'QmRtDCqYUyJGWhGRhk1Bbk4PvE9mbCS1HKkDAo6xUAqN4H',
  hash4: 'QmbFMke1KXqnYyBBWxB74N4c5SBnJMVAiMNRcGu6x1AwQH',
};

test('web3 isConnected test true/false', t => {
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


test('DeStore ===', t => {
  Ethereum.init();
  let DeStore;

  t.test('Receiver Tests === Check functionality of deployment', t => {
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

  t.test('Add receiver to DeStore with storage of 500', t => {
    DeStore.receiverAdd(500)
      .then(tx => {
        return DeStore.receiverGetStorage();
      })
      .then(tx => {
        t.equal(tx.c[0], 500, 'receiverGetStorage should return 500, the available storage parameter passed to receiverAdd');
        t.end();
      })
      .catch(err => {
        t.message(err);
        t.end(err);
      });
  });

  t.test('Check AddReceiver Event', t => {
    Ethereum.getEventLogs('DeStore', DeStore.address, 'AddReceiver')
      .then(logs => {
        const log = logs[logs.length - 1];
        // t.equal(log.init, true, 'Expect AddReceiver init to equal true');
        t.equal(log.status, true, 'Expect AddReceiver status to equal true');
        t.equal(log.index.c[0], 0, 'Expect AddReceiver index to equal 0');
        t.equal(log.availStorage.c[0], 500, 'Expect AddReceiver availStorage to equal storage parameter passed to receiverAdd which was 500');
        t.end();
      })
      .catch(err => {
        t.end(err);
      });
  });

  t.test('Check functionality of receiverGetStatus', t => {
    DeStore.receiverGetStatus(Ethereum.account)
      .then(acctStatus => {
        t.equal(acctStatus, true, 'receiverGetStatus should equal false if the receiver is unavailable');
        t.end();
      })
      .catch(err => {
        t.end(err);
      });
  });

  t.test('Use receiverChangeStatus to change status to false', t => {
    DeStore.receiverChangeStatus(false)
      .then(tx => {
        t.ok(tx, 'receiverChangeStatus transaction was performed');
        t.end();
      })
      .catch(err => {
        t.end(err);
      });
  });

  t.test('Check that status was changed with receiverGetStatus', t => {
    DeStore.receiverGetStatus(Ethereum.account)
      .then(acctStatus => {
        t.equal(acctStatus, false, 'receiverGetStatus should equal false now');
        t.end();
      })
      .catch(err => {
        t.end(err);
      });
  });

  t.test('Change receiver status back to true with receiverChangeStatus', t => {
    DeStore.receiverChangeStatus(true)
      .then(tx => {
        t.ok(tx, 'receiverChangeStatus transaction was performed');
        t.end();
      })
      .catch(err => {
        t.end(err);
      });
  });

  t.test('Check functionality of receiverAddStorage. Adding 1000', t => {
    DeStore.receiverAddStorage(1000)
      .then(tx => {
        t.ok(tx, 'receiverAddStorage transaction of 1000 was performed');
        return DeStore.receiverGetStorage();
      })
      .then(amount => {
        t.equal(amount.c[0], 1500, 'receiverGetStorage should equal 1500');
        t.end();
      })
      .catch(err => {
        t.end(err);
      });
  });

  t.test('Check that the receiver index increases when adding receivers and that adding in other intital storage works', t => {
    Ethereum.changeAccount(1);
    DeStore.receiverAdd(1100, {from: Ethereum.account})
      .then(tx => {
        t.ok(tx, '1st receiverAdd transaction was sucessfully performed');
        return Ethereum.getEventLogs('DeStore', DeStore.address, 'AddReceiver');
      })
      .then(logs => {
        const log = logs[logs.length - 1];
        t.equal(log.index.c[0], 1, 'Expect AddReceiver index to equal 1 after adding 2nd receiver');
        t.equal(log.availStorage.c[0], 1100, 'Expect AddReceiver availStorage to equal 1100');
        Ethereum.changeAccount(2);
        return DeStore.receiverAdd(1500, {from: Ethereum.account});
      })
      .then(tx => {
        t.ok(tx, '2st receiverAdd transaction was sucessfully performed');
        return Ethereum.getEventLogs('DeStore', DeStore.address, 'AddReceiver');
      })
      .then(logs => {
        const log = logs[logs.length - 1];
        t.equal(log.index.c[0], 2, 'Expect AddReceiver index to equal 2 after adding 3rd receiver');
        t.equal(log.availStorage.c[0], 1500, 'Expect AddReceiver availStorage to equal 1500');
        t.end();
      })
      .catch(err => {
        t.end(err);
      });
  });

  t.test('Check functionality of receiverGetBalance', t => {
    DeStore.receiverGetBalance()
      .then(balance => {
        t.equal(balance.c[0], 0, 'Expect balance to equal 0');
        t.end();
      })
      .catch(err => {
        t.end(err);
      });
  });

  t.test('Deploying new DeStore contract for Sender tests', t => {
    Ethereum.changeAccount(0);
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

  t.test('Check functionality of senderAdd by checking AddSender event', t => {
    DeStore.senderAdd()
      .then(tx => {
        t.ok(tx, 'addSender transaction was sucessfully performed');
        return Ethereum.getEventLogs('DeStore', DeStore.address, 'AddSender');
      })
      .then(logs => {
        const log = logs[logs.length - 1];
        t.equal(log._sender, Ethereum.account, 'Expect _sender in event to equal to the message sender Ethereum.account');
        t.end();
      })
      .catch(err => {
        t.end(err);
      });
  });

  t.test('Check functionality of senderAddFile and IPFS addFile', t => {
    lol(config.files.upload + 'test');
    let addedHash;
    IPFS.addFiles(config.files.upload + 'test')
      .then(arr => {
        const hash = arr[0].hash;
        addedHash = hash;
        t.equal(hash.length, 46, 'Expect returned hash to be a string of length 46');
        t.equal(helper.split(hash).length, 2, 'Expect helper.split to return an array with the length of 2');
        t.equal(helper.split(hash)[0].length, 23, 'Expect each string of helper.split to return a length of 23');
        return DeStore.senderAddFile(helper.split(hash), 'test', 5);
      })
      .then(tx => {
        t.ok(tx, 'senderAddFile transaction was sucessfully performed');
        return Ethereum.getEventLogs('DeStore', DeStore.address, 'AddFile');
      })
      .then(logs => {
        const log = logs[logs.length - 1];
        t.equal(log._sender, Ethereum.account, 'Expect _sender of AddFile event to equal to the currently used Ethereum account');
        t.equal(log._value.c[0], 5, 'Expect _value of AddFile event to equal to 5');
        return DeStore.getFileHashes(Ethereum.account, 'test');
      })
      .then(byteArr => {
        const hash = helper.asciiHash(byteArr);
        t.equal(hash, addedHash, 'Expect getFileHashes to return the hash that was return from IPFS addFiles');
        t.end();
      })
      .catch(err => {
        t.end(err);
      });
  });
  t.end();
});
