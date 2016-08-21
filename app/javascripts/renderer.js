const Ethereum = nodeRequire('../../libs/ethereum/ethereum.js');
const web3 = Ethereum.init();
const Host = nodeRequire('../../libs/HostMethods.js');
const User = nodeRequire('../../libs/UserMethods.js');
const Watch = nodeRequire('../../libs/watchMethods.js');
const IPFS = nodeRequire('../../libs/ipfs/ipfs.js');
const path = nodeRequire('path');
const Config = require('electron-config');
const config = new Config();
const fs = require('fs')

var hash;
var recInstance;
var masterInstance;
var senderInstance;
var i = 0;

//Initializes daemon when on page
IPFS.daemon();

//Makes encrypt/download folder (hidden)


$("button.addMasterList").click(function() {
		Ethereum.deploy('MasterList')
			.then(function(instance){
				masterInstance = instance;
			});
	});

$("button.addHost").click(function() {
	var value = $('#host').val();
	Ethereum.deploy('Receiver', [value, masterInstance.address])
		.then(function(instance){
			recInstance = instance;
		});
});

$("button.mkdir").click(function() {
	User.makeWatchFolder();
	//get file path
	// var dirPath = path.join(__dirname, '../../DeStoreWatch');
	// Watch.startWatch(dirPath);
});

$("button.addUser").click(function() {
	hash = $('#hash').val();
	var filesize = $('#user').val();
	var hash1 = hash.substring(0,23);
	var hash2 = hash.substring(23,46);
	Ethereum.deploy('Sender', [hash1, hash2, filesize, masterInstance.address])
		.then(function(instance){
			senderInstance = instance;
		});
});

$("button.test").click(function() {
		masterInstance.testReceiver().then(function(res){
			console.log('Host Address',res[0]);
			console.log('Available Storage',res[1].toNumber());
		});
	});

	$("button.test2").click(function() {
		var value = $('#user').val();
		var hash1 = hash.substring(0,23);
		var hash2 = hash.substring(23-10,46-10);
		senderInstance.testSender(hash1, hash2).then(function(res){
			console.log('Latest Hash: ', web3.toAscii(res[0])+web3.toAscii(res[1]));

		});
	});

	$("button.test3").click(function() {
		recInstance.retrieveStorage().then(function(res){
			for (var i = 0; i < res.length; i+=2) {
				console.log('RECEIVED FILE HASH'+((i/2)+1)+': '+ web3.toAscii(res[i])+web3.toAscii(res[i+1]));
			}
		});
	});

	$("button.test4").click(function() {
		console.log(config.get('fileList'));
	});

	$("button.clear").click(function() {
		// config.clear('fileList');
	});

	function getFileSize(filename) {
			var stats = fs.statSync(filename);
			var fileSizeInBytes = stats["size"];
			return fileSizeInBytes;
	}

	document.ondragover = document.ondrop = (ev) => {
		ev.preventDefault();
	}
	
	var filePathArray, fileSizeArray, filePath, fileSize;
	$("#dropbox").on("drop", function(ev) {
		ev.preventDefault();
		filePath = ev.originalEvent.dataTransfer.files[0].path;
		fileSize = getFileSize(filePath);

		if(config.get('fileList')===undefined) {
			filePathArray = [];
			fileSizeArray = [];
		} else {
			filePathArray = config.get('fileList.name')
			fileSizeArray = config.get('fileList.name')
		}
		filePathArray.push(filePath);
		fileSizeArray.push(fileSize);
		config.set('fileList', { name: filePathArray, size: fileSizeArray });
		console.log('FILE: ', filePath, ' SIZE: ', fileSize)
	});

	function remove() {
		storage.get('fileList', function(error, res){
			if(error) console.log(error);
		})
		storage.set('fileList', { name: fileArray, size: fileSize }, function(error) {
		  if (error) throw error;
		});
	}

	// function mkdir(dir) {
	//   if (!fs.existsSync(dir)){
	//       fs.mkdirSync(dir);
	//   }
	// }

	document.body.ondrop = (ev) => {
		ev.preventDefault();
	}
