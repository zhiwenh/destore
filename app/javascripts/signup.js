const zxcvbn = require('zxcvbn');
const Config = require('electron-config');
const config = new Config();

const strength = {
  0: 'Worst ☹',
  1: 'Bad ☹',
  2: 'Weak ☹',
  3: 'Good ☺',
  4: 'Strong ☻'
};

const password = document.getElementById('password');
const meter = document.getElementById('password-strength-meter');
const text = document.getElementById('password-strength-text');

$(document).ready(function() {
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
    var currentTab = $(this).data('tab');
    config.set('startup', { path: currentTab });
    window.location = `../html/${currentTab}.html`;
  });

  //password STUFF??
  password.addEventListener('input', function() {
    const val = password.value;
    const result = zxcvbn(val);

    // Update the password strength meter
    meter.value = result.score;
  });

// check that passwords match and then
  $(function() {
    $('.password-confirm').keyup(function() {
      var pwToCheck = $('.password').val();
      $('#divCheckPasswordMatch').html(pwToCheck == $(this).val() ? 'Passwords match.' : 'Passwords do not match!');
    });
  });

});
