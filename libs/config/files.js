'use strict';

// file config options

const user = './../user/'; // path to application user directory

// download - where files are downloaded from IPFS to
// watch - where files to be watched and backup are put
// files - files to be uploaded to IPFS
// storage - files backup

const fileConfig = {
  download: user + 'download',
  files: user + 'files',
  storage: user + 'storage',
  watch: user + 'watch'
};

module.exports = fileConfig;
