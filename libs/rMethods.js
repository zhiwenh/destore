const web3 = require('web3');
const systeminformation = require('systeminformation');
const chokidar = require('chokidar');
const diskspace = require('diskspace');

const host = {
  getDiskSpaceWindows: () => {
    diskspace.check('C', function (err, total, free, status) {
      // TODO
    });
  },

  getDiskSpaceNix: () => {
    diskspace.check('/', function (err, total, free, status) {
      // TODO
    });
  },

};
