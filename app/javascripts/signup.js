const nodeRequire = require;
const Config = nodeRequire('electron-config');
const config = new Config();
const configs = nodeRequire('../../libs/config/config.js');
const Ethereum = nodeRequire('../../libs/ethereum/ethereum.js');
const DeStoreAddress = nodeRequire('../../models/DeStoreAddress');


//TESTING
configs.contracts.deStore = DeStoreAddress.get();

$(document).ready(function() {
  Ethereum.init();
  $("body").css("overflow", "hidden");

  // Show/Hide Tabs
  $('.tabs .tab-links a').on('click', function(e) {
    var currentAttrValue = $(this).attr('href');

    $('.tabs ' + currentAttrValue).fadeIn(400).siblings().hide();

    // Change/remove current tab to active
    $(this).parent('li').addClass('active').siblings().removeClass('active');

    e.preventDefault();
  });

  //Route to Host/User on Submit
  $('.form').submit(function(e) {
    e.preventDefault();

    //set path based on form
    var currentTab = $(this).data('tab');
    //get password
    var userPass = $(this).find('.password').val();
    //get host storage
    var storage;
    if(currentTab === 'host') {
      storage = $(this).find('.storage').val();
    }

    //call function for password -> account
    var userID;
    if(!Ethereum.check()) userID = Ethereum.createAccount(userPass);
    else userID = '0x8cf0451e8e69ac504cd0a89d6874a827770e80e6';
    config.set('user', { path: currentTab, password: userPass, id: userID, store: storage });

    //display account in popup (with Authenticate button)
    $('#popup').dialog({
      dialogClass: 'no-close',
      draggable: false,
      resizable: false,
      modal: true,
      width: 600,
      height: 300,
      // open: function() {
      //   $('body').css('background', '#000000');
      // },
      // close: function() {
      //   $('body').css('background', '#ccc');
      // }
    });
    $('.userID').text(userID);
  });

  $('body').on('click', '#authenticate', function() {
    //check if coin balance > 0.01
    if(Ethereum.getBalanceEther() > 5) {
      var userType = config.get('user.path');
      if(userType === 'host') {
        Ethereum.changeAccount(1);
        var storage = 1024*1024*1024*config.get('user.store');
        Ethereum.deStore().receiverAdd(storage, {from: Ethereum.account})
          .then(tx => {
            console.log(tx);
            console.log('Receiver Added');
          })
          .catch(err => {
            console.error(err);
          });
      } else {
        Ethereum.changeAccount(0);
        Ethereum.deStore().senderAdd({from: Ethereum.account})
          .then(tx => {
            console.log('Sender Added');
          })
          .catch(err => {
            console.error(err);
          });
      }
      window.location = `../html/${userType}.html`;
    } else {
      $('#authFail').css('display', 'block');
    }
  });

  //display signin information
  $('.signinQ').on({
    mouseenter: function() {
      $('#signinHelp').css('display', 'inline-block');
    },
    mouseleave: function() {
      $('#signinHelp').css('display', 'none');
    }
  });

});
