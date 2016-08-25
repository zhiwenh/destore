'use strict';

const fs = require('fs-extra');
const path = require('path');
const systeminformation = require('systeminformation');
const chokidar = require('chokidar');
const watchedDir = 'DeStore';
const newFileExists = false;


class User {
  constructor() {

  }
  
  mkdir(name) {
    // console.log('Current Working Directory: ', process.cwd());
    fs.mkdirs(name, (err) => {
      if (err) return console.error(err);
      console.log('DeStore folder created successfully');
    });
  }

  checkNewFile() {
    // to be run against watchedDir
    // checks only for changes and returns a boolean
  }

  addFile() {

  }

  commitToIpfs() {
    // run the IPFS commands to commit the file to IPFS
  }

  sendFile() {
    // sends the IPFS address to the smart contract
  }

  deleteFile() {
    // replace stored file IPNS with an empty file
  }
}


module.exports = new User();
