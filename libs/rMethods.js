const web3 = require('web3');
const fs = require('fs-extra');
const systeminformation = require('systeminformation');
const chokidar = require('chokidar');
const diskspace = require('diskspace');
const program = require('commander');

const offered = 10000000000; // change to reference host-submitted storage space
const freeSpaceThreshold = 0.9;
let drive = 'C';

// this is a first draft of a conditional to set the "drive" variable
// it is a departure from my initial idea, which was just to write two methods:
// one for *nix machines and one for windows machines. That didn't come out DRY
// so I left off experimenting with this conditional
if (systeminformation.osInfo !== 'windows') { // TODO 'windows' isn't right
  drive = '/';
}

// TODO require "offered" diskspace from host

const host = {
  getDiskSpace: (offered) => {
    diskspace.check(drive, (err, total, free, status) => {
      // TODO
      if (offered > free) {
        throw new Error('You do not have enough free space. Please adjust your settings.');
      }

      if ((offered / total) / (free / total) <= freeSpaceThreshold) {
        return true;
      }
    });
  },

  getFile: (fileHash) => {
    // tells the command line to run ipfs get ipfs/fileHash/filename.ext
  },
};

module.exports(host);
