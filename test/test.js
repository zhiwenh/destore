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

test('square function test', t => {
  t.plan(1);

  const square = x => x*x;
  const res = square(5);
  t.equal(res, 25, 'five squared should be twenty-five');
});

test('web3 isConnected test true/false', t => {
  t.plan(1);

  ethereum.init();
  const status = ethereum.check();

  t.equal(status, true, 'successful connection should return true');
});
