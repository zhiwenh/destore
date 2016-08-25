'use strict';
const DataStore = require('nedb');

const db = new DataStore({
  filename: './..data/upload.db',
  autoload: true
});

const Schema = {
  fileName: null,
  filePath: null,
  fileSize: null,
  hashAddress: null,
  contractAddress: null,
  uploadTime: null
  // passwordHash: null
};

module.exports = {
  db: db,
  reset: () => {
    db.remove({}, { multi: true }, (err, numRemoved) => {
      if (err) throw (err)
      else {
        console.log('Removed: ' + numRemoved);
      }
    });
  },
};
