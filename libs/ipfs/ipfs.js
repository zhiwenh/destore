'use strict';
const ipfsAPI = require('ipfs-api');
// const multihashes = require('multihashes');
const fs = require('fs');
const promisify = require('es6-promisify');
const stream = require('stream');

const networkConfig = require('./../config/config.js').network;

// make an ipfs config file
// send multiple files
// save hashes of multiple files
// download multiple files
// config ipfs node. be able to change theirs

// instead of having config file could just have method to change their actual ipfs config

class IPFSObj {
  constructor() {
    this._ipfs = null;
    this.publicKey = null;
    this.id = null;
  }

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
      })
      .catch((err) => {
        console.log(err.code);
        throw('Init: Could not connect to IPFS');
      });
  }

  // @ filesPaths - string or array containing the paths to the files
  // returns a Promise
  addFiles(filePaths) {
    if (typeof filePaths === 'string') {
      filePaths = [filePaths];
    }

    const fileBuffers = filePaths.map((path) => {
      return fs.readFileSync(path);
    });

    // adds actual './path/path/file' to returned obj
    const addPaths = (filePaths, callback) => {
      this._ipfs.files.add(fileBuffers, function(err, res) {
        console.log('callback add');
        if (err) throw(err);
        else {
          res.map((obj, i) => {
            return obj.file = filePaths[i];
          });
          callback(res);
        }
      });
    };
    return promisify(addPaths)(filePaths);
  }

  // @ hashAddress - string - of the file
  // @ writePath - string - path in which to write the file to
  download(hashAddress, writePath) {
    try {
      fs.accessSync(writePath);
    } catch(e) {
      // fs.mkdirSync(writePath);
      fs.closeSync(fs.openSync(writePath, 'w'));
    }
    const writeStream = fs.createWriteStream(writePath);

    const streamPromise = (hashAddress, callback) => {
      this._ipfs.cat(hashAddress)
        .then((stream) => {
          stream.pipe(writeStream);
          let res = '';

          stream.on('data', function(chunk) {
            console.log(chunk.toString());
            res += chunk.toString();
          });

          stream.on('error', function(err) {
            throw(err);
          });

          stream.on('end', function() {
            callback(res);
          });
        })
        .catch((err) => {
          throw(err);
        });
    };

    return promisify(streamPromise)(hashAddress);
  }

}

module.exports = new IPFSObj();
