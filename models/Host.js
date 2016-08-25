'use strict';
const DataStore = require('nedb');

const db = new DataStore({
  filename: './..data/host.db',
  autoload: true
});

const Schema = {
  fileSize: null,
  hashAddress: null,
  senderAddress: null,
  hostTime: null
};

module.exports = {
  db: db,
  reset: () => {
    db.remove({}, { multi: true }, (err, numRemoved) => {
      if (err) throw (err);
      else {
        console.log('Removed: ' + numRemoved);
      }
    });
  },
};
