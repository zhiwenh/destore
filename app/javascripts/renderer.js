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
var masterInstance = {address: '0x32b8ff87ff6504163cdc8390c31b9c7c2e58725a'};

var senderInstance;


let i = 0;

var index, filePathArray, fileSizeArray, fileHashArray, fileIpfsArray, filePath, fileSize, ipfsHash, folder, count = 0;

var fileContractArray;

// if(config.get('key')=={sup:'sup'}) console.log('GETTTT', config.get('key'));

//Initializes daemon when on page
IPFS.init();
IPFS.daemon();

//Makes encrypt/download folder (hidden) if not made
User.mkdir('.fileStorage');

//load from localstorage to page on startup
filePathArray = config.get('fileList.path');
fileSizeArray = config.get('fileList.size');
fileHashArray = config.get('fileList.hash');
fileContractArray = config.get('fileList.contract');

// fileIpfsArray = config.get('fileList.address');
if (filePathArray) {
  //removes all null/undefined from arrays
  while (count < filePathArray.length) {
    if (!filePathArray[count]) {
      filePathArray.splice(count, 1);
      fileSizeArray.splice(count, 1);
      fileHashArray.splice(count, 1);
      // fileContractArray.splice(count, 1);
      // fileIpfsArray.splice(count, 1);
      // console.log('Removed 1', filePathArray);
    } else count++;
    // console.log('LOOOP')
  }
  config.set('fileList', {
    path: filePathArray,
    size: fileSizeArray,
    hash: fileHashArray,
    // address: fileIpfsArray
    contract: fileContractArray
  });
  //adds each file to DOM
  for (count = 0; count < filePathArray.length; count++) {
    if (filePathArray[count]) {
      filePath = filePathArray[count];
      $('#fileTable').append('<div class="file" id="file' + count + '">' + path.basename(filePath) + '<button class="send">Send</button><button class="delete">Delete</button></div>');
    }
  }
fileIpfsArray = config.get('fileList.address');

}
//TODO: MAKE A SEND ALL FUNCTION
//TODO: ON CLOSE, take out all undefined

$("button.addMasterList").click(() => {
  Ethereum.deploy('MasterList')
    .then(function(instance) {
      masterInstance = instance;
    });
});

$("button.addHost").click(() => {
  var value = $('#host').val();
  Ethereum.deploy('Receiver', [value, masterInstance.address])
    .then(function(instance) {
      recInstance = instance;
    });
});

// $("button.mkdir").click(function() {
// 	//get file path
// 	// var dirPath = path.join(__dirname, '../../DeStoreWatch');
// 	// Watch.startWatch(dirPath);
// });



$("button.addUser").click(() => {
  hash = $('#hash').val();
  var filesize = $('#user').val();
  deploySender(hash, filesize);
});

$("button.test").click(() => {
  masterInstance.testReceiver().then(function(res) {
    console.log('Host Address', res[0]);
    console.log('Available Storage', res[1].toNumber());
  });
});

$("button.test2").click(function() {
  var value = $('#user').val();
  var hash1 = hash.substring(0, 23);
  var hash2 = hash.substring(23 - 10, 46 - 10);
  senderInstance.testSender(hash1, hash2).then(function(res) {
    console.log('Latest Hash: ', web3.toAscii(res[0]) + web3.toAscii(res[1]));
  });
});

$("button.test3").click(function() {
  recInstance.retrieveStorage().then(function(res) {
    for (var i = 0; i < res.length; i += 2) {
      ipfsHash = (web3.toAscii(res[i]) + web3.toAscii(res[i + 1]));
      // ipfsHash = ipfsHash.replace(/![A-Za-z0-9]/, "");
      ipfsHash = ipfsHash.split('').filter(item => { return item.match(/[A-Za-z0-9]/); }).join('');
      console.log(ipfsHash);
      console.log('RECEIVED FILE HASH: '+ ipfsHash.length);
      console.log('RECEIVED FILE HASH'+ ipfsHash);
      const writePath = path.join(__dirname + '/../../.fileStorage/' + ipfsHash);
      IPFS.download(ipfsHash, writePath)
        .then(function(res) {console.log(res);})
        .catch(function(err) {console.log('ERROR: ', err);});
    }
  });
});

$("button.test4").click(() => {
  console.log(config.get('fileList'));
});

$("button.clear").click(() => {
  config.clear('fileList');
  $('#fileTable').html("");
  count = 0;
});

const getFileSize = (filename) => {
  var stats = fs.statSync(filename);
  var fileSizeInBytes = stats['size'];
  return fileSizeInBytes;
};

document.ondragover = document.ondrop = (ev) => {
  ev.preventDefault();
};

$('#dropbox').on('dragover', (ev) => {
  $('#dropbox').css('background-color', '#ea9393')
});

$('#dropbox').on('dragleave', (ev) => {
  $('#dropbox').css('background-color', 'red')
});

$("#dropbox").on("drop", (ev) => {
  ev.preventDefault();
  $('#dropbox').css('background-color', 'red')
  if (!count) count = 0;
  filePath = ev.originalEvent.dataTransfer.files[0].path;
  getSize(filePath, (err, res) => {
    fileSize = res;
    if (config.get('fileList') === undefined) {
      filePathArray = [];
      fileSizeArray = [];
      fileHashArray = [];
      fileContractArray = [];
    } else {
      filePathArray = config.get('fileList.path');
      fileSizeArray = config.get('fileList.size');
      fileHashArray = config.get('fileList.hash');
      fileContractArray = config.get('fileList.contract');
    }
    filePathArray.push(filePath);
    fileSizeArray.push(fileSize);
    fileHashArray.push(undefined);
    fileContractArray.push(undefined);
    //saves filepath and filesize to local storage
    config.set('fileList', {
      path: filePathArray,
      size: fileSizeArray,
      hash: fileHashArray,
      contract: fileContractArray
    });
    //create html element for each file
    $('#fileTable').append('<div class="file" id="file' + count + '">' + path.basename(filePath) + '<button class="send">Send</button><button class="delete">Delete</button></div>');
    console.log('FILE: ', filePath, ' SIZE: ', fileSize);
    count++;
  });
});

$('body').on('click', '.send', function() {
  index = $(this).closest('.file').prop('id').replace(/file/, "");
  filePathArray = config.get('fileList.path');
  console.log(index);
  console.log('ARRAY', filePathArray);
  //filePathArray[index] is the filePath
  IPFS.addFiles(filePathArray[index])
    .then(res => {
      console.log(res);
    })
    .catch(err => {
      fileHashArray[index] = err[0].hash;
      console.log(fileHashArray)
      config.set('fileList.hash', fileHashArray);
			// const part1 = fileHashArray[index].substr(0, 22);
			// const part2 = fileHashArray[index].substr(23);
      // const fileSize = err[0].size;
      // const deployArgs = [part1, part2, fileSize, masterInstance];
      deploySender(fileHashArray[index], fileSize);

			// Ethereum.deploy('Sender', deployArgs).testSender()
      //   .then(res => {
      //     console.log
      //     console.log(res);
      //   })
      //   .catch(err => {
      //
      //   });
    });
  $(this).replaceWith('<button class="retrieve">Retrieve</button>');
});

$('body').on('click', '.retrieve', function() {
  User.mkdir('Downloaded');
  index = $(this).closest('.file').prop('id').replace(/file/, "");
  fileHashArray = config.get('fileList.hash');
  filePathArray = config.get('fileList.path');
  console.log(path.join(__dirname + '/../../Downloaded' + path.basename(filePathArray[index])));
  IPFS.download(fileHashArray[index], path.join(__dirname + '/../../Downloaded/' + path.basename(filePathArray[index])))
    .then((res) => console.log(res))
    .catch(res => console.log('ERROR: ', res));
});

$('body').on('click', '.delete', function() {
  index = $(this).closest('.file').prop('id').replace(/file/, "");
  filePathArray = config.get('fileList.path');
  fileSizeArray = config.get('fileList.size');
  fileHashArray = config.get('fileList.size');
  console.log(index);
  console.log(filePathArray);
  filePathArray[index] = undefined;
  fileSizeArray[index] = undefined;
  fileHashArray[index] = undefined;
  fileContractArray[index] = undefined;
  console.log(filePathArray);
  config.set('fileList', {
    path: filePathArray,
    size: fileSizeArray,
    hash: filePathArray,
    contract: fileContractArray
  });
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

window.onbeforeunload = (ev) => {
  ev.preventDefault();
  config.set('check', {
    sup: 'sup'
  });
};

// use after adding a file to IPFS to deploy the file contract
// @ hash - string - IPFS file hash address
// @ fileSize - int - the file size in bytes
function deploySender(hash, fileSize) {
  var hash1 = hash.substring(0,23);
  var hash2 = hash.substring(23,46);
  var deployArgs = [hash1, hash2, fileSize, masterInstance.address];
  console.log(deployArgs);
  Ethereum.deploy('Sender', deployArgs)
    .then(function(instance){
      fileContractArray[index] = instance.address;
      console.log(fileContractArray);
      console.log('deployer sender');
      config.set('fileList.contract', fileContractArray);
      senderInstance = instance;
    })
    .catch(err => {
      console.log('deploySender Error: ' + err);
    });
}
