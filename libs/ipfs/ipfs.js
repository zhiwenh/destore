const IPFS = require('ipfs');
const ipfsAPI = require('ipfs-api');

const multihashes = require('multihashes');

// make an ipfs config file

function IPFSObj() {
  this._node = null;

  this.init = () => {
    this._ipfs = new ipfsAPI();

    console.log(this._node.isOnline());
    // console.log(this._node);
  };

  // send multiple files

  // save hashes of multiple files

  // download multiple files

  // config ipfs node. be able to change theirs
  this.config = function() {

  };

  this.add = () => {
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

    this._node.files.add([data2])
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
