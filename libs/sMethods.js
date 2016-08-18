const web3 = require('web3');
const systeminformation = require('systeminformation');
const chokidar = require('chokidar');
const watchedDir = 'name of folder'; // TODO this is a fake path
const watcher = chokidar.watch(watchedDir, {
  ignored: /[\/\\]\./,
  persistent: true,
});

const user = {
  makeWatchFolder: (desiredPathToDirectory) => {
    // cd into desiredPathToDirectory
    // mkdir DeStore
  };

  checkNewFile: () => {
    // to be run against watchedDir
    // checks only for changes and returns a boolean
  },

  commitToIpfs: () => {
    // run the IPFS commands to commit the file to IPFS
  },

  sendFile: () => {
    // sends the IPFS address to the smart contract
  },

  deleteFile: () => {
    // alert smart contract that user wants to cease paid storage
  },
};
