const Ethereum = nodeRequire('../../libs/ethereum/ethereum.js');
const web3 = Ethereum.init();
const IPFS = nodeRequire('../../libs/ipfs/ipfs.js');
const Sender = nodeRequire('../../libs/sender/sender.js');
const Receiver = nodeRequire('../../libs/receiver/receiver.js');
const path = nodeRequire('path');
const Config = nodeRequire('electron-config');
const config = new Config();
const fs = nodeRequire('fs');

//Initializes daemon when on page
IPFS.init();
IPFS.daemon();

// Ethereum.deStore().senderAdd({from: Ethereum.account})
//           .then(tx => {
//             console.log('Sender Added')
//           })
//           .catch(err => {
//             console.error(err);
//           });

Sender.listUploadDb()
  .then((docs) => {
    docs.map((item) => {
      $('#fileTable').append('<div data-filepath="'+item.filePath+'" class="file">' + path.basename(item.filePath) + '<button class="send">Send</button></div>');
    });
  });

$(document).on('click', '.clearList', () => {
  config.clear('startup');
  window.location = "../html/signup.html";
});

// clears config storage
$("button.clear").click(() => {
  config.clear('fileList');
  $('#fileTable').html("");
  count = 0;
});

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
  $('.upload-drop-zone').css('background-color', 'white');
  var filePath = ev.originalEvent.dataTransfer.files[0].path;
  console.log(filePath);
  Sender.copyFile(filePath)
  .then((res) => {
    console.log(res);
    $('#fileTable').append('<div data-filepath="'+res+'" class="file">' + path.basename(filePath) + '<button class="send">Send</button></div>');
    })
  .catch((res) => {
    console.log('Error', res);
  });
});

$('body').on('click', '.send', function() {
  var filePath = $(this).closest('.file').data('filepath');
  console.log(filePath);
  Sender.mountFile(filePath, 1)
    .then((doc) => {
      console.log(doc);
      return Sender.uploadDeStore(doc.fileName) //returns receivers
    })
    .then((hashes) => {
      console.log(hashes);
      return hashes[0];
    });
  // addFileAndDeploy(filePathArray[index]);
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
  // $(this).replaceWith('<button class="retrieve">Retrieve</button>');
});

$('body').on('click', '.retrieve', function() {
  User.mkdir('Downloaded');
  index = $(this).closest('.file').prop('id').replace(/file/, "");
  fileHashArray = config.get('fileList.hash');
  filePathArray = config.get('fileList.path');
  console.log(path.join(__dirname + '/../../Downloaded/' + path.basename(filePathArray[index])));
  IPFS.download(fileHashArray[index], path.join(__dirname + '/../../files/download/' + path.basename(filePathArray[index])))
    .then((res) => console.log(res))
    .catch(res => console.error('ERROR: ', res));
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

document.body.ondrop = (ev) => {
  ev.preventDefault();
};

window.onbeforeunload = (ev) => {
  ev.preventDefault();
  config.set('check', {
    sup: 'sup'
  });
};
