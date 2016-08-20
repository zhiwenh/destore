const IPFS = require('ipfs');
const ipfsAPI = require('ipfs-api');

const multihashes = require('multihashes');

// make an ipfs config file

function IPFSObj() {
  this._ipfs = null;
  this.publicKey = null;
  this.id = null;

  this.init = () => {
    console.log('init');
    this._ipfs = new ipfsAPI('localhost', '5001', {protocol: 'http'});
    this._ipfs.id()
      .then((res) => {
        console.log('worked');
        this.publickey = res.publickey;
        this.id = res.id;
      })
      .catch((err) => {
        console.log(err.code);
        // throw('Init: Could not connect to IPFS');
      });
    // console.log(this._node);
  };

  // send multiple files

  // save hashes of multiple files

  // download multiple files

  // config ipfs node. be able to change theirs
  this.config = function() {

  };

  this.add = (filePath) => {
    const data = {
      path: './../../files/test.txt'
    };
    const data2 = {
      path: 'test10'
    }
    // node.files.add(data, function(err, files) {
    //   if (err) {
    //     throw (err);
    //   } else {
    //     console.log(files);
    //   }
    // });

    this._ipfs.files.add([data2])
      .then((res) => {
        res.forEach(e => {
          console.log(e.path);
          if (e.node.links.length > 0) {
            const buf = e.node.links[0].hash;
            console.log(multihashes.toB58String(buf));
            // console.log(buf.toString('hex'));
          }
        });
        // console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };

}

module.exports = new IPFSObj();
