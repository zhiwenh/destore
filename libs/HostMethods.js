'use strict';

const web3 = require('web3');
const fs = require('fs-extra');
const systeminformation = require('systeminformation');
const chokidar = require('chokidar');
const diskspace = require('diskspace');
const program = require('commander');

const offered = 10000000000; // change to reference host-submitted storage space
const freeSpaceThreshold = 0.9;
// let drive = 'C';

// TODO require "offered" diskspace from host

const Host = {
  getDiskSpace: (offered) => {
    diskspace.check('/', (err, total, free, status) => { // '/' parameter is for *nix machines.
      console.log('diskspace.check status: ', status);

      // TODO
      if (offered > free) {
        throw new Error('You do not have enough free space. Please adjust your settings.');
      }

      if ((offered / total) / (free / total) <= freeSpaceThreshold) {
        return true;
      }
    });
  },

  getFile: (fileHash, fileName) => {
    const ipfsAddress = 'ipfs cat /ipfs/${fileHash}/${fileName}';
    // program
    //   .command('get file ${ipfsAddress}' )
    //   .description('Host ')
    // tells the command line to run ipfs get ipfs/fileHash/filename.ext
  },
};

module.exports = Host;
