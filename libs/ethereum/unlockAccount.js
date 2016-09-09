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

/**
* NEED TO CALL PROCESS.EXIT() in callback
* @account {String} - account address
* @password {String} - password for account
* @returns {Bool} - promise with a response of success or fail
**/
module.exports = promisify((account, password, callback) => {
  const web3Extended = web3_extended.create(options);
  return web3Extended.personal.unlockAccount(account, password, (err, res) => {
    if (err) {
      callback(err, null);
      process.exit();
    } else {
      callback(null, res);
    }
  });
});
