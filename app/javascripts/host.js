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
var recInstance = {address: '0x8ca22b74e3640541462b04399479212958df0490'};
var masterInstance = {address: '0x4e140616dc42d606909864d9ae8911f95b752133'};

var senderInstance;

let i = 0;

var index, filePathArray, fileSizeArray, fileHashArray, fileIpfsArray, filePath, fileSize, ipfsHash, folder, count = 0;

var fileContractArray;

// if(config.get('key')=={sup:'sup'}) console.log('GETTTT', config.get('key'));

//Initializes daemon when on page
IPFS.init();
IPFS.daemon();

//Makes encrypt/download folder (hidden) if not made
User.mkdir('fileStorage');

fileIpfsArray = config.get('fileList.address');

//TODO: MAKE A SEND ALL FUNCTION
//TODO: ON CLOSE, take out all undefined

$(document).on('click', '.clearList', () => {
  config.clear('startup')
});

$("button.addMasterList").click(() => {
  Ethereum.deploy('MasterList')
    .then(function(instance) {
      masterInstance = instance;
    });
});

$("button.addHost").click(() => {
  var value = $('#hostInput').val();
  value = value * 1024 * 1024;
  $('.addHost').prop('disabled', true);
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

$("button.hostLink").click(() => {
  config.set('')
});

$("button.userLink").click(() => {
  console.log('USER')
});

// tests masterInstance to see if it got a Receiver
$("button.test").click(() => {
  masterInstance.testReceiver().then(function(res) {
    console.log('Host Address', res[0]);
    console.log('Available Storage', res[1].toNumber());
  });
});

// tests the current sender file contract's saved hash address
$("button.test2").click(function() {
  var value = $('#user').val();
  var hash1 = hash.substring(0, 23);
  var hash2 = hash.substring(23 - 10, 46 - 10);
  senderInstance.testSender(hash1, hash2).then(function(res) {
    console.log('Latest Hash: ', web3.toAscii(res[0]) + web3.toAscii(res[1]));
  });
});

// retrives all files stored in reciever contract and downloads
$("button.test3").click(function() {
  console.log('press download')
  retriveFilesDownload(recInstance.address)


});

// gets config storage
$("button.test4").click(() => {
  console.log(config.get('fileList'));
});

// clears config storage
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

// DROPZONE FUNCTIONALITY
document.ondragover = document.ondrop = (ev) => {
  ev.preventDefault();
};

$('.upload-drop-zone').on('dragover', (ev) => {
  $('.upload-drop-zone').css('background-color', '#4c83db')
});

$('.upload-drop-zone').on('dragleave', (ev) => {
  $('.upload-drop-zone').css('background-color', 'white')
});

$(".upload-drop-zone").on("drop", (ev) => {
  ev.preventDefault();
  $('.upload-drop-zone').css('background-color', 'white')
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

  addFileAndDeploy(filePathArray[index]);
  // IPFS.addFiles(filePathArray[index])
  //   .then(res => {
  //     console.log(res);
  //   })
  //   .catch(err => {
  //     fileHashArray[index] = err[0].hash;
  //     console.log(fileHashArray)
  //     config.set('fileList.hash', fileHashArray);
  //     deploySender(fileHashArray[index], fileSize);
  //   });
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

$('body').on('click', '.clearML', function() {
  Ethereum.execAt('MasterList', masterInstance.address)
    .clearReceivers()
    .then(res => {
      console.log(res);
    })
    .catch(err => {
      console.log('clear error');
      console.log(err);
    })

  if($('.addHost').prop('disabled')===true) $('.addHost').prop('disabled', false);
});

document.body.ondrop = (ev) => {
  ev.preventDefault();
};

window.onbeforeunload = (ev) => {
  ev.preventDefault();
  config.set('check', {
    sup: 'sup'
  });
};

function addFileAndDeploy(filePaths) {
  // use after adding a file to IPFS to deploy the file contract
  // @ hash - string - IPFS file hash address
  // @ fileSize - int - the file size in bytes
  function deploySenderContract(hash, fileSize) {
    var hash1 = hash.substring(0,23);
    var hash2 = hash.substring(23,46);
    var deployArgs = [hash1, hash2, fileSize, masterInstance.address];
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

  IPFS.addFiles(filePaths)
    .then(res => {
      console.log(res);
    })
    .catch(err => {
      fileHashArray[index] = err[0].hash;
      console.log(fileHashArray);
      config.set('fileList.hash', fileHashArray);
      deploySenderContract(err[0].hash, fileSize);
    });
}


function retriveFilesDownload(receiverAddress) {
  Ethereum.execAt('Receiver', receiverAddress)
    .retrieveStorage()
    .then(function(res) {
      for (var i = 0; i < res.length; i += 2) {
        ipfsHash = (web3.toAscii(res[i]) + web3.toAscii(res[i + 1]));
        // ipfsHash = ipfsHash.replace(/![A-Za-z0-9]/, "");
        ipfsHash = ipfsHash.split('').filter(item => { return item.match(/[A-Za-z0-9]/); }).join('');
        console.log(ipfsHash);
        console.log('RECEIVED FILE HASH: '+ ipfsHash.length);
        console.log('RECEIVED FILE HASH'+ ipfsHash);
        const writePath = path.join(__dirname + '/../../fileStorage/' + ipfsHash);
        IPFS.download(ipfsHash, writePath)
          .then(function(res) {console.log(res);})
          .catch(function(err) {console.log('ERROR: ', err);});
      }
  })
  .catch(err => {
    console.log(err);
  });
}
