'use strict';
/**
* @bytes {Number} - size in bytes
* @returns {String} - representation of bytes with the right magnitude
**/

module.exports = (bytes) => {
  if (bytes > Math.pow(1024, 4)) {
    return (bytes / Math.pow(1024, 4)).toFixed(2) + ' TB';
  } else if (bytes > Math.pow(1024, 3)) {
    return (bytes / Math.pow(1024, 3)).toFixed(2) + ' GB';
  } else if (bytes > Math.pow(1024, 2)) {
    return (bytes / Math.pow(1024, 2)).toFixed(2) + ' MB';
  } else if (bytes > Math.pow(1024, 1)) {
    return (bytes / Math.pow(1024, 1)).toFixed() + ' KB';
  } else {
    return bytes + ' bytes';
  }
};
