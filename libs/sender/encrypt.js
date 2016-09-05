var path = require('path');
var zlib = require('zlib');
var fs = require('fs');

function encryptFile(filePath, algorithm, password, hash) {
	var start = fs.createReadStream(filePath);
	// zip content
	var zip = zlib.createGzip();
	// encrypt content
	var encrypt = crypto.createCipher(algorithm, password);
	// write file
	var end = fs.createWriteStream(path.join('/../'+hash));
	//execute by piping
	start.pipe(encrypt).pipe(zip).pipe(end);
}




// start pipe
// r.pipe(zip).pipe(encrypt).pipe(decrypt).pipe(unzip).pipe(w);
module.exports = encryptFile;