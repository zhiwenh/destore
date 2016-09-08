const Accounts = require('eth-lightwallet');
const accounts = new Accounts({minPassphraseLength: 6}); // or new Accounts(..) if using dist.
const fs = require('fs');


module.exports = (password) => {
  const accountObject = accounts.new(password);
  console.log(accountObject);
};
