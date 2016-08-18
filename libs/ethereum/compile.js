'use strict';

// compiles Solidity (.sol) files
const fs = require('fs');
const solc = require('solc');

const init = require('./init.js');

const contractsConfig = require('./../config/contracts.js');

// @ contract - string - contract name
// @ directoryPath - string - directory path to where contract is contained
//   optional. if not given will be taken from config

const web3 = init();

module.exports = (contract, directoryPath) => {
  if (!directoryPath) directoryPath = contractsConfig.path;
  if (directoryPath[directoryPath.length - 1] !== '/') directoryPath += '/';
  if (!contract.endsWith('.sol')) contract += '.sol';

  const contractPath = directoryPath + contract;

  console.log(contractPath);

  const contractString = fs.readFileSync(contractPath).toString();
  // const contractString = 'contract mortal { address owner; function mortal() { owner = msg.sender; } function kill() { if (msg.sender == owner) selfdestruct(owner); } } contract greeter is mortal { string greeting; function greeter(string _greeting) public { greeting = _greeting; } function greet() constant returns (string) { return greeting; } }';

  // contractString.replace(/(\r\n|\n|\r)/gm, '');


  console.log(contractString);
  console.log(typeof contractString);

  const contractCompiled = solc.compile(contractString, 1);

  console.log(contractCompiled);
  return contractString;
};
