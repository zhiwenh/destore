const nodeRequire = require;
const Config = nodeRequire('electron-config');
const config = new Config();
const configs = nodeRequire('../../libs/config/config.js');
const Ethereum = nodeRequire('../../libs/ethereum/ethereum.js');
const DeStoreAddress = nodeRequire('../../models/DeStoreAddress');
// const Sender = nodeRequire('../../libs/sender/sender.js');
// const Receiver = nodeRequire('../../libs/receiver/receiver.js');

//TESTING
configs.contracts.deStore = DeStoreAddress.get();

$(document).ready(function() {
  Ethereum.init();
  $('body').css('overflow', 'hidden');

  if (Ethereum.accounts.length !== 0) {
    // $('#tab-accounts').fadeIn(400).siblings().hide();
    for (let i = 0; i < Ethereum.accounts.length; i++) {
      const accountOption = $('<option>').text(Ethereum.accounts[i]);
      $('.login-address').append(accountOption);
    }
  }

  // Show/Hide Tabs
  $('.tabs .tab-links a').on('click', function(e) {
    var currentAttrValue = $(this).attr('href');

    $('.tabs ' + currentAttrValue).fadeIn(400).siblings().hide();

    // Change/remove current tab to active
    $(this).parent('li').addClass('active').siblings().removeClass('active');

    e.preventDefault();
  });

  //Route to Host/User on Submit
  $('.form-signup').submit(function(e) {
    e.preventDefault();

    //set path based on form
    var currentTab = $(this).data('tab');
    //get password
    var userPass = $(this).find('.password').val();
    //get host storage
    var storage;
    if (currentTab === 'host') {
      storage = $(this).find('.storage').val();
    }

    //call function for password -> account
    var userID;
    if (Ethereum.check()) {
      Ethereum.createAccount(userPass)
        .then(account => {
          console.log(account);
          userID = account;
          config.set('user', {
            path: currentTab,
            password: userPass,
            id: userID,
            store: storage,
            accountIndex: (Ethereum.accounts.length - 1)
          });
          Ethereum.changeAccount(config.get('user.accountIndex'));
          //display account in popup (with Authenticate button)
          authenticatePopUp();
          $('.userID').text(userID);
        })
        .catch(err => {
          console.error(err);
        });
    } else {
      failurePopUp();
    }
  });



  $('.form-signin').submit(function(e) {
    console.log('signin submit');

    e.preventDefault();
    var userType = $(this).data('tab');
    // if (currentTab === 'host') {
    //   storage = $(this).find('.storage').val();
    // }

    var userID = $(this).find('.login-address').val();
    var userPass = $(this).find('.login-password').val();
    var storage;
    if (Ethereum.check()) {
      console.log('ethereum check');
      let accountIndex;
      for (let i = 0; i < Ethereum.accounts.length; i++) {
        if (Ethereum.accounts[i] === userID) {
          accountIndex = i;
          break;
        }
      }
      console.log('userid', userID);
      console.log('userpass', userPass);
      Ethereum.unlockAccount(userID, userPass)
        .then(status => {
          if (status === true) {
            console.log('status is true');
            config.set('user', {
              path: userType,
              password: userPass,
              id: userID,
              store: storage,
              accountIndex: accountIndex
            });
            Ethereum.changeAccount(accountIndex);
            // window.location = `../html/${userType}.html`;
            $('.userID').text(userID); // zhiwen - dont know what this does
            authenticatePopUp();
          } else {
            console.log('stauts is false');
            $('.userID').text(userID); // zhiwen - dont know what this does
          }
        })
        .catch(err => {
          console.error(err);
        });
    } else {
      console.log('not connected to ethereum');
    }
  });

  $('body').on('click', '#authenticate', function() {
    //check if coin balance > 0.01
    var userType = config.get('user.path');
    Ethereum.changeAccount(config.get('user.accountIndex'));
    console.log(Ethereum.account);
    if (userType === 'host') {
      // check to see if receiver status is true
      Ethereum.deStore().receiverCheckInit({
        from: Ethereum.account
      })
      .then(status => {
        console.log('host', status);
        if (status === true) {
          window.location = `../html/${userType}.html`;
        } else if (Ethereum.getBalanceEther() > 5) {
          console.log('making receiver');
          receiverAdd();
        } else {
          $('#authFail').css('display', 'block');
        }
      })
      .catch(err => {
        console.error(err);
      });
    } else {
      Ethereum.deStore().senderCheckInit({
        from: Ethereum.account
      })
      .then(status => {
        console.log('user', status);
        if (status === true) {
          window.location = `../html/${userType}.html`;
        } else if (Ethereum.getBalanceEther() > 5) {
          console.log('making sender');
          senderAdd();
        } else {
          $('#authFail').css('display', 'block');
        }
      })
      .catch(err => {
        console.error(err);
      });
    }

    function senderAdd() {
      console.log('making sender');
      Ethereum.deStore().senderAdd({
        from: Ethereum.account,
        gas: 1000000
      })
      .then(tx => {
        console.log('Sender Added');
        window.location = `../html/${userType}.html`;
      })
      .catch(err => {
        console.error(err);
      });
    }

    function receiverAdd() {
      var storage = 1024 * 1024 * 1024 * config.get('user.store');
      Ethereum.deStore().receiverAdd(storage, {
        from: Ethereum.account,
        gas: 1000000
      })
      .then(tx => {
        console.log('Receiver Added');
        window.location = `../html/${userType}.html`;
      })
      .catch(err => {
        console.error(err);
      });
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

let signupBool = true;
$('.signup-new').on('click', function() {
  if (signupBool === true) {
    $('#signup-user').css({display: 'block'});
    $('#signup-host').css({display: 'block'});
    $('#signin-user').css({display: 'none'});
    $('#signin-host').css({display: 'none'});
    $(this).html('Sign in to Ethereum Account');
  } else {
    $('#signup-user').css({display: 'none'});
    $('#signup-host').css({display: 'none'});
    $('#signin-user').css({display: 'block'});
    $('#signin-host').css({display: 'block'});
    $(this).html('Create An Ethereum Account');
    signupBool = false;
  }

});


function authenticatePopUp() {
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
}

function failurePopUp() {
  $('#popup2').dialog({
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
}
