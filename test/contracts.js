const test = require('tape');
const Ethereum = require('../libs/ethereum/ethereum.js');

test.createStream()
  .pipe(tapSpec())
  .pipe(process.stdout);

test('web3 isConnected test true/false', t => {
  // t.plan(1);

  const status = Ethereum.check();
  console.log('ethereum.check() : ', status);
  t.equal(status, true, 'successful connection should return true');
  t.end();
});

test('web3.eth.accounts should return an array', t => {
  // t.plan(1);

  const acctArr = Ethereum.getAccounts();
  const typeOfAcctArr = Array.isArray(acctArr);

  t.equal(typeOfAcctArr, true, 'ethereum.getAccounts should return an array');
  t.end();
});

// var rand = myArray[Math.floor(Math.random() * myArray.length)];

test('deploy should return a Promise', t => {

});
