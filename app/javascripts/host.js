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

//Makes encrypt/download folder (hidden) if not made

const fileIpfsArray = config.get('fileList.address');

//TODO: MAKE A SEND ALL FUNCTION
//TODO: ON CLOSE, take out all undefined

$(document).on('click', '.clearList', () => {
  config.clear('startup');
  window.location = '../html/signup.html';
});

$('button.hostLink').click(() => {
  config.set('');
});

$('button.userLink').click(() => {
  console.log('USER');
});

// retrives all files stored in reciever contract and downloads
$('button.downloadFiles').click(function() {
  // button is still there
  // console.log('press download');
  //
  // Receiver.hostAll(Ethereum.account, function (err, res) {
  //   console.log(err);
  //   console.log(res);
  // });
});

const getFileSize = (filename) => {
  var stats = fs.statSync(filename);
  var fileSizeInBytes = stats['size'];
  return fileSizeInBytes;
};


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
  const balance = Ethereum.getBalanceEther() || 0;
  $('#balance').text(balance + ' Ether');
}
