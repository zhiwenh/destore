const prompt = require('prompt');
const web3 = require('web3');

prompt.start();

const properties = {
  yesno: {
    name: 'yesno',
    message: 'are you sure?',
    validator: /y[es]*|n[o]?/i,
    warning: 'Must respond yes or no',
    default: 'no',
  },
  ethereumAccount: {
    name: 'ethereumAccount',
    message: 'Please enter the Ethereum Account you would like associated with your DeStore account.',
    validator: web3.isAddress(),
    warning: 'Must provide a valid account for making or receiving payments.',
    required: true,
  },
  ipfsStartDaemon: {
    name: 'ipfsStartDaemon',
    message: 'Start IPFS Daemon?',
    validator: /y[es]*|n[o]?/i,
    warning: 'Must respond yes or no',
    default: 'no',
  },
  userAddFileQ: {
    name: 'userAddFile',
    message: 'Would you like to add a file to IPFS?',
    validator: /y[es]*|n[o]?/i,
    warning: 'Must respond yes or no',
    default: 'no',
  },
  userAddFileExecute: {

  },
  hostGetFile: {

  },
  hostMaxStorage: {

  }
};

prompt.get(properties, (err, result) => {
  console.log('Command-line input received:');
  console.log('  result: ' + result.yesno);
  // TODO determine how to capture/act on result objectin
});
