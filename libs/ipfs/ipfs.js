'use strict';
const ipfsAPI = require('ipfs-api');
// const multihashes = require('multihashes');
const fs = require('fs');
const promisify = require('es6-promisify');
// const stream = require('stream');

const spawn = require('child_process').spawn;

const networkConfig = require('./../config/config.js').network;

// make an ipfs config file
// send multiple files
// save hashes of multiple files
// download multiple files
// config ipfs node. be able to change theirs

// instead of having config file could just have method to change their actual ipfs config

class IPFS {
  constructor() {
    this._ipfs = null;
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
      console.log(error);
    });

    ipfsDaemon.on('close', (code) => {
      console.log(`child process exited with code ${code}`);
    });
  }


  // @ filesPaths - string or array containing the paths to the files
  // returns a Promise
  addFiles(filePaths) {
    console.log(filePaths);
    if (typeof filePaths === 'string') {
      filePaths = [filePaths];
    }
    console.log(filePaths)

    const fileBuffers = filePaths.map((path) => {
      return fs.readFileSync(path);
    });
    console.log('file buffers');
    console.log(fileBuffers);
    // adds actual './path/path/file' to returned obj
    const addPaths = (filePaths, callback) => {
      this._ipfs.files.add(fileBuffers, (err, res) => {
        console.log('callback add');
        console.log(res);

        if (err) {
          callback(err, null);
        } else {
          res.map((obj, i) => {
            return obj.file = filePaths[i];
          });
          callback(null, res);
        }
      });
    };
    return promisify(addPaths)(filePaths);
  }

  // @ hashAddress - string - of the file
  // @ writePath - string - path in which to write the file to
  // returns Promise with the response as an array of all buffer chunks
  download(hashAddress, writePath) {
    console.log('INSIDE', hashAddress)
    console.log(writePath)
    try {
      fs.accessSync(writePath);
    } catch(e) {
      // fs.mkdirSync(writePath);
      fs.closeSync(fs.openSync(writePath, 'w'));
    }
    const writeStream = fs.createWriteStream(writePath);

    const streamPromise = (hashAddress, callback) => {
      this._ipfs.cat(hashAddress, (err, stream) => {
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
    };

    return promisify(streamPromise)(hashAddress);
  }

}

module.exports = new IPFS();
