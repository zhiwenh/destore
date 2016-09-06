'use strict';
const Upload = require('./../../models/Host.js');
const promisify = require('es6-promisify');

/**
* Lists all the files
* @returns {Promise} - contains an array of all Uploaded docs
**/
module.exports = promisify((callback) => {
  Upload.db.find({}, (err, docs) => {
    if (err) {
      callback(err, null);
      return;
    }
    callback(null, docs);
  });
});
