const Ethereum = nodeRequire('../../libs/ethereum/ethereum.js');
const web3 = Ethereum.init();
const Host = nodeRequire('../../libs/HostMethods.js');
const User = nodeRequire('../../libs/UserMethods.js');
const Watcher = nodeRequire('../../libs/watcherMethods.js');
const IPFS = nodeRequire('../../libs/ipfs/ipfs.js');
const path = nodeRequire('path');
const Config = nodeRequire('electron-config');
const config = new Config();
const fs = nodeRequire('fs');
const getSize = nodeRequire('get-folder-size');

var hash;
var recInstance;
var masterInstance;
var senderInstance;
var i = 0;
var index, filePathArray, fileSizeArray, fileHashArray, filePath, fileSize, folder, count = 0;

if(config.get('key')=={sup:'sup'}) console.log('GETTTT', config.get('key'));

//Initializes daemon when on page
IPFS.init();
IPFS.daemon();

//Makes encrypt/download folder (hidden) if not made
User.mkdir('.fileStorage');

//load from localstorage to page on startup
filePathArray = config.get('fileList.path');
fileSizeArray = config.get('fileList.size');
fileHashArray = config.get('fileList.size');
if(filePathArray) {
	//removes all null/undefined from arrays
	while (count < filePathArray.length) {
		if(!filePathArray[count]) {
			filePathArray.splice(count,1);
			fileSizeArray.splice(count,1);
			fileHashArray.splice(count,1);
			// console.log('Removed 1', filePathArray);
		} else count ++;
		// console.log('LOOOP')
	}
	config.set('fileList', {path: filePathArray, size: fileSizeArray, hash: fileHashArray});
	//adds each file to DOM
	for(count = 0; count < filePathArray.length; count++) {
		if(filePathArray[count]) {
				filePath = filePathArray[count];
			$('#fileTable').append('<div class="file" id="file' + count + '">'+ path.basename(filePath) +'<button class="send">Send</button><button class="delete">Delete</button></div>');
		}
	}
}
//TODO: MAKE A SEND ALL FUNCTION
//TODO: ON CLOSE, take out all undefined


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

// $("button.mkdir").click(function() {
// 	//get file path
// 	// var dirPath = path.join(__dirname, '../../DeStoreWatch');
// 	// Watch.startWatch(dirPath);
// });

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
		config.clear('fileList');
		$('#fileTable').html("");
	});

	function getFileSize(filename) {
			var stats = fs.statSync(filename);
			var fileSizeInBytes = stats["size"];
			return fileSizeInBytes;
	}

	document.ondragover = document.ondrop = (ev) => {
		ev.preventDefault();
	};

	$('#dropbox').on('dragover', function(ev) {
		$('#dropbox').css('background-color', '#ea9393')
	});

	$('#dropbox').on('dragleave', function(ev) {
		$('#dropbox').css('background-color', 'red')
	});
	
	$("#dropbox").on("drop", function(ev) {
		ev.preventDefault();
		$('#dropbox').css('background-color', 'red')
		if(!count) count = 0;
		filePath = ev.originalEvent.dataTransfer.files[0].path;
		getSize(filePath, function(err, res) {
			fileSize = res;
			if(config.get('fileList')===undefined) {
				filePathArray = [];
				fileSizeArray = [];
				fileHashArray = [];
			} else {
				filePathArray = config.get('fileList.path');
				fileSizeArray = config.get('fileList.size');
				fileHashArray = config.get('fileList.hash');
			}
			filePathArray.push(filePath);
			fileSizeArray.push(fileSize);
			fileHashArray.push(undefined);
			//saves filepath and filesize to local storage
			config.set('fileList', { path: filePathArray, size: fileSizeArray, hash: fileHashArray});
			//create html element for each file
			$('#fileTable').append('<div class="file" id="file' + count + '">'+ path.basename(filePath) +'<button class="send">Send</button><button class="delete">Delete</button></div>');
			console.log('FILE: ', filePath, ' SIZE: ', fileSize);
			count++;
		});		
	});

	$('body').on('click', '.send', function() {
		index = $(this).closest('.file').prop('id').replace(/file/,"");
		filePathArray = config.get('fileList.path');
		fileHashArray = config.get('fileList.hash');
		console.log(index);
		console.log(filePathArray[index]);
		//filePathArray[index] is the filePath
		IPFS.addFiles(filePathArray[index])
    .then(res => {
      console.log(res);
    })
    .catch(err => {
    	fileHashArray[index] = err[0].hash;
    	console.log(fileHashArray);
    	config.set('fileList.hash', fileHashArray);
    	$(this).replaceWith('<button class="retrieve">Retrieve</button>');
      console.log('ERROR: ', err);
    });
	});

	$('body').on('click', '.retrieve', function() {
		User.mkdir('Downloaded');
	});

	$('body').on('click', '.delete', function() {
		index = $(this).closest('.file').prop('id').replace(/file/,"");
		filePathArray = config.get('fileList.path');
		fileSizeArray = config.get('fileList.size');
		console.log(index);
		console.log(filePathArray);
		filePathArray[index] = undefined;
		fileSizeArray[index] = undefined;
		console.log(filePathArray);
		config.set('fileList', { path: filePathArray, size: fileSizeArray });
		$(this).closest('.file').remove();
	});

	// function remove() {
	// 	storage.get('fileList', function(error, res){
	// 		if(error) console.log(error);
	// 	});
	// 	storage.set('fileList', { path: fileArray, size: fileSize }, function(error) {
	// 	  if (error) throw error;
	// 	});
	// }

	document.body.ondrop = (ev) => {
		ev.preventDefault();
	};
