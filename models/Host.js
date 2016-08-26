'use strict';
const DataStore = require('nedb');

const Host = new DataStore({
  filename: './data/host.db',
  autoload: true
});

const Schema = {
  fileSize: null,
  hashAddress: null,
  senderAddress: null,
  hostTime: null
};

Host.ensureIndex({ fieldName: 'hashAddressR', unique: true, sparse: true }, err => {
  if (err) console.error(err);
});

module.exports = {
  db: Host,
  reset: () => {
    Host.remove({}, { multi: true }, (err, numRemoved) => {
      if (err) throw err;
      else {
        console.log('Removed: ' + numRemoved);
      }
    });
  }
};
