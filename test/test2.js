'use strict';
/*
IMPORTANT: testrpc must be running during these tests,
at least for now. 8/25/2016 4:48pm
*/

let test = require('tape');
const tapSpec = require('tap-spec');
const Ethereum = require('../libs/ethereum/ethereum.js');
const promisify = require('es6-promisify');


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
    const half1 = inputHash.substring(0,23);
    const half2 = inputHash.substring(23,46);
    return [half1, half2];
  }
};


test.createStream()
  .pipe(tapSpec())
  .pipe(process.stdout);

test = promisify(test);

test('===DeStore Master List Contract===')
  .then(t => {

    let destoreInstance;
    let recStorage;
    const hash1 = 'QmUNLLsPACCz1vLxQVkXqqLX5R1X345qqfHbsf67hvA3Nn';
    const hash2 = 'QmcSwTAwqbtGTt1MBobEjKb8rPwJJzfCLorLMs5m97axDW';
    const hash3 = 'QmRtDCqYUyJGWhGRhk1Bbk4PvE9mbCS1HKkDAo6xUAqN4H';
    const hash4 = 'QmbFMke1KXqnYyBBWxB74N4c5SBnJMVAiMNRcGu6x1AwQH';

    const deployOptions = {
      from: Ethereum.account,
      value: 10
    };

    Ethereum.deploy('DeStore', [helper.split(hash1), 10], deployOptions)
      .then(instance => {
        destoreInstance = instance;
        t.equal(instance.address.length, 42, 'Contract address should have a length of 42');
        t.end();
      })
      .catch(err => {
        t.end(err);
      });
    t.end();
  })
  .catch(err => {
    lol('error');
    console.error(err);
  });

//  ({
//   Ethereum.init();
//
//   let destoreInstance;
//   let recStorage;
//   const hash1 = 'QmUNLLsPACCz1vLxQVkXqqLX5R1X345qqfHbsf67hvA3Nn';
//   const hash2 = 'QmcSwTAwqbtGTt1MBobEjKb8rPwJJzfCLorLMs5m97axDW';
//   const hash3 = 'QmRtDCqYUyJGWhGRhk1Bbk4PvE9mbCS1HKkDAo6xUAqN4H';
//   const hash4 = 'QmbFMke1KXqnYyBBWxB74N4c5SBnJMVAiMNRcGu6x1AwQH';
//
//   test('Deploying DeStore Contract', t => {
//     const deployOptions = {
//       from: Ethereum.account,
//       value: 10
//     };
//
//     Ethereum.deploy('DeStore', [helper.split(hash1), 10], deployOptions)
//       .then(instance => {
//         destoreInstance = instance;
//         t.equal(instance.address.length, 42, 'Contract address should have a length of 42');
//         t.end();
//       })
//       .catch(err => {
//         t.end(err);
//       });
//   });
//
//   test('Add receivers to DeStore Contract', t => {
//     destoreInstance.addReceiver(500)
//       .then(tx => {
//         return destoreInstance.checkReceiverStorage();
//       })
//       .then(tx => {
//         t.equal(tx, 500, 'checkReceiverStorage should return the available storage parameter passed to addReceiver');
//         t.end();
//       })
//       .catch(err => {
//         t.end(err);
//       });
//   });
// });
