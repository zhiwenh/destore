'use strict';
const pathway = __dirname + '/../data/deStoreAddress';
const fs = require('fs');

module.exports = {
  save: (address) => {
    fs.writeFileSync(pathway, address);
  },
  get: () => {
    return fs.readFileSync(pathway, 'utf8');
  }
};
