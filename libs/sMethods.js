const web3 = require('web3');
const fs = require('fs-extra');
const program = require('commander');
const systeminformation = require('systeminformation');
const chokidar = require('chokidar');
const watchedDir = '';
const watcher = chokidar.watch(watchedDir, {
  ignored: /[\/\\]\./,
  persistent: true,
});
const newFileExists = false;

const user = {
  makeWatchFolder: (desiredPathToDirectory) => {
    // TODO this first argument, the file path, needs to be checked
    fs.mkdirs('user/Desktop/destore', (err) => {
      if (err) return console.error(err);
      console.log('DeStore folder created successfully');
    });
  },

  checkNewFile: () => {
    // to be run against watchedDir
    // checks only for changes and returns a boolean
  },

  commitToIpfs: () => {
    // run the IPFS commands to commit the file to IPFS
    program
      .option();
  },

  sendFile: () => {
    // sends the IPFS address to the smart contract
  },

  deleteFile: () => {
    // alert smart contract that user wants to cease paid storage
  },
};

module.exports = user;
