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
Ethereum.changeAccount(config.get('user.accountIndex'));

Sender.listUploadDb()
  .then((docs) => {
    console.log(docs);
    docs.map((item) => {
      if(item.isUploaded) {
        $('#fileTable').append(`<div data-filepath="${item.filePath}" class="file"><span class="basename">${path.basename(item.filePath)}</span><div class="filesize">${(item.fileSize/(1024*1024)).toFixed(2)} MB</div><div class="cost">${((item.fileSize/(1024*1024*1024)) * 10).toFixed(3) } cents/month</div><button class="btn-up retrieve">Retrieve</button><button class="btn-pay pay">Pay</button></div>`);
      }
      else if(item.isMounted) {
        $('#fileTable').append(`<div data-filepath="${item.filePath}" class="file"><span class="basename">${path.basename(item.filePath)}</span><div class="filesize">${(item.fileSize/(1024*1024)).toFixed(2)} MB</div><div class="cost">${((item.fileSize/(1024*1024*1024)) * 10).toFixed(3) } cents/month</div><input class="recNum" type="number" placeholder="# of hosts"/><button class="btn-up distribute">Distribute</button></div>`);
      }
    });
  });
var accountID = config.get('user.id');
$('#accountID').html(accountID);

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
      $('#fileTable').append(`<div data-filepath="${filePath}" class="file"><span class="basename">${path.basename(filePath)}</span><div class="filesize">${(fileSize/(1024*1024)).toFixed(2)} MB</div><div class="cost">${((fileSize/(1024*1024*1024)) * 10).toFixed(3) } cents/month</div><button class="btn-up mount">Mount</button></div>`);
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
    })
    .catch(err => {
      console.error(err);
    });
});

$('body').on('click', '.distribute', function() {
  var fileName = path.basename($(this).closest('.file').data('filepath'));
  var userNum = $(this).closest('.file').find('.recNum').val() || 3;
  console.log(userNum);
  Sender.distribute(fileName, userNum)
    .then((res) => {
      $(this).closest('.file').find('.recNum').remove();
      $(this).replaceWith('<button class="btn-up retrieve">Retrieve</button><button class="btn-up pay">Pay</button>');
      console.log(res);
      $(this).closest('.file').find('.recNum').remove();
      $(this).replaceWith('<button class="btn-up retrieve">Retrieve</button><button class="btn-pay pay">Pay</button>');
    })
    .catch((err) => {
      console.log(err);
    });

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

function get_elapsed_time_string(total_seconds) {
  function pretty_time_string(num) {
    return ( num < 10 ? '0' : '' ) + num;
  }

  var hours = Math.floor(total_seconds / 3600);
  total_seconds = total_seconds % 3600;

  var minutes = Math.floor(total_seconds / 60);
  total_seconds = total_seconds % 60;

  var seconds = Math.floor(total_seconds);

  // Pad the minutes and seconds with leading zeros, if required
  hours = pretty_time_string(hours);
  minutes = pretty_time_string(minutes);
  seconds = pretty_time_string(seconds);

  // Compose the string for display
  var currentTimeString = hours + ':' + minutes + ':' + seconds;

  return currentTimeString;
}

//1 second Interval for Timer
var elapsed_seconds = 0;
setInterval(function() {
  elapsed_seconds = elapsed_seconds + 1;
  $('#timer').text(get_elapsed_time_string(elapsed_seconds));
}, 1000);

//1 minute Balance Checker
checkBalance();
setInterval(function() {
  checkBalance();
}, 60000);


function checkBalance () {
  console.log(Ethereum.getBalanceEther());
  const balance = (Ethereum.getBalanceEther()-92.37).toFixed(3) || 0;
  $('#balance').text(balance + ' Ether');
}
$(document).on('click', '.clearList', () => {
  config.clear('startup');
  window.location = '../html/signup.html';
});
