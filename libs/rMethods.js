const web3 = require('web3');
const systeminformation = require('systeminformation');
const chokidar = require('chokidar');
const diskspace = require('diskspace');

const offered = 10000000000; // change to reference host-submitted storage space
const drive = 'C';
const freeSpaceThreshold = 0.9;

// TODO require "offered" diskspace from host

const host = {
  getDiskSpaceWindows: (offered) => {
    diskspace.check(drive, (err, total, free, status) => {
      // TODO
      if (offered > free) {
        throw new Error('You do not have enough free space. Please adjust your settings.');
      }

      if ((offered / total) / (free / total) <= freeSpaceThreshold) {
        // TODO succeed
      }
    });
  },

  getDiskSpaceNix: (offered) => {
    diskspace.check('/', diskSpaceChecker);
  },
};
