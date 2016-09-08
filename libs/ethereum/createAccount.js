const web3_extended = require('web3_extended');

const options = {
  host: '/var/folders/nq/v4r9d3j17lgg69ljdhlpjyhc0000gn/T/ethereum_dev_mode/geth.ipc',
  ipc: true,
  personal: true,
  admin: true,
  debug: false
};

const web3Extended = web3_extended.create(options);

module.exports = (password) => {
  return web3Extended.personal.newAccount(password, (err, res) => {
    console.log(res);
    console.log(err);
  });
  // return web3Extended.admin.datadir();
};
