
var path = require('path');
var zlib = require('zlib');
var fs = require('fs');

function decryptFile(filePath, algorithm, password, basename) {
	var start = fs.createReadStream(filePath);
	// decrypt content
	var decrypt = crypto.createDecipher(algorithm, password);
	// unzip content
	var unzip = zlib.createGunzip();
	// write file
	var end = fs.createWriteStream(path.join('/../'+basename));
	//execute by piping
	start.pipe(decrypt).pipe(unzip).pipe(end);
}
// var stripped

// zip content
// var zip = zlib.createGzip();
// encrypt content
// var encrypt = crypto.createCipher(algorithm, password);


// start pipe
// r.pipe(zip).pipe(encrypt).pipe(decrypt).pipe(unzip).pipe(w);

// $("button.test").click(() => {
//   r = fs.createReadStream(filePathh);
//   w = fs.createWriteStream('file.out.txt')
//   r.pipe(w);
// });

// $("button.test5").click(() => {
//   console.log(w)
// });

module.exports = decryptFile;
