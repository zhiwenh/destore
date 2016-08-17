// creates the directory that will contain files
const fs = require('fs');


module.exports = function(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }
};
