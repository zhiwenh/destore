/*
IMPORTANT: testrpc must be running during these tests,
at least for now. 8/25/2016 4:48pm
*/

const test = require('tape');
const tapSpec = require('tap-spec');
const ethereum = require('../libs/ethereum/ethereum.js');

test.createStream()
  .pipe(tapSpec())
  .pipe(process.stdout);

test('web3 isConnected test true/false', t => {
  t.plan(1);

  const status = ethereum.check();
  console.log('ethereum.check() : ', status);
  t.equal(status, true, 'successful connection should return true');
});

test('web3.eth.accounts should return an array', t => {
  t.plan(1);

  const acctArr = ethereum.getAccounts();
  const typeOfAcctArr = Array.isArray(acctArr);

  t.equal(typeOfAcctArr, true, 'ethereum.getAccounts should return an array');
});

// var rand = myArray[Math.floor(Math.random() * myArray.length)];

test('deploy should return a Promise', t => {

});
