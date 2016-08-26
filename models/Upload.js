'use strict';
const DataStore = require('nedb');

const Upload = new DataStore({
  filename: __dirname + '/../data/upload.db',
  autoload: true
});

const Schema = {
  fileName: null,
  filePath: null,
  fileSize: null,
  senderHashAddress: null,
  contractAddress: null,
  uploadTime: null
};

Upload.ensureIndex({ fieldName: 'hashAddress', unique: true, sparse: true }, err => {
  if (err) console.error(err);
});

module.exports = {
  db: Upload,
  reset: () => {
    Upload.remove({}, { multi: true }, (err, numRemoved) => {
      if (err) throw err;
      else {
        console.log('Removed: ' + numRemoved);
      }
    });
  }
};
