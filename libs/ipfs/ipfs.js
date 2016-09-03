'use strict';
const ipfsAPI = require('ipfs-api');
const fs = require('fs');
const promisify = require('es6-promisify');
const spawn = require('child_process').spawn;

const networkConfig = require('./../config/config.js').network;

// config ipfs node. be able to change theirs
// instead of having config file could just have method to change their actual ipfs config

class IPFS {
  constructor() {
    this._ipfs = this.init();
    this.connect = false;
    this.publicKey = null;
    this.id = null;
  }

  // need to run before using IPFSObj
  init() {
    console.log('init ipfs');
    this._ipfs = new ipfsAPI(networkConfig.host,
      networkConfig.port, {
        protocol: networkConfig.protocol
      });
    // a check to see if it connected to IPFS
    this._ipfs.id()
      .then((res) => {
        this.publickey = res.publickey;
        this.id = res.id;
        this.connect = true;
      })
      .catch((err) => {
        console.log(err.code);
        throw('Init: Could not connect to IPFS');
      });
    return this._ipfs;
  }

  // call ipfs daemon --manage-fdlimit
  daemon() {
    const ipfsDaemon = spawn('ipfs', ['daemon', '--manage-fdlimit']);

    ipfsDaemon.stdout.on('data', (data) => {
      console.log(`stdout: ${data}`);
    });

    ipfsDaemon.stderr.on('data', (data) => {
      console.log(`stderr: ${data}`);
    });

    ipfsDaemon.on('error', (error) => {
      console.error(error);
    });

    ipfsDaemon.on('close', (code) => {
      console.log(`child process exited with code ${code}`);
    });
  }

  /**
  * @filesPaths {String} or {Array} contains path to files
  * @return {Promise} with res an array of objects with {path: String, hash: String, size: Number, file: file path}
  **/
  addFiles(filePaths) {
    if (typeof filePaths === 'string') {
      filePaths = [filePaths];
    }

    const fileBuffers = filePaths.map((path) => {
      return fs.readFileSync(path);
    });
    // adds actual './path/path/file' to returned obj
    return promisify((filePaths, callback) => {
      this._ipfs.files.add(fileBuffers, (err, res) => {
        if (err) {
          callback(err, null);
        } else {
          res.map((obj, i) => {
            return obj.file = filePaths[i];
          });
          callback(null, res);
        }
      });
    })(filePaths);
  }

  // @ hashAddress - string - of the file
  // @ writePath - string - path in which to write the file to
  // returns Promise with the response as an array of all buffer chunks
  download(hashAddress, writePath) {
    try {
      fs.accessSync(writePath);
    } catch(e) {
      fs.closeSync(fs.openSync(writePath, 'w'));
    }
    const writeStream = fs.createWriteStream(writePath);

    return promisify((hashAddress, callback) => {
      this._ipfs.cat(hashAddress, (err, stream) => {
        console.log(typeof stream);
        if (err) {
          callback(err);
          return;
        }
        stream.pipe(writeStream);
        let resArray = [];
        process.stdout.write('Downloading ' + hashAddress + ' to: \n');
        process.stdout.write(writePath + '\n');

        stream.on('data', function(chunk) {
          process.stdout.write('.');
          resArray.push(chunk);
        });

        stream.on('error', function(err) {
          callback(err, null);
        });

        stream.on('end', function() {
          process.stdout.write('\nDone!\n');
          callback(null, resArray);
        });
      });
    })(hashAddress);
  }

}

module.exports = new IPFS();
