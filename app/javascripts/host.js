const nodeRequire = require;
const Ethereum = nodeRequire('../../libs/ethereum/ethereum.js');
const web3 = Ethereum.init();
const Receiver = nodeRequire('../../libs/receiver/receiver.js');
const IPFS = nodeRequire('../../libs/ipfs/ipfs.js');
const path = nodeRequire('path');
const configs = nodeRequire('../../libs/config/config.js');
const Config = nodeRequire('electron-config');
const config = new Config();
const fs = nodeRequire('fs');
const DeStoreAddress = nodeRequire('../../models/DeStoreAddress');

//Initializes daemon when on page
IPFS.init();
IPFS.daemon();

//TESTING
configs.contracts.deStore = DeStoreAddress.get();
Ethereum.changeAccount(2);

//Makes encrypt/download folder (hidden) if not made

const fileIpfsArray = config.get('fileList.address');

//TODO: MAKE A SEND ALL FUNCTION
//TODO: ON CLOSE, take out all undefined

updateHostInfos();

$(document).on('click', '.clearList', () => {
  config.clear('startup');
  window.location = '../html/signup.html';
});

$('button.downloadFiles').click(function() {
  Receiver.hostAll()
    .then(docs => {
      updateHostInfos();
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



//1 second Interval for Timer
var elapsed_seconds = 0;
setInterval(function() {
  elapsed_seconds = elapsed_seconds + 1;
  $('#dash__time__timer ').text(get_elapsed_time_string(elapsed_seconds));
}, 1000);

//1 minute Balance Checker
checkBalance();
contractBalance();
setInterval(function() {
  checkBalance();
}, 60000);



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

function checkBalance () {
  const balance = Ethereum.getBalanceEther() || 0;
  $('#dash__balance__value').text(balance + ' Ether');
}

/**
* Calls Host db, gets the storage used by all the files, then adds it to storage size
**/
function updateHostInfos() {
  Receiver.hostInfo()
    .then(docs => {
      return Receiver.listHostDb();
    })
    .then(docs => {
      console.log(docs);
      let storageSize = 0;
      for (let i = 0; i < docs.length; i++) {
        if (docs[i].isHosted === true) {
          storageSize += docs[i].fileSize;
        }

        // const hashAddress = docs[i].hashAddress;
        // const hashDiv = $('<div></div>');
        // hashDiv.text(hashAddress);
        // $('#hashList').append(hashDiv);
      }
      $('.dash__storage__size__num').text(storageSize);
    })
    .catch(err => {
      console.error(err);
    });
}

/**
* Gets the account's balance from the DeStore contract
**/
function contractBalance() {
  Receiver.balance()
    .then(amount => {
      console.log(amount);
    })
    .catch(err => {
      console.error(err);
    });
}
