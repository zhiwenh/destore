const zxcvbn = require('zxcvbn');

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
  $('.tabs .tab-links a').on('click', function(e) {
    var currentAttrValue = $(this).attr('href');

    // Show/Hide Tabs
    // $('.tabs ' + currentAttrValue).show().siblings().hide();
    $('.tabs ' + currentAttrValue).fadeIn(400).siblings().hide();

    // Change/remove current tab to active
    $(this).parent('li').addClass('active').siblings().removeClass('active');

    e.preventDefault();
  });

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
