const fs = require('fs-extra');

function copyFile(source, target, callback) {
  var cbCalled = false;

  var start = fs.createReadStream(source);
  start.on("error", function(err) {
    done(err);
  });
  var end = fs.createWriteStream(target);
  end.on("error", function(err) {
    done(err);
  });
  end.on("close", function(ex) {
    done();
  });
  start.pipe(end);

  function done(err) {
    if (!cbCalled) {
      callback(err);
      cbCalled = true;
    }
  }
}

module.exports = copyFile;