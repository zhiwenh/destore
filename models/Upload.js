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
  hashAddress: null,
  // contractAddress: null,
  blocks: [],
  blockSizes: [],
  receivers: [],
  uploadTime: null,
  isMounted: null
};

Upload.ensureIndex({ fieldName: 'hashAddress', unique: true, sparse: true }, err => {
  if (err) console.error(err);
});

Upload.ensureIndex({ fieldName: 'fileName', unique: true, sparse: true }, err => {
  if (err) console.error(err);
});

module.exports = {
  db: Upload,
  reset: () => {
    Upload.remove({}, { multi: true }, (err, numRemoved) => {
      if (err) throw err;
    });
  }
};
