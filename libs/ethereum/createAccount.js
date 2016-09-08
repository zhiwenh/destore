const web3_extended = require('web3_ipc');
const promisify = require('es6-promisify');
const config = require('./../config/config.js');


const options = {
  host: config.ipc.host,
  ipc: true,
  personal: true,
  admin: true,
  debug: false
};

const web3Extended = web3_extended.create(options);

/**
* NEED TO CALL PROCESS.EXIT() in callback
* @password {String} - password for account
* @returns {String} - promise with a response thats the account number
**/
module.exports = promisify((password, callback) => {
  return web3Extended.personal.newAccount(password, (err, res) => {
    if (err) {
      callback(err, null);
    } else {
      callback(null, res);
    }
  });
});
