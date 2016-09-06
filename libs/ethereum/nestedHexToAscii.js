'use strict';
const Ethereum = require('./ethereum.js');

const web3 = Ethereum.init();

function splitHexHashToAscii(hexArray) {
  let hashAddress;
  for (var i = 0; i < hexArray.length; i += 2) {
    hashAddress = (web3.toAscii(hexArray[i]) + web3.toAscii(hexArray[i + 1]));
    hashAddress = hashAddress.split('').filter(char => {
      return char.match(/[A-Za-z0-9]/);
    }).join('');
  }
  return hashAddress;
}

module.exports = (nestedHexArray) => {
  const asciiHashes = [];
  for (let i = 0; i < nestedHexArray.length; i++) {
    const asciiHash = splitHexHashToAscii(nestedHexArray[i]);
    asciiHashes.push(asciiHash);
  }
  return asciiHashes;
};
