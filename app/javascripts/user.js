const nodeRequire = require;
const Ethereum = nodeRequire('../../libs/ethereum/ethereum.js');
const web3 = Ethereum.init();
const IPFS = nodeRequire('../../libs/ipfs/ipfs.js');
const Sender = nodeRequire('../../libs/sender/sender.js');
const path = nodeRequire('path');
const configs = nodeRequire('../../libs/config/config.js');
const Config = nodeRequire('electron-config');
const config = new Config();
const fs = nodeRequire('fs');
const DeStoreAddress = nodeRequire('../../models/DeStoreAddress');

//Initializes daemon when on page
IPFS.init();
IPFS.daemon();
Ethereum.init();

//TESTING
configs.contracts.deStore = DeStoreAddress.get();

Sender.listUploadDb()
  .then((docs) => {
    console.log(docs);
    docs.map((item) => {
      if(item.isUploaded) {
        $('#fileTable').append(`<div data-filepath="${item.filePath}" class="file"><span class="basename">${path.basename(item.filePath)}</span><div class="filesize">${(item.fileSize/(1024*1024)).toFixed(2)} MB</div><div class="cost">${((item.fileSize/(1024*1024*1024)) * 10).toFixed(3) } cents/month</div>'<button class="btn-up retrieve">Retrieve</button><button class="btn-up pay">Pay</button>'`);
      }
      else if(item.isMounted) {
        $('#fileTable').append(`<div data-filepath="${item.filePath}" class="file"><span class="basename">${path.basename(item.filePath)}</span><div class="filesize">${(item.fileSize/(1024*1024)).toFixed(2)} MB</div><div class="cost">${((item.fileSize/(1024*1024*1024)) * 10).toFixed(3) } cents/month</div><input class="recNum" type="number" placeholder="# of hosts"></input><button class="btn-up distribute">Distribute</button></div>`);
      }
    });
  });

$('.dragdropQ').on({
  mouseenter: function() {
    $('#dragdropHelp').css('display', 'inline-block');
  },
  mouseleave: function() {
    $('#dragdropHelp').css('display', 'none');
  }
});

$('.uploadQ').on({
  mouseenter: function() {
    $('#uploadHelp').css('display', 'inline-block');
  },
  mouseleave: function() {
    $('#uploadHelp').css('display', 'none');
  }
});



// DROPZONE FUNCTIONALITY
document.ondragover = document.ondrop = (ev) => {
  ev.preventDefault();
};

$('.upload-drop-zone').on('dragover', (ev) => {
  $('.upload-drop-zone').css('background-color', '#4c83db');
});

$('.upload-drop-zone').on('dragleave', (ev) => {
  $('.upload-drop-zone').css('background-color', 'white');
});

//ON FILE DROP
$('.upload-drop-zone').on('drop', (ev) => {
  ev.preventDefault();
  $('.upload-drop-zone').css('background-color', 'white');
  var filePath = ev.originalEvent.dataTransfer.files[0].path;
  var fileSize = Sender.filesize(filePath);
  console.log(filePath);
  //check if it's a folder

  //check if it's already there in the list

  Sender.copyFile(filePath)
    .then((res) => {
      console.log(res);
      $('#fileTable').append(`<div data-filepath="${filePath}" class="file">${path.basename(filePath)}<div class="filesize">${(fileSize/(1024*1024)).toFixed(2)} MB</div><div class="cost">${((fileSize/(1024*1024*1024)) * 10).toFixed(3) } cents/month</div><button class="btn-up mount">Mount</button></div>`);
    })
    .catch((res) => {
      console.log('Error', res);
    });
});

$('body').on('click', '.mount', function() {
  var filePath = $(this).closest('.file').data('filepath');
  console.log(filePath);
  Sender.mountFile(filePath, 1)
    .then((doc) => {
      console.log(doc);
      return Sender.uploadDeStore(doc.fileName);
    })
    .then((hashes) => {
      console.log(hashes);
      return hashes[0];
    })
    .then(() => {
      $(this).replaceWith('<input class="recNum" type="number" placeholder="# of hosts"></input><button class="btn-up distribute">Distribute</button>');
    });
});

$('body').on('click', '.distribute', function() {
  var fileName = path.basename($(this).closest('.file').data('filepath'));
  var userNum = $(this).closest('.file').find('.recNum').val() || 3;
  console.log(userNum);
  Sender.distribute(fileName, userNum)
    .then((res) => {
      console.log(res);
    })
    .catch((err) => {
      console.log(err);
    });

  $(this).closest('.file').find('.recNum').remove();
  $(this).replaceWith('<button class="btn-up retrieve">Retrieve</button><button class="btn-up pay">Pay</button>');
});

$('body').on('click', '.retrieve', function() {
  const fileName = path.basename($(this).closest('.file').data('filepath'));
  Sender.retrieveFile(fileName)
    .then((res) => {
      console.log(fileName, 'written to ', res);
    });
});

$('body').on('click', '.pay', function() {
  const fileName = path.basename($(this).closest('.file').data('filepath'));
  Sender.payFile(fileName)
    .then(balance => {
      console.log(balance);
    })
    .catch(err => {
      console.error(err);
    });
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

$(document).on('click', '.clearList', () => {
  config.clear('startup');
  window.location = '../html/signup.html';
});
